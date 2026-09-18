/**
 * Fachliche Konstanten aus dem Businessplan.
 *
 * Diese Datei ist die einzige Quelle fuer diese Werte. Backend, App und Webseite
 * benutzen sie direkt, die Firmware spiegelt sie in ihren Headern. Wer einen Wert
 * aendert, aendert ihn hier und traegt die Begruendung in die Commit-Nachricht.
 */

/** Umkreis, in dem bei Stufe 2 Partnerbetriebe alarmiert werden (Businessplan 3.3). */
export const NETWORK_RADIUS_METERS = 300;

/** Ohne Quittierung wird Stufe 1 nach dieser Zeit auf Stufe 2 hochgestuft (Businessplan 3.3). */
export const ESCALATION_TIMEOUT_SECONDS = 90;

/** Standortdaten werden danach geloescht (Businessplan 9, Datenschutzversprechen). */
export const LOCATION_RETENTION_HOURS = 24;

/** Halten des Tasters bis Stufe 3 (Businessplan 3.3: 3 Sekunden halten). */
export const EMERGENCY_HOLD_MILLISECONDS = 3000;

/** Zeitfenster, in dem ein zweiter Druck als Doppeldruck gilt. */
export const DOUBLE_PRESS_WINDOW_MILLISECONDS = 1500;

/** Prellzeit des Tasters. */
export const BUTTON_DEBOUNCE_MILLISECONDS = 50;

/** Kuerzester Druck, der als Absicht gilt. Schuetzt vor Ausloesen in der Hosentasche. */
export const MIN_PRESS_MILLISECONDS = 80;

/** Stummschaltung der Station nach langem Druck (Station-Ergaenzung, Abschnitt 9). */
export const STATION_MUTE_SECONDS = 60;

/** Ist eine Station laenger offline, meldet das Backend den Ausfall. */
export const STATION_OFFLINE_ALERT_HOURS = 24;

/** Erste Benachrichtigung soll darunter bleiben (Businessplan 8, Punkt 6). */
export const NOTIFICATION_TARGET_MILLISECONDS = 3000;

/** Version des Geraeteprotokolls, siehe packages/protocols/README.md. */
export const PROTOCOL_VERSION = 1;
