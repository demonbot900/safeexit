import { Injectable, Logger } from '@nestjs/common';
import { Subject, type Observable } from 'rxjs';
import type { StationDownstreamMessage } from '@safeexit/protocols';

/**
 * Verteilt Nachrichten an die Stationen.
 *
 * Jetzige Ausbaustufe: Server-Sent Events ueber HTTP, weil das mit jedem einfachen
 * HTTP-Client im Geraet funktioniert und sich mit curl beobachten laesst. Der
 * Wechsel auf MQTT aendert nur diese Klasse, nicht die Fachlogik.
 */
@Injectable()
export class StationGateway {
  private readonly logger = new Logger(StationGateway.name);
  private readonly streams = new Map<string, Subject<StationDownstreamMessage>>();

  connect(stationDeviceId: string): Observable<StationDownstreamMessage> {
    return this.streamFor(stationDeviceId).asObservable();
  }

  publish(stationDeviceId: string, message: StationDownstreamMessage): void {
    const stream = this.streams.get(stationDeviceId);
    if (!stream || stream.observed === false) {
      // Kein Gerät verbunden. Das ist keine Ausnahme, sondern der Normalfall in
      // der Entwicklung und der Grund fuer die Offline-Ueberwachung im Betrieb.
      this.logger.warn(`Station ${stationDeviceId} ist nicht verbunden`);
      return;
    }

    stream.next(message);
  }

  private streamFor(stationDeviceId: string): Subject<StationDownstreamMessage> {
    const existing = this.streams.get(stationDeviceId);
    if (existing) {
      return existing;
    }

    const created = new Subject<StationDownstreamMessage>();
    this.streams.set(stationDeviceId, created);
    return created;
  }
}
