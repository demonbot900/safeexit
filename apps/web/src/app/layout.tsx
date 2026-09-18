import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SafeExit – Hilfe holen, ohne das Handy zu zuecken',
  description:
    'Ein Notfallknopf mit eigener Mobilfunkverbindung, eine Station, die den Alarm laut anzeigt, ' +
    'und Betriebe in der Nachbarschaft, die die Tuer aufmachen. Ohne Smartphone, ohne monatliche Kosten.',
};

export const viewport: Viewport = {
  themeColor: '#c05b3c',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        <header className="marke">
          <span className="marke-punkt" aria-hidden="true" />
          SafeExit
        </header>
        {children}
        <footer>
          <p>
            SafeExit ist ein Alarmierungs- und Vermittlungssystem. Es ist{' '}
            <strong>kein Ersatz</strong> fuer den Notruf 110 oder 112, keine Leitstelle und keine
            Zusage einer Hilfeleistung.
          </p>
          <p>Projekt in Entwicklung. Impressum und Datenschutzerklaerung folgen vor dem Start.</p>
        </footer>
      </body>
    </html>
  );
}
