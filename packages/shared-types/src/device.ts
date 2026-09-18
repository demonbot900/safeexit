import type { AlarmLevel } from './alarm.js';

export type DeviceType = 'button' | 'station_home' | 'station_partner';

export interface Device {
  id: string;
  serial: string;
  type: DeviceType;
  /** Name, der im Alarm angezeigt wird, etwa "Mia, 9 Jahre". */
  wearerName: string;
  householdId: string | null;
  partnerId: string | null;
  firmwareVersion: string | null;
  batteryPercent: number | null;
  lastSeenAt: Date | null;
}

/** Ein Vertrauenskontakt bekommt jeden Alarm ab Stufe 1. */
export interface Contact {
  id: string;
  householdId: string;
  name: string;
  phone: string | null;
  pushToken: string | null;
  /** Station dieses Kontakts, falls vorhanden. */
  stationDeviceId: string | null;
  /** Kleinere Zahl heisst: wird zuerst benachrichtigt. */
  priority: number;
}

export type PartnerStatus = 'pending' | 'active';

/** Ein Partnerbetrieb, in der App ein Safe Point, wird ab Stufe 2 im Umkreis alarmiert. */
export interface Partner {
  id: string;
  name: string;
  street: string;
  postalCode: string;
  city: string;
  latitude: number;
  longitude: number;
  status: PartnerStatus;
  stationDeviceId: string | null;
}

/** Was eine Station beim Eingang eines Alarms anzeigt. */
export interface StationAlarmView {
  alarmId: string;
  level: AlarmLevel;
  wearerName: string;
  distanceMeters: number | null;
  triggeredAt: Date;
  acknowledgedBy: string | null;
}
