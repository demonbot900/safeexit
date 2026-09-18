import { Global, Module, type DynamicModule, type Provider } from '@nestjs/common';
import type { Env } from '../config/env.js';
import {
  ALARM_STORE,
  CONTACT_STORE,
  DEVICE_STORE,
  DOWNLINK_STORE,
  PARTNER_STORE,
  WAITLIST_STORE,
} from './ports.js';
import {
  MemoryAlarmStore,
  MemoryContactStore,
  MemoryDeviceStore,
  MemoryDownlinkStore,
  MemoryPartnerStore,
  MemoryWaitlistStore,
} from './memory/memory-store.js';
import { seedMemory } from './memory/seed-memory.js';
import { PG_POOL, PoolLifecycle, createPool } from './postgres/pool.js';
import {
  PostgresAlarmStore,
  PostgresContactStore,
  PostgresDeviceStore,
  PostgresDownlinkStore,
  PostgresPartnerStore,
  PostgresWaitlistStore,
} from './postgres/postgres-store.js';

const TOKENS = [
  DEVICE_STORE,
  ALARM_STORE,
  CONTACT_STORE,
  PARTNER_STORE,
  DOWNLINK_STORE,
  WAITLIST_STORE,
];

/**
 * Waehlt den Speicher anhand der Konfiguration.
 *
 * STORAGE=memory ist der Entwicklungsweg: kein Docker, keine Datenbank, Demo-Daten
 * sind schon da. STORAGE=postgres ist der Betriebsweg.
 */
@Global()
@Module({})
export class PersistenceModule {
  static forRoot(env: Env): DynamicModule {
    const providers: Provider[] =
      env.STORAGE === 'memory' ? memoryProviders() : postgresProviders(env);

    return {
      module: PersistenceModule,
      providers,
      exports: TOKENS,
    };
  }
}

function memoryProviders(): Provider[] {
  return [
    MemoryDeviceStore,
    MemoryAlarmStore,
    MemoryContactStore,
    MemoryPartnerStore,
    MemoryDownlinkStore,
    MemoryWaitlistStore,
    {
      // Beim ersten Zugriff auf den Geraetespeicher stehen die Demo-Daten bereit.
      provide: DEVICE_STORE,
      useFactory: (
        devices: MemoryDeviceStore,
        contacts: MemoryContactStore,
        partners: MemoryPartnerStore,
      ) => {
        seedMemory(devices, contacts, partners);
        return devices;
      },
      inject: [MemoryDeviceStore, MemoryContactStore, MemoryPartnerStore],
    },
    { provide: ALARM_STORE, useExisting: MemoryAlarmStore },
    { provide: CONTACT_STORE, useExisting: MemoryContactStore },
    { provide: PARTNER_STORE, useExisting: MemoryPartnerStore },
    { provide: DOWNLINK_STORE, useExisting: MemoryDownlinkStore },
    { provide: WAITLIST_STORE, useExisting: MemoryWaitlistStore },
  ];
}

function postgresProviders(env: Env): Provider[] {
  return [
    {
      provide: PG_POOL,
      useFactory: () => createPool(env.DATABASE_URL as string),
    },
    PoolLifecycle,
    PostgresDeviceStore,
    PostgresAlarmStore,
    PostgresContactStore,
    PostgresPartnerStore,
    PostgresDownlinkStore,
    PostgresWaitlistStore,
    { provide: DEVICE_STORE, useExisting: PostgresDeviceStore },
    { provide: ALARM_STORE, useExisting: PostgresAlarmStore },
    { provide: CONTACT_STORE, useExisting: PostgresContactStore },
    { provide: PARTNER_STORE, useExisting: PostgresPartnerStore },
    { provide: DOWNLINK_STORE, useExisting: PostgresDownlinkStore },
    { provide: WAITLIST_STORE, useExisting: PostgresWaitlistStore },
  ];
}
