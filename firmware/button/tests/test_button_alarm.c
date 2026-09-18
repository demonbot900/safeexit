#include "safeexit/button_alarm.h"
#include "safeexit/protocol.h"
#include "se_test.h"

static void test_single_press_triggers_level_one(void)
{
    se_button_alarm_t machine;
    se_action_t action;

    se_button_alarm_init(&machine);
    action = se_button_alarm_on_button(&machine, SE_BUTTON_PRESS);

    SE_ASSERT_EQ(action.type, SE_ACTION_SEND_TRIGGER);
    SE_ASSERT_EQ(action.level, 1);
    SE_ASSERT_EQ(machine.state, SE_ALARM_ACTIVE);
}

static void test_double_press_escalates(void)
{
    se_button_alarm_t machine;
    se_action_t action;

    se_button_alarm_init(&machine);
    se_button_alarm_on_button(&machine, SE_BUTTON_PRESS);
    action = se_button_alarm_on_button(&machine, SE_BUTTON_DOUBLE_PRESS);

    SE_ASSERT_EQ(action.type, SE_ACTION_SEND_ESCALATE);
    SE_ASSERT_EQ(action.level, 2);
    SE_ASSERT_EQ(machine.level, 2);
}

static void test_hold_reaches_level_three(void)
{
    se_button_alarm_t machine;
    se_action_t action;

    se_button_alarm_init(&machine);
    se_button_alarm_on_button(&machine, SE_BUTTON_PRESS);
    action = se_button_alarm_on_button(&machine, SE_BUTTON_HOLD);

    SE_ASSERT_EQ(action.type, SE_ACTION_SEND_ESCALATE);
    SE_ASSERT_EQ(action.level, 3);
}

static void test_level_is_never_lowered(void)
{
    se_button_alarm_t machine;
    se_action_t action;

    se_button_alarm_init(&machine);
    se_button_alarm_on_button(&machine, SE_BUTTON_HOLD);
    action = se_button_alarm_on_button(&machine, SE_BUTTON_PRESS);

    SE_ASSERT_EQ(action.type, SE_ACTION_NONE);
    SE_ASSERT_EQ(machine.level, 3);
}

static void test_acknowledgement_does_not_end_the_alarm(void)
{
    se_button_alarm_t machine;
    se_action_t action;

    se_button_alarm_init(&machine);
    se_button_alarm_on_button(&machine, SE_BUTTON_PRESS);

    action = se_button_alarm_on_downlink(&machine, SE_FRAME_ACKNOWLEDGED);
    SE_ASSERT_EQ(action.type, SE_ACTION_FEEDBACK_ACKNOWLEDGED);
    SE_ASSERT_EQ(machine.state, SE_ALARM_ACKNOWLEDGED);

    /* Wer trotzdem mehr Hilfe braucht, kommt weiter durch. */
    action = se_button_alarm_on_button(&machine, SE_BUTTON_HOLD);
    SE_ASSERT_EQ(action.type, SE_ACTION_SEND_ESCALATE);
    SE_ASSERT_EQ(action.level, 3);
}

static void test_cancellation_returns_to_idle(void)
{
    se_button_alarm_t machine;
    se_action_t action;

    se_button_alarm_init(&machine);
    se_button_alarm_on_button(&machine, SE_BUTTON_DOUBLE_PRESS);

    action = se_button_alarm_on_downlink(&machine, SE_FRAME_CANCELLED);
    SE_ASSERT_EQ(action.type, SE_ACTION_FEEDBACK_CANCELLED);
    SE_ASSERT_EQ(machine.state, SE_ALARM_IDLE);
    SE_ASSERT_EQ(machine.level, 0);

    /* Danach faengt ein Druck wieder bei Stufe 1 an. */
    action = se_button_alarm_on_button(&machine, SE_BUTTON_PRESS);
    SE_ASSERT_EQ(action.type, SE_ACTION_SEND_TRIGGER);
    SE_ASSERT_EQ(action.level, 1);
}

static void test_location_request(void)
{
    se_button_alarm_t machine;
    se_action_t action;

    se_button_alarm_init(&machine);
    se_button_alarm_on_button(&machine, SE_BUTTON_PRESS);
    action = se_button_alarm_on_downlink(&machine, SE_FRAME_REQUEST_LOCATION);

    SE_ASSERT_EQ(action.type, SE_ACTION_SEND_LOCATION);
}

int main(void)
{
    test_single_press_triggers_level_one();
    test_double_press_escalates();
    test_hold_reaches_level_three();
    test_level_is_never_lowered();
    test_acknowledgement_does_not_end_the_alarm();
    test_cancellation_returns_to_idle();
    test_location_request();

    return SE_TEST_RESULT();
}
