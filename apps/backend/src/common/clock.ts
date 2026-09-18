import { Injectable } from '@nestjs/common';

/**
 * Die Zeit als Abhaengigkeit, damit Tests die 90-Sekunden-Regel pruefen koennen,
 * ohne 90 Sekunden zu warten.
 */
export interface Clock {
  now(): Date;
}

export const CLOCK = Symbol('Clock');

@Injectable()
export class SystemClock implements Clock {
  now(): Date {
    return new Date();
  }
}
