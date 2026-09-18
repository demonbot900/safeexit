> **Hinweis an das Gründungsteam – vor Versand entfernen**
>
> Dieses Dokument ist vollständig bis auf zwei Stellen, die niemand außer euch ausfüllen kann: **Abschnitt 10 (Team)** und die Traktionszahlen in Abschnitt 1. Ohne diese beiden ist es kein investorenfertiger Plan, sondern eine gute Vorlage. Investoren in dieser Phase finanzieren nicht die Idee, sondern die Menschen und den Nachweis, dass jemand das Produkt will.
>
> Schickt den Plan **nicht** vor Abschluss der Crowdfunding-Kampagne heraus. Die Kampagne ist euer Verhandlungshebel.

---

# Businessplan SafeExit

**Mobiler Notfallknopf mit eigenständiger Mobilfunkverbindung**

Version 3.0 – investorenfertige Fassung

| | |
|---|---|
| Unternehmen | SafeExit UG (haftungsbeschränkt) i. Gr. |
| Sitz | *(Ort eintragen)* |
| Kontakt | *(E-Mail, Telefon)* |
| Kapitalbedarf gesamt | 220.000 EUR |
| **Beteiligungsangebot** | **120.000 EUR für 15 %** |
| Stand | *(Datum)* |

---

## 1. Executive Summary

**Das Problem.** Wer sich unterwegs bedroht fühlt, hat heute drei Möglichkeiten: den Notruf wählen, eine App öffnen oder jemanden anrufen. Alle drei erfordern, das Smartphone herauszuholen und sichtbar zu bedienen – genau das, was eine bedrohliche Situation eskalieren lässt. Und für Menschen ohne Smartphone, insbesondere Kinder und viele Senioren, fällt jede dieser Optionen von vornherein aus.

**Die Lösung.** SafeExit ist ein tragbarer Notfallknopf mit eigener Mobilfunkverbindung und Satellitenortung. Ein Druck alarmiert hinterlegte Vertrauenskontakte und Partnerbetriebe in der Umgebung, überträgt den Standort und funktioniert vollständig **ohne Smartphone**. Die verbaute SIM-Karte ist für zehn Jahre vorausbezahlt – es entstehen keine monatlichen Pflichtkosten.

**Der Markt.** Wir starten in drei Segmenten, in denen es keine kostenlose Alternative gibt: Kinder von 6 bis 12 Jahren, Senioren außerhalb der eigenen Wohnung und Alleinarbeitende. Der Referenzpreis in diesen Segmenten ist der Hausnotruf mit 25 bis 40 EUR monatlich. Dagegen sind 149 EUR einmalig günstig.

**Das Geschäftsmodell.** Hardwareverkauf zu 149 EUR bei 63 EUR Herstellkosten, optionales Premium-Abonnement und B2B-Lizenzen für Partnerbetriebe. Deckungsbeitrag je Gerät: 77 EUR.

**Der Stand.** *(Hier eure realen Zahlen eintragen – Beispiel:)* Funktionsfähiger Prototyp seit *(Monat)*. *(Zahl)* Vorbestellungen aus der Crowdfunding-Kampagne, entsprechend *(Betrag)* EUR. *(Zahl)* unterschriebene Absichtserklärungen von Partnerbetrieben in *(Stadt)*. *(Zahl)* Personen auf der Warteliste.

**Das Team.** Drei Gründer, die Hardware, Software und Markenauftritt vollständig selbst entwickeln. Diese Eigenleistung ersetzt externe Entwicklungskosten von rund 133.000 EUR und senkt den Kapitalbedarf gegenüber einem vergleichbaren Vorhaben um mehr als ein Drittel.

**Die Zahlen.**

| | Jahr 1 | Jahr 2 | Jahr 3 |
|---|---|---|---|
| Verkaufte Geräte | 1.200 | 4.000 | 9.000 |
| Umsatz | 194.000 EUR | 728.000 EUR | 1.711.000 EUR |
| Rohertrag | 107.000 EUR | 471.000 EUR | 1.191.000 EUR |
| Ergebnis | –23.000 EUR | +81.000 EUR | +391.000 EUR |

**Das Angebot.** 120.000 EUR für 15 % der Anteile. Die Mittel fließen ausschließlich in Zertifizierung, Spritzgusswerkzeug und die Erstserie – nicht in Entwicklung, denn die erbringen wir selbst.

