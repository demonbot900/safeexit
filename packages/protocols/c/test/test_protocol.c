/*
 * Prueft die C-Fassung des Protokolls gegen dieselben Testvektoren wie die
 * TypeScript-Fassung. Weicht eine Seite ab, faellt es hier auf.
 */
#include <string.h>

#include "generated_vectors.h"
#include "safeexit/protocol.h"
#include "se_test.h"

static void test_encode_matches_vectors(void)
{
    uint8_t buffer[SE_MAX_FRAME_SIZE];
    size_t i;

    for (i = 0; i < se_test_vector_count; i++) {
        const se_test_vector_t *vector = &se_test_vectors[i];
        int written = se_frame_encode(&vector->frame, buffer, sizeof buffer);

        SE_ASSERT_EQ(written, (int)vector->length);
        if (written == (int)vector->length) {
            SE_ASSERT(memcmp(buffer, vector->bytes, vector->length) == 0);
        }
    }
}

static void test_decode_matches_vectors(void)
{
    uint8_t buffer[SE_MAX_FRAME_SIZE];
    size_t i;

    for (i = 0; i < se_test_vector_count; i++) {
        const se_test_vector_t *vector = &se_test_vectors[i];
        se_frame_t decoded;
        se_status_t status = se_frame_decode(vector->bytes, vector->length, &decoded);
        int written;

        SE_ASSERT_EQ(status, SE_OK);
        SE_ASSERT_EQ(decoded.type, vector->frame.type);
        SE_ASSERT_EQ(decoded.sequence, vector->frame.sequence);

        /* Der Umweg ueber das Kodieren vergleicht alle Nutzdatenfelder, ohne sich
           auf die Anordnung der Struktur im Speicher zu verlassen. */
        written = se_frame_encode(&decoded, buffer, sizeof buffer);
        SE_ASSERT_EQ(written, (int)vector->length);
        if (written == (int)vector->length) {
            SE_ASSERT(memcmp(buffer, vector->bytes, vector->length) == 0);
        }
    }
}

static void test_negative_coordinates(void)
{
    /* Suedliche Breite muss negativ ankommen, sonst stimmt das Vorzeichen nicht. */
    size_t i;
    int found = 0;

    for (i = 0; i < se_test_vector_count; i++) {
        const se_test_vector_t *vector = &se_test_vectors[i];
        se_frame_t decoded;

        if (vector->frame.type != SE_FRAME_LOCATION) {
            continue;
        }
        if (vector->frame.payload.location.latitude_e7 >= 0) {
            continue;
        }

        found = 1;
        SE_ASSERT_EQ(se_frame_decode(vector->bytes, vector->length, &decoded), SE_OK);
        SE_ASSERT_EQ(decoded.payload.location.latitude_e7,
                     vector->frame.payload.location.latitude_e7);
        SE_ASSERT(decoded.payload.location.latitude_e7 < 0);
        SE_ASSERT(decoded.payload.location.longitude_e7 > 0);
    }

    SE_ASSERT(found == 1);
}

static void test_decode_errors(void)
{
    se_frame_t frame;
    uint8_t bad_version[] = { 0x02, 0x01, 0x01, 0x00, 0x01, 0x57, 0x80, 0xf3, 0xc8, 0x68 };
    uint8_t unknown_type[] = { 0x01, 0x7f, 0x01, 0x00 };
    uint8_t wrong_length[] = { 0x01, 0x01, 0x01, 0x00, 0x01, 0x57 };
    uint8_t too_short[] = { 0x01, 0x01, 0x00 };
    uint8_t bad_level[] = { 0x01, 0x01, 0x01, 0x00, 0x05, 0x57, 0x80, 0xf3, 0xc8, 0x68 };

    SE_ASSERT_EQ(se_frame_decode(bad_version, sizeof bad_version, &frame), SE_ERR_VERSION);
    SE_ASSERT_EQ(se_frame_decode(unknown_type, sizeof unknown_type, &frame), SE_ERR_TYPE);
    SE_ASSERT_EQ(se_frame_decode(wrong_length, sizeof wrong_length, &frame), SE_ERR_LENGTH);
    SE_ASSERT_EQ(se_frame_decode(too_short, sizeof too_short, &frame), SE_ERR_LENGTH);
    SE_ASSERT_EQ(se_frame_decode(bad_level, sizeof bad_level, &frame), SE_ERR_VALUE);
}

static void test_encode_errors(void)
{
    uint8_t small_buffer[4];
    se_frame_t trigger;
    se_frame_t location;

    trigger.type = SE_FRAME_ALARM_TRIGGER;
    trigger.sequence = 1;
    trigger.payload.alarm_trigger.level = 1;
    trigger.payload.alarm_trigger.battery_percent = 87;
    trigger.payload.alarm_trigger.timestamp = 1758000000u;
    SE_ASSERT_EQ(se_frame_encode(&trigger, small_buffer, sizeof small_buffer), SE_ERR_BUFFER);

    trigger.payload.alarm_trigger.battery_percent = 120;
    {
        uint8_t buffer[SE_MAX_FRAME_SIZE];
        SE_ASSERT_EQ(se_frame_encode(&trigger, buffer, sizeof buffer), SE_ERR_VALUE);

        location.type = SE_FRAME_LOCATION;
        location.sequence = 2;
        location.payload.location.latitude_e7 = 531435000;
        location.payload.location.longitude_e7 = 82146000;
        location.payload.location.accuracy_meters = 10;
        location.payload.location.source = 9; /* gibt es nicht */
        location.payload.location.timestamp = 1758000000u;
        SE_ASSERT_EQ(se_frame_encode(&location, buffer, sizeof buffer), SE_ERR_VALUE);
    }
}

static void test_direction(void)
{
    SE_ASSERT_EQ(se_frame_is_uplink(SE_FRAME_ALARM_TRIGGER), 1);
    SE_ASSERT_EQ(se_frame_is_uplink(SE_FRAME_LOCATION), 1);
    SE_ASSERT_EQ(se_frame_is_uplink(SE_FRAME_ACKNOWLEDGED), 0);
    SE_ASSERT_EQ(se_frame_is_uplink(SE_FRAME_CANCELLED), 0);
}

int main(void)
{
    test_encode_matches_vectors();
    test_decode_matches_vectors();
    test_negative_coordinates();
    test_decode_errors();
    test_encode_errors();
    test_direction();

    return SE_TEST_RESULT();
}
