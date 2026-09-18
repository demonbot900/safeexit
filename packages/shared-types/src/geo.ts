export interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_METERS = 6_371_008.8;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Entfernung zweier Punkte auf der Erdkugel in Metern. */
export function distanceMeters(a: Coordinates, b: Coordinates): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLon = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_METERS * Math.asin(Math.min(1, Math.sqrt(h)));
}

export interface BoundingBox {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
}

/**
 * Grobes Rechteck um einen Punkt. Dient als Vorfilter in der Datenbank, damit die
 * genaue Entfernung nur fuer wenige Zeilen gerechnet werden muss.
 */
export function boundingBox(center: Coordinates, radiusMeters: number): BoundingBox {
  // Ein Meter Zuschlag: das Rechteck darf nie knapp zu klein sein. Sonst faellt ein
  // Partnerbetrieb genau am Rand durch den Vorfilter, obwohl die genaue Rechnung ihn
  // einschliesst.
  const padded = radiusMeters + 1;
  const latitudeDelta = (padded / EARTH_RADIUS_METERS) * (180 / Math.PI);
  const cosLatitude = Math.cos(toRadians(center.latitude));
  // Nahe den Polen laeuft der Cosinus gegen null, dann filtern wir die Laenge nicht.
  const longitudeDelta = Math.abs(cosLatitude) < 1e-9 ? 180 : latitudeDelta / Math.abs(cosLatitude);

  return {
    minLatitude: center.latitude - latitudeDelta,
    maxLatitude: center.latitude + latitudeDelta,
    minLongitude: center.longitude - longitudeDelta,
    maxLongitude: center.longitude + longitudeDelta,
  };
}

export function isWithinRadius(
  center: Coordinates,
  point: Coordinates,
  radiusMeters: number,
): boolean {
  return distanceMeters(center, point) <= radiusMeters;
}
