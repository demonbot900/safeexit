import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { AlarmService } from './alarm.service.js';

const ESCALATION_SWEEP_MS = 5_000;
const PURGE_SWEEP_MS = 15 * 60 * 1000;

/**
 * Zwei wiederkehrende Aufgaben des Alarmdienstes.
 *
 * Beide arbeiten mit einem Rundlauf ueber die Datenbank statt mit Zeitgebern je
 * Alarm. Ein Zeitgeber im Arbeitsspeicher wuerde einen Neustart nicht ueberleben,
 * und genau dann waere die Hochstufung nach 90 Sekunden verloren.
 */
@Injectable()
export class EscalationScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(EscalationScheduler.name);
  private readonly timers: NodeJS.Timeout[] = [];

  constructor(private readonly alarms: AlarmService) {}

  onModuleInit(): void {
    this.timers.push(
      setInterval(() => {
        void this.run('Hochstufung', () => this.alarms.escalateOverdue());
      }, ESCALATION_SWEEP_MS),
      setInterval(() => {
        void this.run('Loeschung alter Standortdaten', () => this.alarms.purgeExpiredLocations());
      }, PURGE_SWEEP_MS),
    );

    // Der Prozess soll nicht wegen dieser Zeitgeber am Leben bleiben.
    this.timers.forEach((timer) => timer.unref());
  }

  onModuleDestroy(): void {
    this.timers.forEach((timer) => clearInterval(timer));
  }

  private async run(name: string, task: () => Promise<number>): Promise<void> {
    try {
      await task();
    } catch (error) {
      this.logger.error(`${name} fehlgeschlagen: ${String(error)}`);
    }
  }
}
