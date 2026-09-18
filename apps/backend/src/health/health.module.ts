import { Module, type DynamicModule } from '@nestjs/common';
import { HealthController, SERVICE_NAME } from './health.controller.js';

@Module({})
export class HealthModule {
  static forService(name: string): DynamicModule {
    return {
      module: HealthModule,
      controllers: [HealthController],
      providers: [{ provide: SERVICE_NAME, useValue: name }],
    };
  }
}
