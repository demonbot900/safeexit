# Businessplan SafeExit

**Mobiler Notfallknopf, Empfangsstation und lokales Hilfenetzwerk**

Gesamtfassung v4.0 – ersetzt alle vorherigen Dokumente

---

## 1. Die Geschäftsidee

SafeExit ist ein Sicherheitssystem aus drei Bausteinen:

**Der Knopf** – ein tragbares Notfallgerät mit eigener Mobilfunkverbindung und Satellitenortung. Ein Druck alarmiert hinterlegte Kontakte und Partnerbetriebe in der Umgebung und überträgt den Standort. Er funktioniert **ohne Smartphone**.

**Die Station** – ein quadratisches Empfangsgerät für Wand oder Regal. Es hängt am WLAN und schlägt bei einem Alarm laut und sichtbar an, ohne dass jemand aufs Handy schauen muss.

**Das Netzwerk** – Betriebe, die sich bereiterklären, Menschen in einer Notlage hereinzulassen und warten zu lassen, bis Hilfe eintrifft.

Der Knopf kostet 149 EUR, die Station 49 EUR, im Bundle 179 EUR. Die eingebaute SIM-Karte ist für zehn Jahre vorausbezahlt – **es entstehen keine monatlichen Pflichtkosten.**

Hardware, Software und Markenauftritt entwickeln wir vollständig selbst. Das ersetzt externe Entwicklungskosten von rund 133.000 EUR.

---

## 2. Das Problem

| Zielgruppe | Heutige Lösung | Warum sie versagt |
|---|---|---|
| Kinder 6–12 | Smartwatch oder nichts | an vielen Schulen untersagt, lenkt ab, braucht eigenen Tarif |
| Senioren unterwegs | Hausnotruf | funktioniert nur in der Wohnung |
| Alleinarbeitende | Diensthandy | muss bedient werden, oft außer Reichweite |
| Nächtlicher Heimweg | Sicherheits-Apps | erfordern sichtbares Bedienen des Telefons |

Die gemeinsame Lücke: Es fehlt eine unauffällige, sofortige Auslösung – und für Menschen ohne Smartphone fällt jede App-Lösung von vornherein aus.

**Warum jetzt:** Die Abschaltung der 2G- und 3G-Netze macht ältere Notrufgeräte unbrauchbar. LTE-M ist flächendeckend verfügbar. IoT-Tarife mit Einmalgebühr ermöglichen erstmals Geräte ganz ohne laufende Kosten.

---

## 3. Die Produkte

### 3.1 SafeExit Knopf

| Eigenschaft | Umsetzung |
|---|---|
| Mobilfunk | LTE-M (Cat-M1), vorzertifiziertes Modul, NB-IoT als Rückfall |
| Ortung | GNSS mit A-GPS, Zellortung als Rückfallebene |
| Nahbereich | Bluetooth – nutzt die Position eines Smartphones, falls vorhanden |
| SIM | fest verlötet, Tarif für zehn Jahre vorausbezahlt |
| Akku | 1.000 mAh, 3–4 Monate Bereitschaft, USB-C |
| Gehäuse | IP67, ca. 45 × 45 × 13 mm, 32 g |
| Bedienung | ein Taster, Vibrations- und LED-Rückmeldung |

Der Hybridbetrieb ist der technische Kern: Ist ein Smartphone in Reichweite, liegt die Position sofort und präzise vor. Ist keins da – Kind ohne Handy, leerer Akku, Telefon verloren – alarmiert das Gerät eigenständig.

### 3.2 SafeExit Station

| Eigenschaft | Umsetzung |
|---|---|
| Form | quadratisch, ca. 90 × 90 × 25 mm, Wandhalterung und Standfuß |
| Verbindung | WLAN, Einrichtung einmalig per App |
| Alarm | ca. 90 dB, roter LED-Ring, Display mit Name und Entfernung |
| Bedienung | ein großer Knopf: **„Ich komme"** und Stummschalten |
| Strom | externes USB-C-Netzteil, Pufferakku für 8 Stunden |
| Ausführungen | Home (49 EUR) und Partner (100 dB, robuster) |

