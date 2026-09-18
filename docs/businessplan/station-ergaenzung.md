# Businessplan SafeExit Station

**Das quadratische Empfangsgerät – Alarm hören, ohne ans Handy gebunden zu sein**

*Ergänzung zum Businessplan SafeExit v3.0*

---

## 1. Die Idee

Der SafeExit-Knopf löst den Alarm aus. Die **SafeExit Station** empfängt ihn – laut, sichtbar und ohne dass jemand aufs Handy schauen muss.

Ein quadratisches Gerät für Wand oder Regal. Es hängt am WLAN, ist dauerhaft mit Strom versorgt und schlägt an, sobald ein Alarm eingeht: lauter Ton, rotes Blinklicht, Anzeige, wer Hilfe braucht und wie weit entfernt.

Eingerichtet wird es einmalig per Smartphone. Danach läuft es eigenständig.

---

## 2. Warum das Gerät gebraucht wird

### 2.1 Es rettet das Partnernetzwerk

Das ist der wichtigste Punkt des gesamten Konzepts.

Das Partnernetzwerk ist unser Alleinstellungsmerkmal – aber es funktioniert nur, wenn Partner den Alarm **bemerken**. In einer Bar um ein Uhr nachts geht eine Push-Nachricht auf dem Handy des Personals unter. Das Handy liegt im Büro, ist lautlos, steckt in der Schürze.

Ein Kasten an der Wand, der schrill wird und rot blinkt, geht nicht unter.

Ohne die Station ist das Netzwerk ein Versprechen. Mit ihr ist es ein System.

### 2.2 Zuhause

Eltern bekommen den Alarm ihres Kindes mit, während sie kochen, im Garten sind oder schlafen. Das Handy liegt irgendwo – die Station steht in der Küche und im Flur.

### 2.3 Quittierung – die Funktion, die den Unterschied macht

Ein Knopf auf der Station: **„Ich komme."**

Wer ihn drückt, sendet eine Rückmeldung an das Gerät der alarmierenden Person. Dort vibriert es zweimal und die LED wird grün.

Wer in einer Notlage weiß, dass jemand reagiert hat, verhält sich anders als jemand, der nur hofft. Diese Funktion kostet in der Herstellung nichts und ist emotional das Wertvollste am ganzen System.

---

## 3. Produkt

### 3.1 Aufbau

| Eigenschaft | Umsetzung |
|---|---|
| Form | quadratisch, ca. 90 × 90 × 25 mm |
| Montage | Wandhalterung oder Standfuß, beides im Lieferumfang |
| Verbindung | WLAN (2,4 GHz), Einrichtung per Bluetooth und App |
| Alarmton | ca. 90 dB, unterscheidbare Tonfolgen je Alarmstufe |
| Optik | roter LED-Ring, umlaufend, auch aus dem Augenwinkel sichtbar |
| Anzeige | kleines Display: Name, Entfernung, Uhrzeit |
| Bedienung | ein großer Knopf: Quittieren und Stummschalten |
| Strom | USB-C-Netzteil (extern, zertifiziert) |
| Notstrom | Pufferakku, ca. 8 Stunden bei Stromausfall |
| Optional | eigener SOS-Knopf auf der Rückseite – macht die Station zum stationären Notrufgerät |

### 3.2 Zwei Ausführungen

| | **Station Home** | **Station Partner** |
|---|---|---|
| Zielgruppe | Familien, Angehörige | Partnerbetriebe |
| Lautstärke | 90 dB | 100 dB, Gehäuse robuster |
| Reichweitenfilter | nur eigene Kontakte | Alarme im Umkreis von 300 m |
| Preis | 49 EUR | 79 EUR, im Business-Paket enthalten |

**Die Station Partner wird an Basispartner kostenlos abgegeben.** Materialkosten von 22 EUR je Standort sind Marketingaufwand – und ein fest an der Wand montiertes Gerät bindet den Partner stärker als jeder Vertrag.

---

## 4. Warum das Gerät günstig und schnell zu bauen ist

Im Vergleich zum Mobilfunkknopf ist die Station technisch anspruchslos:

