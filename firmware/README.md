# Firmware

Zwei Geräte, eine Regel: **die Fachlogik kennt keine Hardware.**

Was ein Tastendruck bedeutet, wann eine Stufe steigt und wann die Station wieder laut wird,
steht in reinem C ohne Hersteller-SDK. Das lässt sich auf dem Entwicklungsrechner in
Millisekunden testen — Monate bevor die erste Leiterplatte existiert. Die Anbindung an ein
konkretes Funkmodul kommt später in `*/drivers` dazu und ist dann austauschbar.

```
firmware/
├─ button/                  Knopf
│  ├─ include/safeexit/     button_input.h (Gesten), button_alarm.h (Zustände), button_hal.h
│  ├─ src/                  die Fachlogik, testbar ohne Hardware
│  ├─ drivers/              Plattformanbindung (noch leer)
│  └─ tests/                Host-Tests
├─ station/                 Station, gleicher Aufbau
└─ CMakeLists.txt
```

Das Funkprotokoll liegt nicht hier, sondern in `packages/protocols/c` — gemeinsam mit dem
Backend gepflegt und gegen dieselben Testvektoren geprüft.

## Tests laufen lassen

```bash
npm run firmware:configure    # einmalig
npm run firmware:test
```

Gebraucht werden CMake und ein C-Compiler (GCC oder Clang) plus Ninja oder Make. Die CI macht
dasselbe auf Ubuntu.

## Was die Tests festhalten

**Knopf** (`button/tests`)

- Ein Anstoßen in der Hosentasche löst nichts aus (Mindestdauer 80 ms).
- Ein prellender Kontakt ergibt genau einen Druck, nicht fünf.
- Der Druck wird gemeldet, sobald er lange genug anliegt — nicht erst beim Loslassen. In einer
  Notlage auf das Ende des Doppelklickfensters zu warten wäre der falsche Kompromiss.
- Zweimal drücken hebt auf Stufe 2, drei Sekunden halten auf Stufe 3.
- Eine Stufe wird **nie** zurückgenommen.
- Eine Quittierung beendet den Alarm nicht, sie gibt nur Rückmeldung. Wer danach weiter hält,
  kommt trotzdem auf Stufe 3.

**Station** (`station/tests`)

- Kurz drücken heißt „Ich komme": Ton aus, Ring grün, Quittierung ans Backend.
- Lang drücken schaltet 60 Sekunden stumm — das **Licht bleibt an**, der Alarm ist nicht vorbei.
- Nach Ablauf der Stummschaltung wird sie von selbst wieder laut.
- Eine höhere Alarmstufe hebt die Stummschaltung sofort auf.
- Hat jemand anders quittiert, wird die Station still, meldet aber nichts ans Backend.

## Noch offen

Die Zielplattformen sind nicht entschieden: `docs/entscheidungen/0004-hardware-plattform.md`.
Bis dahin bleibt jede Zeile hier plattformfrei.
