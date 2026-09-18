#include <stddef.h>

#include "safeexit/station_state.h"

static se_station_output_t outputs_for(const se_station_t *station, int send_acknowledge)
{
    se_station_output_t output;

    output.sound_on = 0;
    output.led = SE_STATION_LED_OFF;
    output.send_acknowledge = send_acknowledge;

    switch (station->state) {
    case SE_STATION_RINGING:
        output.sound_on = 1;
        output.led = SE_STATION_LED_RED;
        break;

    case SE_STATION_MUTED:
        /* Ton aus, Licht bleibt: der Alarm ist nicht vorbei, nur leiser. */
        output.led = SE_STATION_LED_RED;
        break;

    case SE_STATION_ACKNOWLEDGED:
        output.led = SE_STATION_LED_GREEN;
        break;

    case SE_STATION_IDLE:
    default:
        break;
    }

    return output;
}

static se_station_output_t silent_outputs(void)
{
    se_station_t empty;

    empty.state = SE_STATION_IDLE;
    empty.level = 0;
    empty.mute_seconds = 60;
    empty.mute_until_ms = 0;

    return outputs_for(&empty, 0);
}

void se_station_init(se_station_t *station, uint32_t mute_seconds)
{
    if (station == NULL) {
        return;
    }

    station->state = SE_STATION_IDLE;
    station->level = 0;
    station->mute_seconds = (mute_seconds > 0u) ? mute_seconds : 60u;
    station->mute_until_ms = 0;
}

se_station_output_t se_station_on_alarm(se_station_t *station, uint8_t level, uint32_t now_ms)
{
    (void)now_ms;

    if (station == NULL) {
        return silent_outputs();
    }

    if (station->state == SE_STATION_IDLE || level > station->level) {
        /* Eine hoehere Stufe hebt auch eine Stummschaltung wieder auf. */
        station->state = SE_STATION_RINGING;
        station->mute_until_ms = 0;
    }

    if (level > station->level) {
        station->level = level;
    }

    return outputs_for(station, 0);
}

se_station_output_t se_station_on_update(se_station_t *station, uint8_t level, int cancelled,
                                         int acknowledged, uint32_t now_ms)
{
    if (station == NULL) {
        return silent_outputs();
    }

    if (cancelled != 0) {
        station->state = SE_STATION_IDLE;
        station->level = 0;
        station->mute_until_ms = 0;
        return outputs_for(station, 0);
    }

    if (level > station->level) {
        return se_station_on_alarm(station, level, now_ms);
    }

    if (acknowledged != 0 && station->state != SE_STATION_IDLE) {
        station->state = SE_STATION_ACKNOWLEDGED;
    }

    return outputs_for(station, 0);
}

se_station_output_t se_station_on_button(se_station_t *station, int long_press, uint32_t now_ms)
{
    if (station == NULL) {
        return silent_outputs();
    }

    if (station->state == SE_STATION_IDLE) {
        return outputs_for(station, 0);
    }

    if (long_press != 0) {
        station->state = SE_STATION_MUTED;
        station->mute_until_ms = now_ms + station->mute_seconds * 1000u;
        return outputs_for(station, 0);
    }

    station->state = SE_STATION_ACKNOWLEDGED;
    station->mute_until_ms = 0;

    return outputs_for(station, 1);
}

se_station_output_t se_station_tick(se_station_t *station, uint32_t now_ms)
{
    if (station == NULL) {
        return silent_outputs();
    }

    if (station->state == SE_STATION_MUTED && now_ms >= station->mute_until_ms) {
        /* Niemand hat reagiert. Dann wird die Station wieder laut. */
        station->state = SE_STATION_RINGING;
        station->mute_until_ms = 0;
    }

    return outputs_for(station, 0);
}

se_station_output_t se_station_outputs(const se_station_t *station)
{
    if (station == NULL) {
        return silent_outputs();
    }

    return outputs_for(station, 0);
}
