import { Inject, Injectable, Logger } from '@nestjs/common';
import type { Alarm } from '@safeexit/shared-types';
import type { StationDownstreamMessage } from '@safeexit/protocols';
import type { DeviceRecord } from '../../persistence/ports.js';
import { StationGateway } from '../station/station.gateway.js';

export type AlarmNotificationKind = 'triggered' | 'escalated' | 'acknowledged' | 'cancelled';

export interface AlarmRecipient {
  kind: 'contact' | 'partner';
  id: string;
  name: string;
  phone: string | null;
  pushToken: string | null;
  stationDeviceId: string | null;
  /** Entfernung zwischen Empfaenger und Alarm, soweit bekannt. */
  distanceMeters: number | null;
}

export interface AlarmNotification {
  kind: AlarmNotificationKind;
  alarm: Alarm;
  device: DeviceRecord;
  recipient: AlarmRecipient;
}

export interface NotificationChannel {
  readonly name: string;
  supports(notification: AlarmNotification): boolean;
  send(notification: AlarmNotification): Promise<void>;
}

export const NOTIFICATION_CHANNELS = Symbol('NotificationChannels');

/**
 * Platzhalter fuer Push und SMS.
 *
 * Push (Firebase, APNs mit der Berechtigung fuer kritische Mitteilungen) und SMS
 * brauchen Vertraege und Freigaben, die erst spaeter vorliegen. Bis dahin ist im
 * Log nachvollziehbar, wer wann benachrichtigt worden waere. Der Alarmpfad ist
 * damit vollstaendig testbar.
 */
@Injectable()
export class LogNotificationChannel implements NotificationChannel {
  readonly name = 'log';
  private readonly logger = new Logger('Benachrichtigung');

  supports(): boolean {
    return true;
  }

  async send(notification: AlarmNotification): Promise<void> {
    const { alarm, device, recipient, kind } = notification;
    const distance = recipient.distanceMeters === null ? '?' : `${recipient.distanceMeters} m`;

    this.logger.log(
      `${kind} | Stufe ${alarm.level} | ${device.wearerName} | an ${recipient.kind} ${recipient.name} (${distance}) | Alarm ${alarm.id}`,
    );
  }
}

/** Schickt den Alarm an die Station des Empfaengers, falls er eine hat. */
@Injectable()
export class StationNotificationChannel implements NotificationChannel {
  readonly name = 'station';

  constructor(private readonly gateway: StationGateway) {}

  supports(notification: AlarmNotification): boolean {
    return notification.recipient.stationDeviceId !== null;
  }

  async send(notification: AlarmNotification): Promise<void> {
    const { alarm, device, recipient, kind } = notification;
    if (!recipient.stationDeviceId) {
      return;
    }

    const message: StationDownstreamMessage =
      kind === 'triggered'
        ? {
            type: 'alarm',
            alarmId: alarm.id,
            level: alarm.level,
            wearerName: device.wearerName,
            distanceMeters: recipient.distanceMeters,
            triggeredAt: alarm.triggeredAt.toISOString(),
            acknowledgedBy: alarm.acknowledgement?.responderName ?? null,
          }
        : {
            type: 'alarm_update',
            alarmId: alarm.id,
            level: alarm.level,
            status: alarm.status,
            acknowledgedBy: alarm.acknowledgement?.responderName ?? null,
            distanceMeters: recipient.distanceMeters,
          };

    this.gateway.publish(recipient.stationDeviceId, message);
  }
}

/**
 * Faechert eine Benachrichtigung ueber alle Kanaele auf.
 *
 * Ein Kanal darf den anderen nicht aufhalten: faellt Push aus, muessen SMS und
 * Station trotzdem rausgehen. Deshalb allSettled statt all.
 */
@Injectable()
export class AlarmDispatcher {
  private readonly logger = new Logger(AlarmDispatcher.name);

  constructor(
    @Inject(NOTIFICATION_CHANNELS) private readonly channels: readonly NotificationChannel[],
  ) {}

  async dispatch(notifications: readonly AlarmNotification[]): Promise<number> {
    const tasks: Promise<void>[] = [];

    for (const notification of notifications) {
      for (const channel of this.channels) {
        if (!channel.supports(notification)) {
          continue;
        }

        tasks.push(
          channel.send(notification).catch((error: unknown) => {
            this.logger.error(
              `Kanal ${channel.name} konnte ${notification.recipient.name} nicht erreichen: ${String(error)}`,
            );
          }),
        );
      }
    }

    await Promise.allSettled(tasks);
    return tasks.length;
  }
}
