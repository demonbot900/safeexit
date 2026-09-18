import { Module, type DynamicModule } from '@nestjs/common';
import { AlarmModule } from './alarm/alarm.module.js';
import type { Env } from './config/env.js';
import { CoreModule } from './core.module.js';
import { HealthModule } from './health/health.module.js';
import { PersistenceModule } from './persistence/persistence.module.js';

/**
 * Der Alarmdienst: alles, was zwischen Knopfdruck und Hilfe liegt, und sonst nichts.
 */
@Module({})
export class AlarmServiceModule {
  static forRoot(env: Env): DynamicModule {
    return {
      module: AlarmServiceModule,
      imports: [
        CoreModule.forRoot(env),
        PersistenceModule.forRoot(env),
        AlarmModule,
        HealthModule.forService('alarm'),
      ],
    };
  }
}
