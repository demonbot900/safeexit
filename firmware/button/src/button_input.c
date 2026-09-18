#include <stddef.h>

#include "safeexit/button_input.h"

se_button_config_t se_button_default_config(void)
{
    se_button_config_t config;

    config.debounce_ms = 50;             /* BUTTON_DEBOUNCE_MILLISECONDS */
    config.min_press_ms = 80;            /* MIN_PRESS_MILLISECONDS */
    config.double_press_window_ms = 1500; /* DOUBLE_PRESS_WINDOW_MILLISECONDS */
    config.hold_ms = 3000;               /* EMERGENCY_HOLD_MILLISECONDS */

    return config;
}

void se_button_init(se_button_t *button, const se_button_config_t *config)
{
    if (button == NULL) {
        return;
    }

    button->config = (config != NULL) ? *config : se_button_default_config();
    button->raw_pressed = 0;
    button->stable_pressed = 0;
    button->press_reported = 0;
    button->hold_reported = 0;
    button->has_previous_press = 0;
    button->last_edge_ms = 0;
    button->press_started_ms = 0;
    button->last_press_ms = 0;
}

se_button_event_t se_button_update(se_button_t *button, int pressed, uint32_t now_ms)
{
    uint8_t level;

    if (button == NULL) {
        return SE_BUTTON_NONE;
    }

    level = (pressed != 0) ? 1u : 0u;

    /* Entprellen: ein neuer Pegel zaehlt erst, wenn er lange genug anliegt. */
    if (level != button->raw_pressed) {
        button->raw_pressed = level;
        button->last_edge_ms = now_ms;
        return SE_BUTTON_NONE;
    }

    if (level != button->stable_pressed) {
        if (now_ms - button->last_edge_ms < button->config.debounce_ms) {
            return SE_BUTTON_NONE;
        }

        button->stable_pressed = level;

        if (level == 1u) {
            button->press_started_ms = now_ms;
            button->press_reported = 0;
            button->hold_reported = 0;
        }

        return SE_BUTTON_NONE;
    }

    if (button->stable_pressed == 0u) {
        return SE_BUTTON_NONE;
    }

    /*
     * Der Druck wird gemeldet, sobald er lange genug anliegt, und nicht erst beim
     * Loslassen. In einer Notlage zaehlt jede Sekunde; auf das Ende des
     * Doppelklickfensters zu warten waere hier der falsche Kompromiss.
     */
    if (button->press_reported == 0u &&
        now_ms - button->press_started_ms >= button->config.min_press_ms) {
        button->press_reported = 1u;

        if (button->has_previous_press != 0u &&
            button->press_started_ms - button->last_press_ms <=
                button->config.double_press_window_ms) {
            button->last_press_ms = button->press_started_ms;
            return SE_BUTTON_DOUBLE_PRESS;
        }

        button->has_previous_press = 1u;
        button->last_press_ms = button->press_started_ms;
        return SE_BUTTON_PRESS;
    }

    if (button->hold_reported == 0u && now_ms - button->press_started_ms >= button->config.hold_ms) {
        button->hold_reported = 1u;
        return SE_BUTTON_HOLD;
    }

    return SE_BUTTON_NONE;
}