| | Knopf (LTE-M) | Station (WLAN) |
|---|---|---|
| Funktechnik | Mobilfunk, HF-Entwurf anspruchsvoll | WLAN-Modul, Standardanwendung |
| Energiemanagement | kritisch, Monate Batterielaufzeit | unkritisch, Dauerstrom |
| Ortung | GNSS, aufwendig | keine |
| SIM und Konnektivität | notwendig | keine |
| Zertifizierung | 28.000 EUR | 6.000–9.000 EUR |
| Entwicklungsdauer | 10–11 Monate | 3–4 Monate |

**Zwei Kostenhinweise:**

Das Netzteil wird **nicht** eingebaut. Ein externes, bereits zertifiziertes USB-C-Netzteil beizulegen erspart die gesamte Prüfung zur Netzspannungssicherheit. Das spart mehrere tausend Euro und Monate.

Für die ersten 500 Stück kommt ein **Standardgehäuse** zum Einsatz, nicht ein eigenes Spritzgusswerkzeug. Eigenes Werkzeug erst ab 2.000 Stück – das verschiebt 12.000 EUR aus der Anlaufphase nach hinten.

---

## 5. Kalkulation

### 5.1 Stückkosten

| Position | 500 Stück | 5.000 Stück |
|---|---|---|
| WLAN-Mikrocontroller (ESP32-Klasse, vorzertifiziert) | 3,00 EUR | 2,30 EUR |
| Lautsprecher und Verstärker | 3,20 EUR | 2,40 EUR |
| LED-Ring und Treiber | 1,60 EUR | 1,10 EUR |
| Display | 2,40 EUR | 1,70 EUR |
| Pufferakku und Ladeschaltung | 2,80 EUR | 2,20 EUR |
| Taster, Kleinteile, Passive | 1,80 EUR | 1,30 EUR |
| Leiterplatte und Bestückung | 3,50 EUR | 2,40 EUR |
| Gehäuse und Wandhalterung | 3,20 EUR | 2,20 EUR |
| USB-C-Netzteil (beiliegend) | 2,50 EUR | 1,90 EUR |
| Verpackung, Test, Fertigermarge | 2,00 EUR | 1,50 EUR |
| **Herstellkosten** | **26,00 EUR** | **19,00 EUR** |

### 5.2 Deckungsbeiträge

| Produkt | Preis | Herstellkosten | Nebenkosten | **Deckungsbeitrag** |
|---|---|---|---|---|
| Station Home | 49 EUR | 26 EUR | 5 EUR | **18 EUR** |
| Station Home ab Jahr 2 | 49 EUR | 19 EUR | 4 EUR | **26 EUR** |
| Station Partner (Verkauf) | 79 EUR | 28 EUR | 5 EUR | **46 EUR** |
| Bundle: Knopf + Station | 179 EUR | 89 EUR | 12 EUR | **78 EUR** |

**Das Bundle ist der wichtigste Artikel.** 179 EUR statt 198 EUR bei Einzelkauf, und fast jeder Käufer nimmt es – die Station macht den Knopf erst vollständig.

---

## 6. Absatzplanung

Grundlage ist die Anhängequote: Wie viele Knopfkäufer nehmen eine Station dazu?

| | Jahr 1 | Jahr 2 | Jahr 3 |
|---|---|---|---|
| Verkaufte Knöpfe | 1.200 | 4.000 | 9.000 |
| Anhängequote | 35 % | 45 % | 50 % |
| **Verkaufte Stationen** | **420** | **1.800** | **4.500** |
| Umsatz Stationen | 20.580 EUR | 88.200 EUR | 220.500 EUR |
| Deckungsbeitrag | 7.560 EUR | 46.800 EUR | 139.500 EUR |
| Kostenlose Partnergeräte | 40 | 120 | 300 |
| Materialaufwand dafür | –1.040 EUR | –2.280 EUR | –5.700 EUR |

---

## 7. Auswirkung auf den Gesamtplan

