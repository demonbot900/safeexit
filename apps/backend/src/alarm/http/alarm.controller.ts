import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import {
  acknowledgeAlarmSchema,
  cancelAlarmSchema,
  type AcknowledgeAlarmRequest,
  type AlarmResponse,
  type CancelAlarmRequest,
} from '@safeexit/api-contracts';
import { ZodValidationPipe } from '../../common/zod-validation.pipe.js';
import { DEVICE_STORE, type DeviceStore } from '../../persistence/ports.js';
import { AlarmService } from '../alarm.service.js';
import { toAlarmResponse } from './alarm-response.js';

/**
 * Was die App auf einen laufenden Alarm hin tun kann.
 *
 * Offener Punkt: eine Anmeldung fuer App-Nutzer gibt es noch nicht, die Endpunkte
 * sind nur durch die nicht erratbare Alarm-Kennung geschuetzt. Die Entwarnung
 * verlangt zusaetzlich die PIN. Siehe docs/roadmap.md, Punkt Kontoverwaltung.
 */
@Controller('v1')
export class AlarmController {
  constructor(
    private readonly alarms: AlarmService,
    @Inject(DEVICE_STORE) private readonly devices: DeviceStore,
  ) {}

  @Get('alarms/:id')
  async get(@Param('id') id: string): Promise<AlarmResponse> {
    return this.respond(id);
  }

  /** Der laufende Alarm eines Geraets, falls es einen gibt. */
  @Get('devices/:deviceId/active-alarm')
  async active(@Param('deviceId') deviceId: string): Promise<AlarmResponse | null> {
    const alarm = await this.alarms.findActiveByDeviceId(deviceId);
    if (!alarm) {
      return null;
    }

    const device = await this.devices.findById(alarm.deviceId);
    if (!device) {
      throw new NotFoundException('Geraet nicht gefunden');
    }

    return toAlarmResponse(alarm, device);
  }

  @Post('alarms/:id/acknowledge')
  @HttpCode(200)
  async acknowledge(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(acknowledgeAlarmSchema)) body: AcknowledgeAlarmRequest,
  ): Promise<AlarmResponse> {
    await this.alarms.acknowledge(id, body.responderId, body.responderName);
    return this.respond(id);
  }

  @Post('alarms/:id/cancel')
  @HttpCode(200)
  async cancel(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(cancelAlarmSchema)) body: CancelAlarmRequest,
  ): Promise<AlarmResponse> {
    await this.alarms.cancel(id, body.pin);
    return this.respond(id);
  }

  private async respond(alarmId: string): Promise<AlarmResponse> {
    const alarm = await this.alarms.findById(alarmId);
    if (!alarm) {
      throw new NotFoundException('Alarm nicht gefunden');
    }

    const device = await this.devices.findById(alarm.deviceId);
    if (!device) {
      throw new NotFoundException('Geraet nicht gefunden');
    }

    return toAlarmResponse(alarm, device);
  }
}