---

## 2. Problem

### 2.1 Die Lücke im Markt

| Zielgruppe | Aktuelle Lösung | Warum sie nicht funktioniert |
|---|---|---|
| Kinder 6–12 | Kinder-Smartwatch oder nichts | Smartwatches sind an vielen Schulen untersagt, lenken ab, brauchen einen eigenen Tarif und sind sichtbare Wertgegenstände |
| Senioren unterwegs | Hausnotruf | Funktioniert nur in der Wohnung. Der Weg nach draußen ist ungeschützt |
| Alleinarbeitende | Diensthandy | Muss bedient werden, oft in der Jacke, im Fahrzeug oder außer Reichweite |
| Nächtlicher Heimweg | Sicherheits-Apps | Erfordern sichtbares Bedienen des Telefons in genau dem Moment, in dem das gefährlich ist |

### 2.2 Warum jetzt

- Abschaltung der 2G- und 3G-Netze macht ältere Notrufgeräte unbrauchbar; ein Austauschzyklus läuft
- LTE-M ist flächendeckend verfügbar und für batteriebetriebene Geräte ausgelegt
- IoT-Konnektivität mit Laufzeittarif ermöglicht erstmals Geräte ohne monatliche Kosten
- Wachsende Sensibilität für Datenschutz begünstigt ein europäisches Produkt gegenüber Ortungsdiensten aus den USA

---

## 3. Produkt

### 3.1 Gerät

| Eigenschaft | Umsetzung |
|---|---|
| Mobilfunk | LTE-M (Cat-M1), NB-IoT als Rückfallebene, vorzertifiziertes Modul |
| Ortung | GNSS mit A-GPS, Zellortung als Rückfallebene |
| Nahbereich | Bluetooth 5.x – nutzt die Position eines gekoppelten Smartphones, wenn vorhanden |
| SIM | fest verlötete eSIM, Tarif für zehn Jahre vorausbezahlt |
| Akku | 1.000 mAh, 3–4 Monate Bereitschaft |
| Gehäuse | IP67, ca. 45 × 45 × 13 mm, 32 g |
| Bedienung | ein Taster, Vibrations- und LED-Rückmeldung |

Der Hybridbetrieb ist der technische Kern: Ist ein Smartphone in Reichweite, liegt die Position sofort und präzise vor. Ist keins da – Kind ohne Handy, leerer Akku, Telefon verloren – alarmiert das Gerät eigenständig über Mobilfunk.

### 3.2 Die Rettungskette

| Stufe | Auslöser | Reaktion |
|---|---|---|
| 1 – Stiller Alarm | 1× drücken | Push und SMS an bis zu 10 Vertrauenskontakte, mit Standort |
| 2 – Netzwerkalarm | 2× drücken oder keine Reaktion nach 90 Sek. | zusätzlich Partnerbetriebe im Umkreis von 300 m |
| 3 – Notruf | 3 Sek. halten | Kontakte werden aufgefordert, 110 zu wählen; App zeigt vorbereitete Standortangabe |
| Entwarnung | PIN in der App | sofortige Entwarnung an alle Beteiligten |

Ein automatischer Notruf an die Leitstelle findet bewusst nicht statt. Fehlalarme würden dort Kapazitäten binden und das Verhältnis zu Polizei und Rettungsdiensten dauerhaft beschädigen.

### 3.3 Abgrenzung

SafeExit ist ein Alarmierungs- und Vermittlungssystem. Es ist ausdrücklich **kein Ersatz für den Notruf 110/112**, keine Notrufleitstelle und keine Zusage einer Hilfeleistung. Diese Abgrenzung wird in AGB, App-Einrichtung und sämtlicher Kommunikation konsequent durchgehalten.

### 3.4 Entwicklungsstand

| Baustein | Stand |
|---|---|
| Funktionsprototyp auf Entwicklungsplattform | *(eintragen)* |
| Firmware Energiemanagement | *(eintragen)* |
| App iOS und Android | *(eintragen)* |
| Backend und Alarmzustellung | *(eintragen)* |
| Eigene Leiterplatte | *(eintragen)* |
| Feldtest mit Nutzern | *(eintragen)* |

---

## 4. Markt

### 4.1 Marktgröße Deutschland

