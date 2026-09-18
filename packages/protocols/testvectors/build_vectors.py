"""Erzeugt button-frames.json aus der Spezifikation in packages/protocols/README.md.

Dieses Skript ist bewusst eine dritte, unabhaengige Umsetzung des Formats neben der
TypeScript- und der C-Fassung. Es wird nur gebraucht, wenn das Protokoll erweitert
wird: python testvectors/build_vectors.py > testvectors/button-frames.json
"""

import json
import struct

HEADER = "<BBH"


def frame(type_code: int, sequence: int, payload: bytes) -> str:
    return (struct.pack(HEADER, 1, type_code, sequence) + payload).hex()


def e7(degrees: float) -> int:
    return round(degrees * 1e7)


vectors = {
    "version": 1,
    "note": "Normative Testvektoren. TypeScript- und C-Fassung muessen beide passen.",
    "uplink": [
        {
            "name": "alarm_trigger_stufe_1",
            "frame": {
                "type": "alarm_trigger",
                "sequence": 1,
                "level": 1,
                "batteryPercent": 87,
                "timestamp": 1758000000,
            },
            "hex": frame(0x01, 1, struct.pack("<BBI", 1, 87, 1758000000)),
        },
        {
            "name": "alarm_trigger_stufe_3_akku_schwach",
            "frame": {
                "type": "alarm_trigger",
                "sequence": 2,
                "level": 3,
                "batteryPercent": 5,
                "timestamp": 1758000123,
            },
            "hex": frame(0x01, 2, struct.pack("<BBI", 3, 5, 1758000123)),
        },
        {
            "name": "alarm_escalate_auf_stufe_2",
            "frame": {
                "type": "alarm_escalate",
                "sequence": 3,
                "level": 2,
                "timestamp": 1758000090,
            },
            "hex": frame(0x02, 3, struct.pack("<BI", 2, 1758000090)),
        },
        {
            "name": "location_gnss_oldenburg",
            "frame": {
                "type": "location",
                "sequence": 4,
                "latitudeE7": e7(53.1435),
                "longitudeE7": e7(8.2146),
                "accuracyMeters": 12,
                "source": "gnss",
                "timestamp": 1758000010,
            },
            "hex": frame(
                0x03, 4, struct.pack("<iiHBI", e7(53.1435), e7(8.2146), 12, 0, 1758000010)
            ),
        },
        {
            "name": "location_zellortung_negative_koordinaten",
            "frame": {
                "type": "location",
                "sequence": 5,
                "latitudeE7": e7(-33.8688197),
                "longitudeE7": e7(151.2092955),
                "accuracyMeters": 1500,
                "source": "cell",
                "timestamp": 1758000020,
            },
            "hex": frame(
                0x03,
                5,
                struct.pack("<iiHBI", e7(-33.8688197), e7(151.2092955), 1500, 1, 1758000020),
            ),
        },
        {
            "name": "heartbeat",
            "frame": {
                "type": "heartbeat",
                "sequence": 6,
                "batteryPercent": 64,
                "rssiDbm": -97,
                "firmwareMajor": 1,
                "firmwareMinor": 4,
                "timestamp": 1758000030,
            },
            "hex": frame(0x04, 6, struct.pack("<BbBBI", 64, -97, 1, 4, 1758000030)),
        },
    ],
    "downlink": [
        {
            "name": "receipt_fuer_standortmeldung",
            "frame": {"type": "receipt", "sequence": 100, "acknowledgedSequence": 4},
            "hex": frame(0x80, 100, struct.pack("<H", 4)),
        },
        {
            "name": "quittierung_ich_komme",
            "frame": {"type": "acknowledged", "sequence": 101, "timestamp": 1758000045},
            "hex": frame(0x81, 101, struct.pack("<I", 1758000045)),
        },
        {
            "name": "entwarnung",
            "frame": {"type": "cancelled", "sequence": 102, "timestamp": 1758000300},
            "hex": frame(0x82, 102, struct.pack("<I", 1758000300)),
        },
        {
            "name": "standort_angefordert",
            "frame": {"type": "request_location", "sequence": 103},
            "hex": frame(0x83, 103, b""),
        },
    ],
}

print(json.dumps(vectors, indent=2, ensure_ascii=False))
