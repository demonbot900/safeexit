/*
 * SafeExit Geraeteprotokoll, Version 1 - C-Fassung.
 *
 * Gegenstueck zu packages/protocols/src/button-frames.ts. Beide Fassungen werden
 * gegen dieselben Testvektoren geprueft (packages/protocols/testvectors).
 *
 * Bewusst ohne dynamischen Speicher und ohne Abhaengigkeit ausser stdint, damit der
 * Code unveraendert auf dem Knopf, auf der Station und auf dem Entwicklungsrechner
 * laeuft.
 */
#ifndef SAFEEXIT_PROTOCOL_H
#define SAFEEXIT_PROTOCOL_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

#define SE_PROTOCOL_VERSION 1
#define SE_FRAME_HEADER_SIZE 4
#define SE_MAX_FRAME_SIZE 32

/* Rahmentypen. 0x00 bis 0x7f sendet das Geraet, 0x80 bis 0xff das Backend. */
enum {
    SE_FRAME_ALARM_TRIGGER = 0x01,
    SE_FRAME_ALARM_ESCALATE = 0x02,
    SE_FRAME_LOCATION = 0x03,
    SE_FRAME_HEARTBEAT = 0x04,
    SE_FRAME_RECEIPT = 0x80,
    SE_FRAME_ACKNOWLEDGED = 0x81,
    SE_FRAME_CANCELLED = 0x82,
    SE_FRAME_REQUEST_LOCATION = 0x83
};

enum {
    SE_LOCATION_SOURCE_GNSS = 0,
    SE_LOCATION_SOURCE_CELL = 1,
    SE_LOCATION_SOURCE_PHONE = 2
};

typedef enum {
    SE_OK = 0,
    SE_ERR_BUFFER = -1,  /* Puffer zu klein */
    SE_ERR_VERSION = -2, /* fremde Protokollversion */
    SE_ERR_TYPE = -3,    /* unbekannter Rahmentyp */
    SE_ERR_LENGTH = -4,  /* Laenge passt nicht zum Typ */
    SE_ERR_VALUE = -5    /* Wert ausserhalb des gueltigen Bereichs */
} se_status_t;

typedef struct {
    uint8_t level;
    uint8_t battery_percent;
    uint32_t timestamp;
} se_alarm_trigger_t;

typedef struct {
    uint8_t level;
    uint32_t timestamp;
} se_alarm_escalate_t;

typedef struct {
    int32_t latitude_e7;
    int32_t longitude_e7;
    uint16_t accuracy_meters;
    uint8_t source;
    uint32_t timestamp;
} se_location_t;

typedef struct {
    uint8_t battery_percent;
    int8_t rssi_dbm;
    uint8_t firmware_major;
    uint8_t firmware_minor;
    uint32_t timestamp;
} se_heartbeat_t;

typedef struct {
    uint16_t acknowledged_sequence;
} se_receipt_t;

typedef struct {
    uint32_t timestamp;
} se_timestamped_t;

typedef struct {
    uint8_t type;
    uint16_t sequence;
    union {
        se_alarm_trigger_t alarm_trigger;
        se_alarm_escalate_t alarm_escalate;
        se_location_t location;
        se_heartbeat_t heartbeat;
        se_receipt_t receipt;
        se_timestamped_t acknowledged;
        se_timestamped_t cancelled;
    } payload;
} se_frame_t;

/**
 * Schreibt den Rahmen nach buffer.
 * Rueckgabe: Laenge in Byte, oder ein negativer se_status_t im Fehlerfall.
 */
int se_frame_encode(const se_frame_t *frame, uint8_t *buffer, size_t buffer_size);

/** Liest einen Rahmen. Rueckgabe SE_OK oder ein negativer se_status_t. */
se_status_t se_frame_decode(const uint8_t *data, size_t length, se_frame_t *frame);

/** 1, wenn der Typ vom Geraet zum Backend geht. */
int se_frame_is_uplink(uint8_t type);

/** Erwartete Rahmenlaenge fuer einen Typ, oder 0 bei unbekanntem Typ. */
size_t se_frame_length(uint8_t type);

#ifdef __cplusplus
}
#endif

#endif /* SAFEEXIT_PROTOCOL_H */