| Segment | Grundgesamtheit | Erreichbar | Annahme |
|---|---|---|---|
| Kinder 6–12 | ca. 4,6 Mio. | ca. 690.000 | 15 % der Eltern erwägen ein Ortungs- oder Notfallgerät |
| Senioren 70+ außerhalb der Wohnung aktiv | ca. 9,5 Mio. | ca. 950.000 | 10 % mit erhöhtem Sicherheitsbedürfnis |
| Alleinarbeitende | ca. 2,0 Mio. | ca. 400.000 | 20 % in Tätigkeiten mit erhöhtem Risiko |
| Nächtliche Wege, Selbstkäufer | ca. 4,2 Mio. | ca. 210.000 | 5 %, Preis begrenzt die Reichweite |
| **Summe erreichbarer Markt (SAM)** | | **ca. 2,25 Mio.** | |

**Erreichbarer Marktanteil (SOM) Jahr 3:** 9.000 Geräte, entsprechend 0,4 % des SAM.

Bei einem Gerätepreis von 149 EUR entspricht der erreichbare Markt einem Volumen von über 330 Mio. EUR allein in Deutschland, ohne Abonnements und B2B.

### 4.2 Wettbewerb

| Anbieter | Hardware | Ohne Smartphone | Netzwerk | Laufende Kosten | Preis |
|---|---|---|---|---|---|
| **SafeExit** | ja | **ja** | ja | **keine** | 149 EUR |
| SafeNow | nein | nein | ja (Zonen) | keine | kostenlos |
| Life360 | nein | nein | nein | Abo | Freemium |
| Hausnotruf (DRK, Johanniter u. a.) | ja | ja | Leitstelle | 25–40 EUR/Monat | plus Anschluss |
| Kinder-Smartwatches | ja | ja | nein | Tarif nötig | 100–200 EUR |
| Taschenalarm | ja | ja | nein | keine | 5–15 EUR |

**Unsere Position:** Wir sind das einzige Angebot, das ohne Smartphone funktioniert, ein lokales Hilfenetzwerk mitbringt und dabei keine monatlichen Kosten verursacht.

**Die ehrliche Einschränkung:** Im Segment des nächtlichen Heimwegs ist SafeNow etabliert und für Endnutzer kostenlos. Deshalb ist dieses Segment für uns nicht der Markteintritt, sondern ein späterer Zusatzmarkt, den wir über eine preisgünstigere Zweitvariante erschließen, sobald die Stückkosten unter 45 EUR liegen.

### 4.3 Der entscheidende Preisvergleich

Ein Hausnotruf kostet über fünf Jahre zwischen 1.500 und 2.400 EUR. SafeExit kostet einmalig 149 EUR und funktioniert zusätzlich außerhalb der Wohnung. Dieses Verhältnis ist das stärkste Verkaufsargument des Unternehmens.

---

## 5. Geschäftsmodell

### 5.1 Erlösquellen

| Quelle | Preis | Deckungsbeitrag | Anteil Jahr 3 |
|---|---|---|---|
| Gerät | 149 EUR | 77 EUR | 78 % |
| Premium-Abo (optional) | 4,99 EUR/Monat | 4,24 EUR | 13 % |
| B2B-Paket ab 5 Geräten | 129 EUR/Gerät | 57 EUR | – |
| Safe Point Business | 49 EUR/Monat | 44 EUR | 8 % |

### 5.2 Stückkalkulation

| Position | Jahr 1 (1.500 Stk.) | Jahr 3 (10.000 Stk.) |
|---|---|---|
| Material und Fertigung | 52,00 EUR | 36,00 EUR |
| eSIM mit 10-Jahres-Tarif | 11,00 EUR | 9,00 EUR |
| **Herstellkosten** | **63,00 EUR** | **45,00 EUR** |
| Versand, Zahlungsabwicklung, Garantie | 9,00 EUR | 7,00 EUR |
| **Deckungsbeitrag bei 149 EUR** | **77,00 EUR** | **97,00 EUR** |
| Rohmarge | 52 % | 65 % |

### 5.3 Kennzahlen je Kunde

| Kennzahl | Wert |
|---|---|
| Deckungsbeitrag Gerät | 77 EUR |
| Erwarteter Abo-Beitrag (30 % Conversion, 24 Monate) | 30 EUR |
| **Kundenwert (LTV)** | **107 EUR** |
| Zielwert Akquisekosten (CAC) | unter 35 EUR |
| **LTV zu CAC** | **3,1** |
| Amortisation der Akquisekosten | sofort beim Gerätekauf |

