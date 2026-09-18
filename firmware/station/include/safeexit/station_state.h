/*
 * Der Zustandsautomat der Station.
 *
 * Die Station hat genau einen Knopf. Kurz druecken heisst "Ich komme", lange
 * druecken schaltet den Ton fuer eine Minute stumm. Alles andere kommt vom
 * Backend. Ohne Hardwarebezug, damit es auf dem Rechner testbar bleibt.
 */
#ifndef SAFEEXIT_STATION_STATE_H
#define SAFEEXIT_STATION_STATE_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    SE_STATION_IDLE = 0,
    SE_STATION_RINGING,
    /** Ton aus, Licht laeuft weiter. Endet von selbst. */
    SE_STATION_MUTED,
    /** Jemand hat "Ich komme" gedrueckt, hier oder anderswo. */
    SE_STATION_ACKNOWLEDGED
} se_station_state_t;

typedef enum { SE_STATION_LED_OFF = 0, SE_STATION_LED_RED, SE_STATION_LED_GREEN } se_station_led_t;

typedef struct {
    int sound_on;
    se_station_led_t led;
    /** 1, wenn die Quittierung ans Backend geschickt werden soll. */
    int send_acknowledge;
} se_station_output_t;

typedef struct {
    se_station_state_t state;
    uint8_t level;
    uint32_t mute_seconds;
    uint32_t mute_until_ms;
} se_station_t;

/** mute_seconds: Dauer der Stummschaltung, im Produkt 60 Sekunden. */
void se_station_init(se_station_t *station, uint32_t mute_seconds);

/** Neuer Alarm vom Backend. */
se_station_output_t se_station_on_alarm(se_station_t *station, uint8_t level, uint32_t now_ms);

/** Aenderung an einem laufenden Alarm. */
se_station_output_t se_station_on_update(se_station_t *station, uint8_t level, int cancelled,
                                         int acknowledged, uint32_t now_ms);

/** Knopf an der Station. long_press: 1 fuer stummschalten. */
se_station_output_t se_station_on_button(se_station_t *station, int long_press, uint32_t now_ms);

/** Regelmaessig aufrufen, damit die Stummschaltung von selbst endet. */
se_station_output_t se_station_tick(se_station_t *station, uint32_t now_ms);

/** Was gerade zu sehen und zu hoeren sein soll. */
se_station_output_t se_station_outputs(const se_station_t *station);

#ifdef __cplusplus
}
#endif

#endif /* SAFEEXIT_STATION_STATE_H */
