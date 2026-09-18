# 0004 – Module für Knopf und Station

**Stand: offen.** Diese Notiz hält fest, was die Entscheidung bestimmt, damit sie nicht
nebenbei getroffen wird.

## Was feststeht

Aus dem Businessplan: LTE-M (Cat-M1) mit NB-IoT als Rückfall, GNSS mit A-GPS, Bluetooth für die
Position eines Telefons in der Nähe, fest verlötete SIM, **vorzertifiziertes Funkmodul**. Für die
Station ein WLAN-Mikrocontroller der ESP32-Klasse, ebenfalls vorzertifiziert.

Das vorzertifizierte Modul ist nicht verhandelbar: Es senkt die Zertifizierungskosten und gleicht
die bekannte Lücke im Team bei Hochfrequenztechnik aus (Businessplan 17).

## Wonach entschieden wird

1. Vorzertifizierung vorhanden und in der EU verwendbar
2. Stromaufnahme im Bereitschaftsmodus (bestimmt die 3–4 Monate Laufzeit)
3. Zeit vom Aufwachen bis zum ersten GNSS-Fix, mit und ohne A-GPS
4. Zweite Bezugsquelle (Businessplan 15: Lieferengpass beim Funkmodul)
5. Stückkosten bei 1.500 und bei 10.000 Stück gegen die Kalkulation (52 EUR bzw. 36 EUR)
6. Qualität der Entwicklungsumgebung — davon hängt ab, wie schnell zwei Personen vorankommen

## Warum es noch nicht entschieden ist

Ohne Messung an echten Entwicklungsboards wäre es geraten. Der Fahrplan sieht dafür Monat 2 bis 4
vor, und der Kapitalbedarf dafür ist klein (1.500 bis 4.000 EUR, Businessplan 13.3).

## Was bis dahin gilt

Die Fachlogik in `firmware/` bleibt frei von jedem Hersteller-SDK. Die Plattform wird über
`button_hal.h` und `station_hal.h` angebunden. Fällt die Wahl anders aus als gedacht, ändert das
die Treiber, nicht die Zustandsautomaten — und die Tests laufen weiter.