Der Hardwareverkauf deckt die Akquisekosten unmittelbar. Das Abonnement ist reiner Zusatzertrag und nicht Voraussetzung für die Rentabilität – ein wesentlicher Unterschied zu abo-getriebenen Wettbewerbern, deren Kapitalbedarf mit jedem Neukunden wächst.

---

## 6. Markteintritt

### 6.1 Reihenfolge der Segmente

**Phase 1 – Kinder (Monat 1–9 nach Launch).** Eltern entscheiden schnell, zahlen bereitwillig und empfehlen weiter. Zugang über Elternvertretungen, Schulen, Familienportale und Social Media. Erwartet: 55 % der Erstjahresmenge.

**Phase 2 – Senioren und Angehörige (ab Monat 4).** Nicht Senioren selbst sind die Käufer, sondern deren erwachsene Kinder. Zugang über Pflegeberatung, Sanitätshäuser, Apotheken und regionale Presse. Erwartet: 30 %.

**Phase 3 – B2B, Alleinarbeitende (ab Monat 6).** Längere Entscheidungswege, dafür Mehrfachbestellungen und wiederkehrende Umsätze. Erwartet: 15 %.

### 6.2 Vertriebskanäle

| Kanal | Anteil Jahr 1 | Marge |
|---|---|---|
| Eigener Onlineshop | 70 % | voll |
| B2B-Direktvertrieb | 15 % | reduziert |
| Sanitätshäuser und Apotheken | 10 % | Handelsspanne 25 % |
| Partnerbetriebe mit Provision | 5 % | 10 EUR je Gerät |

### 6.3 Partnernetzwerk

Das Netzwerk ist unser Alleinstellungsmerkmal und wird nach dem Grundsatz **Dichte vor Fläche** aufgebaut: erst eine Pilotstadt mit mindestens 40 Partnerstandorten, dann drei weitere Städte nach demselben Muster.

Die Basispartnerschaft ist kostenlos – bezahlt wird nur der betriebliche Eigennutzen (Mitarbeiterschutz, Auswertungen, mehrere Standorte). Ein leeres Netzwerk ist für keinen Betrieb 49 EUR wert; ein dichtes rechtfertigt den Preis von selbst.

### 6.4 Marketingbudget Jahr 1

| Maßnahme | Jahresbudget |
|---|---|
| Social Media, Anzeigen (Eltern, Angehörige) | 16.000 EUR |
| Kooperationen und Mikro-Influencer | 5.000 EUR |
| Presse- und Öffentlichkeitsarbeit | 3.000 EUR |
| Messen (Pflege, Bildung, Sicherheit) | 4.000 EUR |
| Material, Aufkleber, Partnerausstattung | 2.000 EUR |
| **Summe** | **30.000 EUR** |

---

## 7. Technologie

### 7.1 Architektur

Gerät (LTE-M, GNSS, BLE) → verschlüsselte Übertragung → Backend in Deutschland → Push und SMS an Kontakte, Partner-App, Weboberfläche für B2B.

### 7.2 Technische Risiken und ihre Behandlung

| Risiko | Behandlung |
|---|---|
| Standortermittlung nach dem Aufwachen dauert zu lange | A-GPS, sofortiger Alarm ohne Position, Nachreichen des Standorts, Zellortung als Rückfall |
| Spannungseinbruch bei Sendestromspitzen | ausreichende Pufferung, Auslegung auf 500 mA Spitzenstrom |
| Akkulaufzeit unter Erwartung | Messung des Energieverbrauchs von Beginn an, PSM- und eDRX-Betrieb |
| Netzabdeckung im ländlichen Raum | LTE-M statt NB-IoT wegen Mobilitätsunterstützung, Netzabdeckung vorab verifiziert |
| Funkzulassung nicht bestanden | vorzertifiziertes Modul, Vorabmessung vor der offiziellen Prüfung |

### 7.3 Schutzrechte

Marke „SafeExit" beim DPMA in den Klassen 9, 42 und 45 angemeldet. Ein Patent auf das Gerät selbst ist nicht vorgesehen – die Schutzwirkung entsteht über das Partnernetzwerk, die Nutzerbasis und die Marke, nicht über die Elektronik.

---

## 8. Recht und Regulierung

