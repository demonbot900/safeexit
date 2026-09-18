# Geräteprotokoll

Alles, was zwischen **Gerät und Backend** gesprochen wird. Verträge zwischen App/Webseite und
Backend stehen dagegen in `packages/api-contracts`.

Drei Umsetzungen desselben Formats, die nicht auseinanderlaufen dürfen:

| Umsetzung    | Ort                              | Geprüft durch               |
| ------------ | -------------------------------- | --------------------------- |
| TypeScript   | `src/button-frames.ts`           | `src/button-frames.spec.ts` |
| C (Firmware) | `c/src/protocol.c`               | `c/test/test_protocol.c`    |
| Testvektoren | `testvectors/button-frames.json` | beide Tests oben            |

Die Testvektoren sind die verbindliche Quelle. Wer das Protokoll ändert, ändert zuerst die
Vektoren (`testvectors/build_vectors.py` hilft dabei), erzeugt danach die C-Kopfdatei neu
(`npm run protocols:generate`) und lässt beide Testreihen laufen.

## Knopf: Binärformat

Jedes Byte kostet Funkzeit und damit Akkulaufzeit. Deshalb feste Felder statt JSON, alle
Mehrbyte-Werte **little-endian**.

**Kopf, 4 Byte, in jedem Rahmen**

| Offset | Größe | Feld                                   |
| ------ | ----- | -------------------------------------- |
| 0      | 1     | Protokollversion, aktuell `1`          |
| 1      | 1     | Rahmentyp                              |
| 2      | 2     | Laufende Nummer (`uint16`, läuft über) |

Typen `0x00`–`0x7f` sendet das Gerät, `0x80`–`0xff` das Backend.

**Uplink (Gerät → Backend)**

| Typ    | Name             | Länge | Nutzdaten                                                                                   |
| ------ | ---------------- | ----- | ------------------------------------------------------------------------------------------- |
| `0x01` | `alarm_trigger`  | 10    | `u8` Stufe, `u8` Akku in %, `u32` Zeitstempel                                               |
| `0x02` | `alarm_escalate` | 9     | `u8` neue Stufe, `u32` Zeitstempel                                                          |
| `0x03` | `location`       | 19    | `i32` Breite ×1e7, `i32` Länge ×1e7, `u16` Genauigkeit in m, `u8` Quelle, `u32` Zeitstempel |
| `0x04` | `heartbeat`      | 12    | `u8` Akku, `i8` RSSI in dBm, `u8` Firmware-Haupt, `u8` Firmware-Neben, `u32` Zeitstempel    |

Quelle: `0` = GNSS, `1` = Zellortung, `2` = Position eines gekoppelten Telefons.

**Downlink (Backend → Gerät)**

| Typ    | Name               | Länge | Nutzdaten                         |
| ------ | ------------------ | ----- | --------------------------------- |
| `0x80` | `receipt`          | 6     | `u16` bestätigte laufende Nummer  |
| `0x81` | `acknowledged`     | 8     | `u32` Zeitstempel der Quittierung |
| `0x82` | `cancelled`        | 8     | `u32` Zeitstempel der Entwarnung  |
| `0x83` | `request_location` | 4     | –                                 |

## Regeln, die im Format nicht sichtbar sind

**Der Alarm geht vor der Position raus.** `alarm_trigger` enthält bewusst keine Koordinaten.
Ein GNSS-Fix nach dem Aufwachen dauert Sekunden bis Minuten; so lange darf niemand warten.
Die Position kommt als eigener `location`-Rahmen nach, sobald sie vorliegt.

**Wiederholen, bis quittiert.** Ein Uplink gilt erst als zugestellt, wenn das Backend ein
`receipt` mit derselben laufenden Nummer schickt. Ohne Empfangsbestätigung wiederholt das
Gerät mit wachsendem Abstand (1 s, 2 s, 4 s, …, gedeckelt). Alarmrahmen werden dabei nie
verworfen, Heartbeats schon.

**Doppelte Rahmen sind normal.** Das Backend muss sie an der laufenden Nummer erkennen und
verwerfen (idempotent verarbeiten), sonst erzeugt eine verlorene Bestätigung einen zweiten
Alarm.

**Wer identifiziert das Gerät?** Nicht der Rahmen, sondern die Transportschicht. Das spart in
jedem Alarm 16 Byte. In der jetzigen Ausbaustufe ist das der HTTP-Kopf
`X-Device-Id` plus `Authorization: Bearer <Gerätegeheimnis>`; im Feldeinsatz ein Zertifikat
je Gerät (DTLS/CoAP oder MQTT über TLS, siehe `docs/entscheidungen/0003-geraeteprotokoll.md`).

**Zeitstempel** sind Unix-Sekunden aus der Netzzeit. Hat das Gerät keine Zeit, sendet es `0`;
dann gilt der Empfangszeitpunkt des Backends.

**Keine Audiodaten, keine Dauerortung.** Das Protokoll kennt keinen Rahmen dafür, und das
bleibt so (Businessplan 9, § 201 StGB).

## Station: JSON-Nachrichten

Die Station hängt am WLAN und am Netzteil. Bandbreite und Strom sind kein Engpass, deshalb
JSON: lesbar im Log, erweiterbar ohne Firmware-Update auf beiden Seiten. Schemata in
`src/station-messages.ts`.

**Backend → Station**

- `alarm` – neuer Alarm: Stufe, Name, Entfernung in Metern (oder `null`, solange kein
  Standort vorliegt), Auslösezeit.
- `alarm_update` – Stufe erhöht, jemand hat quittiert, oder entwarnt.

**Station → Backend**

- `acknowledge` – jemand hat „Ich komme" gedrückt.
- `heartbeat` – Lebenszeichen mit Firmware-Version, Laufzeit und ob sie gerade auf dem
  Pufferakku läuft. Bleibt es länger als 24 Stunden aus, meldet das Backend den Ausfall.

## Version erhöhen

Version `1` steht im ersten Byte jedes Rahmens. Rückwärtskompatible Ergänzungen bekommen
einen **neuen Rahmentyp**, nie ein neues Feld in einem bestehenden Typ. Erst wenn ein
bestehender Typ seine Bedeutung ändert, steigt die Version – und dann muss das Backend
beide Versionen beherrschen, solange noch Geräte mit alter Firmware im Feld sind.
