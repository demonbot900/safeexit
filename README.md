# SafeExit

Mobiler Notfallknopf, Empfangsstation und lokales Hilfenetzwerk.

Ein Druck alarmiert hinterlegte Kontakte und Partnerbetriebe in der Umgebung und überträgt den
Standort — **ohne Smartphone** und **ohne monatliche Kosten**. Wer „Ich komme" drückt, schickt
eine Rückmeldung an den Knopf: zweimal vibrieren, LED grün.

Der Businessplan liegt unter [`docs/businessplan/`](docs/businessplan/).

## Was hier schon läuft

| Teil                  | Stand                                                                                                                  |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Alarmkette im Backend | Auslösen, Hochstufen nach 90 s, Partner im 300-m-Umkreis, Quittieren, Entwarnung mit PIN — 20 Tests, davon 8 über HTTP |
| Geräteprotokoll       | Binärformat für den Knopf in TypeScript **und** C, gegen gemeinsame Testvektoren geprüft                               |
| Firmware-Logik        | Gestenerkennung und Zustandsautomaten für Knopf und Station, 4 Testreihen auf dem Entwicklungsrechner                  |
| Landingpage           | Startseite mit Formular für den Nachfragetest                                                                          |
| App                   | Gerüst mit Alarmansicht, „Ich komme" und Entwarnung                                                                    |
| Datenbank             | Schema als SQL, Migrationswerkzeug, Demo-Daten                                                                         |

Was noch fehlt, steht vollständig in [`docs/roadmap.md`](docs/roadmap.md) — darunter Push, SMS
und die Entscheidung über die Funkmodule.

## In fünf Minuten selbst sehen

```bash
npm install
npm run dev:alarm
```

In einem zweiten Terminal:

```bash
npm run simulate:button -- --level 2
```

Der Simulator sendet dieselben Funkrahmen wie das echte Gerät. Im Log des Alarmdienstes stehen
Mama, Papa und der Kiosk am Markt (120 m entfernt); die Apotheke in 700 m bleibt still. Der
Simulator druckt die Befehle zum Quittieren und Entwarnen und meldet beim nächsten Lebenszeichen:

```
>> Jemand kommt. Knopf vibriert zweimal, LED wird grün.
```

Ausführlicher, samt Station zum Zuhören: [`docs/entwicklung.md`](docs/entwicklung.md).

## Aufbau

```
apps/
  backend/      Alarmdienst und API-Dienst (NestJS), getrennt betrieben
  web/          Landingpage und Nachfragetest (Next.js)
  mobile/       App für Vertrauenskontakte (Flutter)
packages/
  shared-types/ Fachbegriffe und die Zahlen aus dem Businessplan
  protocols/    Gerät ↔ Backend: Binärformat (TS + C) und JSON für die Station
  api-contracts/App/Web ↔ Backend
firmware/
  button/       Knopf: Gesten, Zustandsautomat, HAL
  station/      Station: Klingeln, Quittieren, Stummschalten
infrastructure/
  database/     Schema als SQL — die verbindliche Antwort darauf, was gespeichert wird
  docker/       Postgres und beide Dienste
  deployment/   was vor dem Marktstart stehen muss
docs/           Architektur, Datenschutz, Entscheidungen, Fahrplan
```

## Prüfen

```bash
npm test                                             # Pakete, Backend, End-to-End
npm run lint && npm run format:check
npm run firmware:configure && npm run firmware:test  # C-Tests
cd apps/mobile && flutter test                       # App
```

Dieselben Schritte laufen in der CI bei jedem Push.

## Drei Dinge, die den Code prägen

**Der Alarmpfad hängt an nichts anderem.** Shop, Konten und Statistik laufen als eigener Dienst.
Ein Fehler dort darf keinen Alarm aufhalten
([Entscheidung 0002](docs/entscheidungen/0002-alarmpfad-getrennt.md)).

**Datenschutz ist im Code verankert, nicht nur auf der Startseite.** Standortdaten gibt es nur
während eines Alarms, sie stehen in genau einer Tabelle und werden nach 24 Stunden gelöscht.
Jede Zusage mit ihrer Stelle im Code: [`docs/datenschutz.md`](docs/datenschutz.md).

**SafeExit ist kein Ersatz für 110 oder 112.** Keine Leitstelle, keine Zusage einer Hilfeleistung.
Das gilt in den AGB, in der App, auf der Webseite — und deshalb löst das System auch von sich aus
keinen Notruf aus.
