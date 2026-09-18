/**
 * Legt die Demo-Daten in der Datenbank an (npm run db:seed).
 *
 * Dieselben Daten wie bei STORAGE=memory, damit eine Vorfuehrung auf beiden Wegen
 * gleich aussieht. Nur fuer Entwicklung und Vorfuehrung gedacht.
 */
import { loadEnv } from '../../config/env.js';
import { DEMO, buildDemoData } from '../demo-data.js';
import { createPool } from './pool.js';

async function seed(): Promise<void> {
  const env = loadEnv();
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL fehlt');
  }
  if (env.NODE_ENV === 'production') {
    throw new Error('Demo-Daten gehoeren nicht in die Produktion');
  }

  const data = buildDemoData();
  const pool = createPool(env.DATABASE_URL);
  const client = await pool.connect();

  try {
    await client.query('begin');

    await client.query(
      'insert into households (id, name) values ($1, $2) on conflict (id) do nothing',
      [DEMO.householdId, DEMO.householdName],
    );

    for (const partner of data.partners) {
      await client.query(
        `insert into partners (id, name, street, postal_code, city, latitude, longitude, status)
         values ($1, $2, $3, $4, $5, $6, $7, $8)
         on conflict (id) do nothing`,
        [
          partner.id,
          partner.name,
          partner.street,
          partner.postalCode,
          partner.city,
          partner.latitude,
          partner.longitude,
          partner.status,
        ],
      );
    }

    for (const device of data.devices) {
      await client.query(
        `insert into devices (id, serial, type, wearer_name, household_id, partner_id,
                              secret_hash, cancel_pin_hash, firmware_version, battery_percent)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         on conflict (id) do update
            set secret_hash = excluded.secret_hash,
                cancel_pin_hash = excluded.cancel_pin_hash`,
        [
          device.id,
          device.serial,
          device.type,
          device.wearerName,
          device.householdId,
          device.partnerId,
          device.secretHash,
          device.cancelPinHash,
          device.firmwareVersion,
          device.batteryPercent,
        ],
      );
    }

    // Erst jetzt moeglich: die Station gehoert zu einem Geraet, das es geben muss.
    for (const partner of data.partners) {
      await client.query('update partners set station_device_id = $2 where id = $1', [
        partner.id,
        partner.stationDeviceId,
      ]);
    }

    for (const contact of data.contacts) {
      await client.query(
        `insert into contacts (id, household_id, name, phone, push_token, station_device_id, priority)
         values ($1, $2, $3, $4, $5, $6, $7)
         on conflict (id) do nothing`,
        [
          contact.id,
          contact.householdId,
          contact.name,
          contact.phone,
          contact.pushToken,
          contact.stationDeviceId,
          contact.priority,
        ],
      );
    }

    await client.query('commit');
    console.log('Demo-Daten angelegt');
    console.log(`Knopf:           ${DEMO.buttonDeviceId} (Geheimnis: ${DEMO.buttonSecret})`);
    console.log(`Station zuhause: ${DEMO.homeStationDeviceId}`);
    console.log(`Station Partner: ${DEMO.partnerStationDeviceId}`);
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

await seed();