**Die Quittierung ist die wichtigste Funktion des Systems.** Wer „Ich komme" drückt, sendet eine Rückmeldung an den Knopf der alarmierenden Person – dort vibriert es zweimal, die LED wird grün. Wer weiß, dass jemand reagiert hat, verhält sich anders als jemand, der nur hofft.

### 3.3 Die Rettungskette

| Stufe | Auslöser | Reaktion |
|---|---|---|
| 1 – Stiller Alarm | 1× drücken | Push, SMS und Stationen der Vertrauenskontakte, mit Standort |
| 2 – Netzwerkalarm | 2× drücken oder keine Reaktion nach 90 Sek. | zusätzlich Partnerbetriebe im Umkreis von 300 m |
| 3 – Notruf | 3 Sek. halten | Kontakte werden aufgefordert, 110 zu wählen |
| Entwarnung | PIN in der App | sofortige Entwarnung an alle |

Ein automatischer Notruf an die Leitstelle findet bewusst nicht statt. Fehlalarme würden dort Kapazitäten binden und das Verhältnis zu Polizei und Rettungsdiensten dauerhaft beschädigen.

### 3.4 Abgrenzung

SafeExit ist ein Alarmierungs- und Vermittlungssystem. Es ist ausdrücklich **kein Ersatz für den Notruf 110/112**, keine Leitstelle und keine Zusage einer Hilfeleistung. Das wird in AGB, App-Einrichtung und sämtlicher Werbung konsequent durchgehalten.

---

## 4. Zielgruppen

### 4.1 Reihenfolge des Markteintritts

**1. Kinder von 6 bis 12 (55 % der Erstjahresmenge).** Ein Neunjähriger hat kein Smartphone – jede App-Lösung fällt aus. Eltern entscheiden schnell und sind preisunempfindlich. Zugang über Elternvertretungen, Schulen, Familienportale.

**2. Senioren und Angehörige (30 %).** Käufer sind nicht die Senioren, sondern deren erwachsene Kinder. Der Hausnotruf endet an der Wohnungstür – der Weg nach draußen ist die Lücke. Zugang über Pflegeberatung, Sanitätshäuser, Apotheken.

**3. Alleinarbeitende, B2B (15 %).** Pflegedienste, Außendienst, Handwerk, Landwirtschaft. Längere Entscheidungswege, dafür Mehrfachbestellungen.

*Hinweis: Für Personen-Notsignal-Anlagen im arbeitsschutzrechtlichen Sinn gelten eigene Normanforderungen. Ohne Zertifizierung verkaufen wir eine ausdrücklich ergänzende Lösung.*

**4. Nächtlicher Heimweg** – später, über eine preisgünstigere Zweitvariante, sobald die Stückkosten unter 45 EUR liegen.

### 4.2 Marktgröße Deutschland

| Segment | Grundgesamtheit | Erreichbar |
|---|---|---|
| Kinder 6–12 | 4,6 Mio. | 690.000 |
| Senioren 70+, aktiv | 9,5 Mio. | 950.000 |
| Alleinarbeitende | 2,0 Mio. | 400.000 |
| Nächtliche Wege | 4,2 Mio. | 210.000 |
| **Erreichbarer Markt** | | **2,25 Mio.** |

Erreichbarer Anteil im dritten Jahr: 9.000 Geräte, entsprechend 0,4 %.

---

## 5. Nutzen und Alleinstellungsmerkmal

### 5.1 Kundennutzen

- Alarm ohne sichtbares Bedienen des Telefons
- Funktioniert vollständig **ohne Smartphone**
- **Keine monatlichen Kosten** – die SIM ist für zehn Jahre bezahlt
- Rückmeldung, dass jemand reagiert hat
- Hilfe aus der unmittelbaren Umgebung, nicht nur von weit entfernten Kontakten
- Standortdaten nur während eines Alarms, Löschung nach 24 Stunden, Server in Deutschland

### 5.2 Alleinstellungsmerkmal

**SafeExit ist das einzige Angebot, das ohne Smartphone funktioniert, ein lokales Hilfenetzwerk mitbringt und dabei keine laufenden Kosten verursacht.**

### 5.3 Der entscheidende Preisvergleich

Ein Hausnotruf kostet 25 bis 40 EUR im Monat, über fünf Jahre also 1.500 bis 2.400 EUR – und funktioniert nur in der Wohnung. Knopf und Station zusammen kosten einmalig 179 EUR. Dieses Verhältnis ist das stärkste Verkaufsargument des Unternehmens.

