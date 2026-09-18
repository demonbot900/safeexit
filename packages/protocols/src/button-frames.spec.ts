import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { decodeFrame, encodeFrame, ProtocolError, type Frame } from './button-frames.js';

interface Vector {
  name: string;
  frame: Frame;
  hex: string;
}

const vectors = JSON.parse(
  readFileSync(new URL('../testvectors/button-frames.json', import.meta.url), 'utf8'),
) as { uplink: Vector[]; downlink: Vector[] };

const allVectors = [...vectors.uplink, ...vectors.downlink];

function toHex(bytes: Uint8Array): string {
  return Buffer.from(bytes).toString('hex');
}

describe('Testvektoren', () => {
  it.each(allVectors)('$name wird gleich kodiert', (vector) => {
    expect(toHex(encodeFrame(vector.frame))).toBe(vector.hex);
  });

  it.each(allVectors)('$name wird gleich dekodiert', (vector) => {
    expect(decodeFrame(Uint8Array.from(Buffer.from(vector.hex, 'hex')))).toEqual(vector.frame);
  });
});

describe('Fehlerfaelle', () => {
  it('weist eine fremde Protokollversion ab', () => {
    const bytes = Uint8Array.from(Buffer.from('02010100015780f3c868', 'hex'));
    expect(() => decodeFrame(bytes)).toThrow(ProtocolError);
  });

  it('weist eine unbekannte Alarmstufe ab', () => {
    const bytes = Uint8Array.from(Buffer.from('01010100055780f3c868', 'hex'));
    expect(() => decodeFrame(bytes)).toThrow(ProtocolError);
  });

  it('weist einen zu kurzen Rahmen ab', () => {
    expect(() => decodeFrame(Uint8Array.from([1, 1, 0]))).toThrow(ProtocolError);
  });

  it('weist einen Akkustand ueber 100 Prozent beim Kodieren ab', () => {
    expect(() =>
      encodeFrame({
        type: 'alarm_trigger',
        sequence: 1,
        level: 1,
        batteryPercent: 120,
        timestamp: 1758000000,
      }),
    ).toThrow(ProtocolError);
  });
});
