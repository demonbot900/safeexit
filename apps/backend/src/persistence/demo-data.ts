import type { Contact, Partner } from '@safeexit/shared-types';
import { hashSecret } from '../common/secrets.js';
import type { DeviceRecord } from './ports.js';

/**
 * Demo-Daten fuer Entwicklung und Vorfuehrung.
 *
 * Damit laeuft die ganze Kette ohne Hardware: Alarm ausloesen
 * (npm run simulate:button), Station beobachten, quittieren, entwarnen.
 * STORAGE=memory laedt sie beim Start, fuer Postgres legt sie npm run db:seed an.
 *
 * Die Geheimnisse hier sind ausdruecklich oeffentlich und gehoeren niemals in eine
 * Umgebung, die aus dem Netz erreichbar ist.
 */
export const DEMO = {
  householdId: '00000000-0000-4000-8000-000000000001',
  householdName: 'Familie Demo',
  partnerId: '00000000-0000-4000-8000-000000000002',

  buttonDeviceId: '11111111-1111-4111-8111-111111111111',
  buttonSerial: 'SE-KNOPF-0001',
  buttonSecret: 'demo-knopf-geheimnis',
  cancelPin: '1234',

  homeStationDeviceId: '22222222-2222-4222-8222-222222222222',
  homeStationSecret: 'demo-station-geheimnis',

  partnerStationDeviceId: '33333333-3333-4333-8333-333333333333',
  partnerStationSecret: 'demo-partner-geheimnis',

  /** Marktplatz Oldenburg. Die Partner unten liegen darum herum. */
  location: { latitude: 53.1435, longitude: 8.2146 },
} as const;

export interface DemoData {
  devices: DeviceRecord[];
  contacts: Contact[];
  partners: Partner[];
}

export function buildDemoData(): DemoData {
  return {
    devices: [
      {
        id: DEMO.buttonDeviceId,
        serial: DEMO.buttonSerial,
        type: 'button',
        wearerName: 'Mia, 9 Jahre',
        householdId: DEMO.householdId,
        partnerId: null,
        firmwareVersion: '0.1',
        batteryPercent: 87,
        lastSeenAt: null,
        secretHash: hashSecret(DEMO.buttonSecret),
        cancelPinHash: hashSecret(DEMO.cancelPin),
      },
      {
        id: DEMO.homeStationDeviceId,
        serial: 'SE-STATION-0001',
        type: 'station_home',
        wearerName: 'Station Kueche',
        householdId: DEMO.householdId,
        partnerId: null,
        firmwareVersion: '0.1',
        batteryPercent: null,
        lastSeenAt: null,
        secretHash: hashSecret(DEMO.homeStationSecret),
        cancelPinHash: null,
      },
      {
        id: DEMO.partnerStationDeviceId,
        serial: 'SE-STATION-0002',
        type: 'station_partner',
        wearerName: 'Kiosk am Markt',
        householdId: null,
        partnerId: DEMO.partnerId,
        firmwareVersion: '0.1',
        batteryPercent: null,
        lastSeenAt: null,
        secretHash: hashSecret(DEMO.partnerStationSecret),
        cancelPinHash: null,
      },
    ],

    contacts: [
      {
        id: '44444444-4444-4444-8444-444444444441',
        householdId: DEMO.householdId,
        name: 'Mama',
        phone: '+4917000000001',
        pushToken: 'demo-push-mama',
        stationDeviceId: DEMO.homeStationDeviceId,
        priority: 1,
      },
      {
        id: '44444444-4444-4444-8444-444444444442',
        householdId: DEMO.householdId,
        name: 'Papa',
        phone: '+4917000000002',
        pushToken: 'demo-push-papa',
        stationDeviceId: null,
        priority: 2,
      },
    ],

    partners: [
      // Rund 120 m entfernt, aktiv, mit Station: wird bei Stufe 2 alarmiert.
      {
        id: DEMO.partnerId,
        name: 'Kiosk am Markt',
        street: 'Markt 3',
        postalCode: '26122',
        city: 'Oldenburg',
        latitude: 53.1446,
        longitude: 8.2146,
        status: 'active',
        stationDeviceId: DEMO.partnerStationDeviceId,
      },
      // Rund 700 m entfernt: liegt ausserhalb der 300 m und bleibt still.
      {
        id: '00000000-0000-4000-8000-000000000003',
        name: 'Nachtapotheke',
        street: 'Lange Strasse 40',
        postalCode: '26122',
        city: 'Oldenburg',
        latitude: 53.1498,
        longitude: 8.2146,
        status: 'active',
        stationDeviceId: null,
      },
      // Nah dran, aber nur Absichtserklaerung: bekommt nichts.
      {
        id: '00000000-0000-4000-8000-000000000004',
        name: 'Buchhandlung (noch nicht aktiv)',
        street: 'Markt 8',
        postalCode: '26122',
        city: 'Oldenburg',
        latitude: 53.1437,
        longitude: 8.215,
        status: 'pending',
        stationDeviceId: null,
      },
    ],
  };
}
