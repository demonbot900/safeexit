/*
 * Was die Zielplattform bereitstellen muss.
 *
 * Diese Kopfdatei enthaelt absichtlich keine Umsetzung. Die Fachlogik in src/
 * kennt sie nicht einmal, damit sie auf dem Entwicklungsrechner testbar bleibt.
 * Die Umsetzung fuer ein konkretes Modul kommt nach button/drivers.
 */
#ifndef SAFEEXIT_BUTTON_HAL_H
#define SAFEEXIT_BUTTON_HAL_H

#include <stddef.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum { SE_LED_OFF = 0, SE_LED_RED, SE_LED_GREEN, SE_LED_AMBER } se_led_color_t;

/** Millisekunden seit dem Start. Muss auch im Schlafmodus weiterlaufen. */
uint32_t se_hal_uptime_ms(void);

/** Pegel des Tasters: 1 gedrueckt, 0 losgelassen. */
int se_hal_button_pressed(void);

void se_hal_vibrate(uint8_t pulses);

void se_hal_led(se_led_color_t color, int blinking);

/** Ladestand in Prozent. */
uint8_t se_hal_battery_percent(void);

/**
 * Sendet einen Rahmen. Rueckgabe 0 bei Erfolg.
 * Die Wiederholung bei Misserfolg gehoert in die Sendeschleife, nicht hierher.
 */
int se_hal_radio_send(const uint8_t *frame, size_t length);

/**
 * Holt einen Rahmen, den das Backend als Antwort mitgeschickt hat.
 * Rueckgabe: Laenge, 0 wenn nichts anliegt, negativ bei Fehler.
 */
int se_hal_radio_receive(uint8_t *buffer, size_t capacity, uint32_t timeout_ms);

/**
 * Versucht eine Ortung. Rueckgabe 0 bei Erfolg.
 * Darf blockieren; der Alarm ist zu diesem Zeitpunkt schon unterwegs.
 */
int se_hal_gnss_fix(int32_t *latitude_e7, int32_t *longitude_e7, uint16_t *accuracy_meters,
                    uint32_t timeout_ms);

/** Unix-Zeit in Sekunden aus dem Mobilfunknetz, 0 wenn unbekannt. */
uint32_t se_hal_network_time(void);

#ifdef __cplusplus
}
#endif

#endif /* SAFEEXIT_BUTTON_HAL_H */
