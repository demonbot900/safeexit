import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

/**
 * Geraetegeheimnisse und Entwarnungs-PINs liegen nur als Hash in der Datenbank.
 * scrypt ist im Standard von Node enthalten, wir brauchen dafuer keine Bibliothek.
 */
const KEY_LENGTH = 32;

export function hashSecret(secret: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(secret, salt, KEY_LENGTH).toString('hex');
  return `scrypt:${salt}:${derived}`;
}

export function verifySecret(secret: string, stored: string | null): boolean {
  if (!stored) {
    return false;
  }

  const [algorithm, salt, expected] = stored.split(':');
  if (algorithm !== 'scrypt' || !salt || !expected) {
    return false;
  }

  const derived = scryptSync(secret, salt, KEY_LENGTH);
  const expectedBuffer = Buffer.from(expected, 'hex');

  if (derived.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(derived, expectedBuffer);
}