| | Jahr 1 | Jahr 2 | Jahr 3 |
|---|---|---|---|
| Umsatz bisher (nur Knopf, Abo, B2B) | 193.800 EUR | 727.600 EUR | 1.711.300 EUR |
| **plus Stationen** | **20.600 EUR** | **88.200 EUR** | **220.500 EUR** |
| **Umsatz neu** | **214.400 EUR** | **815.800 EUR** | **1.931.800 EUR** |
| Rohertrag neu | 114.000 EUR | 515.300 EUR | 1.325.000 EUR |
| **Ergebnis neu** | **–16.000 EUR** | **+125.300 EUR** | **+525.000 EUR** |
| Ergebnis bisher | –22.600 EUR | +80.800 EUR | +391.200 EUR |

Die Station verbessert das Ergebnis im dritten Jahr um rund 134.000 EUR – bei geringem zusätzlichem Risiko, weil sie technisch einfach ist.

### Kapitalbedarf

| Position | Betrag |
|---|---|
| Kapitalbedarf bisher | 220.000 EUR |
| Material Entwicklung und Prototypen Station | +2.500 EUR |
| Zertifizierung Station (RED, EMV) | +7.500 EUR |
| Erstserie 500 Stationen | +13.000 EUR |
| **Kapitalbedarf neu** | **243.000 EUR** |

Spritzgusswerkzeug für die Station fällt erst ab der zweiten Serie an und wird dann aus dem laufenden Geschäft finanziert.

---

## 8. Was zusätzlich möglich wird

**Ersatz für den Hausnotruf.** Mit dem optionalen SOS-Knopf auf der Rückseite ist die Station ein stationäres Notrufgerät für die Wohnung. Zusammen mit dem mobilen Knopf deckt SafeExit damit ab, wofür Hausnotrufanbieter 25 bis 40 EUR monatlich verlangen – zu einem einmaligen Preis von 198 EUR. Das ist ein eigenes Verkaufsargument im Seniorensegment.

**Mehrere Stationen je Haushalt.** Küche, Schlafzimmer, Werkstatt. Die zweite Station ist reiner Zusatzumsatz ohne Akquisekosten.

**Sichtbarkeit beim Partner.** Ein Gerät an der Wand hinter dem Tresen erklärt jedem Gast ohne Worte, was ein Safe Point ist. Das ersetzt Werbung.

---

## 9. Risiken

| Risiko | Bewertung | Gegenmaßnahme |
|---|---|---|
| **Zwei Hardwareprodukte gleichzeitig überfordern das Team** | **hoch** | Station erst entwickeln, wenn der Knopf die Zertifizierung bestanden hat. Nicht parallel. |
| Anhängequote unter 35 % | mittel | Bundle-Preis aggressiv setzen; Station im Kaufprozess als Standard vorauswählen |
| WLAN-Einrichtung überfordert ältere Nutzer | hoch | Einrichtung über die App des Angehörigen, nicht des Nutzers; Ersteinrichtung optional durch uns per Fernzugriff |
| Fehlalarme in Betrieben um 3 Uhr nachts | mittel | Zweistufige Auslösung, PIN-Entwarnung, Stummschaltung für 60 Sekunden |
| Stromausfall oder WLAN-Ausfall beim Partner | mittel | Pufferakku, Statusmeldung an uns bei Offline-Zustand über 24 Stunden |

**Zum ersten Punkt, deutlich:** Zwei Hardwareprodukte parallel zu entwickeln ist der häufigste Grund, warum kleine Teams keins von beiden fertig bekommen. Die Station ist technisch einfach – aber sie kostet trotzdem Zertifizierung, Fertigerauswahl, Support und Aufmerksamkeit. Entwickelt sie, sobald der Knopf durch die Prüfung ist, und nicht davor.

---

## 10. Zeitplan

| Monat | Schritt |
|---|---|
| 12–15 | Knopf in Zertifizierung – Station als Nebenprojekt entwerfen, Bauteile bestellen |
| 15–17 | Prototyp Station, Firmware, App-Anbindung |
| 17–19 | Zertifizierung Station, Erstserie 500 Stück im Standardgehäuse |
| **19** | **Markteinführung als Bundle mit dem Knopf** |
| ab 22 | Partnerbetriebe flächendeckend mit Station ausstatten |
| ab Jahr 2 | eigenes Spritzgusswerkzeug ab 2.000 Stück |