| Bereich | Status | Kosten |
|---|---|---|
| CE, Funkrichtlinie (RED), EMV | vor Serienstart, akkreditiertes Prüflabor | 12.000–18.000 EUR |
| Akkutransport UN 38.3 | vor Versand | 2.500–4.000 EUR |
| Netzbetreiberfreigabe | modulabhängig, vorab geklärt | 0–8.000 EUR |
| ElektroG (stiftung ear), Batteriegesetz, Verpackungsgesetz | vor erstem Verkauf | ca. 900 EUR |
| DSGVO: Folgenabschätzung, externer Datenschutzbeauftragter | ab Entwicklungsbeginn | 3.000 EUR/Jahr |
| Produkthaftpflicht, Deckung 5 Mio. EUR | vor Auslieferung | ab 1.200 EUR/Jahr |
| Abgrenzung zum Medizinprodukt | keine gesundheitsbezogenen Funktionen oder Aussagen | – |

**Datenschutz als Produktmerkmal:** Standortdaten werden ausschließlich während eines aktiven Alarms erhoben und nach 24 Stunden gelöscht. Es findet keine dauerhafte Ortung statt. Alle Server stehen in Deutschland. Dieses Versprechen ist im Segment Kinder ein eigenständiges Verkaufsargument gegenüber Ortungsuhren.

---

## 9. Finanzplanung

### 9.1 Ergebnisrechnung

| | Jahr 1 | Jahr 2 | Jahr 3 |
|---|---|---|---|
| Verkaufte Geräte | 1.200 | 4.000 | 9.000 |
| Herstellkosten je Gerät | 63 EUR | 52 EUR | 45 EUR |
| Hardwareumsatz | 178.800 EUR | 596.000 EUR | 1.341.000 EUR |
| Abonnements (netto) | 7.600 EUR | 71.000 EUR | 193.400 EUR |
| B2B | 7.400 EUR | 60.600 EUR | 176.900 EUR |
| **Umsatz** | **193.800 EUR** | **727.600 EUR** | **1.711.300 EUR** |
| Wareneinsatz und Nebenkosten | –86.400 EUR | –256.800 EUR | –520.100 EUR |
| **Rohertrag** | **107.400 EUR** | **470.800 EUR** | **1.191.200 EUR** |
| Personal | –69.600 EUR | –230.000 EUR | –480.000 EUR |
| Marketing | –30.000 EUR | –100.000 EUR | –200.000 EUR |
| Infrastruktur und Betrieb | –9.000 EUR | –24.000 EUR | –48.000 EUR |
| Recht, Versicherung, Verwaltung | –21.400 EUR | –36.000 EUR | –72.000 EUR |
| **Ergebnis** | **–22.600 EUR** | **+80.800 EUR** | **+391.200 EUR** |
| Mitarbeitende (Vollzeitäquivalente) | 2,5 | 5 | 9 |

Kumuliertes Ergebnis nach drei Jahren: **+449.400 EUR**

### 9.2 Break-even

Fixkosten Jahr 1: 130.000 EUR, entsprechend 10.833 EUR monatlich. Bei einem Deckungsbeitrag von 77 EUR je Gerät wird die Gewinnschwelle bei **141 verkauften Geräten pro Monat** erreicht, erwartet ab Monat 9 des ersten Verkaufsjahres.

### 9.3 Szenarien

| | Konservativ | Plan | Optimistisch |
|---|---|---|---|
| Geräte Jahr 1 | 700 | 1.200 | 1.900 |
| Umsatz Jahr 1 | 112.000 EUR | 194.000 EUR | 308.000 EUR |
| Ergebnis Jahr 1 | –63.000 EUR | –23.000 EUR | +19.000 EUR |
| Break-even | Monat 20 | Monat 9 | Monat 5 |
| Zusätzlicher Kapitalbedarf | 45.000 EUR | keiner | keiner |

Im konservativen Fall reduzieren wir das Marketingbudget um die Hälfte, verschieben die zweite Produktionscharge und verlagern den Vertriebsschwerpunkt auf B2B, wo Mehrfachbestellungen die Stückzahl schneller tragen.

---

## 10. Team

> **Dieser Abschnitt ist von euch auszufüllen und der wichtigste des gesamten Dokuments.** In dieser Phase wird nicht das Produkt finanziert, sondern die Überzeugung, dass genau ihr es bauen könnt. Schreibt zu jeder Person drei bis vier Sätze und belegt sie – mit einem Projekt, einem Repository, einem gebauten Gerät, einer Kundenreferenz. Keine Eigenschaftswörter, nur Belege.

