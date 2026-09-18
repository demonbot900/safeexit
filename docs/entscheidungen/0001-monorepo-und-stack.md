# 0001 – Ein Repository, dieser Technikstapel

## Lage

Zwei Hardwareprodukte, eine App, eine Webseite, ein Backend — bei zweieinhalb Vollzeitstellen im
ersten Jahr (Businessplan 12.1). Die Geräte und das Backend müssen sich exakt einig sein, sonst
kommt ein Alarm nicht an.

## Entscheidung

Ein Repository für alles, npm-Workspaces für die TypeScript-Teile. Der Stack folgt dem
Businessplan 10: Flutter für die App, Next.js für die Webseite, NestJS für das Backend,
PostgreSQL, C für beide Firmwares.

Alle geteilten Festlegungen liegen in `packages/`:

- `shared-types` — die Zahlen aus dem Businessplan (90 s, 300 m, 24 h) stehen genau einmal.
- `protocols` — das Funkformat, in TypeScript **und** in C, geprüft gegen gemeinsame
  Testvektoren.
- `api-contracts` — die HTTP-Verträge, von Backend und Webseite mit demselben Schema geprüft.

## Warum

Ein getrenntes Repository je Teil bedeutet bei dieser Teamgröße Versionsstände, die auseinander
laufen — und das an der Stelle, an der ein Fehler heißt, dass jemand keine Hilfe bekommt. Im
Monorepo bricht die CI sofort, wenn Firmware und Backend sich uneinig werden.

## Folgen

- Ein `npm install` richtet alles ein.
- Die CI baut alles zusammen; ein Bruch fällt beim Verursacher auf, nicht Wochen später.
- Die App in Dart kann die TypeScript-Typen nicht lesen. Deshalb spiegelt
  `apps/mobile/lib/models/` sie von Hand, mit Verweis auf die Quelle.

## Offen

Ob der Shop später ein eigenes System wird (Shopify, Shopware) oder im API-Dienst bleibt.
