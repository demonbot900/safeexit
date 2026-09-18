import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AlarmServiceModule } from './alarm-service.module.js';
import { configureAlarmApp, enableDevelopmentCors } from './bootstrap.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();
const app = await NestFactory.create(AlarmServiceModule.forRoot(env));

configureAlarmApp(app);
enableDevelopmentCors(app, env);
await app.listen(env.ALARM_PORT);

new Logger('Alarmdienst').log(
  `Alarmdienst auf Port ${env.ALARM_PORT}, Speicher: ${env.STORAGE}, ` +
    `Hochstufung nach ${env.ESCALATION_TIMEOUT_SECONDS} s, Umkreis ${env.NETWORK_RADIUS_METERS} m`,
);
