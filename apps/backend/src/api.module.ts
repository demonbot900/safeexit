import { Module, type DynamicModule } from '@nestjs/common';
import type { Env } from './config/env.js';
import { CoreModule } from './core.module.js';
import { HealthModule } from './health/health.module.js';
import { PersistenceModule } from './persistence/persistence.module.js';
import { WaitlistModule } from './waitlist/waitlist.module.js';

/**
 * Der API-Dienst: Warteliste, spaeter Shop, Konten, Partnerverwaltung.
 * Faellt er aus, laeuft der Alarmdienst weiter.
 */
@Module({})
export class ApiModule {
  static forRoot(env: Env): DynamicModule {
    return {
      module: ApiModule,
      imports: [
        CoreModule.forRoot(env),
        PersistenceModule.forRoot(env),
        WaitlistModule,
        HealthModule.forService('api'),
      ],
    };
  }
}
