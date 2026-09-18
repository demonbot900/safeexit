import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';
import pg from 'pg';

export const PG_POOL = Symbol('PgPool');

export function createPool(databaseUrl: string): pg.Pool {
  return new pg.Pool({
    connectionString: databaseUrl,
    // Der Alarmdienst soll lieber schnell scheitern als lange haengen.
    connectionTimeoutMillis: 5_000,
    max: 10,
  });
}

/** Schliesst die Verbindungen beim Herunterfahren. */
@Injectable()
export class PoolLifecycle implements OnModuleDestroy {
  constructor(@Inject(PG_POOL) private readonly pool: pg.Pool) {}

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }
}