| Rolle | Name | Verantwortung | Nachweis |
|---|---|---|---|
| Geschäftsführung, Vertrieb | | Partner, Finanzierung, B2B | |
| Hardware und Firmware | | Schaltung, Layout, Energiemanagement, Zertifizierung | |
| Software | | App, Backend, Infrastruktur | |
| Marke und Marketing | | Gestaltung, Kampagnen, Community | |

**Was wir nicht abdecken und wie wir es lösen:**

| Lücke | Lösung |
|---|---|
| Hochfrequenztechnik und Serienreife | Beirat oder Beratung auf Stundenbasis; vorzertifiziertes Modul senkt den Anspruch erheblich |
| Vertrieb in Pflege und Gesundheitswesen | Beirat; später eigene Einstellung aus Mitteln des zweiten Jahres |
| Fertigungssteuerung | Auswahl eines Fertigers mit eigener Qualitätssicherung |

**Beirat (geplant/angefragt):** Vertretung aus Polizei oder Präventionsarbeit, Datenschutzexpertise, Elektronikfertigung, Pflegewirtschaft.

**Eigenleistung als Kapitalbeitrag:** Hardwareentwicklung, App, Backend und Markenauftritt werden vollständig im Team erbracht. Zu marktüblichen Sätzen entspricht das einem Gegenwert von rund 133.000 EUR und ist der wesentliche Eigenbeitrag der Gründer.

---

## 11. Kapitalbedarf und Finanzierung

### 11.1 Mittelverwendung

| Position | Betrag | Anteil |
|---|---|---|
| Zertifizierung (CE, RED, EMV, UN 38.3, Netzfreigabe) | 28.000 EUR | 13 % |
| Spritzgusswerkzeug und Serienvorbereitung | 18.000 EUR | 8 % |
| Erstserie 1.500 Geräte | 94.500 EUR | 43 % |
| Material für Entwicklung, Prototypen, Feldtest | 15.000 EUR | 7 % |
| Recht, Datenschutz, Versicherung, Gründung | 12.000 EUR | 5 % |
| Marketing bis zum Break-even | 30.000 EUR | 14 % |
| Liquiditätsreserve (6 Monate) | 22.500 EUR | 10 % |
| **Gesamt** | **220.000 EUR** | |

**Kein einziger Euro fließt in Entwicklungsdienstleistungen.** Ein vergleichbares Vorhaben mit externer Hardware- und Softwareentwicklung benötigt an dieser Stelle 340.000 EUR.

### 11.2 Finanzierungsstruktur

| Quelle | Betrag | Status |
|---|---|---|
| Eigenleistung der Gründer (Entwicklung) | 133.000 EUR | erbracht bzw. laufend |
| Crowdfunding / Vorbestellungen | 80.000 EUR | *(Status eintragen)* |
| Öffentliche Förderung und Mikromezzanine | 50.000 EUR | beantragt |
| **Beteiligungsrunde** | **120.000 EUR** | **dieses Angebot** |
| **Finanzierung gesamt (ohne Eigenleistung)** | **250.000 EUR** | |

Der Überhang von 30.000 EUR gegenüber dem Kapitalbedarf dient als Puffer für das konservative Szenario.

### 11.3 Beteiligungsangebot

| | |
|---|---|
| Gesuchte Summe | 120.000 EUR |
| Angebotener Anteil | 15 % |
| Bewertung vor Einlage | 680.000 EUR |
| Bewertung nach Einlage | 800.000 EUR |
| Form | Beteiligung an der UG oder Wandeldarlehen |
| Auszahlung | zwei Tranchen, siehe 11.4 |

**Begründung der Bewertung.** Grundlage sind erbrachte Eigenleistung im Wert von 133.000 EUR, ein funktionsfähiger Prototyp, *(Zahl)* Vorbestellungen aus der Kampagne und *(Zahl)* unterschriebene Partnerabsichtserklärungen. Der Kapitalbedarf bis zur Gewinnschwelle beträgt weniger als ein Drittel dessen, was vergleichbare Hardwarevorhaben ohne interne Entwicklungskompetenz benötigen.

### 11.4 Tranchen und Meilensteine

| Tranche | Betrag | Auszahlung bei |
|---|---|---|
| 1 | 70.000 EUR | Abschluss der Beteiligung |
| 2 | 50.000 EUR | bestandene CE- und Funkprüfung sowie Freigabe der Nullserie |

