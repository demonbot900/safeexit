import type { Alarm } from '@safeexit/shared-types';
import type { AlarmResponse } from '@safeexit/api-contracts';
import type { DeviceRecord } from '../../persistence/ports.js';

/** Wandelt den Alarm in die Form um, die App und Webseite erwarten. */
export function toAlarmResponse(alarm: Alarm, device: DeviceRecord): AlarmResponse {
  return {
    id: alarm.id,
    deviceId: alarm.deviceId,
    wearerName: device.wearerName,
    level: alarm.level,
    status: alarm.status,
    triggeredAt: alarm.triggeredAt.toISOString(),
    networkDispatchedAt: alarm.networkDispatchedAt?.toISOString() ?? null,
    acknowledgedAt: alarm.acknowledgement?.at.toISOString() ?? null,
    acknowledgedBy: alarm.acknowledgement?.responderName ?? null,
    cancelledAt: alarm.cancelledAt?.toISOString() ?? null,
    lastLocation: alarm.lastLocation
      ? {
          latitude: alarm.lastLocation.latitude,
          longitude: alarm.lastLocation.longitude,
          accuracyMeters: alarm.lastLocation.accuracyMeters,
          source: alarm.lastLocation.source,
          recordedAt: alarm.lastLocation.recordedAt.toISOString(),
        }
      : null,
  };
}
