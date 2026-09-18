/**
 * Die Speicherschnittstellen des Backends.
 *
 * Der Alarmpfad kennt nur diese Schnittstellen, nie eine konkrete Datenbank. Das
 * hat zwei Gruende: die Fachlogik laesst sich ohne Datenbank testen, und die
 * Entwicklung laeuft mit STORAGE=memory ohne Docker.
 */
import type {
  Alarm,
  AlarmEvent,
  AlarmLocation,
  Contact,
  Coordinates,
  Device,
  Partner,
} from '@safeexit/shared-types';
import type { DownlinkFrame } from '@safeexit/protocols';
import type { WaitlistSignup } from '@safeexit/api-contracts';

/** Ein Geraet mit den Feldern, die nie nach aussen gehen. */
export interface DeviceRecord extends Device {
  secretHash: string;
  /** Nur Knoepfe haben eine PIN zur Entwarnung. */
  cancelPinHash: string | null;
}

export interface DeviceTelemetry {
  batteryPercent?: number;
  firmwareVersion?: string;
  lastSeenAt: Date;
}

export interface DeviceStore {
  findById(id: string): Promise<DeviceRecord | null>;
  findBySerial(serial: string): Promise<DeviceRecord | null>;
  updateTelemetry(id: string, telemetry: DeviceTelemetry): Promise<void>;
}

export interface AlarmStore {
  create(alarm: Alarm): Promise<Alarm>;
  findById(id: string): Promise<Alarm | null>;
  findActiveByDeviceId(deviceId: string): Promise<Alarm | null>;
  /** Speichert den vollstaendigen Alarm. */
  update(alarm: Alarm): Promise<void>;
  /** Aktive Alarme auf Stufe 1, die seit dem Zeitpunkt niemand quittiert hat. */
  findUnacknowledgedBefore(threshold: Date): Promise<Alarm[]>;
  addLocation(alarmId: string, location: AlarmLocation): Promise<void>;
  /** Loescht Standortdaten, die aelter sind als der Zeitpunkt. Gibt die Anzahl zurueck. */
  deleteLocationsRecordedBefore(cutoff: Date): Promise<number>;
  appendEvent(event: AlarmEvent): Promise<void>;
  listEvents(alarmId: string): Promise<AlarmEvent[]>;
  /**
   * Merkt sich eine verarbeitete laufende Nummer.
   * Gibt false zurueck, wenn der Rahmen schon einmal ankam: das Geraet wiederholt,
   * bis es eine Bestaetigung bekommt, und darf dabei keinen zweiten Alarm ausloesen.
   */
  rememberUplink(deviceId: string, sequence: number): Promise<boolean>;
  /** Raeumt alte Eintraege der Wiederholungserkennung ab. Gibt die Anzahl zurueck. */
  deleteUplinksReceivedBefore(cutoff: Date): Promise<number>;
}

export interface ContactStore {
  findByHouseholdId(householdId: string): Promise<Contact[]>;
}

export interface PartnerStore {
  /** Aktive Partnerbetriebe im Umkreis, sortiert nach Entfernung. */
  findActiveWithin(center: Coordinates, radiusMeters: number): Promise<Partner[]>;
}

export interface DownlinkStore {
  enqueue(deviceId: string, frame: DownlinkFrame): Promise<void>;
  /** Gibt die offenen Rahmen zurueck und markiert sie als zugestellt. */
  takePending(deviceId: string): Promise<DownlinkFrame[]>;
}

export interface WaitlistStore {
  /** Gibt false zurueck, wenn die Adresse schon vorgemerkt war. */
  add(signup: WaitlistSignup): Promise<boolean>;
  count(): Promise<number>;
}

export const DEVICE_STORE = Symbol('DeviceStore');
export const ALARM_STORE = Symbol('AlarmStore');
export const CONTACT_STORE = Symbol('ContactStore');
export const PARTNER_STORE = Symbol('PartnerStore');
export const DOWNLINK_STORE = Symbol('DownlinkStore');
export const WAITLIST_STORE = Symbol('WaitlistStore');
