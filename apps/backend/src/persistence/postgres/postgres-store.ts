import { Inject, Injectable } from '@nestjs/common';
import type { Pool } from 'pg';
import type {
  Alarm,
  AlarmEvent,
  AlarmEventType,
  AlarmLevel,
  AlarmLocation,
  AlarmStatus,
  Contact,
  Coordinates,
  DeviceType,
  LocationSource,
  Partner,
  PartnerStatus,
} from '@safeexit/shared-types';
import { boundingBox, distanceMeters } from '@safeexit/shared-types';
import { decodeDownlinkFrame, encodeFrame, type DownlinkFrame } from '@safeexit/protocols';
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
import { PG_POOL } from './pool.js';

/**
 * Postgres-Umsetzung der Speicherschnittstellen.
 *
 * Bewusst mit Abfragen von Hand statt mit einem ORM: Das Schema in
 * infrastructure/database/migrations ist die Quelle, und an den heiklen Stellen
 * (ein aktiver Alarm je Geraet, Loeschung der Standortdaten) soll man sehen, was
 * wirklich passiert.
 */

interface AlarmRow {
  id: string;
  device_id: string;
  level: number;
  status: string;
  triggered_at: Date;
  network_dispatched_at: Date | null;
  acknowledged_at: Date | null;
  acknowledged_by_id: string | null;
  acknowledged_by_name: string | null;
  cancelled_at: Date | null;
  latitude: number | null;
  longitude: number | null;
  accuracy_meters: number | null;
  source: string | null;
  recorded_at: Date | null;
}

const ALARM_SELECT = `
  select a.id, a.device_id, a.level, a.status, a.triggered_at, a.network_dispatched_at,
         a.acknowledged_at, a.acknowledged_by_id, a.acknowledged_by_name, a.cancelled_at,
         l.latitude, l.longitude, l.accuracy_meters, l.source, l.recorded_at
    from alarms a
    left join lateral (
      select latitude, longitude, accuracy_meters, source, recorded_at
        from alarm_locations
       where alarm_id = a.id
       order by recorded_at desc
       limit 1
    ) l on true
`;

function toAlarm(row: AlarmRow): Alarm {
  const lastLocation: AlarmLocation | null =
    row.latitude !== null && row.longitude !== null && row.recorded_at !== null
      ? {
          latitude: row.latitude,
          longitude: row.longitude,
          accuracyMeters: row.accuracy_meters ?? 0,
          source: (row.source ?? 'gnss') as LocationSource,
          recordedAt: row.recorded_at,
        }
      : null;

  return {
    id: row.id,
    deviceId: row.device_id,
    level: row.level as AlarmLevel,
    status: row.status as AlarmStatus,
    triggeredAt: row.triggered_at,
    networkDispatchedAt: row.network_dispatched_at,
    acknowledgement:
      row.acknowledged_at && row.acknowledged_by_id
        ? {
            responderId: row.acknowledged_by_id,
            responderName: row.acknowledged_by_name ?? row.acknowledged_by_id,
            at: row.acknowledged_at,
          }
        : null,
    cancelledAt: row.cancelled_at,
    lastLocation,
  };
}

@Injectable()
export class PostgresDeviceStore implements DeviceStore {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findById(id: string): Promise<DeviceRecord | null> {
    const result = await this.pool.query('select * from devices where id = $1', [id]);
    return result.rows[0] ? this.toDevice(result.rows[0]) : null;
  }

  async findBySerial(serial: string): Promise<DeviceRecord | null> {
    const result = await this.pool.query('select * from devices where serial = $1', [serial]);
    return result.rows[0] ? this.toDevice(result.rows[0]) : null;
  }

  async updateTelemetry(id: string, telemetry: DeviceTelemetry): Promise<void> {
    await this.pool.query(
      `update devices
          set battery_percent = coalesce($2, battery_percent),
              firmware_version = coalesce($3, firmware_version),
              last_seen_at = $4
        where id = $1`,
      [
        id,
        telemetry.batteryPercent ?? null,
        telemetry.firmwareVersion ?? null,
        telemetry.lastSeenAt,
      ],
    );
  }

