#include "safeexit/button_input.h"
#include "se_test.h"

static se_button_t button;

static void init(void)
{
    se_button_config_t config = se_button_default_config();
    se_button_init(&button, &config);
}

/* Haelt den Taster fuer eine Dauer und sammelt das erste Ereignis ein. */
static se_button_event_t press_for(uint32_t start_ms, uint32_t duration_ms, uint32_t *now_ms)
{
    se_button_event_t found = SE_BUTTON_NONE;
    uint32_t t;

    for (t = start_ms; t <= start_ms + duration_ms; t += 10) {
        se_button_event_t event = se_button_update(&button, 1, t);
        if (event != SE_BUTTON_NONE && found == SE_BUTTON_NONE) {
            found = event;
        }
    }

    /* Loslassen und die Flanke entprellen lassen. */
    for (t = start_ms + duration_ms; t <= start_ms + duration_ms + 100u; t += 10) {
        se_button_update(&button, 0, t);
    }

    *now_ms = start_ms + duration_ms + 100u;
    return found;
}

static void test_short_touch_is_ignored(void)
{
    uint32_t now = 0;
    init();
    /* Anstossen in der Hosentasche: kuerzer als die Mindestdauer. */
    SE_ASSERT_EQ(press_for(1000, 60, &now), SE_BUTTON_NONE);
}

static void test_single_press(void)
{
    uint32_t now = 0;
    init();
    SE_ASSERT_EQ(press_for(1000, 200, &now), SE_BUTTON_PRESS);
}

static void test_bouncing_contact_gives_one_press(void)
{
    uint32_t t;
    int events = 0;
    init();

    /* Prellender Kontakt: schnelle Wechsel in den ersten Millisekunden. */
    for (t = 0; t < 40u; t += 5) {
        se_button_update(&button, (int)((t / 5u) % 2u), t);
    }
    for (t = 40; t < 400u; t += 10) {
        if (se_button_update(&button, 1, t) == SE_BUTTON_PRESS) {
            events++;
        }
    }

    SE_ASSERT_EQ(events, 1);
}

static void test_double_press(void)
{
    uint32_t now = 0;
    init();

    SE_ASSERT_EQ(press_for(1000, 150, &now), SE_BUTTON_PRESS);
    SE_ASSERT_EQ(press_for(now + 200u, 150, &now), SE_BUTTON_DOUBLE_PRESS);
}

static void test_two_presses_far_apart_are_not_a_double_press(void)
{
    uint32_t now = 0;
    init();

    SE_ASSERT_EQ(press_for(1000, 150, &now), SE_BUTTON_PRESS);
    SE_ASSERT_EQ(press_for(now + 4000u, 150, &now), SE_BUTTON_PRESS);
}

static void test_hold_is_reported_once(void)
{
    int presses = 0;
    int holds = 0;
    uint32_t t;
    init();

    for (t = 0; t < 5000u; t += 10) {
        se_button_event_t event = se_button_update(&button, 1, t);
        if (event == SE_BUTTON_PRESS) {
            presses++;
        }
        if (event == SE_BUTTON_HOLD) {
            holds++;
        }
    }

    /* Halten meldet zuerst den gewollten Druck und nach drei Sekunden das Halten. */
    SE_ASSERT_EQ(presses, 1);
    SE_ASSERT_EQ(holds, 1);
}

int main(void)
{
    test_short_touch_is_ignored();
    test_single_press();
    test_bouncing_contact_gives_one_press();
    test_double_press();
    test_two_presses_far_apart_are_not_a_double_press();
    test_hold_is_reported_once();

    return SE_TEST_RESULT();
}