---

## 6. Markt und Wettbewerb

| Anbieter | Hardware | Ohne Smartphone | Netzwerk | Laufende Kosten | Preis |
|---|---|---|---|---|---|
| **SafeExit** | ja | **ja** | ja | **keine** | 149 EUR |
| SafeNow | nein | nein | ja (Zonen) | keine | kostenlos |
| Life360 | nein | nein | nein | Abo | Freemium |
| Hausnotruf (DRK, Johanniter) | ja | ja | Leitstelle | 25–40 EUR/Monat | plus Anschluss |
| Kinder-Smartwatches | ja | ja | nein | Tarif nötig | 100–200 EUR |
| Taschenalarm | ja | ja | nein | keine | 5–15 EUR |

**Ehrliche Einschränkung:** Im Segment des nächtlichen Heimwegs ist SafeNow etabliert und für Endnutzer kostenlos. Deshalb ist dieses Segment nicht unser Markteintritt. In den drei Segmenten, mit denen wir starten, gibt es keinen kostenlosen Wettbewerber.

**Geplante Partner:** lokale Betriebe mit Nachtöffnung, Taxiunternehmen, Sicherheitsdienste, Kommunen, Hochschulen.

**Beschaffung:** Elektronikfertigung in der EU, vorzertifizierte Funkmodule, Cloud-Infrastruktur in Deutschland.

---

## 7. Das Partnernetzwerk

### 7.1 Was ein Partner zusagt

Die Person hereinlassen und warten lassen, das Personal informieren, auf Wunsch 110 wählen. **Keine** Verpflichtung zum Eingreifen. Der Partnervertrag hält ausdrücklich fest, dass keine Garantenstellung und keine über § 323c StGB hinausgehende Pflicht entsteht.

### 7.2 Warum Betriebe mitmachen

Sichtbarkeit in der App, Türaufkleber als „Safe Point", Schutz der eigenen Mitarbeitenden, Nennung in der Pressearbeit. Die Basispartnerschaft ist **kostenlos** – ein leeres Netzwerk ist für keinen Betrieb 49 EUR wert. Bezahlt wird nur der betriebliche Eigennutzen im Paket „Safe Point Business" (49 EUR/Monat).

### 7.3 Die Station als Schlüssel

Das Netzwerk funktioniert nur, wenn Partner den Alarm bemerken. In einer Bar um ein Uhr nachts geht eine Push-Nachricht unter – ein Kasten an der Wand, der schrill wird und rot blinkt, nicht.

Deshalb erhält jeder Basispartner eine Station kostenlos. 22 EUR Material je Standort sind Marketingaufwand, und ein fest montiertes Gerät bindet stärker als jeder Vertrag.

### 7.4 Dichte vor Fläche

40 Partner in einer Stadt sind wertvoll. 400 über Deutschland verteilt sind wertlos. Erst eine Pilotstadt mit mindestens 40 Standorten, dann drei weitere nach demselben Muster, dann Skalierung über Ketten und Stadtverwaltungen.

---

## 8. Marketing – die 7 Ps

**1. Produktgestaltung.** Minimalistisch, ohne Sicherheitsästhetik – kein Gerät, das nach Medizintechnik aussieht. Farben Schwarz, Sand, Terrakotta. Fertigung bei zertifizierten Elektronikherstellern in der EU.

**2. Preis.**

| Angebot | Preis | Deckungsbeitrag |
|---|---|---|
| Knopf | 149 EUR | 77 EUR |
| Station Home | 49 EUR | 18 EUR |
| **Bundle Knopf + Station** | **179 EUR** | **78 EUR** |
| Premium-Abo (optional) | 4,99 EUR/Monat | 4,24 EUR |
| B2B ab 5 Geräten | 129 EUR/Gerät | 57 EUR |
| Safe Point Business | 49 EUR/Monat | 44 EUR |

**3. Vertriebskanäle.** Eigener Onlineshop (70 %), B2B-Direktvertrieb (15 %), Sanitätshäuser und Apotheken (10 %), Partnerbetriebe mit Provision (5 %).

