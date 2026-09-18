# Datenschutz im Code

Der Businessplan verkauft Datenschutz als Produktmerkmal — im Segment Kinder ist er ein eigenes
Verkaufsargument gegenüber Ortungsuhren. Ein Versprechen auf der Startseite, das der Code nicht
einhält, ist eine Lüge mit Absatzabsicht. Diese Seite hält fest, wo jedes Versprechen technisch
verankert ist.

## Standort nur während eines Alarms

Kommt eine Standortmeldung, ohne dass für das Gerät ein Alarm läuft, wird sie **verworfen** und
nicht gespeichert — `AlarmService.recordLocation`, geprüft in `alarm.service.spec.ts`
(„verwirft Standortdaten ohne laufenden Alarm").

Es gibt keinen Endpunkt und keinen Funkrahmen, mit dem sich eine Position außerhalb eines Alarms
abfragen ließe. Das Protokoll kennt so etwas nicht (`packages/protocols/README.md`).

## Löschung nach 24 Stunden

Standortdaten stehen ausschließlich in der Tabelle `alarm_locations`, nirgends als Kopie. Der
Löschlauf in `escalation.scheduler.ts` ruft viertelstündlich `purgeExpiredLocations` auf; die
Frist steht in `LOCATION_RETENTION_HOURS`. Geprüft in `alarm.service.spec.ts` („löscht
Standortdaten nach Ablauf der Frist").

## Keine Bewegungshistorie

`alarm_events` — die Tabelle, die die Löschfrist überlebt, weil daraus Reaktionszeit und
Fehlalarmquote entstehen — enthält **keine Koordinaten**. Nur Art des Ereignisses, Zeitpunkt und
Zahlen wie Genauigkeit oder Anzahl erreichter Partner.

Das ist der technische Gegenwert zu der Aussage im Businessplan, dass eine dauerhafte
Bewegungshistorie ein Kontrollinstrument wäre und gegen genau die Menschen verwendet würde, die
das Produkt schützen soll.

## Keine Tonaufnahme

Das Protokoll hat keinen Rahmen dafür, die Hardware-Schnittstelle kein Mikrofon. Eine
Audioaufnahme im Alarmfall verstößt gegen § 201 StGB.

## Geheimnisse nur als Hash

Gerätegeheimnisse und Entwarnungs-PINs stehen als scrypt-Hash in der Datenbank
(`common/secrets.ts`, Vergleich mit `timingSafeEqual`). Wer die Datenbank liest, kann keinen
Alarm auslösen und keinen fremden Alarm beenden.

## Sparsam beim Nachfragetest

Das Formular auf der Landingpage speichert E-Mail, Segment und freiwillig die Postleitzahl.
Keine IP-Adresse, kein Zeitpunkt des Besuchs, keine Zählpixel. Ohne gesetzte Einwilligung weist
das Schema die Anmeldung ab (`waitlistSignupSchema`, `consent: z.literal(true)`).

## Server in Deutschland

Betrifft auch Sicherungen, Protokolle und Fehlerberichte. Beim Auswählen von Diensten
(Push, SMS, Fehlerüberwachung, Hosting) ist das ein Ausschlusskriterium, keine Vorliebe —
`infrastructure/deployment/README.md`.

## Was noch aussteht

- Datenschutz-Folgenabschätzung (im Businessplan mit 3.000 EUR im Jahr eingeplant)
- Verzeichnis von Verarbeitungstätigkeiten
- Auftragsverarbeitungsverträge mit jedem Dienstleister
- Löschkonzept für Konten, nicht nur für Standortdaten
- Auskunftsersuchen: heute nur von Hand über SQL möglich
