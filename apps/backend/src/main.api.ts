import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module.js';
import { enableDevelopmentCors } from './bootstrap.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();
const app = await NestFactory.create(ApiModule.forRoot(env));

enableDevelopmentCors(app, env);
app.enableShutdownHooks();
await app.listen(env.API_PORT);

new Logger('API').log(`API auf Port ${env.API_PORT}, Speicher: ${env.STORAGE}`);