**4. Kommunikation.** Social Media für Eltern und Angehörige, Mikro-Influencer, regionale Presse, Messen für Pflege und Bildung. Budget 30.000 EUR im ersten Jahr.

*Tonalität:* Selbstbestimmung, nicht Angst. „Geh, wann du willst." statt „Nachts allein? Gefährlich." Werbung mit Angst funktioniert kurzfristig und beschädigt die Marke dauerhaft.

**5. People.** Geschultes Partnerpersonal, verifizierte Helfer, Support innerhalb von 24 Stunden. Beirat aus Polizei, Beratungsstelle und Datenschutzexpertise.

**6. Process.** Erste Benachrichtigung unter 3 Sekunden, Verfügbarkeit 99,9 %, Versand in 48 Stunden, monatliche Netzwerkkontrolle mit Testalarmen.

**7. Physical Evidence.** Türaufkleber der Partner, sichtbare Station hinter dem Tresen, Karte aller Safe Points in der App, Testalarm-Funktion für Nutzer, jährlicher Transparenzbericht.

---

## 9. Recht und Regulierung

| Bereich | Kosten |
|---|---|
| CE, Funkrichtlinie (RED), EMV – Knopf | 12.000–18.000 EUR |
| Akkutransport UN 38.3 | 2.500–4.000 EUR |
| Netzbetreiberfreigabe (modulabhängig) | 0–8.000 EUR |
| CE und EMV – Station | 6.000–9.000 EUR |
| ElektroG, Batteriegesetz, Verpackungsgesetz | ca. 900 EUR |
| DSGVO: Folgenabschätzung, externer Datenschutzbeauftragter | 3.000 EUR/Jahr |
| Produkthaftpflicht, 5 Mio. EUR Deckung | ab 1.200 EUR/Jahr |
| Markenanmeldung DPMA | 290 EUR |
| Rechtsberatung IT-Recht | 800–1.500 EUR |

**Rechtsform: UG (haftungsbeschränkt)**, später GmbH. Bei einem Sicherheitsprodukt ist die Haftungsbeschränkung nicht optional.

**Datenschutz als Produktmerkmal:** Standortdaten nur während eines aktiven Alarms, Löschung nach 24 Stunden, keine dauerhafte Ortung, Server ausschließlich in Deutschland. Im Segment Kinder ist das ein eigenständiges Verkaufsargument gegenüber Ortungsuhren.

**Zwei Funktionen entfallen bewusst:** Eine dauerhafte Bewegungshistorie wäre ein Kontrollinstrument und würde gegen genau die Menschen verwendet, die wir schützen wollen. Eine Audioaufnahme im Alarmfall verstößt gegen § 201 StGB.

**Keine gesundheitsbezogenen Funktionen oder Aussagen** – sonst greifen die Anforderungen der Medizinprodukteverordnung.

---

## 10. Technik

**Architektur:** Knopf (LTE-M, GNSS, Bluetooth) → verschlüsselte Übertragung → Backend in Deutschland → Push, SMS, Stationen, Partner-App.

### Technologie-Stack

| Baustein | Technologie |
|---|---|
| Mobile App (iOS und Android) | Dart / Flutter |
| Webseite und Shop | TypeScript / Next.js |
| Backend | TypeScript / NestJS |
| Datenbank | PostgreSQL |
| Firmware Knopf | C/C++ |
| Firmware Station | C/C++ |

Eine gemeinsame Sprache für Web und Backend sowie eine einzige App-Codebasis für beide Plattformen halten den Entwicklungsaufwand klein – das ist die Voraussetzung dafür, dass ein Team dieser Größe zwei Hardwareprodukte und eine App gleichzeitig tragen kann.

**Drei Punkte, die bei einem Notfallsystem früh geklärt werden müssen:**

*Kritische Benachrichtigungen auf iOS.* Damit ein Alarm den Stummschaltmodus und den Fokus durchbricht, ist bei Apple eine gesonderte Berechtigung erforderlich, die eigens beantragt werden muss. Sie wird nur für echte Sicherheitsanwendungen erteilt. Ohne sie geht ein nächtlicher Alarm auf einem stummgeschalteten iPhone unter. **Antrag früh stellen – die Bearbeitung dauert.**

