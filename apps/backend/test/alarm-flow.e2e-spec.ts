/**
 * Die ganze Kette ueber HTTP: Knopfdruck, Standort, Hochstufung, Quittierung durch
 * eine Station, Entwarnung mit PIN. Laeuft gegen den Speicher im Arbeitsspeicher,
 * braucht also weder Datenbank noch Hardware.
 */
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  decodeAllFrames,
  encodeFrame,
  toE7,
  type Frame,
  type UplinkFrame,
} from '@safeexit/protocols';
import { AlarmServiceModule } from '../src/alarm-service.module.js';
import { configureAlarmApp } from '../src/bootstrap.js';
import { loadEnv } from '../src/config/env.js';
import { DEMO } from '../src/persistence/demo-data.js';

let app: INestApplication;
let sequence = 100;

function nextSequence(): number {
  sequence += 1;
  return sequence;
}

function binaryParser(
  response: NodeJS.EventEmitter & { setEncoding(encoding: string): void },
  callback: (error: Error | null, body: Buffer) => void,
): void {
  response.setEncoding('binary');
  let data = '';
  response.on('data', (chunk: string) => {
    data += chunk;
  });
  response.on('end', () => callback(null, Buffer.from(data, 'binary')));
}

async function sendUplink(frame: UplinkFrame, expectedStatus = 200): Promise<Frame[]> {
  const response = await request(app.getHttpServer())
    .post('/v1/uplink')
    .set('x-device-id', DEMO.buttonDeviceId)
    .set('authorization', `Bearer ${DEMO.buttonSecret}`)
    .set('content-type', 'application/octet-stream')
    .buffer(true)
    .parse(binaryParser as never)
    .send(Buffer.from(encodeFrame(frame)))
    .expect(expectedStatus);

  return decodeAllFrames(new Uint8Array(response.body as Buffer));
}

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      AlarmServiceModule.forRoot(
        loadEnv({ NODE_ENV: 'test', STORAGE: 'memory' } as NodeJS.ProcessEnv),
      ),
    ],
  }).compile();

  app = moduleRef.createNestApplication({ logger: false });
  configureAlarmApp(app);
  await app.init();
});

afterAll(async () => {
  await app.close();
});

describe('Alarmkette', () => {
  let alarmId: string;

  it('weist Rahmen ohne gueltiges Geraetegeheimnis ab', async () => {
    await request(app.getHttpServer())
      .post('/v1/uplink')
      .set('x-device-id', DEMO.buttonDeviceId)
      .set('authorization', 'Bearer falsch')
      .set('content-type', 'application/octet-stream')
      .send(
        Buffer.from(
          encodeFrame({
            type: 'alarm_trigger',
            sequence: 1,
            level: 1,
            batteryPercent: 80,
            timestamp: 0,
          }),
        ),
      )
      .expect(401);
  });

  it('nimmt einen Knopfdruck an und bestaetigt den Empfang', async () => {
    const usedSequence = nextSequence();
    const frames = await sendUplink({
      type: 'alarm_trigger',
      sequence: usedSequence,
      level: 1,
      batteryPercent: 87,
      timestamp: 0,
    });

    expect(frames).toEqual([
      { type: 'receipt', sequence: usedSequence, acknowledgedSequence: usedSequence },
    ]);

    const response = await request(app.getHttpServer())
      .get(`/v1/devices/${DEMO.buttonDeviceId}/active-alarm`)
      .expect(200);

    expect(response.body.level).toBe(1);
    expect(response.body.status).toBe('active');
    expect(response.body.wearerName).toBe('Mia, 9 Jahre');
    expect(response.body.lastLocation).toBeNull();

    alarmId = response.body.id;
  });

  it('nimmt den nachgereichten Standort an', async () => {
    await sendUplink({
      type: 'location',
      sequence: nextSequence(),
      latitudeE7: toE7(DEMO.location.latitude),
      longitudeE7: toE7(DEMO.location.longitude),
      accuracyMeters: 14,
      source: 'gnss',
      timestamp: 0,
    });

    const response = await request(app.getHttpServer()).get(`/v1/alarms/${alarmId}`).expect(200);
    expect(response.body.lastLocation.accuracyMeters).toBe(14);
    expect(response.body.lastLocation.source).toBe('gnss');
  });

  it('stuft auf Stufe 2 hoch und erreicht damit das Partnernetzwerk', async () => {
    await sendUplink({
      type: 'alarm_escalate',
      sequence: nextSequence(),
      level: 2,
      timestamp: 0,
    });

    const response = await request(app.getHttpServer()).get(`/v1/alarms/${alarmId}`).expect(200);
    expect(response.body.level).toBe(2);
    expect(response.body.networkDispatchedAt).not.toBeNull();
  });

  it('laesst eine Station quittieren und meldet das an den Knopf zurueck', async () => {
    await request(app.getHttpServer())
      .post(`/v1/stations/${DEMO.partnerStationDeviceId}/messages`)
      .set('authorization', `Bearer ${DEMO.partnerStationSecret}`)
      .send({ type: 'acknowledge', alarmId })
      .expect(200);

    const alarm = await request(app.getHttpServer()).get(`/v1/alarms/${alarmId}`).expect(200);
    expect(alarm.body.acknowledgedBy).toBe('Kiosk am Markt');
    expect(alarm.body.status).toBe('active');

    // Der Knopf erfaehrt es beim naechsten Funkkontakt.
    const frames = await sendUplink({
      type: 'heartbeat',
      sequence: nextSequence(),
      batteryPercent: 86,
      rssiDbm: -91,
      firmwareMajor: 0,
      firmwareMinor: 1,
      timestamp: 0,
    });

    expect(frames.map((frame) => frame.type)).toEqual(['receipt', 'acknowledged']);
  });

  it('entwarnt nur mit der richtigen PIN', async () => {
    await request(app.getHttpServer())
      .post(`/v1/alarms/${alarmId}/cancel`)
      .send({ pin: '9999' })
      .expect(403);

    const response = await request(app.getHttpServer())
      .post(`/v1/alarms/${alarmId}/cancel`)
      .send({ pin: DEMO.cancelPin })
      .expect(200);

    expect(response.body.status).toBe('cancelled');

    const frames = await sendUplink({
      type: 'heartbeat',
      sequence: nextSequence(),
      batteryPercent: 86,
      rssiDbm: -91,
      firmwareMajor: 0,
      firmwareMinor: 1,
      timestamp: 0,
    });

    expect(frames.map((frame) => frame.type)).toEqual(['receipt', 'cancelled']);
  });

  it('weist eine PIN im falschen Format ab', async () => {
    await request(app.getHttpServer())
      .post(`/v1/alarms/${alarmId}/cancel`)
      .send({ pin: 'abcd' })
      .expect(400);
  });

  it('meldet sich gesund', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);
    expect(response.body.service).toBe('alarm');
  });
});
