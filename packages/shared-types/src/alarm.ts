/** Die drei Stufen der Rettungskette (Businessplan 3.3). */
export const ALARM_LEVEL = {
  /** Einmal druecken: nur die hinterlegten Vertrauenskontakte. */
  SILENT: 1,
  /** Zweimal druecken oder keine Reaktion: zusaetzlich Partnerbetriebe im Umkreis. */
  NETWORK: 2,
  /** Drei Sekunden halten: Kontakte werden aufgefordert, 110 zu waehlen. */
  EMERGENCY: 3,
} as const;

export type AlarmLevel = (typeof ALARM_LEVEL)[keyof typeof ALARM_LEVEL];

export const ALARM_LEVELS: readonly AlarmLevel[] = [
  ALARM_LEVEL.SILENT,
  ALARM_LEVEL.NETWORK,
  ALARM_LEVEL.EMERGENCY,
];

export function isAlarmLevel(value: number): value is AlarmLevel {
  return value === 1 || value === 2 || value === 3;
}

/**
 * Ein Alarm ist aktiv, bis er per PIN in der App entwarnt wird.
 * Eine Quittierung beendet den Alarm ausdruecklich nicht, sie wird nur vermerkt.
 */
export type AlarmStatus = 'active' | 'cancelled';

export type LocationSource = 'gnss' | 'cell' | 'phone';

export interface AlarmLocation {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  source: LocationSource;
  recordedAt: Date;
}

export interface AlarmAcknowledgement {
  /** Wer reagiert hat, etwa contact:uuid oder partner:uuid. */
  responderId: string;
  responderName: string;
  at: Date;
}

export interface Alarm {
  id: string;
  deviceId: string;
  level: AlarmLevel;
  status: AlarmStatus;
  triggeredAt: Date;
  /** Zeitpunkt, zu dem die Partnerbetriebe alarmiert wurden. */
  networkDispatchedAt: Date | null;
  acknowledgement: AlarmAcknowledgement | null;
  cancelledAt: Date | null;
  lastLocation: AlarmLocation | null;
}

/**
 * Ereignisse werden protokolliert, um Fehlalarmquote und Reaktionszeit messen zu
 * koennen (Businessplan 16). Standortdaten gehoeren ausdruecklich nicht hinein.
 */
export type AlarmEventType =
  | 'triggered'
  | 'escalated'
  | 'network_dispatched'
  | 'acknowledged'
  | 'cancelled'
  | 'location_received'
  | 'notification_sent';

export interface AlarmEvent {
  alarmId: string;
  type: AlarmEventType;
  at: Date;
  detail: Record<string, string | number | boolean | null>;
}
