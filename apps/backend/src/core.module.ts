import { Global, Module, type DynamicModule } from '@nestjs/common';
import { CLOCK, SystemClock } from './common/clock.js';
import { ENV, type Env } from './config/env.js';

/**
 * Konfiguration und Uhr. Global, weil praktisch jeder Baustein beides braucht und
 * eine Import-Zeile in jedem Modul nichts erklaert.
 */
@Global()
@Module({})
export class CoreModule {
  static forRoot(env: Env): DynamicModule {
    return {
      module: CoreModule,
      providers: [
        { provide: ENV, useValue: env },
        { provide: CLOCK, useClass: SystemClock },
      ],
      exports: [ENV, CLOCK],
    };
  }
}
