#include "safeexit/protocol.h"

/*
 * Alle Mehrbyte-Felder liegen little-endian im Rahmen. Wir schreiben und lesen sie
 * byteweise, damit der Code unabhaengig von der Byte-Reihenfolge des Prozessors ist.
 */

static void write_u16(uint8_t *out, uint16_t value)
{
    out[0] = (uint8_t)(value & 0xffu);
    out[1] = (uint8_t)((value >> 8) & 0xffu);
}

static void write_u32(uint8_t *out, uint32_t value)
{
    out[0] = (uint8_t)(value & 0xffu);
    out[1] = (uint8_t)((value >> 8) & 0xffu);
    out[2] = (uint8_t)((value >> 16) & 0xffu);
    out[3] = (uint8_t)((value >> 24) & 0xffu);
}

static uint16_t read_u16(const uint8_t *in)
{
    return (uint16_t)((uint16_t)in[0] | ((uint16_t)in[1] << 8));
}

static uint32_t read_u32(const uint8_t *in)
{
    return (uint32_t)in[0] | ((uint32_t)in[1] << 8) | ((uint32_t)in[2] << 16) |
           ((uint32_t)in[3] << 24);
}

static int32_t read_i32(const uint8_t *in)
{
    /* Umweg ueber uint32_t, weil ein Ueberlauf beim Schieben von int32_t
       undefiniert waere. */
    return (int32_t)read_u32(in);
}

size_t se_frame_length(uint8_t type)
{
    switch (type) {
    case SE_FRAME_ALARM_TRIGGER:
        return 10;
    case SE_FRAME_ALARM_ESCALATE:
        return 9;
    case SE_FRAME_LOCATION:
        return 19;
    case SE_FRAME_HEARTBEAT:
        return 12;
    case SE_FRAME_RECEIPT:
        return 6;
    case SE_FRAME_ACKNOWLEDGED:
    case SE_FRAME_CANCELLED:
        return 8;
    case SE_FRAME_REQUEST_LOCATION:
        return SE_FRAME_HEADER_SIZE;
    default:
        return 0;
    }
}

int se_frame_is_uplink(uint8_t type)
{
    return (type & 0x80u) == 0u ? 1 : 0;
}

static se_status_t check_level(uint8_t level)
{
    return (level >= 1u && level <= 3u) ? SE_OK : SE_ERR_VALUE;
}

int se_frame_encode(const se_frame_t *frame, uint8_t *buffer, size_t buffer_size)
{
    size_t length;

    if (frame == NULL || buffer == NULL) {
        return SE_ERR_VALUE;
    }

    length = se_frame_length(frame->type);
    if (length == 0u) {
        return SE_ERR_TYPE;
    }
    if (buffer_size < length) {
        return SE_ERR_BUFFER;
    }

    buffer[0] = SE_PROTOCOL_VERSION;
    buffer[1] = frame->type;
    write_u16(&buffer[2], frame->sequence);

    switch (frame->type) {
    case SE_FRAME_ALARM_TRIGGER:
        if (check_level(frame->payload.alarm_trigger.level) != SE_OK) {
            return SE_ERR_VALUE;
        }
        if (frame->payload.alarm_trigger.battery_percent > 100u) {
            return SE_ERR_VALUE;
        }
        buffer[4] = frame->payload.alarm_trigger.level;
        buffer[5] = frame->payload.alarm_trigger.battery_percent;
        write_u32(&buffer[6], frame->payload.alarm_trigger.timestamp);
        break;

    case SE_FRAME_ALARM_ESCALATE:
        if (check_level(frame->payload.alarm_escalate.level) != SE_OK) {
            return SE_ERR_VALUE;
        }
        buffer[4] = frame->payload.alarm_escalate.level;
        write_u32(&buffer[5], frame->payload.alarm_escalate.timestamp);
        break;

    case SE_FRAME_LOCATION:
        if (frame->payload.location.source > SE_LOCATION_SOURCE_PHONE) {
            return SE_ERR_VALUE;
        }
        write_u32(&buffer[4], (uint32_t)frame->payload.location.latitude_e7);
        write_u32(&buffer[8], (uint32_t)frame->payload.location.longitude_e7);
        write_u16(&buffer[12], frame->payload.location.accuracy_meters);
        buffer[14] = frame->payload.location.source;
        write_u32(&buffer[15], frame->payload.location.timestamp);
        break;

    case SE_FRAME_HEARTBEAT:
        if (frame->payload.heartbeat.battery_percent > 100u) {
            return SE_ERR_VALUE;
        }
        buffer[4] = frame->payload.heartbeat.battery_percent;
        buffer[5] = (uint8_t)frame->payload.heartbeat.rssi_dbm;
        buffer[6] = frame->payload.heartbeat.firmware_major;
        buffer[7] = frame->payload.heartbeat.firmware_minor;
        write_u32(&buffer[8], frame->payload.heartbeat.timestamp);
        break;

    case SE_FRAME_RECEIPT:
        write_u16(&buffer[4], frame->payload.receipt.acknowledged_sequence);
        break;

    case SE_FRAME_ACKNOWLEDGED:
        write_u32(&buffer[4], frame->payload.acknowledged.timestamp);
        break;

    case SE_FRAME_CANCELLED:
        write_u32(&buffer[4], frame->payload.cancelled.timestamp);
        break;

    case SE_FRAME_REQUEST_LOCATION:
        break;

    default:
        return SE_ERR_TYPE;
    }

    return (int)length;
}

