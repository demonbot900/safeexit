/**
 * Knopf ohne Knopf.
 *
 * Bis die erste Leiterplatte da ist, spielt dieses Skript das Geraet: es sendet
 * dieselben Rahmen, wartet auf dieselben Antworten und zeigt, was das Geraet
 * spueren wuerde (zweimal vibrieren, LED gruen).
 *
 *   npm run dev:alarm                     # Alarmdienst starten
 *   npm run simulate:button -- --level 2  # Alarm ausloesen
 *
 * Weitere Schalter: --url, --device, --secret, --no-location, --once
 */
import {
  decodeAllFrames,
  encodeFrame,
  isUplinkFrame,
  toE7,
  type DownlinkFrame,
  type UplinkFrame,
} from '@safeexit/protocols';
import { isAlarmLevel, type AlarmLevel } from '@safeexit/shared-types';
import { DEMO } from '../src/persistence/demo-data.js';

interface Options {
  url: string;
  deviceId: string;
  secret: string;
  level: AlarmLevel;
  sendLocation: boolean;
  once: boolean;
}

function parseArguments(argv: string[]): Options {
  const options: Options = {
    url: 'http://localhost:3001',
    deviceId: DEMO.buttonDeviceId,
    secret: DEMO.buttonSecret,
    level: 1,
    sendLocation: true,
    once: false,
  };

  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index];
    const value = argv[index + 1];

    switch (argument) {
      case '--url':
        options.url = value ?? options.url;
        index++;
        break;
      case '--device':
        options.deviceId = value ?? options.deviceId;
        index++;
        break;
      case '--secret':
        options.secret = value ?? options.secret;
        index++;
        break;
      case '--level': {
        const level = Number(value);
        if (!isAlarmLevel(level)) {
          throw new Error('--level braucht 1, 2 oder 3');
        }
        options.level = level;
        index++;
        break;
      }
      case '--no-location':
        options.sendLocation = false;
        break;
      case '--once':
        options.once = true;
        break;
      default:
        break;
    }
  }

  return options;
}

const options = parseArguments(process.argv.slice(2));
let sequence = Math.floor(Math.random() * 30_000);

function nextSequence(): number {
  sequence = (sequence + 1) % 0x10000;
  return sequence;
}

function now(): number {
  return Math.floor(Date.now() / 1000);
}

async function send(frame: UplinkFrame): Promise<DownlinkFrame[]> {
  const response = await fetch(`${options.url}/v1/uplink`, {
    method: 'POST',
    headers: {
      'content-type': 'application/octet-stream',
      'x-device-id': options.deviceId,
      authorization: `Bearer ${options.secret}`,
    },
    body: Buffer.from(encodeFrame(frame)),
  });

  if (!response.ok) {
    throw new Error(`Alarmdienst antwortet mit ${response.status}: ${await response.text()}`);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  return decodeAllFrames(bytes).filter(
    (decoded): decoded is DownlinkFrame => !isUplinkFrame(decoded),
  );
}

function report(frames: DownlinkFrame[]): void {
  for (const frame of frames) {
    switch (frame.type) {
      case 'receipt':
        console.log(`   Empfang bestaetigt fuer Rahmen ${frame.acknowledgedSequence}`);
        break;
      case 'acknowledged':
        console.log('   >> Jemand kommt. Knopf vibriert zweimal, LED wird gruen.');
        break;
      case 'cancelled':
        console.log('   >> Entwarnung. Knopf geht in den Ruhezustand.');
        break;
      case 'request_location':
        console.log('   >> Standort angefordert.');
        break;
    }
  }
}

async function showAlarm(): Promise<void> {
  const response = await fetch(`${options.url}/v1/devices/${options.deviceId}/active-alarm`);
  const text = await response.text();
  if (!text) {
    console.log('Kein laufender Alarm.');
    return;
  }

  const alarm = JSON.parse(text) as { id: string; level: number };
  console.log(`Alarm ${alarm.id}, Stufe ${alarm.level}`);
  console.log('Quittieren:');
  console.log(
    `  curl -X POST ${options.url}/v1/alarms/${alarm.id}/acknowledge ` +
      `-H "content-type: application/json" ` +
      `-d '{"responderId":"contact:mama","responderName":"Mama"}'`,
  );
  console.log('Entwarnen:');
  console.log(
    `  curl -X POST ${options.url}/v1/alarms/${alarm.id}/cancel ` +
      `-H "content-type: application/json" -d '{"pin":"${DEMO.cancelPin}"}'`,
  );
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

console.log(`Knopf ${options.deviceId} gegen ${options.url}`);
console.log(`Druck: Stufe ${options.level}`);

report(
  await send({
    type: 'alarm_trigger',
    sequence: nextSequence(),
    level: options.level,
    batteryPercent: 87,
    timestamp: now(),
  }),
);

await showAlarm();

if (options.sendLocation) {
  // So verhaelt sich das Geraet auch im Feld: erst Alarm, dann Position.
  console.log('Warte auf GNSS ...');
  await sleep(3000);

  report(
    await send({
      type: 'location',
      sequence: nextSequence(),
      latitudeE7: toE7(DEMO.location.latitude),
      longitudeE7: toE7(DEMO.location.longitude),
      accuracyMeters: 14,
      source: 'gnss',
      timestamp: now(),
    }),
  );
  console.log('Standort gesendet.');
}

if (options.once) {
  process.exit(0);
}

console.log('Lebenszeichen alle 5 Sekunden. Abbruch mit Strg+C.');

for (;;) {
  await sleep(5000);
  report(
    await send({
      type: 'heartbeat',
      sequence: nextSequence(),
      batteryPercent: 86,
      rssiDbm: -91,
      firmwareMajor: 0,
      firmwareMinor: 1,
      timestamp: now(),
    }),
  );
}
