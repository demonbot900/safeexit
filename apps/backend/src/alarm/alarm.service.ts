import { randomUUID } from 'node:crypto';
import { ForbiddenException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import type { Alarm, AlarmLevel, AlarmLocation, Coordinates } from '@safeexit/shared-types';
import { distanceMeters } from '@safeexit/shared-types';
import { fromE7, type UplinkFrame } from '@safeexit/protocols';
import { verifySecret } from '../common/secrets.js';
import { CLOCK, type Clock } from '../common/clock.js';
import { ENV, type Env } from '../config/env.js';
import {
  ALARM_STORE,
  CONTACT_STORE,
  DEVICE_STORE,
  DOWNLINK_STORE,
  PARTNER_STORE,
  type AlarmStore,
  type ContactStore,
  type DeviceRecord,
  type DeviceStore,
  type DownlinkStore,
  type PartnerStore,
} from '../persistence/ports.js';
import {
  AlarmDispatcher,
  type AlarmNotification,
  type AlarmNotificationKind,
} from './dispatch/notification.js';

/** Grenze, ab der wir der Uhr im Geraet nicht mehr glauben. */
const MAX_CLOCK_DRIFT_MS = 24 * 60 * 60 * 1000;

/** So lange merkt sich das Backend gesehene Funkrahmen. */
const UPLINK_MEMORY_DAYS = 7;

@Injectable()
export class AlarmService {
  private readonly logger = new Logger(AlarmService.name);

  /**
   * Laufende Nummer der Downlinks. Bei einem Neustart faengt sie wieder an; das ist
   * unkritisch, weil das Geraet nur prueft, ob es dieselbe Nummer zweimal sieht.
   */
  private downlinkSequence = 1;

  constructor(
    @Inject(ALARM_STORE) private readonly alarms: AlarmStore,
    @Inject(DEVICE_STORE) private readonly devices: DeviceStore,
    @Inject(CONTACT_STORE) private readonly contacts: ContactStore,
    @Inject(PARTNER_STORE) private readonly partners: PartnerStore,
    @Inject(DOWNLINK_STORE) private readonly downlinks: DownlinkStore,
    @Inject(CLOCK) private readonly clock: Clock,
    @Inject(ENV) private readonly env: Env,
    private readonly dispatcher: AlarmDispatcher,
  ) {}

  /**
   * Nimmt einen Rahmen vom Geraet an.
   *
   * Der Aufrufer hat das Geraet bereits geprueft. Wiederholungen desselben Rahmens
   * sind normal (das Geraet sendet, bis es eine Bestaetigung bekommt) und duerfen
   * keinen zweiten Alarm ausloesen.
   */
  async handleUplink(device: DeviceRecord, frame: UplinkFrame): Promise<void> {
    const isNew = await this.alarms.rememberUplink(device.id, frame.sequence);
    if (!isNew) {
      this.logger.debug(`Rahmen ${frame.sequence} von ${device.serial} war schon da`);
      return;
    }

    const at = this.resolveTimestamp(frame.timestamp);

    switch (frame.type) {
      case 'alarm_trigger':
        await this.devices.updateTelemetry(device.id, {
          batteryPercent: frame.batteryPercent,
          lastSeenAt: at,
        });
        await this.trigger(device, frame.level, at);
        break;

      case 'alarm_escalate': {
        const alarm = await this.alarms.findActiveByDeviceId(device.id);
        if (!alarm) {
          // Kann vorkommen, wenn die Entwarnung schneller war als die Wiederholung.
          this.logger.warn(`Hochstufung ohne aktiven Alarm von ${device.serial}`);
          break;
        }
        await this.escalate(alarm, device, frame.level, 'Geraet');
        break;
      }

      case 'location':
        await this.recordLocation(device, {
          latitude: fromE7(frame.latitudeE7),
          longitude: fromE7(frame.longitudeE7),
          accuracyMeters: frame.accuracyMeters,
          source: frame.source,
          recordedAt: at,
        });
        break;

      case 'heartbeat':
        await this.devices.updateTelemetry(device.id, {
          batteryPercent: frame.batteryPercent,
          firmwareVersion: `${frame.firmwareMajor}.${frame.firmwareMinor}`,
          lastSeenAt: at,
        });
        break;
    }
  }

  /** Loest einen Alarm aus oder stuft einen laufenden hoch. */
  async trigger(device: DeviceRecord, level: AlarmLevel, at: Date): Promise<Alarm> {
    const running = await this.alarms.findActiveByDeviceId(device.id);
    if (running) {
      return this.escalate(running, device, level, 'erneuter Druck');
    }

    const alarm: Alarm = {
      id: randomUUID(),
      deviceId: device.id,
      level,
      status: 'active',
      triggeredAt: at,
      networkDispatchedAt: null,
      acknowledgement: null,
      cancelledAt: null,
      lastLocation: null,
    };

    await this.alarms.create(alarm);
    await this.alarms.appendEvent({
      alarmId: alarm.id,
      type: 'triggered',
      at,
      detail: { level },
    });

    await this.notifyContacts(alarm, device, 'triggered');
    if (alarm.level >= 2) {
      await this.notifyNetwork(alarm, device);
    }

    return alarm;
  }

  async escalate(
    alarm: Alarm,
    device: DeviceRecord,
    level: AlarmLevel,
    reason: string,
  ): Promise<Alarm> {
    if (alarm.status !== 'active' || level <= alarm.level) {
      // Eine Stufe wird nie zurueckgenommen. Wer einmal Hilfe gerufen hat, soll sie
      // nicht durch einen weiteren Tastendruck verlieren.
      return alarm;
    }

    alarm.level = level;
    await this.alarms.update(alarm);
    await this.alarms.appendEvent({
      alarmId: alarm.id,
      type: 'escalated',
      at: this.clock.now(),
      detail: { level, reason },
    });

    await this.notifyContacts(alarm, device, 'escalated');
    if (alarm.level >= 2) {
      await this.notifyNetwork(alarm, device);
    }

    return alarm;
  }

  /**
   * Standortdaten werden nur waehrend eines laufenden Alarms gespeichert.
   * Kommt eine Meldung ohne Alarm an, wird sie verworfen: keine Bewegungshistorie
   * (Businessplan 9).
   */
  async recordLocation(device: DeviceRecord, location: AlarmLocation): Promise<Alarm | null> {
    const alarm = await this.alarms.findActiveByDeviceId(device.id);
    if (!alarm) {
      this.logger.debug(`Standort ohne aktiven Alarm von ${device.serial} verworfen`);
      return null;
    }

    await this.alarms.addLocation(alarm.id, location);
    alarm.lastLocation = location;
    await this.alarms.update(alarm);
    await this.alarms.appendEvent({
      alarmId: alarm.id,
      type: 'location_received',
      at: location.recordedAt,
      detail: { source: location.source, accuracyMeters: location.accuracyMeters },
    });

    // Stufe 2 ohne Position konnte die Partnerbetriebe noch nicht erreichen.
    // Jetzt geht es.
    if (alarm.level >= 2 && alarm.networkDispatchedAt === null) {
      await this.notifyNetwork(alarm, device);
    }

    return alarm;
  }

  /** Jemand hat "Ich komme" gedrueckt. Die erste Quittierung zaehlt. */
  async acknowledge(alarmId: string, responderId: string, responderName: string): Promise<Alarm> {
    const alarm = await this.requireAlarm(alarmId);
    if (alarm.status !== 'active') {
      throw new ForbiddenException('Der Alarm ist bereits entwarnt');
    }
    if (alarm.acknowledgement) {
      return alarm;
    }

    const device = await this.requireDevice(alarm.deviceId);
    const at = this.clock.now();

    alarm.acknowledgement = { responderId, responderName, at };
    await this.alarms.update(alarm);
    await this.alarms.appendEvent({
      alarmId: alarm.id,
      type: 'acknowledged',
      at,
      detail: {
        responderId,
        secondsUntilResponse: Math.round((at.getTime() - alarm.triggeredAt.getTime()) / 1000),
      },
    });

    // Das Wichtigste am ganzen System: die Rueckmeldung am Knopf.
    await this.downlinks.enqueue(device.id, {
      type: 'acknowledged',
      sequence: this.nextDownlinkSequence(),
      timestamp: Math.floor(at.getTime() / 1000),
    });

    await this.notifyContacts(alarm, device, 'acknowledged');
    await this.notifyNetwork(alarm, device, { force: true });

    return alarm;
  }

  /** Entwarnung. Nur mit der PIN des Geraets. */
  async cancel(alarmId: string, pin: string): Promise<Alarm> {
    const alarm = await this.requireAlarm(alarmId);
    const device = await this.requireDevice(alarm.deviceId);

    if (!verifySecret(pin, device.cancelPinHash)) {
      throw new ForbiddenException('PIN stimmt nicht');
    }
    if (alarm.status === 'cancelled') {
      return alarm;
    }

    const at = this.clock.now();
    alarm.status = 'cancelled';
    alarm.cancelledAt = at;
    await this.alarms.update(alarm);
    await this.alarms.appendEvent({
      alarmId: alarm.id,
      type: 'cancelled',
      at,
      detail: {
        secondsActive: Math.round((at.getTime() - alarm.triggeredAt.getTime()) / 1000),
        acknowledged: alarm.acknowledgement !== null,
      },
    });

    await this.downlinks.enqueue(device.id, {
      type: 'cancelled',
      sequence: this.nextDownlinkSequence(),
      timestamp: Math.floor(at.getTime() / 1000),
    });

    await this.notifyContacts(alarm, device, 'cancelled');
    await this.notifyNetwork(alarm, device, { force: true });

    return alarm;
  }

  /**
   * Stuft Alarme hoch, die nach der eingestellten Frist niemand quittiert hat.
   * Wird regelmaessig aufgerufen; ein Zeitgeber im Arbeitsspeicher wuerde einen
   * Neustart nicht ueberleben.
   */
  async escalateOverdue(now: Date = this.clock.now()): Promise<number> {
    const threshold = new Date(now.getTime() - this.env.ESCALATION_TIMEOUT_SECONDS * 1000);
    const overdue = await this.alarms.findUnacknowledgedBefore(threshold);
    let escalated = 0;

    for (const alarm of overdue) {
      const device = await this.devices.findById(alarm.deviceId);
      if (!device) {
        continue;
      }
      await this.escalate(alarm, device, 2, 'keine Reaktion');
      escalated++;
    }

    return escalated;
  }

  /** Loescht Standortdaten nach Ablauf der Aufbewahrungsfrist. */
  async purgeExpiredLocations(now: Date = this.clock.now()): Promise<number> {
    const cutoff = new Date(now.getTime() - this.env.LOCATION_RETENTION_HOURS * 60 * 60 * 1000);
    const deleted = await this.alarms.deleteLocationsRecordedBefore(cutoff);

    if (deleted > 0) {
      this.logger.log(`${deleted} Standortdatensaetze nach Ablauf der Frist geloescht`);
    }

    // Die Wiederholungserkennung braucht nur die juengste Vergangenheit.
    await this.alarms.deleteUplinksReceivedBefore(
      new Date(now.getTime() - UPLINK_MEMORY_DAYS * 24 * 60 * 60 * 1000),
    );

    return deleted;
  }

  async findById(alarmId: string): Promise<Alarm | null> {
    return this.alarms.findById(alarmId);
  }

  async findActiveByDeviceId(deviceId: string): Promise<Alarm | null> {
    return this.alarms.findActiveByDeviceId(deviceId);
  }

  // --- intern ---

  private async notifyContacts(
    alarm: Alarm,
    device: DeviceRecord,
    kind: AlarmNotificationKind,
  ): Promise<void> {
    if (!device.householdId) {
      return;
    }

    const contacts = await this.contacts.findByHouseholdId(device.householdId);
    const notifications: AlarmNotification[] = contacts.map((contact) => ({
      kind,
      alarm,
      device,
      recipient: {
        kind: 'contact',
        id: contact.id,
        name: contact.name,
        phone: contact.phone,
        pushToken: contact.pushToken,
        stationDeviceId: contact.stationDeviceId,
        distanceMeters: null,
      },
    }));

    await this.record(alarm, kind, await this.dispatcher.dispatch(notifications));
  }

  /**
   * Partnerbetriebe im Umkreis. Ohne Position geht das nicht; dann wird der Versand
   * nachgeholt, sobald die erste Ortung ankommt.
   */
  private async notifyNetwork(
    alarm: Alarm,
    device: DeviceRecord,
    options: { force?: boolean } = {},
  ): Promise<void> {
    if (alarm.level < 2 || alarm.lastLocation === null) {
      return;
    }
    if (alarm.networkDispatchedAt !== null && !options.force) {
      return;
    }

    const center: Coordinates = alarm.lastLocation;
    const partners = await this.partners.findActiveWithin(center, this.env.NETWORK_RADIUS_METERS);
    const kind: AlarmNotificationKind =
      alarm.status === 'cancelled'
        ? 'cancelled'
        : alarm.acknowledgement !== null && options.force
          ? 'acknowledged'
          : 'triggered';

    const notifications: AlarmNotification[] = partners.map((partner) => ({
      kind,
      alarm,
      device,
      recipient: {
        kind: 'partner',
        id: partner.id,
        name: partner.name,
        phone: null,
        pushToken: null,
        stationDeviceId: partner.stationDeviceId,
        distanceMeters: Math.round(distanceMeters(center, partner)),
      },
    }));

    const sent = await this.dispatcher.dispatch(notifications);

    if (alarm.networkDispatchedAt === null) {
      alarm.networkDispatchedAt = this.clock.now();
      await this.alarms.update(alarm);
      await this.alarms.appendEvent({
        alarmId: alarm.id,
        type: 'network_dispatched',
        at: alarm.networkDispatchedAt,
        detail: { partnerCount: partners.length },
      });
    }

    await this.record(alarm, kind, sent);
  }

  private async record(alarm: Alarm, kind: string, sent: number): Promise<void> {
    if (sent === 0) {
      return;
    }

    await this.alarms.appendEvent({
      alarmId: alarm.id,
      type: 'notification_sent',
      at: this.clock.now(),
      detail: { kind, count: sent },
    });
  }

  private async requireAlarm(alarmId: string): Promise<Alarm> {
    const alarm = await this.alarms.findById(alarmId);
    if (!alarm) {
      throw new NotFoundException('Alarm nicht gefunden');
    }
    return alarm;
  }

  private async requireDevice(deviceId: string): Promise<DeviceRecord> {
    const device = await this.devices.findById(deviceId);
    if (!device) {
      throw new NotFoundException('Geraet nicht gefunden');
    }
    return device;
  }

  private nextDownlinkSequence(): number {
    this.downlinkSequence = (this.downlinkSequence + 1) % 0x10000;
    return this.downlinkSequence;
  }

  private resolveTimestamp(deviceTimestamp: number): Date {
    const now = this.clock.now();
    if (deviceTimestamp === 0) {
      return now;
    }

    const candidate = new Date(deviceTimestamp * 1000);
    if (Math.abs(candidate.getTime() - now.getTime()) > MAX_CLOCK_DRIFT_MS) {
      this.logger.warn('Zeitstempel des Geraets ist unglaubwuerdig, nehme Empfangszeit');
      return now;
    }

    return candidate;
  }
}