*Alarmpfad getrennt vom Hauptsystem.* Die Zustellung eines Alarms darf nicht davon abhängen, dass Shop, Kontoverwaltung oder Statistik fehlerfrei laufen. Der Alarmdienst wird als eigener, minimaler Dienst mit eigener Überwachung betrieben.

*Bluetooth im Hintergrund.* Die Kopplung zum Knopf erfordert plattformspezifischen Code außerhalb von Flutter. Das ist üblich und beherrschbar, aber einzuplanen.

| Technisches Risiko | Behandlung |
|---|---|
| Standort nach dem Aufwachen zu langsam | A-GPS, sofortiger Alarm ohne Position, Nachreichen, Zellortung als Rückfall |
| Spannungseinbruch bei Sendestromspitzen | Pufferung auf 500 mA Spitzenstrom ausgelegt |
| Akkulaufzeit unter Zusage | Energiemessung ab Tag 1, Zusage konservativ kommunizieren |
| Netzabdeckung im ländlichen Raum | LTE-M statt NB-IoT wegen Mobilitätsunterstützung |
| Funkzulassung nicht bestanden | vorzertifiziertes Modul, Vorabmessung vor der offiziellen Prüfung |

**Kostensparend bei der Station:** externes zertifiziertes Netzteil beilegen statt einbauen – das erspart die gesamte Netzspannungsprüfung. Erste 500 Stück im Standardgehäuse, eigenes Spritzgusswerkzeug erst ab 2.000 Stück.

---

## 11. Kalkulation

### 11.1 Stückkosten Knopf

| Position | 1.500 Stk. | 10.000 Stk. |
|---|---|---|
| Material und Fertigung | 52,00 EUR | 36,00 EUR |
| eSIM mit 10-Jahres-Tarif | 11,00 EUR | 9,00 EUR |
| **Herstellkosten** | **63,00 EUR** | **45,00 EUR** |
| **Deckungsbeitrag bei 149 EUR** | **77,00 EUR** | **97,00 EUR** |

### 11.2 Stückkosten Station

| Position | 500 Stk. | 5.000 Stk. |
|---|---|---|
| **Herstellkosten** | **26,00 EUR** | **19,00 EUR** |
| **Deckungsbeitrag bei 49 EUR** | **18,00 EUR** | **26,00 EUR** |

### 11.3 Kennzahlen je Kunde

| Kennzahl | Wert |
|---|---|
| Deckungsbeitrag Knopf | 77 EUR |
| Deckungsbeitrag Station (35 % Anhängequote) | 6 EUR |
| Abo-Beitrag (30 % Conversion, 24 Monate) | 30 EUR |
| **Kundenwert** | **113 EUR** |
| Zielwert Akquisekosten | unter 35 EUR |
| **Verhältnis** | **3,2** |

Der Hardwareverkauf deckt die Akquisekosten sofort. Das Abonnement ist Zusatzertrag, keine Voraussetzung für die Rentabilität.

---

## 12. Finanzplanung

### 12.1 Ergebnisrechnung

| | Jahr 1 | Jahr 2 | Jahr 3 |
|---|---|---|---|
| Verkaufte Knöpfe | 1.200 | 4.000 | 9.000 |
| Verkaufte Stationen | 420 | 1.800 | 4.500 |
| Umsatz Knöpfe | 178.800 EUR | 596.000 EUR | 1.341.000 EUR |
| Umsatz Stationen | 20.600 EUR | 88.200 EUR | 220.500 EUR |
| Abonnements (netto) | 7.600 EUR | 71.000 EUR | 193.400 EUR |
| B2B | 7.400 EUR | 60.600 EUR | 176.900 EUR |
| **Umsatz** | **214.400 EUR** | **815.800 EUR** | **1.931.800 EUR** |
| Wareneinsatz und Nebenkosten | –100.400 EUR | –300.500 EUR | –606.800 EUR |
| **Rohertrag** | **114.000 EUR** | **515.300 EUR** | **1.325.000 EUR** |
| Personal | –69.600 EUR | –230.000 EUR | –480.000 EUR |
| Marketing | –30.000 EUR | –100.000 EUR | –200.000 EUR |
| Infrastruktur | –9.000 EUR | –24.000 EUR | –48.000 EUR |
| Recht, Versicherung, Verwaltung | –21.400 EUR | –36.000 EUR | –72.000 EUR |
| **Ergebnis** | **–16.000 EUR** | **+125.300 EUR** | **+525.000 EUR** |
| Mitarbeitende (Vollzeitäquivalente) | 2,5 | 5 | 9 |

