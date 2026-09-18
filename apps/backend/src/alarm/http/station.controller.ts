import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Logger,
  Param,
  Post,
  Sse,
  type MessageEvent,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';
import { stationUpstreamMessageSchema, type StationUpstreamMessage } from '@safeexit/protocols';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { CLOCK, type Clock } from '../../common/clock.js';
import { DEVICE_STORE, type DeviceStore } from '../../persistence/ports.js';
import { AlarmService } from '../alarm.service.js';
import { StationGateway } from '../station/station.gateway.js';
import { authenticateDevice } from './device-auth.js';

/**
 * Die Station als HTTP-Teilnehmer.
 *
 * Sie haelt eine offene Verbindung (Server-Sent Events) und bekommt darueber
 * Alarme; Quittierung und Lebenszeichen gehen als kurze Anfragen zurueck.
 * Beobachten laesst sich der Strom mit:
 *   curl -N -H "Authorization: Bearer <geheimnis>" \
 *        http://localhost:3001/v1/stations/<id>/events
 */
@Controller('v1/stations/:stationDeviceId')
export class StationController {
  private readonly logger = new Logger(StationController.name);

  constructor(
    private readonly alarms: AlarmService,
    private readonly gateway: StationGateway,
    @Inject(DEVICE_STORE) private readonly devices: DeviceStore,
    @Inject(CLOCK) private readonly clock: Clock,
  ) {}

  @Sse('events')
  async events(
    @Param('stationDeviceId') stationDeviceId: string,
    @Headers('authorization') authorization: string | undefined,
  ): Promise<Observable<MessageEvent>> {
    const device = await authenticateDevice(this.devices, stationDeviceId, authorization);
    this.logger.log(`Station ${device.wearerName} ist verbunden`);

    return this.gateway
      .connect(device.id)
      .pipe(map((message): MessageEvent => ({ type: message.type, data: message })));
  }

  @Post('messages')
  @HttpCode(200)
  async message(
    @Param('stationDeviceId') stationDeviceId: string,
    @Headers('authorization') authorization: string | undefined,
    @Body(new ZodValidationPipe(stationUpstreamMessageSchema)) message: StationUpstreamMessage,
  ): Promise<{ accepted: true }> {
    const device = await authenticateDevice(this.devices, stationDeviceId, authorization);

    switch (message.type) {
      case 'acknowledge':
        // Der Name der Station ist der Name, den die alarmierende Person sieht:
        // "Kiosk am Markt kommt" ist hilfreicher als eine Kennung.
        await this.alarms.acknowledge(message.alarmId, `station:${device.id}`, device.wearerName);
        break;

      case 'heartbeat':
        await this.devices.updateTelemetry(device.id, {
          firmwareVersion: message.firmwareVersion,
          lastSeenAt: this.clock.now(),
        });
        if (message.onBatteryPower) {
          this.logger.warn(`Station ${device.wearerName} laeuft auf dem Pufferakku`);
        }
        break;
    }

    return { accepted: true };
  }
}
