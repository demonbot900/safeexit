# Datenbank

Postgres. Das Schema liegt als SQL in `migrations/` und ist die verbindliche Quelle:
Wer wissen will, welche Daten SafeExit speichert, liest diese Dateien, nicht den Quelltext.

## Regeln

**Migrationen werden nie bearbeitet.** Eine angewendete Datei bleibt, wie sie ist. Aenderungen
kommen als neue Datei mit der naechsten Nummer. Das Migrationsskript prueft die Pruefsumme und
bricht ab, wenn eine schon angewendete Datei sich geaendert hat.

**Standortdaten liegen nur in `alarm_locations`.** Nirgendwo sonst, auch nicht als Kopie am
Alarm. Nur so laesst sich die Loeschung nach 24 Stunden mit einer Anweisung erledigen und
nachweisen (Businessplan 9).

**`alarm_events` enthaelt keine Koordinaten.** Die Tabelle traegt die Kennzahlen aus
Businessplan 16 (Reaktionszeit, Fehlalarmquote) und ueberlebt die Loeschfrist. Deshalb darf sie
nichts enthalten, was einen Bewegungsverlauf ergeben koennte.

## Anwenden

```bash
# gegen eine laufende Datenbank
DATABASE_URL=postgres://safeexit:safeexit@localhost:5432/safeexit npm run db:migrate

# Demo-Daten fuer Entwicklung und Vorfuehrung
DATABASE_URL=... npm run db:seed
```

Mit `docker compose -f infrastructure/docker/docker-compose.yml up` laeuft die Migration
automatisch, bevor die Dienste starten.
