# Treiber des Knopfs

Hier kommt die Anbindung an die Zielplattform hinein, also die Umsetzung von
`include/safeexit/button_hal.h`. Der Rest der Firmware kennt nur diese Kopfdatei und bleibt
dadurch auf dem Entwicklungsrechner testbar.

Erwartete Unterverzeichnisse, sobald die Plattform feststeht:

- `<plattform>/hal.c` – Uhr, Taster, Vibration, LED, Akku
- `<plattform>/radio.c` – Senden und Empfangen, Wiederholung bis zur Bestaetigung
- `<plattform>/gnss.c` – Ortung mit A-GPS, Zellortung als Rueckfall

Die Plattform ist noch nicht entschieden. Stand und Empfehlung:
`docs/entscheidungen/0004-hardware-plattform.md`.
