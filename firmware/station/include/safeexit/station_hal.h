/*
 * Was die Station von ihrer Plattform braucht.
 * Ohne Umsetzung; die kommt fuer das gewaehlte Modul nach station/drivers.
 */
#ifndef SAFEEXIT_STATION_HAL_H
#define SAFEEXIT_STATION_HAL_H

#include <stddef.h>
#include <stdint.h>

#include "safeexit/station_state.h"

#ifdef __cplusplus
extern "C" {
#endif

uint32_t se_station_hal_uptime_ms(void);

/** Ton an oder aus. Im Produkt rund 90 dB, bei der Partnerfassung 100 dB. */
void se_station_hal_sound(int on);

void se_station_hal_led_ring(se_station_led_t color);

/** Zeile im Display, etwa "Mia, 9 Jahre - 120 m". */
void se_station_hal_display(const char *line);

/** Pegel des grossen Knopfs. */
int se_station_hal_button_pressed(void);

/** 1, wenn die Station gerade auf dem Pufferakku laeuft. */
int se_station_hal_on_battery(void);

/** Sendet eine JSON-Nachricht ans Backend. Rueckgabe 0 bei Erfolg. */
int se_station_hal_send(const char *json, size_t length);

#ifdef __cplusplus
}
#endif

#endif /* SAFEEXIT_STATION_HAL_H */
