/*
 * Tastererkennung fuer den Knopf.
 *
 * Aufgabe: aus einem prellenden Pegel die drei Gesten machen, die der
 * Businessplan beschreibt: einmal druecken, zweimal druecken, drei Sekunden
 * halten. Bewusst ohne Zugriff auf Hardware, damit sie auf dem Rechner testbar ist.
 */
#ifndef SAFEEXIT_BUTTON_INPUT_H
#define SAFEEXIT_BUTTON_INPUT_H

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    SE_BUTTON_NONE = 0,
    /** Ein gewollter Druck ist erkannt (nicht bloss ein Anstossen). */
    SE_BUTTON_PRESS,
    /** Zweiter Druck innerhalb des Zeitfensters. */
    SE_BUTTON_DOUBLE_PRESS,
    /** Taster wird lange genug gehalten. Wird je Druck nur einmal gemeldet. */
    SE_BUTTON_HOLD
} se_button_event_t;

typedef struct {
    uint32_t debounce_ms;
    uint32_t min_press_ms;
    uint32_t double_press_window_ms;
    uint32_t hold_ms;
} se_button_config_t;

typedef struct {
    se_button_config_t config;
    uint8_t raw_pressed;
    uint8_t stable_pressed;
    uint8_t press_reported;
    uint8_t hold_reported;
    uint8_t has_previous_press;
    uint32_t last_edge_ms;
    uint32_t press_started_ms;
    uint32_t last_press_ms;
} se_button_t;

/** Werte aus packages/shared-types/src/constants.ts. */
se_button_config_t se_button_default_config(void);

void se_button_init(se_button_t *button, const se_button_config_t *config);

/**
 * Wird mit dem Pegel des Tasters aufgerufen, so oft wie moeglich.
 * Liefert hoechstens ein Ereignis je Aufruf.
 */
se_button_event_t se_button_update(se_button_t *button, int pressed, uint32_t now_ms);

#ifdef __cplusplus
}
#endif

#endif /* SAFEEXIT_BUTTON_INPUT_H */
