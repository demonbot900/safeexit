import { describe, expect, it } from 'vitest';
import { boundingBox, distanceMeters, isWithinRadius } from './geo.js';
import { NETWORK_RADIUS_METERS } from './constants.js';

const marktplatz = { latitude: 53.1435, longitude: 8.2146 };

describe('distanceMeters', () => {
  it('ist null fuer denselben Punkt', () => {
    expect(distanceMeters(marktplatz, marktplatz)).toBe(0);
  });

  it('rechnet eine bekannte Strecke plausibel', () => {
    // Oldenburg bis Bremen, Luftlinie rund 40 km.
    const bremen = { latitude: 53.0793, longitude: 8.8017 };
    const distance = distanceMeters(marktplatz, bremen);
    expect(distance).toBeGreaterThan(38_000);
    expect(distance).toBeLessThan(46_000);
  });

  it('erkennt Punkte innerhalb des Netzwerkradius', () => {
    const nearby = { latitude: 53.1453, longitude: 8.2146 };
    expect(isWithinRadius(marktplatz, nearby, NETWORK_RADIUS_METERS)).toBe(true);

    const faraway = { latitude: 53.1516, longitude: 8.2146 };
    expect(isWithinRadius(marktplatz, faraway, NETWORK_RADIUS_METERS)).toBe(false);
  });
});

describe('boundingBox', () => {
  it('umschliesst den Radius vollstaendig', () => {
    const box = boundingBox(marktplatz, NETWORK_RADIUS_METERS);

    const northEdge = { latitude: box.maxLatitude, longitude: marktplatz.longitude };
    const eastEdge = { latitude: marktplatz.latitude, longitude: box.maxLongitude };

    expect(distanceMeters(marktplatz, northEdge)).toBeGreaterThanOrEqual(NETWORK_RADIUS_METERS);
    expect(distanceMeters(marktplatz, eastEdge)).toBeGreaterThanOrEqual(NETWORK_RADIUS_METERS);
  });
});
