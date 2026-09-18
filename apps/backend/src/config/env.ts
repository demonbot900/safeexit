import { z } from 'zod';
import {
  ESCALATION_TIMEOUT_SECONDS,
  LOCATION_RETENTION_HOURS,
  NETWORK_RADIUS_METERS,
} from '@safeexit/shared-types';

/**
 * Konfiguration wird beim Start einmal geprueft. Faellt etwas auf, soll der Dienst
 * sofort abbrechen und nicht erst beim ersten Alarm.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  STORAGE: z.enum(['memory', 'postgres']).default('memory'),
  DATABASE_URL: z.string().optional(),
  API_PORT: z.coerce.number().int().positive().default(3000),
  ALARM_PORT: z.coerce.number().int().positive().default(3001),
  ESCALATION_TIMEOUT_SECONDS: z.coerce
    .number()
    .int()
    .positive()
    .default(ESCALATION_TIMEOUT_SECONDS),
  NETWORK_RADIUS_METERS: z.coerce.number().int().positive().default(NETWORK_RADIUS_METERS),
  LOCATION_RETENTION_HOURS: z.coerce.number().int().positive().default(LOCATION_RETENTION_HOURS),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const env = envSchema.parse(source);

  if (env.STORAGE === 'postgres' && !env.DATABASE_URL) {
    throw new Error('STORAGE=postgres verlangt DATABASE_URL');
  }

  return env;
}

export const ENV = Symbol('Env');
