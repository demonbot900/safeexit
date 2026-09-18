# Entwicklung

## Einmalig

```bash
npm install
cp .env.example .env
```

Gebraucht werden Node 22 und npm 10. Für die Firmware zusätzlich CMake und ein C-Compiler, für
die App das Flutter-SDK. Eine Datenbank wird für die tägliche Arbeit **nicht** gebraucht.

## Die ganze Kette in fünf Minuten sehen

Drei Terminals:

```bash
# 1 – Alarmdienst (STORAGE=memory, Demo-Daten sind schon drin)
npm run dev:alarm

# 2 – Station des Partnerbetriebs zuhören
curl -N -H "Authorization: Bearer demo-partner-geheimnis" \
  http://localhost:3001/v1/stations/33333333-3333-4333-8333-333333333333/events

# 3 – Knopf drücken
npm run simulate:button -- --level 2
```

Was passiert: Der Simulator sendet denselben Funkrahmen wie das echte Gerät. Der Alarmdienst
legt einen Alarm an, benachrichtigt Mama und Papa (im Log), nimmt drei Sekunden später die
Position entgegen und alarmiert damit den Kiosk am Markt — 120 m entfernt. Die Apotheke in
700 m Entfernung bleibt still, der Betrieb mit bloßer Absichtserklärung ebenfalls.

Der Simulator druckt die Befehle zum Quittieren und Entwarnen. Nach dem Quittieren meldet er
beim nächsten Lebenszeichen:

```
>> Jemand kommt. Knopf vibriert zweimal, LED wird grün.
```

## Landingpage

```bash
npm run dev:api     # Backend für die Warteliste, Port 3000
npm run dev:web     # Seite auf http://localhost:3002
```

Das Formular geht an die Next.js-Route `/api/waitlist` und von dort serverseitig an das Backend.
Die Seite kennt die Backend-Adresse nicht.

## Mit echter Datenbank

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

Oder gegen eine eigene Postgres-Instanz:

```bash
STORAGE=postgres DATABASE_URL=postgres://... npm run db:migrate
STORAGE=postgres DATABASE_URL=postgres://... npm run db:seed
STORAGE=postgres DATABASE_URL=postgres://... npm run dev:alarm
```

## Prüfen

```bash
npm test                  # TypeScript: Pakete, Backend, End-to-End
npm run lint
npm run format:check
npm run firmware:configure && npm run firmware:test    # C
cd apps/mobile && flutter analyze && flutter test      # App
```

Dasselbe macht die CI bei jedem Push (`.github/workflows/ci.yml`).

## Wenn du am Protokoll etwas änderst

Die Reihenfolge ist wichtig, sonst laufen die drei Umsetzungen auseinander:

1. `packages/protocols/README.md` — die Beschreibung
2. `packages/protocols/testvectors/button-frames.json` — die verbindlichen Beispiele
3. `packages/protocols/src/button-frames.ts` und `packages/protocols/c/src/protocol.c`
4. `npm run protocols:generate` und die erzeugte Datei mit einchecken
5. beide Testreihen laufen lassen

Die CI prüft, dass die erzeugte C-Datei zum JSON passt.

## Eine Falle, die zwei Stunden kosten kann

Die Dienste starten mit `node --import @swc-node/register/esm-register`, **nicht** mit `tsx`.
Grund: NestJS liest die Typen der Konstruktor-Parameter zur Laufzeit aus den
Decorator-Metadaten. esbuild (und damit `tsx`) erzeugt diese Metadaten nicht, SWC schon. Mit
`tsx` startet der Dienst mit der Meldung „Nest can't resolve dependencies", obwohl der Code
richtig ist. Aus demselben Grund läuft Vitest über `unplugin-swc` und ist
`@typescript-eslint/consistent-type-imports` abgeschaltet: Ein `import type` auf eine Klasse,
die Nest einsetzt, löscht genau diese Angabe.

## Wo was hingehört

| Du änderst …                                       | … dann hier                                        |
| -------------------------------------------------- | -------------------------------------------------- |
| eine Zahl aus dem Businessplan (90 s, 300 m, 24 h) | `packages/shared-types/src/constants.ts`           |
| was ein Alarm bedeutet                             | `apps/backend/src/alarm/alarm.service.ts`          |
| welche Daten gespeichert werden                    | `infrastructure/database/migrations/` (neue Datei) |
| was das Gerät funkt                                | `packages/protocols/`                              |
| was der Knopf bei einem Druck tut                  | `firmware/button/src/button_alarm.c`               |

## Umgangston im Code

Deutsch in Dokumentation, Kommentaren und allem, was Nutzer sehen. Englisch in Bezeichnern, weil
die Sprachen es so vorsehen. Kommentare erklären **warum**, nicht was — das steht schon im Code.
