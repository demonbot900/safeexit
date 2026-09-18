import { Injectable } from '@nestjs/common';
import type {
  Alarm,
  AlarmEvent,
  AlarmLocation,
  Contact,
  Coordinates,
  Partner,
} from '@safeexit/shared-types';
import { distanceMeters } from '@safeexit/shared-types';
import type { DownlinkFrame } from '@safeexit/protocols';
import type { WaitlistSignup } from '@safeexit/api-contracts';
import type {
  AlarmStore,
  ContactStore,
  DeviceRecord,
  DeviceStore,
  DeviceTelemetry,
  DownlinkStore,
  PartnerStore,
  WaitlistStore,
} from '../ports.js';

/**
 * Speicher im Arbeitsspeicher. Zwei Aufgaben: Entwicklung und Demo ohne Datenbank
 * (STORAGE=memory) und Testdoppel in den Unit-Tests.
 *
 * Er verhaelt sich wie die Datenbank, gibt also Kopien heraus und nicht die eigenen
 * Objekte. Sonst wuerde ein Aufrufer aus Versehen den Speicher aendern und der Test
 * gruen bleiben, obwohl der Postgres-Speicher sich anders verhielte.
 */

@Injectable()
export class MemoryDeviceStore implements DeviceStore {
  private readonly devices = new Map<string, DeviceRecord>();

  put(device: DeviceRecord): void {
    this.devices.set(device.id, structuredClone(device));
  }

  async findById(id: string): Promise<DeviceRecord | null> {
    const device = this.devices.get(id);
    return device ? structuredClone(device) : null;
  }

  async findBySerial(serial: string): Promise<DeviceRecord | null> {
    for (const device of this.devices.values()) {
      if (device.serial === serial) {
        return structuredClone(device);
      }
    }
    return null;
  }

  async updateTelemetry(id: string, telemetry: DeviceTelemetry): Promise<void> {
    const device = this.devices.get(id);
    if (!device) {
      return;
    }

    if (telemetry.batteryPercent !== undefined) {
      device.batteryPercent = telemetry.batteryPercent;
    }
    if (telemetry.firmwareVersion !== undefined) {
      device.firmwareVersion = telemetry.firmwareVersion;
    }
    device.lastSeenAt = telemetry.lastSeenAt;
  }
}

@Injectable()
export class MemoryAlarmStore implements AlarmStore {
  private readonly alarms = new Map<string, Alarm>();
  private readonly locations = new Map<string, AlarmLocation[]>();
  private readonly events: AlarmEvent[] = [];
  private readonly seenUplinks = new Map<string, Date>();

  async create(alarm: Alarm): Promise<Alarm> {
    this.alarms.set(alarm.id, structuredClone(alarm));
    return structuredClone(alarm);
  }

  async findById(alarmId: string): Promise<Alarm | null> {
    const alarm = this.alarms.get(alarmId);
    return alarm ? structuredClone(alarm) : null;
  }

  async findActiveByDeviceId(deviceId: string): Promise<Alarm | null> {
    for (const alarm of this.alarms.values()) {
      if (alarm.deviceId === deviceId && alarm.status === 'active') {
        return structuredClone(alarm);
      }
    }
    return null;
  }

  async update(alarm: Alarm): Promise<void> {
    this.alarms.set(alarm.id, structuredClone(alarm));
  }

  async findUnacknowledgedBefore(threshold: Date): Promise<Alarm[]> {
    const due: Alarm[] = [];

    for (const alarm of this.alarms.values()) {
      if (
        alarm.status === 'active' &&
        alarm.level === 1 &&
        alarm.acknowledgement === null &&
        alarm.triggeredAt.getTime() <= threshold.getTime()
      ) {
        due.push(structuredClone(alarm));
      }
    }

    return due;
  }

  async addLocation(alarmId: string, location: AlarmLocation): Promise<void> {
    const list = this.locations.get(alarmId) ?? [];
    list.push(structuredClone(location));
    this.locations.set(alarmId, list);
  }

  async deleteLocationsRecordedBefore(cutoff: Date): Promise<number> {
    let deleted = 0;

    for (const [alarmId, list] of this.locations) {
      const kept = list.filter((location) => location.recordedAt.getTime() >= cutoff.getTime());
      deleted += list.length - kept.length;
      if (kept.length === 0) {
        this.locations.delete(alarmId);
      } else {
        this.locations.set(alarmId, kept);
      }
    }

    for (const alarm of this.alarms.values()) {
      if (alarm.lastLocation && alarm.lastLocation.recordedAt.getTime() < cutoff.getTime()) {
        alarm.lastLocation = null;
      }
    }

    return deleted;
  }

  async appendEvent(event: AlarmEvent): Promise<void> {
    this.events.push(structuredClone(event));
  }

  async listEvents(alarmId: string): Promise<AlarmEvent[]> {
    return this.events
      .filter((event) => event.alarmId === alarmId)
      .map((event) => structuredClone(event));
  }

  async rememberUplink(deviceId: string, sequence: number): Promise<boolean> {
    const key = `${deviceId}:${sequence}`;
    if (this.seenUplinks.has(key)) {
      return false;
    }
    this.seenUplinks.set(key, new Date());
    return true;
  }

  async deleteUplinksReceivedBefore(cutoff: Date): Promise<number> {
    let deleted = 0;

    for (const [key, receivedAt] of this.seenUplinks) {
      if (receivedAt.getTime() < cutoff.getTime()) {
        this.seenUplinks.delete(key);
        deleted++;
      }
    }

    return deleted;
  }
}

@Injectable()
export class MemoryContactStore implements ContactStore {
  private readonly contacts: Contact[] = [];

  put(contact: Contact): void {
    this.contacts.push(structuredClone(contact));
  }

  async findByHouseholdId(householdId: string): Promise<Contact[]> {
    return this.contacts
      .filter((contact) => contact.householdId === householdId)
      .sort((a, b) => a.priority - b.priority)
      .map((contact) => structuredClone(contact));
  }
}

@Injectable()
export class MemoryPartnerStore implements PartnerStore {
  private readonly partners: Partner[] = [];

  put(partner: Partner): void {
    this.partners.push(structuredClone(partner));
  }

  async findActiveWithin(center: Coordinates, radiusMeters: number): Promise<Partner[]> {
    return this.partners
      .filter((partner) => partner.status === 'active')
      .map((partner) => ({ partner, distance: distanceMeters(center, partner) }))
      .filter(({ distance }) => distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance)
      .map(({ partner }) => structuredClone(partner));
  }
}

@Injectable()
export class MemoryDownlinkStore implements DownlinkStore {
  private readonly queues = new Map<string, DownlinkFrame[]>();

  async enqueue(deviceId: string, frame: DownlinkFrame): Promise<void> {
    const queue = this.queues.get(deviceId) ?? [];
    queue.push(structuredClone(frame));
    this.queues.set(deviceId, queue);
  }

  async takePending(deviceId: string): Promise<DownlinkFrame[]> {
    const queue = this.queues.get(deviceId) ?? [];
    this.queues.set(deviceId, []);
    return queue;
  }
}

@Injectable()
export class MemoryWaitlistStore implements WaitlistStore {
  private readonly signups = new Map<string, WaitlistSignup>();

  async add(signup: WaitlistSignup): Promise<boolean> {
    const key = signup.email.toLowerCase();
    if (this.signups.has(key)) {
      return false;
    }
    this.signups.set(key, structuredClone(signup));
    return true;
  }

  async count(): Promise<number> {
    return this.signups.size;
  }
}
