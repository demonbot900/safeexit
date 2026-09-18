import { beforeEach, describe, expect, it } from 'vitest';
import { ALARM_LEVEL } from '@safeexit/shared-types';
import { loadEnv } from '../config/env.js';
import type { Clock } from '../common/clock.js';
import { DEMO } from '../persistence/demo-data.js';
import {
  MemoryAlarmStore,
  MemoryContactStore,
  MemoryDeviceStore,
  MemoryDownlinkStore,
  MemoryPartnerStore,
} from '../persistence/memory/memory-store.js';
import { seedMemory } from '../persistence/memory/seed-memory.js';
import type { DeviceRecord } from '../persistence/ports.js';
import { AlarmService } from './alarm.service.js';
import {
  AlarmDispatcher,
  type AlarmNotification,
  type NotificationChannel,
} from './dispatch/notification.js';

class TestClock implements Clock {
  constructor(private current = new Date('2026-09-16T22:00:00.000Z')) {}

  now(): Date {
    return new Date(this.current);
  }

  advanceSeconds(seconds: number): void {
    this.current = new Date(this.current.getTime() + seconds * 1000);
  }
}

class RecordingChannel implements NotificationChannel {
  readonly name = 'test';
  readonly sent: AlarmNotification[] = [];

  supports(): boolean {
    return true;
  }

  async send(notification: AlarmNotification): Promise<void> {
    this.sent.push(notification);
  }

  namesFor(kind: AlarmNotification['recipient']['kind']): string[] {
    return this.sent
      .filter((notification) => notification.recipient.kind === kind)
      .map((notification) => notification.recipient.name);
  }

  clear(): void {
    this.sent.length = 0;
  }
}

