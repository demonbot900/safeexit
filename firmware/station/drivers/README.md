# Treiber der Station

Umsetzung von `include/safeexit/station_hal.h` fuer die gewaehlte Plattform.

- `<plattform>/hal.c` – Uhr, Knopf, Summer, LED-Ring, Display, Erkennung des Pufferakkus
- `<plattform>/wifi.c` – WLAN-Einrichtung und Verbindung zum Backend
- `<plattform>/messages.c` – JSON-Nachrichten aus `packages/protocols/src/station-messages.ts`

Die Station ist technisch anspruchslos gegenueber dem Knopf (kein Mobilfunk, keine Ortung, kein
Energiesparen). Sie wird trotzdem erst entwickelt, wenn der Knopf die Zertifizierung bestanden
hat: Zwei Hardwareprodukte gleichzeitig sind laut Businessplan 15 das groesste Projektrisiko.
