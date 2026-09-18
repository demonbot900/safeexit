# Was als Nächstes dran ist

Diese Basis deckt die Alarmkette ab — von der Geste am Knopf bis zur Entwarnung — und das
Formular für den Nachfragetest. Alles andere ist bewusst noch nicht gebaut. Die Liste folgt dem
Fahrplan aus Businessplan 14.

## Sofort, ohne Hardware (Fahrplan Monat 1–2)

Der Nachfragetest ist der erste Meilenstein und hängt an nichts, was noch fehlt.

- [ ] Landingpage veröffentlichen: Domain, Hosting in Deutschland, Impressum,
      Datenschutzerklärung
- [ ] Postgres aufsetzen und `npm run db:migrate` laufen lassen (die Warteliste im
      Arbeitsspeicher überlebt keinen Neustart)
- [ ] Bestätigungsmail an Vormerkungen (heute passiert nach dem Eintrag nichts)
- [ ] Auswertung: Vormerkungen je Segment und Postleitzahl — entscheidet über Pilotstadt und
      Reihenfolge des Markteintritts
- [ ] 500 EUR Anzeigen schalten, Ziel über 300 Vormerkungen

## Backend, vor dem ersten echten Nutzer

- [ ] **Push-Nachrichten.** Firebase für Android, APNs für iOS. Die Berechtigung für kritische
      Mitteilungen bei Apple **früh beantragen** — ohne sie geht ein nächtlicher Alarm auf einem
      stummgeschalteten iPhone unter, und die Bearbeitung dauert (Businessplan 10).
- [ ] **SMS-Versand** mit zweitem Anbieter als Rückfall.
      Beides sind neue `NotificationChannel`-Umsetzungen, sonst ändert sich nichts.
- [ ] **Anmeldung für App-Nutzer.** Heute sind Quittierung und Alarmabfrage nur durch die nicht
      erratbare Kennung geschützt, die Entwarnung zusätzlich durch die PIN.
- [ ] **Integrationstests gegen echtes Postgres.** Die SQL-Umsetzung ist übersetzt, aber nicht
      gegen eine laufende Datenbank geprüft (siehe `entscheidungen/0005`).
- [ ] Begrenzung der Anfragen je Gerät, damit ein defektes Gerät den Dienst nicht überlastet
- [ ] Überwachung mit Alarmierung auf ein Telefon, getrennt für den Alarmdienst
- [ ] Kennzahlen aus `alarm_events` auswerten: Reaktionszeit, Fehlalarmquote (Businessplan 16)

## Gerät (Fahrplan Monat 2–4)

- [ ] Entwicklungsboards beschaffen und messen, dann `entscheidungen/0004` abschließen
- [ ] Treiber für die gewählte Plattform in `firmware/button/drivers`
- [ ] Sendeschleife mit Wiederholung bis zur Bestätigung, gegen den echten Alarmdienst
- [ ] Energiemessung ab Tag 1 — die Zusage von 3–4 Monaten ist ein Produktversprechen
- [ ] Feldtest mit 20 Geräten über vier Wochen, Ziel Tragequote über 70 %

## Station (erst nach der Zertifizierung des Knopfs)

Zwei Hardwareprodukte parallel sind laut Businessplan 15 das größte Projektrisiko. Die Fachlogik
der Station steht und ist getestet; Treiber und Gehäuse kommen später.

## App

- [ ] Push statt Nachfragen im Fünf-Sekunden-Takt
- [ ] Einrichtung: Gerät koppeln, Kontakte anlegen, PIN setzen
- [ ] Karte der Safe Points
- [ ] Partner-Ansicht für Betriebe ohne Station

## Webseite

- [ ] Shop und Bestellung
- [ ] Seite für Partnerbetriebe mit Anmeldung als Safe Point
- [ ] Jährlicher Transparenzbericht (Businessplan 8, Punkt 7)

## Was ausdrücklich nicht gebaut wird

Diese drei Punkte sind keine Lücken, sondern Entscheidungen aus dem Businessplan:

- **Kein automatischer Notruf an die Leitstelle.** Fehlalarme würden dort Kapazitäten binden und
  das Verhältnis zu Polizei und Rettungsdiensten dauerhaft beschädigen.
- **Keine dauerhafte Bewegungshistorie.** Sie wäre ein Kontrollinstrument gegen genau die
  Menschen, die geschützt werden sollen.
- **Keine Tonaufnahme im Alarmfall.** Verstößt gegen § 201 StGB.

Wer eine dieser Funktionen einbaut, ändert das Produkt, nicht nur den Code.