Die Kopplung an die bestandene Zertifizierung nimmt dem Investor das größte technische Einzelrisiko ab.

### 11.5 Was wir über Kapital hinaus suchen

Zugang zu Fertigungspartnern, Erfahrung mit Serienanläufen in der Elektronik sowie Kontakte in Pflegewirtschaft oder Einzelhandel. Ein Investor mit Hardwarehintergrund ist uns deutlich lieber als ein rein finanzieller.

---

## 12. Meilensteine

| Monat | Meilenstein | Nachweis |
|---|---|---|
| 1–3 | Nachfragetest, Partnerakquise | 300+ Vormerkungen, 15 Absichtserklärungen |
| 4–6 | Feldtest mit 20 Geräten | Tragequote nach 4 Wochen über 70 % |
| 6–9 | Eigene Leiterplatte, Serienentwurf | funktionsfähiges Muster in Zielgröße |
| 9–11 | Crowdfunding-Kampagne | 80.000 EUR eingeworben |
| 10–12 | **Beteiligungsrunde** | dieses Angebot |
| 12–15 | Zertifizierung, Werkzeugbau | CE-Konformität erklärt |
| 15–16 | Nullserie, Qualitätsfreigabe | 50 geprüfte Geräte |
| 16–17 | Erstserie, Auslieferung an Unterstützer | 1.500 Geräte produziert |
| **18** | **Marktstart** | 40 Partnerstandorte aktiv |
| 27 | Gewinnschwelle | positives Monatsergebnis |

---

## 13. Risiken

| Risiko | Auswirkung | Gegenmaßnahme |
|---|---|---|
| Zertifizierung nicht im ersten Anlauf bestanden | Verzögerung 2–3 Monate, 8.000 EUR | vorzertifiziertes Modul, Vorabmessung, Puffer eingeplant |
| Akkulaufzeit unter Zusage | Produktversprechen betroffen | Energiemessung ab Tag 1, Zusage konservativ kommunizieren |
| Netzwerk bleibt zu dünn | Alleinstellungsmerkmal entwertet | Dichte vor Fläche, Marktstart erst ab 40 Standorten |
| Lieferengpass beim Funkmodul | Produktionsstopp | Zweitquelle definiert, Sicherheitsbestand |
| Produkthaftungsfall | existenzbedrohend | Versicherung 5 Mio. EUR, UG, Dokumentationspflicht |
| Datenschutzvorfall | Vertrauensverlust | Datenminimierung, EU-Hosting, externe Sicherheitsprüfung vor Start |
| Wettbewerber ergänzt Hardware | Verlust des Vorsprungs | Vorsprung über Netzwerkdichte und Nutzerbasis, nicht über Technik |
| Gründer fallen aus | Entwicklung stoppt | Dokumentation, Code in gemeinsamen Repositories, Vesting-Regelung |

---

## 14. Exit-Perspektive

Strategische Käufer für ein Unternehmen mit Hardwarebasis, wiederkehrenden Erlösen und einem lokalen Partnernetzwerk:

- **Versicherungswirtschaft** – Sicherheitsdienste als Zusatzleistung im Bestandsgeschäft; Versicherer haben in diesem Feld bereits eigene Angebote betrieben
- **Sicherheits- und Alarmdienstleister** – europäische Anbieter im Bereich Objekt- und Personensicherheit
- **Anbieter von Hausnotrufsystemen** – der mobile Anwendungsfall ist genau ihre Angebotslücke
- **Telekommunikation** – Geräte mit eigener Konnektivität und Endkundenbindung

Ein realistischer Zeitraum liegt bei fünf bis sieben Jahren. Bewertungsmaßstab ist in diesem Segment üblicherweise ein Vielfaches des wiederkehrenden Jahresumsatzes – weshalb der Aufbau des Abonnement- und B2B-Anteils strategisch wichtiger ist als die reine Stückzahl.

---

## 15. Anhänge

1. Produktskizze und Gehäuseentwurf
2. Übersicht Feldtestergebnisse
3. Liste der Partnerbetriebe mit Absichtserklärungen
4. Detaillierte Finanzplanung, monatlich, 36 Monate
5. Auswertung des Nachfragetests
6. Lebensläufe der Gründer
7. Stückliste und Fertigungsangebote
