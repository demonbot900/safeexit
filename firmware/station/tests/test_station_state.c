#include "safeexit/station_state.h"
#include "se_test.h"

#define MUTE_SECONDS 60u

static void test_alarm_rings(void)
{
    se_station_t station;
    se_station_output_t output;

    se_station_init(&station, MUTE_SECONDS);
    output = se_station_on_alarm(&station, 1, 1000);

    SE_ASSERT_EQ(output.sound_on, 1);
    SE_ASSERT_EQ(output.led, SE_STATION_LED_RED);
    SE_ASSERT_EQ(station.state, SE_STATION_RINGING);
}

static void test_short_press_acknowledges(void)
{
    se_station_t station;
    se_station_output_t output;

    se_station_init(&station, MUTE_SECONDS);
    se_station_on_alarm(&station, 2, 1000);
    output = se_station_on_button(&station, 0, 1500);

    SE_ASSERT_EQ(output.send_acknowledge, 1);
    SE_ASSERT_EQ(output.sound_on, 0);
    SE_ASSERT_EQ(output.led, SE_STATION_LED_GREEN);
}

static void test_long_press_mutes_and_returns(void)
{
    se_station_t station;
    se_station_output_t output;

    se_station_init(&station, MUTE_SECONDS);
    se_station_on_alarm(&station, 2, 1000);

    output = se_station_on_button(&station, 1, 2000);
    SE_ASSERT_EQ(output.sound_on, 0);
    /* Das Licht bleibt: der Alarm ist nicht vorbei. */
    SE_ASSERT_EQ(output.led, SE_STATION_LED_RED);
    SE_ASSERT_EQ(output.send_acknowledge, 0);

    output = se_station_tick(&station, 2000 + 30u * 1000u);
    SE_ASSERT_EQ(output.sound_on, 0);

    output = se_station_tick(&station, 2000 + MUTE_SECONDS * 1000u);
    SE_ASSERT_EQ(output.sound_on, 1);
}

static void test_escalation_breaks_the_mute(void)
{
    se_station_t station;
    se_station_output_t output;

    se_station_init(&station, MUTE_SECONDS);
    se_station_on_alarm(&station, 1, 1000);
    se_station_on_button(&station, 1, 1200);

    output = se_station_on_update(&station, 3, 0, 0, 1500);

    SE_ASSERT_EQ(output.sound_on, 1);
    SE_ASSERT_EQ(station.level, 3);
}

static void test_acknowledged_elsewhere(void)
{
    se_station_t station;
    se_station_output_t output;

    se_station_init(&station, MUTE_SECONDS);
    se_station_on_alarm(&station, 2, 1000);
    output = se_station_on_update(&station, 2, 0, 1, 1800);

    SE_ASSERT_EQ(output.sound_on, 0);
    SE_ASSERT_EQ(output.led, SE_STATION_LED_GREEN);
    /* Nur die Station, an der gedrueckt wurde, meldet die Quittierung. */
    SE_ASSERT_EQ(output.send_acknowledge, 0);
}

static void test_cancellation_returns_to_idle(void)
{
    se_station_t station;
    se_station_output_t output;

    se_station_init(&station, MUTE_SECONDS);
    se_station_on_alarm(&station, 2, 1000);
    output = se_station_on_update(&station, 2, 1, 0, 3000);

    SE_ASSERT_EQ(output.sound_on, 0);
    SE_ASSERT_EQ(output.led, SE_STATION_LED_OFF);
    SE_ASSERT_EQ(station.state, SE_STATION_IDLE);
}

static void test_button_without_alarm_does_nothing(void)
{
    se_station_t station;
    se_station_output_t output;

    se_station_init(&station, MUTE_SECONDS);
    output = se_station_on_button(&station, 0, 1000);

    SE_ASSERT_EQ(output.send_acknowledge, 0);
    SE_ASSERT_EQ(station.state, SE_STATION_IDLE);
}

int main(void)
{
    test_alarm_rings();
    test_short_press_acknowledges();
    test_long_press_mutes_and_returns();
    test_escalation_breaks_the_mute();
    test_acknowledged_elsewhere();
    test_cancellation_returns_to_idle();
    test_button_without_alarm_does_nothing();

    return SE_TEST_RESULT();
}
