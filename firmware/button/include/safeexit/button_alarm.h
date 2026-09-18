/*
 * Der Zustandsautomat des Knopfs.
 *
 * Er entscheidet, was ein Tastendruck bedeutet und was das Geraet danach tut.
 * Die Stufen entsprechen der Rettungskette im Businessplan 3.3.
 */
#ifndef SAFEEXIT_BUTTON_ALARM_H
#define SAFEEXIT_BUTTON_ALARM_H

#include <stdint.h>

#include "safeexit/button_input.h"

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    SE_ALARM_IDLE = 0,
    SE_ALARM_ACTIVE,
    /** Jemand hat "Ich komme" gedrueckt. Der Alarm laeuft weiter. */
    SE_ALARM_ACKNOWLEDGED
} se_alarm_state_t;

typedef enum {
    SE_ACTION_NONE = 0,
    SE_ACTION_SEND_TRIGGER,
    SE_ACTION_SEND_ESCALATE,
    /** Zweimal vibrieren, LED gruen: jemand kommt. */
    SE_ACTION_FEEDBACK_ACKNOWLEDGED,
    /** Entwarnung, zurueck in den Ruhezustand. */
    SE_ACTION_FEEDBACK_CANCELLED,
    /** Das Backend moechte eine frische Ortung. */
    SE_ACTION_SEND_LOCATION
} se_action_type_t;

typedef struct {
    se_action_type_t type;
    /** Nur bei SEND_TRIGGER und SEND_ESCALATE belegt. */
    uint8_t level;
} se_action_t;

typedef struct {
    se_alarm_state_t state;
    uint8_t level;
} se_button_alarm_t;

void se_button_alarm_init(se_button_alarm_t *machine);

/** Verarbeitet eine Geste des Tasters. */
se_action_t se_button_alarm_on_button(se_button_alarm_t *machine, se_button_event_t event);

/** Verarbeitet einen Rahmen vom Backend (Typen aus safeexit/protocol.h). */
se_action_t se_button_alarm_on_downlink(se_button_alarm_t *machine, uint8_t frame_type);

#ifdef __cplusplus
}
#endif

#endif /* SAFEEXIT_BUTTON_ALARM_H */
