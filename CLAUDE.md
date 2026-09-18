# Hinweise für Claude Code

## Was das Projekt ist

SafeExit: ein Notfallknopf mit eigener Mobilfunkverbindung, eine Empfangsstation und ein
Netzwerk aus Partnerbetrieben. Der Businessplan liegt in `docs/businessplan/` und ist die
fachliche Quelle. Wenn eine Zahl oder eine Regel dort steht, gilt sie hier.

## Sprache

Deutsch in Dokumentation, Kommentaren, Log-Ausgaben und allem, was Nutzer sehen. Englisch in
Bezeichnern. Kommentare erklären **warum**, nicht was.

## Reihenfolge bei Änderungen

**Zahlen aus dem Businessplan** (90 Sekunden, 300 Meter, 24 Stunden, Alarmstufen) stehen genau
einmal, in `packages/shared-types/src/constants.ts`. Nicht im Code verstreuen.

**Am Protokoll** wird in dieser Reihenfolge gearbeitet: `packages/protocols/README.md`, dann
`testvectors/button-frames.json`, dann beide Umsetzungen (TypeScript und C), dann
`npm run protocols:generate`, dann beide Testreihen. Die CI prüft, dass alles zusammenpasst.

**Am Datenbankschema:** neue Datei in `infrastructure/database/migrations/`. Angewendete
Migrationen werden nie bearbeitet, das Migrationsskript bricht sonst ab.

## Drei Regeln, die nicht verhandelbar sind

1. **Der Alarmpfad hängt an nichts anderem.** `apps/backend/src/alarm/` und `main.alarm.ts`
   importieren nichts aus Shop, Konten oder Statistik.
2. **Standortdaten gibt es nur während eines Alarms**, nur in `alarm_locations`, gelöscht nach
   24 Stunden. Keine zweite Kopie, auch nicht in Protokollen oder Ereignissen.
3. **Kein automatischer Notruf, keine Tonaufnahme, keine Bewegungshistorie.** Begründung in
   `docs/roadmap.md`, Abschnitt „Was ausdrücklich nicht gebaut wird".

## Prüfen

```bash
npm test                                             # Pakete, Backend, End-to-End
npm run lint && npm run format:check
npm run firmware:configure && npm run firmware:test
cd apps/mobile && flutter analyze && flutter test
```

Die Entwicklung läuft mit `STORAGE=memory` ohne Datenbank; Demo-Daten stehen in
`apps/backend/src/persistence/demo-data.ts`.

## Bei größeren Entscheidungen

Wenn eine Entscheidung schwer rückgängig zu machen ist (Plattform, Transport, Speicher,
Zuschnitt der Dienste), gehört eine kurze Notiz nach `docs/entscheidungen/` — Lage,
Entscheidung, Warum, Folgen, Offen. Bestehende Notizen werden nicht umgeschrieben, sondern
ergänzt.