  private toDevice(row: Record<string, unknown>): DeviceRecord {
    return {
      id: row.id as string,
      serial: row.serial as string,
      type: row.type as DeviceType,
      wearerName: row.wearer_name as string,
      householdId: (row.household_id as string | null) ?? null,
      partnerId: (row.partner_id as string | null) ?? null,
      firmwareVersion: (row.firmware_version as string | null) ?? null,
      batteryPercent: (row.battery_percent as number | null) ?? null,
      lastSeenAt: (row.last_seen_at as Date | null) ?? null,
      secretHash: row.secret_hash as string,
      cancelPinHash: (row.cancel_pin_hash as string | null) ?? null,
    };
  }
}

@Injectable()
export class PostgresAlarmStore implements AlarmStore {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async create(alarm: Alarm): Promise<Alarm> {
    await this.pool.query(
      `insert into alarms (id, device_id, level, status, triggered_at)
       values ($1, $2, $3, $4, $5)`,
      [alarm.id, alarm.deviceId, alarm.level, alarm.status, alarm.triggeredAt],
    );
    return alarm;
  }

  async findById(alarmId: string): Promise<Alarm | null> {
    const result = await this.pool.query<AlarmRow>(`${ALARM_SELECT} where a.id = $1`, [alarmId]);
    return result.rows[0] ? toAlarm(result.rows[0]) : null;
  }

  async findActiveByDeviceId(deviceId: string): Promise<Alarm | null> {
    const result = await this.pool.query<AlarmRow>(
      `${ALARM_SELECT} where a.device_id = $1 and a.status = 'active'`,
      [deviceId],
    );
    return result.rows[0] ? toAlarm(result.rows[0]) : null;
  }

  async update(alarm: Alarm): Promise<void> {
    await this.pool.query(
      `update alarms
          set level = $2,
              status = $3,
              network_dispatched_at = $4,
              acknowledged_at = $5,
              acknowledged_by_id = $6,
              acknowledged_by_name = $7,
              cancelled_at = $8
        where id = $1`,
      [
        alarm.id,
        alarm.level,
        alarm.status,
        alarm.networkDispatchedAt,
        alarm.acknowledgement?.at ?? null,
        alarm.acknowledgement?.responderId ?? null,
        alarm.acknowledgement?.responderName ?? null,
        alarm.cancelledAt,
      ],
    );
  }

  async findUnacknowledgedBefore(threshold: Date): Promise<Alarm[]> {
    const result = await this.pool.query<AlarmRow>(
      `${ALARM_SELECT}
        where a.status = 'active'
          and a.level = 1
          and a.acknowledged_at is null
          and a.triggered_at <= $1`,
      [threshold],
    );
    return result.rows.map(toAlarm);
  }

  async addLocation(alarmId: string, location: AlarmLocation): Promise<void> {
    await this.pool.query(
      `insert into alarm_locations (alarm_id, latitude, longitude, accuracy_meters, source, recorded_at)
       values ($1, $2, $3, $4, $5, $6)`,
      [
        alarmId,
        location.latitude,
        location.longitude,
        location.accuracyMeters,
        location.source,
        location.recordedAt,
      ],
    );
  }

  async deleteLocationsRecordedBefore(cutoff: Date): Promise<number> {
    const result = await this.pool.query('delete from alarm_locations where recorded_at < $1', [
      cutoff,
    ]);
    return result.rowCount ?? 0;
  }

  async appendEvent(event: AlarmEvent): Promise<void> {
    await this.pool.query(
      'insert into alarm_events (alarm_id, type, at, detail) values ($1, $2, $3, $4)',
      [event.alarmId, event.type, event.at, JSON.stringify(event.detail)],
    );
  }

  async listEvents(alarmId: string): Promise<AlarmEvent[]> {
    const result = await this.pool.query(
      'select alarm_id, type, at, detail from alarm_events where alarm_id = $1 order by at',
      [alarmId],
    );

    return result.rows.map((row) => ({
      alarmId: row.alarm_id as string,
      type: row.type as AlarmEventType,
      at: row.at as Date,
      detail: row.detail as AlarmEvent['detail'],
    }));
  }

