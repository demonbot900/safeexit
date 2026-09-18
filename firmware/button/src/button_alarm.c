#include <stddef.h>

#include "safeexit/button_alarm.h"
#include "safeexit/protocol.h"

static se_action_t action(se_action_type_t type, uint8_t level)
{
    se_action_t result;

    result.type = type;
    result.level = level;

    return result;
}

void se_button_alarm_init(se_button_alarm_t *machine)
{
    if (machine == NULL) {
        return;
    }

    machine->state = SE_ALARM_IDLE;
    machine->level = 0;
}

/* Eine Stufe wird nie zurueckgenommen, nur erhoeht. */
static se_action_t raise_to(se_button_alarm_t *machine, uint8_t level)
{
    if (level <= machine->level) {
        return action(SE_ACTION_NONE, 0);
    }

    machine->level = level;

    if (machine->state == SE_ALARM_IDLE) {
        machine->state = SE_ALARM_ACTIVE;
        return action(SE_ACTION_SEND_TRIGGER, level);
    }

    return action(SE_ACTION_SEND_ESCALATE, level);
}

se_action_t se_button_alarm_on_button(se_button_alarm_t *machine, se_button_event_t event)
{
    if (machine == NULL) {
        return action(SE_ACTION_NONE, 0);
    }

    switch (event) {
    case SE_BUTTON_PRESS:
        return raise_to(machine, 1);

    case SE_BUTTON_DOUBLE_PRESS:
        return raise_to(machine, 2);

    case SE_BUTTON_HOLD:
        return raise_to(machine, 3);

    case SE_BUTTON_NONE:
    default:
        return action(SE_ACTION_NONE, 0);
    }
}

se_action_t se_button_alarm_on_downlink(se_button_alarm_t *machine, uint8_t frame_type)
{
    if (machine == NULL) {
        return action(SE_ACTION_NONE, 0);
    }

    switch (frame_type) {
    case SE_FRAME_ACKNOWLEDGED:
        if (machine->state != SE_ALARM_ACTIVE) {
            return action(SE_ACTION_NONE, 0);
        }
        /*
         * Die wichtigste Rueckmeldung des ganzen Systems: Wer weiss, dass jemand
         * reagiert hat, verhaelt sich anders als jemand, der nur hofft.
         * Der Alarm bleibt dabei ausdruecklich aktiv.
         */
        machine->state = SE_ALARM_ACKNOWLEDGED;
        return action(SE_ACTION_FEEDBACK_ACKNOWLEDGED, machine->level);

    case SE_FRAME_CANCELLED:
        if (machine->state == SE_ALARM_IDLE) {
            return action(SE_ACTION_NONE, 0);
        }
        machine->state = SE_ALARM_IDLE;
        machine->level = 0;
        return action(SE_ACTION_FEEDBACK_CANCELLED, 0);

    case SE_FRAME_REQUEST_LOCATION:
        return action(SE_ACTION_SEND_LOCATION, machine->level);

    default:
        return action(SE_ACTION_NONE, 0);
    }
}
