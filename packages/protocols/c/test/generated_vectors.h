/*
 * Erzeugte Datei. Nicht von Hand aendern.
 * Quelle: packages/protocols/testvectors/button-frames.json
 * Erzeugen mit: npm run protocols:generate
 */
#ifndef SAFEEXIT_GENERATED_VECTORS_H
#define SAFEEXIT_GENERATED_VECTORS_H

#include "safeexit/protocol.h"

typedef struct {
    const char *name;
    const uint8_t *bytes;
    size_t length;
    se_frame_t frame;
} se_test_vector_t;

static const uint8_t se_vector_bytes_0[] = { 0x01, 0x01, 0x01, 0x00, 0x01, 0x57, 0x80, 0xf3, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_1[] = { 0x01, 0x01, 0x02, 0x00, 0x03, 0x05, 0xfb, 0xf3, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_2[] = { 0x01, 0x02, 0x03, 0x00, 0x02, 0xda, 0xf3, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_3[] = { 0x01, 0x03, 0x04, 0x00, 0xf8, 0x0d, 0xad, 0x1f, 0xd0, 0x72, 0xe5, 0x04, 0x0c, 0x00, 0x00, 0x8a, 0xf3, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_4[] = { 0x01, 0x03, 0x05, 0x00, 0x3b, 0x07, 0xd0, 0xeb, 0x1b, 0xb5, 0x20, 0x5a, 0xdc, 0x05, 0x01, 0x94, 0xf3, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_5[] = { 0x01, 0x04, 0x06, 0x00, 0x40, 0x9f, 0x01, 0x04, 0x9e, 0xf3, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_6[] = { 0x01, 0x80, 0x64, 0x00, 0x04, 0x00 };
static const uint8_t se_vector_bytes_7[] = { 0x01, 0x81, 0x65, 0x00, 0xad, 0xf3, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_8[] = { 0x01, 0x82, 0x66, 0x00, 0xac, 0xf4, 0xc8, 0x68 };
static const uint8_t se_vector_bytes_9[] = { 0x01, 0x83, 0x67, 0x00 };

static const se_test_vector_t se_test_vectors[] = {
    { "alarm_trigger_stufe_1", se_vector_bytes_0, sizeof se_vector_bytes_0,
      { SE_FRAME_ALARM_TRIGGER, 1, { .alarm_trigger = { 1, 87, 1758000000u } } } },
    { "alarm_trigger_stufe_3_akku_schwach", se_vector_bytes_1, sizeof se_vector_bytes_1,
      { SE_FRAME_ALARM_TRIGGER, 2, { .alarm_trigger = { 3, 5, 1758000123u } } } },
    { "alarm_escalate_auf_stufe_2", se_vector_bytes_2, sizeof se_vector_bytes_2,
      { SE_FRAME_ALARM_ESCALATE, 3, { .alarm_escalate = { 2, 1758000090u } } } },
    { "location_gnss_oldenburg", se_vector_bytes_3, sizeof se_vector_bytes_3,
      { SE_FRAME_LOCATION, 4, { .location = { 531435000, 82146000, 12, SE_LOCATION_SOURCE_GNSS, 1758000010u } } } },
    { "location_zellortung_negative_koordinaten", se_vector_bytes_4, sizeof se_vector_bytes_4,
      { SE_FRAME_LOCATION, 5, { .location = { -338688197, 1512092955, 1500, SE_LOCATION_SOURCE_CELL, 1758000020u } } } },
    { "heartbeat", se_vector_bytes_5, sizeof se_vector_bytes_5,
      { SE_FRAME_HEARTBEAT, 6, { .heartbeat = { 64, -97, 1, 4, 1758000030u } } } },
    { "receipt_fuer_standortmeldung", se_vector_bytes_6, sizeof se_vector_bytes_6,
      { SE_FRAME_RECEIPT, 100, { .receipt = { 4 } } } },
    { "quittierung_ich_komme", se_vector_bytes_7, sizeof se_vector_bytes_7,
      { SE_FRAME_ACKNOWLEDGED, 101, { .acknowledged = { 1758000045u } } } },
    { "entwarnung", se_vector_bytes_8, sizeof se_vector_bytes_8,
      { SE_FRAME_CANCELLED, 102, { .cancelled = { 1758000300u } } } },
    { "standort_angefordert", se_vector_bytes_9, sizeof se_vector_bytes_9,
      { SE_FRAME_REQUEST_LOCATION, 103, { .receipt = { 0 } } } },
};

static const size_t se_test_vector_count = sizeof se_test_vectors / sizeof se_test_vectors[0];

#endif /* SAFEEXIT_GENERATED_VECTORS_H */
