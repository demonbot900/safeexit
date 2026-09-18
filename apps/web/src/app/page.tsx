import { WaitlistForm } from '@/components/waitlist-form';

export default function Startseite() {
  return (
    <main>
      <section className="hero">
        <h1>Geh, wann du willst.</h1>
        <p>
          Ein Knopf in der Tasche. Einmal druecken, und die Menschen, denen du vertraust, wissen
          Bescheid und sehen, wo du bist. Ohne Handy in der Hand. Ohne monatliche Kosten.
        </p>
      </section>

      <ul className="merkmale">
        <li className="merkmal">
          <h3>Der Knopf</h3>
          <p>
            Eigene Mobilfunkverbindung und Satellitenortung. Funktioniert auch fuer Menschen ohne
            Smartphone, zum Beispiel fuer Kinder in der Schule.
          </p>
        </li>
        <li className="merkmal">
          <h3>Die Station</h3>
          <p>
            Ein Kasten an der Wand, der laut wird und rot blinkt. Nachts um eins geht eine
            Push-Nachricht unter, ein schriller Kasten nicht.
          </p>
        </li>
        <li className="merkmal">
          <h3>Das Netzwerk</h3>
          <p>
            Betriebe in der Nachbarschaft, die die Tuer aufmachen und warten lassen, bis Hilfe da
            ist. Alarmiert werden sie im Umkreis von 300 Metern.
          </p>
        </li>
      </ul>

      <h2>Was es kostet</h2>
      <div className="preise">
        <div className="preis">
          <span className="betrag">149 &euro;</span>
          <span className="hinweis">Knopf, einmalig</span>
        </div>
        <div className="preis">
          <span className="betrag">49 &euro;</span>
          <span className="hinweis">Station, einmalig</span>
        </div>
        <div className="preis hervorgehoben">
          <span className="betrag">179 &euro;</span>
          <span className="hinweis">beides zusammen</span>
        </div>
      </div>
      <p>
        Die SIM-Karte im Knopf ist fuer zehn Jahre bezahlt. Es gibt keinen Vertrag und keine
        monatliche Gebuehr. Ein Hausnotruf kostet 25 bis 40 Euro im Monat und funktioniert nur in
        der Wohnung.
      </p>

      <h2>Was passiert, wenn du drueckst</h2>
      <ol>
        <li>
          <strong>Einmal druecken:</strong> deine Vertrauenskontakte bekommen den Alarm mit
          Standort, auf dem Handy und auf ihrer Station.
        </li>
        <li>
          <strong>Zweimal druecken oder keine Reaktion nach 90 Sekunden:</strong> zusaetzlich die
          Partnerbetriebe in deiner Naehe.
        </li>
        <li>
          <strong>Drei Sekunden halten:</strong> deine Kontakte werden aufgefordert, die 110 zu
          waehlen.
        </li>
        <li>
          <strong>Jemand drueckt &bdquo;Ich komme&ldquo;:</strong> dein Knopf vibriert zweimal und
          leuchtet gruen. Du weisst, dass jemand unterwegs ist.
        </li>
      </ol>

      <div className="hinweiskasten">
        <p>
          <strong>Datenschutz ist Teil des Produkts.</strong> Dein Standort wird nur waehrend eines
          Alarms uebertragen und nach 24 Stunden geloescht. Keine dauerhafte Ortung, keine
          Bewegungshistorie, keine Tonaufnahme. Server in Deutschland.
        </p>
      </div>

      <h2>Vormerken lassen</h2>
      <p>
        Wir bauen gerade die ersten Geraete. Trag dich ein, wenn du zu den Ersten gehoeren willst,
        die eins bekommen.
      </p>
      <WaitlistForm />
    </main>
  );
}
