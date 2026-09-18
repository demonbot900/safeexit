import { Controller, Get, Inject } from '@nestjs/common';

export const SERVICE_NAME = Symbol('ServiceName');

/**
 * Lebenszeichen fuer Ueberwachung und Lastverteiler.
 *
 * Der Alarmdienst wird getrennt ueberwacht: faellt er aus, ist das ein Vorfall
 * anderer Dringlichkeit als ein Ausfall des Shops.
 */
@Controller('health')
export class HealthController {
  private readonly startedAt = Date.now();

  constructor(@Inject(SERVICE_NAME) private readonly service: string) {}

  @Get()
  get(): { status: 'ok'; service: string; uptimeSeconds: number } {
    return {
      status: 'ok',
      service: this.service,
      uptimeSeconds: Math.round((Date.now() - this.startedAt) / 1000),
    };
  }
}