  async rememberUplink(deviceId: string, sequence: number): Promise<boolean> {
    const result = await this.pool.query(
      `insert into device_uplinks (device_id, sequence)
       values ($1, $2)
       on conflict (device_id, sequence) do nothing`,
      [deviceId, sequence],
    );
    return (result.rowCount ?? 0) === 1;
  }

  async deleteUplinksReceivedBefore(cutoff: Date): Promise<number> {
    const result = await this.pool.query('delete from device_uplinks where received_at < $1', [
      cutoff,
    ]);
    return result.rowCount ?? 0;
  }
}

@Injectable()
export class PostgresContactStore implements ContactStore {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findByHouseholdId(householdId: string): Promise<Contact[]> {
    const result = await this.pool.query(
      `select id, household_id, name, phone, push_token, station_device_id, priority
         from contacts
        where household_id = $1
        order by priority`,
      [householdId],
    );

    return result.rows.map((row) => ({
      id: row.id as string,
      householdId: row.household_id as string,
      name: row.name as string,
      phone: (row.phone as string | null) ?? null,
      pushToken: (row.push_token as string | null) ?? null,
      stationDeviceId: (row.station_device_id as string | null) ?? null,
      priority: row.priority as number,
    }));
  }
}

@Injectable()
export class PostgresPartnerStore implements PartnerStore {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async findActiveWithin(center: Coordinates, radiusMeters: number): Promise<Partner[]> {
    // Grobes Rechteck in der Datenbank, genaue Entfernung danach in der Anwendung.
    // Dieselbe Rechnung wie im Speicher-Store, damit beide gleich antworten.
    const box = boundingBox(center, radiusMeters);
    const result = await this.pool.query(
      `select id, name, street, postal_code, city, latitude, longitude, status, station_device_id
         from partners
        where status = 'active'
          and latitude between $1 and $2
          and longitude between $3 and $4`,
      [box.minLatitude, box.maxLatitude, box.minLongitude, box.maxLongitude],
    );

    return result.rows
      .map((row) => ({
        id: row.id as string,
        name: row.name as string,
        street: row.street as string,
        postalCode: row.postal_code as string,
        city: row.city as string,
        latitude: row.latitude as number,
        longitude: row.longitude as number,
        status: row.status as PartnerStatus,
        stationDeviceId: (row.station_device_id as string | null) ?? null,
      }))
      .map((partner) => ({ partner, distance: distanceMeters(center, partner) }))
      .filter(({ distance }) => distance <= radiusMeters)
      .sort((a, b) => a.distance - b.distance)
      .map(({ partner }) => partner);
  }
}

@Injectable()
export class PostgresDownlinkStore implements DownlinkStore {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async enqueue(deviceId: string, frame: DownlinkFrame): Promise<void> {
    await this.pool.query('insert into device_downlinks (device_id, payload) values ($1, $2)', [
      deviceId,
      Buffer.from(encodeFrame(frame)),
    ]);
  }

  async takePending(deviceId: string): Promise<DownlinkFrame[]> {
    // Markieren und Ausliefern in einem Schritt, damit zwei gleichzeitige Anfragen
    // denselben Rahmen nicht doppelt bekommen.
    const result = await this.pool.query(
      `update device_downlinks
          set delivered_at = now()
        where device_id = $1 and delivered_at is null
        returning payload`,
      [deviceId],
    );

    return result.rows.map((row) => decodeDownlinkFrame(new Uint8Array(row.payload as Buffer)));
  }
}

@Injectable()
export class PostgresWaitlistStore implements WaitlistStore {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  async add(signup: WaitlistSignup): Promise<boolean> {
    const result = await this.pool.query(
      `insert into waitlist_signups (email, segment, postal_code)
       values ($1, $2, $3)
       on conflict (lower(email)) do nothing`,
      [signup.email, signup.segment, signup.postalCode ?? null],
    );
    return (result.rowCount ?? 0) === 1;
  }

  async count(): Promise<number> {
    const result = await this.pool.query('select count(*)::int as total from waitlist_signups');
    return (result.rows[0]?.total as number | undefined) ?? 0;
  }
}
