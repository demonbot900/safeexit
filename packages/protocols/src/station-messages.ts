/**
 * Nachrichten zwischen Backend und Station.
 *
 * Die Station haengt am WLAN und hat Dauerstrom, Bandbreite ist also kein Engpass.
 * Deshalb JSON statt Binaerformat: lesbar im Log, einfach zu erweitern, ohne
 * Firmware-Update auf beiden Seiten.
 */
import { z } from 'zod';

const alarmLevelSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

/** Neuer Alarm, den die Station laut und sichtbar anzeigen soll. */
export const stationAlarmSchema = z.object({
  type: z.literal('alarm'),
  alarmId: z.string().min(1),
  level: alarmLevelSchema,
  wearerName: z.string().min(1).max(64),
  /** Entfernung zur Station, null solange kein Standort vorliegt. */
  distanceMeters: z.number().int().nonnegative().nullable(),
  triggeredAt: z.string().min(1),
  acknowledgedBy: z.string().nullable(),
});

/** Aenderung an einem laufenden Alarm: hochgestuft, quittiert oder entwarnt. */
export const stationAlarmUpdateSchema = z.object({
  type: z.literal('alarm_update'),
  alarmId: z.string().min(1),
  level: alarmLevelSchema,
  status: z.union([z.literal('active'), z.literal('cancelled')]),
  acknowledgedBy: z.string().nullable(),
  distanceMeters: z.number().int().nonnegative().nullable(),
});

export const stationDownstreamMessageSchema = z.discriminatedUnion('type', [
  stationAlarmSchema,
  stationAlarmUpdateSchema,
]);

/** Quittierung: jemand hat "Ich komme" gedrueckt. */
export const stationAcknowledgeSchema = z.object({
  type: z.literal('acknowledge'),
  alarmId: z.string().min(1),
});

/** Lebenszeichen. Bleibt es laenger aus, meldet das Backend den Ausfall. */
export const stationHeartbeatSchema = z.object({
  type: z.literal('heartbeat'),
  firmwareVersion: z.string().min(1).max(32),
  uptimeSeconds: z.number().int().nonnegative(),
  onBatteryPower: z.boolean(),
});

export const stationUpstreamMessageSchema = z.discriminatedUnion('type', [
  stationAcknowledgeSchema,
  stationHeartbeatSchema,
]);

export type StationAlarmMessage = z.infer<typeof stationAlarmSchema>;
export type StationAlarmUpdateMessage = z.infer<typeof stationAlarmUpdateSchema>;
export type StationDownstreamMessage = z.infer<typeof stationDownstreamMessageSchema>;
export type StationAcknowledgeMessage = z.infer<typeof stationAcknowledgeSchema>;
export type StationHeartbeatMessage = z.infer<typeof stationHeartbeatSchema>;
export type StationUpstreamMessage = z.infer<typeof stationUpstreamMessageSchema>;