describe('AlarmService', () => {
  let devices: MemoryDeviceStore;
  let alarms: MemoryAlarmStore;
  let downlinks: MemoryDownlinkStore;
  let channel: RecordingChannel;
  let clock: TestClock;
  let service: AlarmService;
  let button: DeviceRecord;

  beforeEach(async () => {
    devices = new MemoryDeviceStore();
    alarms = new MemoryAlarmStore();
    downlinks = new MemoryDownlinkStore();
    const contacts = new MemoryContactStore();
    const partners = new MemoryPartnerStore();
    seedMemory(devices, contacts, partners);

    channel = new RecordingChannel();
    clock = new TestClock();
    service = new AlarmService(
      alarms,
      devices,
      contacts,
      partners,
      downlinks,
      clock,
      loadEnv({} as NodeJS.ProcessEnv),
      new AlarmDispatcher([channel]),
    );

    const found = await devices.findById(DEMO.buttonDeviceId);
    if (!found) {
      throw new Error('Demo-Geraet fehlt');
    }
    button = found;
  });

  it('alarmiert auf Stufe 1 nur die Vertrauenskontakte', async () => {
    const alarm = await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());

    expect(alarm.level).toBe(1);
    expect(alarm.status).toBe('active');
    expect(channel.namesFor('contact')).toEqual(['Mama', 'Papa']);
    expect(channel.namesFor('partner')).toEqual([]);
  });

  it('stuft bei erneutem Druck hoch, statt einen zweiten Alarm anzulegen', async () => {
    const first = await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());
    const second = await service.trigger(button, ALARM_LEVEL.NETWORK, clock.now());

    expect(second.id).toBe(first.id);
    expect(second.level).toBe(ALARM_LEVEL.NETWORK);
  });

  it('nimmt eine Stufe nie zurueck', async () => {
    const alarm = await service.trigger(button, ALARM_LEVEL.EMERGENCY, clock.now());
    const afterLowerPress = await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());

    expect(afterLowerPress.id).toBe(alarm.id);
    expect(afterLowerPress.level).toBe(ALARM_LEVEL.EMERGENCY);
  });

  it('alarmiert Partnerbetriebe erst, wenn ein Standort vorliegt', async () => {
    await service.trigger(button, ALARM_LEVEL.NETWORK, clock.now());
    expect(channel.namesFor('partner')).toEqual([]);

    channel.clear();
    const alarm = await service.recordLocation(button, {
      ...DEMO.location,
      accuracyMeters: 12,
      source: 'gnss',
      recordedAt: clock.now(),
    });

    // Nur der aktive Partner im Umkreis von 300 m, nicht die 700 m entfernte
    // Apotheke und nicht der Betrieb, der erst eine Absichtserklaerung hat.
    expect(channel.namesFor('partner')).toEqual(['Kiosk am Markt']);
    expect(alarm?.networkDispatchedAt).not.toBeNull();
  });

  it('stuft ohne Quittierung nach der eingestellten Frist hoch', async () => {
    await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());

    clock.advanceSeconds(89);
    expect(await service.escalateOverdue()).toBe(0);

    clock.advanceSeconds(2);
    expect(await service.escalateOverdue()).toBe(1);

    const alarm = await service.findActiveByDeviceId(button.id);
    expect(alarm?.level).toBe(ALARM_LEVEL.NETWORK);
  });

  it('stuft nach einer Quittierung nicht mehr hoch', async () => {
    const alarm = await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());
    await service.acknowledge(alarm.id, 'contact:mama', 'Mama');

    clock.advanceSeconds(300);
    expect(await service.escalateOverdue()).toBe(0);
  });

  it('schickt die Quittierung als Rueckmeldung an den Knopf', async () => {
    const alarm = await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());
    await service.acknowledge(alarm.id, 'contact:mama', 'Mama');

    const pending = await downlinks.takePending(button.id);
    expect(pending.map((frame) => frame.type)).toEqual(['acknowledged']);

    const updated = await service.findById(alarm.id);
    expect(updated?.acknowledgement?.responderName).toBe('Mama');
    // Die Quittierung beendet den Alarm nicht.
    expect(updated?.status).toBe('active');
  });

  it('behaelt die erste Quittierung', async () => {
    const alarm = await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());
    await service.acknowledge(alarm.id, 'contact:mama', 'Mama');
    await service.acknowledge(alarm.id, 'partner:kiosk', 'Kiosk am Markt');

    const updated = await service.findById(alarm.id);
    expect(updated?.acknowledgement?.responderName).toBe('Mama');
  });

  it('entwarnt nur mit der richtigen PIN', async () => {
    const alarm = await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());

    await expect(service.cancel(alarm.id, '9999')).rejects.toThrow();

    const cancelled = await service.cancel(alarm.id, DEMO.cancelPin);
    expect(cancelled.status).toBe('cancelled');
    expect(await service.findActiveByDeviceId(button.id)).toBeNull();

    const pending = await downlinks.takePending(button.id);
    expect(pending.map((frame) => frame.type)).toEqual(['cancelled']);
  });

  it('loest bei einem wiederholten Funkrahmen keinen zweiten Alarm aus', async () => {
    const frame = {
      type: 'alarm_trigger',
      sequence: 7,
      level: ALARM_LEVEL.SILENT,
      batteryPercent: 87,
      timestamp: Math.floor(clock.now().getTime() / 1000),
    } as const;

    await service.handleUplink(button, frame);
    await service.handleUplink(button, frame);

    const alarm = await service.findActiveByDeviceId(button.id);
    expect(alarm).not.toBeNull();

    const events = await alarms.listEvents(alarm!.id);
    expect(events.filter((event) => event.type === 'triggered')).toHaveLength(1);
  });

  it('verwirft Standortdaten ohne laufenden Alarm', async () => {
    const result = await service.recordLocation(button, {
      ...DEMO.location,
      accuracyMeters: 20,
      source: 'gnss',
      recordedAt: clock.now(),
    });

    expect(result).toBeNull();
  });

  it('loescht Standortdaten nach Ablauf der Frist', async () => {
    await service.trigger(button, ALARM_LEVEL.SILENT, clock.now());
    await service.recordLocation(button, {
      ...DEMO.location,
      accuracyMeters: 12,
      source: 'gnss',
      recordedAt: clock.now(),
    });

    clock.advanceSeconds(23 * 60 * 60);
    expect(await service.purgeExpiredLocations()).toBe(0);

    clock.advanceSeconds(2 * 60 * 60);
    expect(await service.purgeExpiredLocations()).toBe(1);

    const alarm = await service.findActiveByDeviceId(button.id);
    expect(alarm?.lastLocation).toBeNull();
  });
});
