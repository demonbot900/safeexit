# 0003 – Binärformat für den Knopf, JSON für die Station

## Lage

Der Knopf hat 1.000 mAh und soll drei bis vier Monate durchhalten (Businessplan 3.1). Jedes
gesendete Byte kostet Funkzeit und damit Laufzeit. Die Station hängt am Netzteil und am WLAN.

## Entscheidung

Zwei Formate, je nach Gerät:

- **Knopf:** festes Binärformat, little-endian, 4 Byte Kopf, längster Rahmen 19 Byte.
  Beschreibung und Testvektoren in `packages/protocols`.
- **Station:** JSON. Lesbar im Log, erweiterbar ohne gleichzeitiges Update auf beiden Seiten.

Das Gerät identifiziert sich **nicht** im Rahmen, sondern über die Transportschicht. Das spart in
jedem Alarm 16 Byte.

## Warum

Ein selbstbeschreibendes Format (JSON, CBOR) am Knopf würde jeden Alarm aufblähen, ohne dass
jemand es je liest. Umgekehrt wäre ein Binärformat für die Station Sparsamkeit am falschen Ende:
dort kostet Bandbreite nichts, Lesbarkeit im Fehlerfall aber viel.

Drei Umsetzungen desselben Formats (TypeScript, C, Python für die Vektoren) laufen erfahrungsgemäß
auseinander. Deshalb sind die Testvektoren in `testvectors/button-frames.json` die verbindliche
Quelle, und beide Testreihen prüfen dagegen.

## Folgen

- Änderungen am Format gehen immer über die Vektoren, nie direkt in eine der Umsetzungen.
- Die C-Kopfdatei mit den Vektoren wird erzeugt (`npm run protocols:generate`) und eingecheckt;
  die CI prüft, dass sie zum JSON passt.
- Neue Felder gibt es nicht — nur neue Rahmentypen. So bleiben Geräte mit alter Firmware im Feld
  bedienbar.

## Offen

Der Transport. Heute HTTP mit `X-Device-Id` und Bearer-Token, damit sich die Kette ohne Hardware
testen lässt. Im Feld wird daraus CoAP über DTLS oder MQTT über TLS mit einem Zertifikat je
Gerät. Das Rahmenformat bleibt dabei gleich; es ändert sich nur, wer die Bytes transportiert.
