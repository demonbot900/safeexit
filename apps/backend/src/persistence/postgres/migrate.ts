/**
 * Wendet die SQL-Dateien aus infrastructure/database/migrations an.
 *
 * Bewusst ein kurzes eigenes Skript statt eines Werkzeugs: Das Schema ist die
 * wichtigste Datei des Projekts, und es soll ohne Zwischenschicht nachvollziehbar
 * bleiben, was in welcher Reihenfolge lief.
 *
 * Aufruf: npm run db:migrate
 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { loadEnv } from '../../config/env.js';
import { createPool } from './pool.js';

const CANDIDATE_DIRECTORIES = [
  process.env.MIGRATIONS_DIR,
  'infrastructure/database/migrations',
  '../../infrastructure/database/migrations',
].filter((value): value is string => typeof value === 'string' && value.length > 0);

function findMigrationsDirectory(): string {
  for (const candidate of CANDIDATE_DIRECTORIES) {
    const resolved = path.resolve(process.cwd(), candidate);
    if (existsSync(resolved)) {
      return resolved;
    }
  }

  throw new Error(
    `Kein Migrationsverzeichnis gefunden. Gesucht: ${CANDIDATE_DIRECTORIES.join(', ')}`,
  );
}

export async function migrate(): Promise<void> {
  const env = loadEnv();
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL fehlt');
  }

  const directory = findMigrationsDirectory();
  const files = (await readdir(directory)).filter((file) => file.endsWith('.sql')).sort();
  const pool = createPool(env.DATABASE_URL);

  try {
    await pool.query(`
      create table if not exists schema_migrations (
        version text primary key,
        checksum text not null,
        applied_at timestamptz not null default now()
      )
    `);

    const applied = await pool.query('select version, checksum from schema_migrations');
    const known = new Map(
      applied.rows.map((row) => [row.version as string, row.checksum as string]),
    );

    for (const file of files) {
      const sql = await readFile(path.join(directory, file), 'utf8');
      const checksum = createHash('sha256').update(sql).digest('hex');
      const previous = known.get(file);

      if (previous === checksum) {
        continue;
      }
      if (previous && previous !== checksum) {
        throw new Error(
          `${file} wurde nach dem Anwenden geaendert. Migrationen werden nie bearbeitet, ` +
            'sondern durch eine neue Datei ergaenzt.',
        );
      }

      const client = await pool.connect();
      try {
        // Jede Migration laeuft vollstaendig oder gar nicht.
        await client.query('begin');
        await client.query(sql);
        await client.query('insert into schema_migrations (version, checksum) values ($1, $2)', [
          file,
          checksum,
        ]);
        await client.query('commit');
        console.log(`angewendet: ${file}`);
      } catch (error) {
        await client.query('rollback');
        throw error;
      } finally {
        client.release();
      }
    }

    console.log('Datenbank ist auf dem aktuellen Stand');
  } finally {
    await pool.end();
  }
}

await migrate();