se_status_t se_frame_decode(const uint8_t *data, size_t length, se_frame_t *frame)
{
    uint8_t type;
    size_t expected;

    if (data == NULL || frame == NULL) {
        return SE_ERR_VALUE;
    }
    if (length < (size_t)SE_FRAME_HEADER_SIZE) {
        return SE_ERR_LENGTH;
    }
    if (data[0] != SE_PROTOCOL_VERSION) {
        return SE_ERR_VERSION;
    }

    type = data[1];
    expected = se_frame_length(type);
    if (expected == 0u) {
        return SE_ERR_TYPE;
    }
    if (length != expected) {
        return SE_ERR_LENGTH;
    }

    frame->type = type;
    frame->sequence = read_u16(&data[2]);

    switch (type) {
    case SE_FRAME_ALARM_TRIGGER:
        if (check_level(data[4]) != SE_OK) {
            return SE_ERR_VALUE;
        }
        frame->payload.alarm_trigger.level = data[4];
        frame->payload.alarm_trigger.battery_percent = data[5];
        frame->payload.alarm_trigger.timestamp = read_u32(&data[6]);
        break;

    case SE_FRAME_ALARM_ESCALATE:
        if (check_level(data[4]) != SE_OK) {
            return SE_ERR_VALUE;
        }
        frame->payload.alarm_escalate.level = data[4];
        frame->payload.alarm_escalate.timestamp = read_u32(&data[5]);
        break;

    case SE_FRAME_LOCATION:
        if (data[14] > SE_LOCATION_SOURCE_PHONE) {
            return SE_ERR_VALUE;
        }
        frame->payload.location.latitude_e7 = read_i32(&data[4]);
        frame->payload.location.longitude_e7 = read_i32(&data[8]);
        frame->payload.location.accuracy_meters = read_u16(&data[12]);
        frame->payload.location.source = data[14];
        frame->payload.location.timestamp = read_u32(&data[15]);
        break;

    case SE_FRAME_HEARTBEAT:
        frame->payload.heartbeat.battery_percent = data[4];
        frame->payload.heartbeat.rssi_dbm = (int8_t)data[5];
        frame->payload.heartbeat.firmware_major = data[6];
        frame->payload.heartbeat.firmware_minor = data[7];
        frame->payload.heartbeat.timestamp = read_u32(&data[8]);
        break;

    case SE_FRAME_RECEIPT:
        frame->payload.receipt.acknowledged_sequence = read_u16(&data[4]);
        break;

    case SE_FRAME_ACKNOWLEDGED:
        frame->payload.acknowledged.timestamp = read_u32(&data[4]);
        break;

    case SE_FRAME_CANCELLED:
        frame->payload.cancelled.timestamp = read_u32(&data[4]);
        break;

    case SE_FRAME_REQUEST_LOCATION:
        break;

    default:
        return SE_ERR_TYPE;
    }

    return SE_OK;
}
