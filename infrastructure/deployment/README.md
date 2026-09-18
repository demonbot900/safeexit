# Betrieb

Noch nichts davon ist eingerichtet. Diese Datei haelt fest, was vor dem Marktstart stehen muss,
damit es nicht in der letzten Woche entschieden wird.

## Zwei Dienste, getrennt betrieben

| Dienst  | Aufgabe                             | Ausfall bedeutet                                       |
| ------- | ----------------------------------- | ------------------------------------------------------ |
| `alarm` | Knopf, Station, Alarmkette          | Alarme kommen nicht an. Hoechste Dringlichkeit.        |
| `api`   | Warteliste, spaeter Shop und Konten | Niemand kann bestellen. Aergerlich, nicht gefaehrlich. |

Beide laufen aus demselben Abbild mit unterschiedlichem Startbefehl. Sie werden **getrennt
ueberwacht und getrennt alarmiert**. Die Begruendung steht in
`docs/entscheidungen/0002-alarmpfad-getrennt.md`.

## Ort

Server ausschliesslich in Deutschland (Businessplan 9, Datenschutz als Produktmerkmal). Das ist
ein Werbeversprechen auf der Startseite und darf nicht durch einen beilaeufig gewaehlten
Dienstleister gebrochen werden. Auch Sicherungen, Protokolle und Fehlerberichte bleiben in der EU.

## Vor dem ersten echten Alarm

- [ ] TLS mit automatischer Erneuerung
- [ ] Ueberwachung des Alarmdienstes mit Alarmierung auf ein Telefon, nicht nur per E-Mail
- [ ] Testalarm als regelmaessiger Ablauf, mindestens monatlich (Businessplan 8, Punkt 6)
- [ ] Taegliche Sicherung der Datenbank, Rueckspielen einmal geuebt
- [ ] Geheimnisse ausserhalb des Quelltextes, getrennt je Umgebung
- [ ] Protokolle ohne personenbezogene Daten, Aufbewahrung begrenzt
- [ ] Zweite Quelle fuer den SMS-Versand, falls der erste Anbieter ausfaellt

## Kosten

Der Plan sieht 9.000 EUR Infrastruktur im ersten Jahr vor (Businessplan 12.1). Zwei kleine
Server, eine verwaltete Datenbank und Ueberwachung liegen deutlich darunter; der Rest ist Puffer
fuer SMS, Push und Lastspitzen.
