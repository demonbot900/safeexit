import type { INestApplication } from '@nestjs/common';
import express from 'express';
import { MAX_FRAME_SIZE } from '@safeexit/protocols';
import type { Env } from './config/env.js';

/**
 * Gemeinsame Einrichtung fuer den laufenden Dienst und die Tests.
 *
 * Rahmen vom Knopf kommen als rohe Bytes an, nicht als JSON. Die Obergrenze liegt
 * knapp ueber der groessten Rahmenlaenge: alles andere ist kein Geraet.
 */
export function configureAlarmApp(app: INestApplication): void {
  app.use(express.raw({ type: 'application/octet-stream', limit: MAX_FRAME_SIZE * 4 }));
  app.enableShutdownHooks();
}

/**
 * Freigabe fremder Herkunft, nur ausserhalb der Produktion.
 *
 * Gebraucht wird sie fuer die Vorschau der App im Browser (flutter run -d chrome),
 * die auf einem anderen Port laeuft. Im Betrieb sprechen App und Geraete direkt mit
 * dem Dienst, und die Webseite geht ueber ihre eigene Route - dann ist keine
 * Freigabe noetig und es gibt auch keine.
 */
export function enableDevelopmentCors(app: INestApplication, env: Env): void {
  if (env.NODE_ENV === 'production') {
    return;
  }

  app.enableCors({ origin: true });
}