Kumuliertes Ergebnis nach drei Jahren: **+634.300 EUR**

### 12.2 Break-even

Fixkosten Jahr 1: 130.000 EUR, entsprechend 10.833 EUR monatlich. Bei 83 EUR Deckungsbeitrag je Kunde liegt die Gewinnschwelle bei **131 Verkäufen pro Monat**, erwartet ab Monat 9 des ersten Verkaufsjahres.

### 12.3 Szenarien

| | Konservativ | Plan | Optimistisch |
|---|---|---|---|
| Knöpfe Jahr 1 | 700 | 1.200 | 1.900 |
| Umsatz Jahr 1 | 124.000 EUR | 214.000 EUR | 340.000 EUR |
| Ergebnis Jahr 1 | –56.000 EUR | –16.000 EUR | +30.000 EUR |
| Break-even | Monat 20 | Monat 9 | Monat 5 |

Im konservativen Fall: Marketingbudget halbieren, zweite Produktionscharge verschieben, Schwerpunkt auf B2B mit Mehrfachbestellungen.

---

## 13. Kapitalbedarf und Finanzierung

### 13.1 Mittelverwendung

| Position | Betrag |
|---|---|
| Zertifizierung Knopf (CE, RED, EMV, UN 38.3, Netzfreigabe) | 28.000 EUR |
| Zertifizierung Station | 7.500 EUR |
| Spritzgusswerkzeug Knopf | 18.000 EUR |
| Erstserie 1.500 Knöpfe | 94.500 EUR |
| Erstserie 500 Stationen | 13.000 EUR |
| Material für Entwicklung, Prototypen, Feldtest | 17.500 EUR |
| Recht, Datenschutz, Versicherung, Gründung | 12.000 EUR |
| Marketing bis zur Gewinnschwelle | 30.000 EUR |
| Liquiditätsreserve (6 Monate) | 22.500 EUR |
| **Gesamt** | **243.000 EUR** |

**Kein Euro fließt in Entwicklungsdienstleistungen.** Ein vergleichbares Vorhaben mit externer Entwicklung benötigt an dieser Stelle über 370.000 EUR.

### 13.2 Finanzierung

| Quelle | Betrag |
|---|---|
| Eigenleistung der Gründer (Entwicklung, bewertet) | 133.000 EUR |
| Crowdfunding und Vorbestellungen | 80.000 EUR |
| Öffentliche Förderung und Mikromezzanine | 50.000 EUR |
| Beteiligung oder Förderkredit | 120.000 EUR |
| **Finanzierung ohne Eigenleistung** | **250.000 EUR** |

### 13.3 Die erste Hürde

Vor allem anderen steht ein sehr viel kleinerer Betrag: **rund 1.500 bis 4.000 EUR** für Entwicklungsboards, Messgerät, Feldtestgeräte und 3D-gedruckte Gehäuse. Ohne funktionsfähigen Prototyp gibt es keine Crowdfunding-Kampagne, ohne Kampagne keine weitere Finanzierung.

Wege dorthin ohne Eigenkapital: Gründerwettbewerbe mit Preisgeld, Bauteil-Sponsoring direkt bei Herstellern, Mikrokreditfonds, Landesförderung, Laborzugang über Hochschule oder FabLab statt Gerätekauf.

---

## 14. Fahrplan

