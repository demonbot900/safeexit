import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Inject,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ProtocolError, decodeUplinkFrame, encodeFrame } from '@safeexit/protocols';
import {
  DEVICE_STORE,
  DOWNLINK_STORE,
  type DeviceStore,
  type DownlinkStore,
} from '../../persistence/ports.js';
import { AlarmService } from '../alarm.service.js';
import { authenticateDevice } from './device-auth.js';

/**
 * Eingang fuer Rahmen vom Knopf.
 *
 * Die Antwort enthaelt die Empfangsbestaetigung und alles, was fuer das Geraet
 * bereitliegt. Das spart bei LTE-M eine zweite Verbindung: das Geraet kann nach
 * dem Senden sofort wieder schlafen und erfaehrt trotzdem, dass jemand kommt.
 */
@Controller('v1')
export class UplinkController {
  private readonly logger = new Logger(UplinkController.name);

  constructor(
    private readonly alarms: AlarmService,
    @Inject(DEVICE_STORE) private readonly devices: DeviceStore,
    @Inject(DOWNLINK_STORE) private readonly downlinks: DownlinkStore,
  ) {}

  @Post('uplink')
  @HttpCode(200)
  async uplink(
    @Headers('x-device-id') deviceId: string | undefined,
    @Headers('authorization') authorization: string | undefined,
    @Body() body: Buffer,
    @Res() response: Response,
  ): Promise<void> {
    const device = await authenticateDevice(this.devices, deviceId, authorization);

    if (!Buffer.isBuffer(body) || body.byteLength === 0) {
      throw new BadRequestException('Leerer Rahmen');
    }

    let frame;
    try {
      frame = decodeUplinkFrame(new Uint8Array(body));
    } catch (error) {
      if (error instanceof ProtocolError) {
        this.logger.warn(`Ungueltiger Rahmen von ${device.serial}: ${error.message}`);
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    await this.alarms.handleUplink(device, frame);

    const pending = await this.downlinks.takePending(device.id);
    const frames = [
      encodeFrame({
        type: 'receipt',
        sequence: frame.sequence,
        acknowledgedSequence: frame.sequence,
      }),
      ...pending.map((downlink) => encodeFrame(downlink)),
    ];

    response
      .status(200)
      .type('application/octet-stream')
      .send(Buffer.concat(frames.map((bytes) => Buffer.from(bytes))));
  }
}
