# 0005 – SQL von Hand statt ORM

## Lage

Das Backend braucht Zugriff auf PostgreSQL. Üblich wäre ein ORM (Prisma, TypeORM, Drizzle).

## Entscheidung

Abfragen von Hand mit `pg`, Schema als SQL-Dateien in `infrastructure/database/migrations`, ein
kurzes eigenes Migrationsskript. Der Zugriff liegt hinter Schnittstellen (`persistence/ports.ts`)
mit zwei Umsetzungen: Arbeitsspeicher und Postgres.

## Warum

Das Schema ist bei diesem Produkt kein technisches Detail, sondern das Datenschutzversprechen in
lesbarer Form. Wer wissen will, was gespeichert wird und wann es gelöscht wird, soll eine
SQL-Datei lesen können statt einer ORM-Beschreibung plus generierter Migrationen.

Dazu kommen zwei Stellen, an denen wir genau sehen wollen, was passiert:

- `alarms_one_active_per_device` — ein Teilindex, der verhindert, dass eine Funkwiederholung
  einen zweiten Alarm anlegt. Diese Regel gehört in die Datenbank, nicht nur in den Code.
- die Löschung der Standortdaten: eine Anweisung, nachweisbar.

Die Umsetzung im Arbeitsspeicher kostet zusätzlichen Code, zahlt sich aber doppelt aus: Die
Entwicklung läuft ohne Docker, und die Fachlogik ist ohne Datenbank testbar.

## Folgen

- Bei neuen Abfragen ist SQL zu schreiben, nicht zu generieren.
- Beide Umsetzungen müssen sich gleich verhalten. Die Umkreissuche benutzt deshalb in beiden
  Fällen dieselbe Entfernungsrechnung aus `shared-types`.
- Die Postgres-Umsetzung ist bisher nur übersetzt, nicht gegen eine laufende Datenbank getestet.
  Integrationstests stehen in `docs/roadmap.md`.

## Offen

Wenn der Shop dazukommt und die Zahl der Tabellen deutlich wächst, ist diese Entscheidung erneut
zu prüfen — dann allerdings nur für den API-Dienst, nicht für den Alarmpfad.