| Monat | Schritt | Erfolgskriterium |
|---|---|---|
| 1–2 | Gründung vorbereiten, Markenrecherche, Pilotstadt festlegen | Name rechtlich frei |
| 1–2 | Nachfragetest: Landingpage, 500 EUR Anzeigen, Preis 149 EUR | über 300 Vormerkungen |
| 2–3 | 40 Betriebe besuchen, Absichtserklärungen einholen | 15 Unterschriften |
| 2–4 | Funktionsprototyp auf Entwicklungsplattform | Knopfdruck löst Alarm aus |
| 4–6 | Feldtest mit 20 Geräten über vier Wochen | Tragequote über 70 % |
| 4–5 | UG gründen, Rechtsberatung, Marke anmelden | Gesellschaft eingetragen |
| 6–9 | Eigene Leiterplatte, drei Entwurfsrunden, Fertigungsangebote | Muster in Zielgröße |
| 9–11 | Crowdfunding-Kampagne | 80.000 EUR |
| 10–12 | Förderung und Beteiligung abschließen | Finanzierung steht |
| 12–15 | Zertifizierung Knopf, Werkzeugbau | CE-Konformität erklärt |
| 15–16 | Nullserie 50 Stück prüfen | Qualitätsfreigabe |
| 15–17 | Entwicklung und Zertifizierung Station | – |
| 16–17 | Erstserie, Auslieferung an Unterstützer | 1.500 Knöpfe |
| **18** | **Marktstart in der Pilotstadt** | 40 Partnerstandorte aktiv |
| 19 | Station als Bundle im Verkauf | – |
| 27 | Gewinnschwelle | positives Monatsergebnis |

---

## 15. Risiken

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Zertifizierung nicht im ersten Anlauf bestanden | 2–3 Monate, 8.000 EUR | vorzertifiziertes Modul, Vorabmessung, Puffer |
| **Zwei Hardwareprodukte gleichzeitig** | **Projekt bleibt stecken** | Station erst nach bestandener Prüfung des Knopfs |
| Netzwerk bleibt zu dünn | Alleinstellungsmerkmal entwertet | Dichte vor Fläche, Marktstart erst ab 40 Standorten |
| Akkulaufzeit unter Zusage | Produktversprechen betroffen | Energiemessung ab Tag 1, konservative Angabe |
| Fehlalarme zerstören Reaktionsbereitschaft | Netzwerk stirbt | zweistufige Auslösung, PIN-Entwarnung, Ziel unter 5 % |
| Lieferengpass beim Funkmodul | Produktionsstopp | Zweitquelle definiert, Sicherheitsbestand |
| Produkthaftungsfall | existenzbedrohend | Versicherung, UG, lückenlose Dokumentation |
| Datenschutzvorfall | Vertrauensverlust | Datenminimierung, EU-Hosting, externe Prüfung vor Start |
| Alarm ausgelöst, niemand hilft – negative Presse | Reputationsschaden | Erwartungsmanagement von Anfang an, keine Hilfegarantie |

---

## 16. Kennzahlen zur Steuerung

| Kennzahl | Zielwert Jahr 1 |
|---|---|
| Aktivierungsquote (gekauft → eingerichtet) | über 85 % |
| Anhängequote Station | über 35 % |
| Premium-Conversion | über 30 % |
| Monatliche Kündigungsquote | unter 3 % |
| Partner je Pilotstadt | über 40 |
| Reaktionszeit Netzwerkalarm | unter 60 Sekunden |
| Fehlalarmquote | unter 5 % |
| Akquisekosten je Kunde | unter 35 EUR |

---

## 17. Team

| Rolle | Name | Verantwortung |
|---|---|---|
| Geschäftsführung, Vertrieb | *(eintragen)* | Partner, Finanzierung, B2B |
| Hardware und Firmware | *(eintragen)* | Schaltung, Layout, Energiemanagement |
| Software | *(eintragen)* | App, Backend, Infrastruktur |
| Marke und Marketing | *(eintragen)* | Gestaltung, Kampagnen, Community |

Schreibt zu jeder Person drei bis vier Sätze und belegt sie – mit einem Projekt, einem Repository, einem gebauten Gerät. Keine Eigenschaftswörter, nur Belege.

**Beirat (anzufragen):** Polizei oder Präventionsarbeit, Datenschutzexpertise, Elektronikfertigung, Pflegewirtschaft.

**Bekannte Lücke:** Hochfrequenztechnik und Serienreife. Lösung über Beirat oder Beratung auf Stundenbasis; das vorzertifizierte Modul senkt den Anspruch erheblich.

---

## 18. Anhänge

1. Produktskizze Knopf und Station *(anzufertigen – von der Aufgabenstellung gefordert)*
2. Logo
3. Auswertung des Nachfragetests
4. Liste der Partnerbetriebe mit Absichtserklärungen
5. Feldtestergebnisse
6. Stückliste und Fertigungsangebote
7. Monatliche Finanzplanung über 36 Monate
