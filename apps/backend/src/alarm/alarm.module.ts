import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service.js';
import { EscalationScheduler } from './escalation.scheduler.js';
import {
  AlarmDispatcher,
  LogNotificationChannel,
  NOTIFICATION_CHANNELS,
  StationNotificationChannel,
  type NotificationChannel,
} from './dispatch/notification.js';
import { StationGateway } from './station/station.gateway.js';
import { AlarmController } from './http/alarm.controller.js';
import { StationController } from './http/station.controller.js';
import { UplinkController } from './http/uplink.controller.js';

/**
 * Der Alarmpfad. Er kennt weder Shop noch Kontoverwaltung und laeuft als eigener
 * Dienst (src/main.alarm.ts), siehe docs/entscheidungen/0002-alarmpfad-getrennt.md.
 */
@Module({
  controllers: [UplinkController, AlarmController, StationController],
  providers: [
    AlarmService,
    AlarmDispatcher,
    EscalationScheduler,
    StationGateway,
    LogNotificationChannel,
    StationNotificationChannel,
    {
      provide: NOTIFICATION_CHANNELS,
      useFactory: (log: LogNotificationChannel, station: StationNotificationChannel) =>
        [log, station] as NotificationChannel[],
      inject: [LogNotificationChannel, StationNotificationChannel],
    },
  ],
  exports: [AlarmService],
})
export class AlarmModule {}
