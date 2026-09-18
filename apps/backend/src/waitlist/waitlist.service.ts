import { Inject, Injectable, Logger } from '@nestjs/common';
import type { WaitlistSignup, WaitlistSignupResponse } from '@safeexit/api-contracts';
import { WAITLIST_STORE, type WaitlistStore } from '../persistence/ports.js';

/**
 * Vormerkungen aus dem Nachfragetest (Fahrplan Monat 1 bis 2, Ziel ueber 300).
 *
 * Gespeichert wird nur, was fuer den Test gebraucht wird: Adresse, Segment und
 * freiwillig die Postleitzahl. Keine IP-Adresse, kein Zeitstempel des Besuchs.
 */
@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(@Inject(WAITLIST_STORE) private readonly store: WaitlistStore) {}

  async signUp(signup: WaitlistSignup): Promise<WaitlistSignupResponse> {
    const added = await this.store.add(signup);
    const total = await this.store.count();

    if (added) {
      this.logger.log(`Neue Vormerkung im Segment ${signup.segment}, jetzt ${total}`);
    }

    return { total };
  }
}
