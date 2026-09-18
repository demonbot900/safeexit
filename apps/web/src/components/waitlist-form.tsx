'use client';

import { useState } from 'react';
import type { WaitlistSegment } from '@safeexit/api-contracts';

const SEGMENTE: { value: WaitlistSegment; label: string }[] = [
  { value: 'kind', label: 'Fuer mein Kind' },
  { value: 'senioren', label: 'Fuer meine Eltern oder Grosseltern' },
  { value: 'beruf', label: 'Fuer die Arbeit (Pflege, Aussendienst, Handwerk)' },
  { value: 'heimweg', label: 'Fuer mich selbst, unterwegs' },
];

type Status =
  { kind: 'bereit' } | { kind: 'sendet' } | { kind: 'ok' } | { kind: 'fehler'; text: string };

/**
 * Das Formular des Nachfragetests (Fahrplan Monat 1 bis 2).
 *
 * Gefragt wird nur, was die Entscheidung beeinflusst: Adresse fuer die Nachricht,
 * Segment fuer die Reihenfolge des Markteintritts, Postleitzahl fuer die Wahl der
 * Pilotstadt. Sonst nichts.
 */
export function WaitlistForm() {
  const [status, setStatus] = useState<Status>({ kind: 'bereit' });

  async function submit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus({ kind: 'sendet' });

    const postalCode = String(form.get('postalCode') ?? '').trim();

    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: String(form.get('email') ?? ''),
        segment: form.get('segment'),
        ...(postalCode ? { postalCode } : {}),
        consent: form.get('consent') === 'on',
      }),
    }).catch(() => null);

    if (!response || !response.ok) {
      const message = response
        ? ((await response.json().catch(() => null))?.message ??
          'Das hat nicht geklappt. Bitte pruefe deine Eingaben.')
        : 'Keine Verbindung. Bitte spaeter noch einmal.';
      setStatus({ kind: 'fehler', text: message });
      return;
    }

    setStatus({ kind: 'ok' });
  }

  if (status.kind === 'ok') {
    return (
      <div className="formular">
        <h3>Vorgemerkt.</h3>
        <p>
          Wir melden uns, sobald die ersten Geraete fertig sind. Bis dahin bekommst du hoechstens
          eine Nachricht im Monat, und abmelden geht mit einem Klick.
        </p>
      </div>
    );
  }

  return (
    <form className="formular" onSubmit={submit}>
      <h3>Vormerken</h3>
      <p className="preis-hinweis">
        Unverbindlich. Wir melden uns, wenn es losgeht, und fragen dann nach dem Preis von 149 Euro.
      </p>

      <label className="feld">
        <span>E-Mail</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="du@beispiel.de"
        />
      </label>

      <label className="feld">
        <span>Fuer wen?</span>
        <select name="segment" required defaultValue="kind">
          {SEGMENTE.map((segment) => (
            <option key={segment.value} value={segment.value}>
              {segment.label}
            </option>
          ))}
        </select>
      </label>

      <label className="feld">
        <span>Postleitzahl (freiwillig)</span>
        <input
          type="text"
          name="postalCode"
          inputMode="numeric"
          pattern="\d{5}"
          placeholder="26122"
        />
      </label>

      <label className="einwilligung">
        <input type="checkbox" name="consent" required />
        <span>
          Ich moechte benachrichtigt werden, wenn SafeExit verfuegbar ist. Meine Adresse wird nur
          dafuer benutzt und nicht weitergegeben.
        </span>
      </label>

      <button type="submit" disabled={status.kind === 'sendet'}>
        {status.kind === 'sendet' ? 'Einen Moment ...' : 'Vormerken'}
      </button>

      {status.kind === 'fehler' && <p className="rueckmeldung fehler">{status.text}</p>}
    </form>
  );
}
