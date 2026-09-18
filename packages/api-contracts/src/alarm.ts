import { z } from 'zod';
import type { AlarmLevel, AlarmStatus, LocationSource } from '@safeexit/shared-types';

/** Quittierung durch einen Kontakt oder einen Partnerbetrieb. */
export const acknowledgeAlarmSchema = z.object({
  responderId: z.string().min(1).max(64),
  responderName: z.string().min(1).max(64),
});

export type AcknowledgeAlarmRequest = z.infer<typeof acknowledgeAlarmSchema>;

/**
 * Entwarnung. Nur mit PIN, damit niemand ausser der betroffenen Person einen
 * laufenden Alarm beenden kann.
 */
export const cancelAlarmSchema = z.object({
  pin: z.string().regex(/^\d{4,8}$/, 'Die PIN besteht aus vier bis acht Ziffern'),
});

export type CancelAlarmRequest = z.infer<typeof cancelAlarmSchema>;

export interface AlarmLocationResponse {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  source: LocationSource;
  recordedAt: string;
}

export interface AlarmResponse {
  id: string;
  deviceId: string;
  wearerName: string;
  level: AlarmLevel;
  status: AlarmStatus;
  triggeredAt: string;
  networkDispatchedAt: string | null;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;
  cancelledAt: string | null;
  lastLocation: AlarmLocationResponse | null;
}
