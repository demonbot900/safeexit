# 0002 – Alarmdienst getrennt vom Rest

## Lage

Businessplan 10: „Die Zustellung eines Alarms darf nicht davon abhängen, dass Shop,
Kontoverwaltung oder Statistik fehlerfrei laufen."

## Entscheidung

Zwei Einstiegspunkte im selben Quellbaum, zwei Prozesse im Betrieb:

- `main.alarm.ts` — Uplink, Stationen, Hochstufung, Quittierung, Entwarnung
- `main.api.ts` — Warteliste, später Shop, Konten, Partnerverwaltung

Der Alarmdienst importiert kein Modul des API-Dienstes. Beide werden getrennt überwacht und
getrennt alarmiert.

## Warum

Ein Shop-Update, eine kaputte Statistikabfrage oder eine Lastspitze beim Verkauf dürfen die
Alarmkette nicht berühren. Getrennte Prozesse sind die einzige Trennung, die auch dann hält,
wenn jemand unter Zeitdruck etwas Unbedachtes einbaut.

Gemeinsamer Quellbaum statt zweier Repositorys, weil beide dieselben Typen, dieselbe Datenbank
und dieselben Bausteine benutzen — und weil zwei Repositorys bei dieser Teamgröße mehr Schaden
anrichten als der geteilte Prozessraum (siehe 0001).

## Folgen

- Ein Docker-Abbild, zwei Startbefehle.
- Die Datenbank wird geteilt. Der Alarmdienst liest Kontakte und Partner direkt, statt den
  API-Dienst zu fragen; auch das ist eine Abhängigkeit weniger im Alarmfall.
- `npm run dev:api` und `npm run dev:alarm` laufen in der Entwicklung getrennt.

## Offen

Ob die geteilte Datenbank auf Dauer bleibt. Sie ist heute die letzte gemeinsame Stelle. Getrennte
Datenbanken würden Daten verdoppeln und für ein Team dieser Größe mehr kosten, als sie bringen.
