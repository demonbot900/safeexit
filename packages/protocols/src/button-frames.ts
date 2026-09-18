/**
 * Binaerformat zwischen Knopf und Backend, Version 1.
 *
 * Jedes Byte kostet Funkzeit und damit Akkulaufzeit, deshalb ist das Format fest
 * und klein statt selbstbeschreibend. Die verbindliche Beschreibung steht in
 * packages/protocols/README.md, die verbindlichen Beispiele in
 * packages/protocols/testvectors/button-frames.json.
 *
 * Diese Datei und c/src/protocol.c muessen sich gleich verhalten. Beide werden
 * gegen dieselben Testvektoren geprueft.
 */
import {
  PROTOCOL_VERSION,
  isAlarmLevel,
  type AlarmLevel,
  type LocationSource,
} from '@safeexit/shared-types';

export const FRAME_TYPE = {
  ALARM_TRIGGER: 0x01,
  ALARM_ESCALATE: 0x02,
  LOCATION: 0x03,
  HEARTBEAT: 0x04,
  RECEIPT: 0x80,
  ACKNOWLEDGED: 0x81,
  CANCELLED: 0x82,
  REQUEST_LOCATION: 0x83,
} as const;

export const HEADER_SIZE = 4;
export const MAX_FRAME_SIZE = 32;

/** Feste Laenge je Rahmentyp. Gegenstueck zu se_frame_length in der C-Fassung. */
const FRAME_LENGTHS = new Map<number, number>([
  [FRAME_TYPE.ALARM_TRIGGER, 10],
  [FRAME_TYPE.ALARM_ESCALATE, 9],
  [FRAME_TYPE.LOCATION, 19],
  [FRAME_TYPE.HEARTBEAT, 12],
  [FRAME_TYPE.RECEIPT, 6],
  [FRAME_TYPE.ACKNOWLEDGED, 8],
  [FRAME_TYPE.CANCELLED, 8],
  [FRAME_TYPE.REQUEST_LOCATION, HEADER_SIZE],
]);

/** Laenge eines Rahmentyps in Byte, 0 bei unbekanntem Typ. */
export function frameLength(type: number): number {
  return FRAME_LENGTHS.get(type) ?? 0;
}

/** Quellenschluessel im Funkformat. Die Reihenfolge ist Teil des Protokolls. */
const LOCATION_SOURCES: readonly LocationSource[] = ['gnss', 'cell', 'phone'];

export const COORDINATE_SCALE = 1e7;

/** Grad in die Ganzzahldarstellung des Protokolls. */
export function toE7(degrees: number): number {
  return Math.round(degrees * COORDINATE_SCALE);
}

/** Ganzzahldarstellung des Protokolls zurueck in Grad. */
export function fromE7(value: number): number {
  return value / COORDINATE_SCALE;
}

export class ProtocolError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProtocolError';
  }
}

export type UplinkFrame =
  | {
      type: 'alarm_trigger';
      sequence: number;
      level: AlarmLevel;
      batteryPercent: number;
      timestamp: number;
    }
  | { type: 'alarm_escalate'; sequence: number; level: AlarmLevel; timestamp: number }
  | {
      type: 'location';
      sequence: number;
      latitudeE7: number;
      longitudeE7: number;
      accuracyMeters: number;
      source: LocationSource;
      timestamp: number;
    }
  | {
      type: 'heartbeat';
      sequence: number;
      batteryPercent: number;
      rssiDbm: number;
      firmwareMajor: number;
      firmwareMinor: number;
      timestamp: number;
    };

export type DownlinkFrame =
  | { type: 'receipt'; sequence: number; acknowledgedSequence: number }
  | { type: 'acknowledged'; sequence: number; timestamp: number }
  | { type: 'cancelled'; sequence: number; timestamp: number }
  | { type: 'request_location'; sequence: number };

export type Frame = UplinkFrame | DownlinkFrame;

function assertRange(name: string, value: number, min: number, max: number): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new ProtocolError(`${name} liegt ausserhalb des gueltigen Bereichs: ${value}`);
  }
}

function writeHeader(view: DataView, type: number, sequence: number): void {
  assertRange('sequence', sequence, 0, 0xffff);
  view.setUint8(0, PROTOCOL_VERSION);
  view.setUint8(1, type);
  view.setUint16(2, sequence, true);
}

export function encodeFrame(frame: Frame): Uint8Array {
  const buffer = new ArrayBuffer(MAX_FRAME_SIZE);
  const view = new DataView(buffer);
  let length: number;

  switch (frame.type) {
    case 'alarm_trigger': {
      assertRange('level', frame.level, 1, 3);
      assertRange('batteryPercent', frame.batteryPercent, 0, 100);
      assertRange('timestamp', frame.timestamp, 0, 0xffffffff);
      writeHeader(view, FRAME_TYPE.ALARM_TRIGGER, frame.sequence);
      view.setUint8(4, frame.level);
      view.setUint8(5, frame.batteryPercent);
      view.setUint32(6, frame.timestamp, true);
      length = frameLength(FRAME_TYPE.ALARM_TRIGGER);
      break;
    }
    case 'alarm_escalate': {
      assertRange('level', frame.level, 1, 3);
      assertRange('timestamp', frame.timestamp, 0, 0xffffffff);
      writeHeader(view, FRAME_TYPE.ALARM_ESCALATE, frame.sequence);
      view.setUint8(4, frame.level);
      view.setUint32(5, frame.timestamp, true);
      length = frameLength(FRAME_TYPE.ALARM_ESCALATE);
      break;
    }
    case 'location': {
      assertRange('latitudeE7', frame.latitudeE7, -900_000_000, 900_000_000);
      assertRange('longitudeE7', frame.longitudeE7, -1_800_000_000, 1_800_000_000);
      assertRange('accuracyMeters', frame.accuracyMeters, 0, 0xffff);
      assertRange('timestamp', frame.timestamp, 0, 0xffffffff);
      const sourceCode = LOCATION_SOURCES.indexOf(frame.source);
      if (sourceCode < 0) {
        throw new ProtocolError(`Unbekannte Standortquelle: ${frame.source}`);
      }
      writeHeader(view, FRAME_TYPE.LOCATION, frame.sequence);
      view.setInt32(4, frame.latitudeE7, true);
      view.setInt32(8, frame.longitudeE7, true);
      view.setUint16(12, frame.accuracyMeters, true);
      view.setUint8(14, sourceCode);
      view.setUint32(15, frame.timestamp, true);
      length = frameLength(FRAME_TYPE.LOCATION);
      break;
    }
    case 'heartbeat': {
      assertRange('batteryPercent', frame.batteryPercent, 0, 100);
      assertRange('rssiDbm', frame.rssiDbm, -128, 127);
      assertRange('firmwareMajor', frame.firmwareMajor, 0, 255);
      assertRange('firmwareMinor', frame.firmwareMinor, 0, 255);
      assertRange('timestamp', frame.timestamp, 0, 0xffffffff);
      writeHeader(view, FRAME_TYPE.HEARTBEAT, frame.sequence);
      view.setUint8(4, frame.batteryPercent);
      view.setInt8(5, frame.rssiDbm);
      view.setUint8(6, frame.firmwareMajor);
      view.setUint8(7, frame.firmwareMinor);
      view.setUint32(8, frame.timestamp, true);
      length = frameLength(FRAME_TYPE.HEARTBEAT);
      break;
    }
    case 'receipt': {
      assertRange('acknowledgedSequence', frame.acknowledgedSequence, 0, 0xffff);
      writeHeader(view, FRAME_TYPE.RECEIPT, frame.sequence);
      view.setUint16(4, frame.acknowledgedSequence, true);
      length = frameLength(FRAME_TYPE.RECEIPT);
      break;
    }
    case 'acknowledged':
    case 'cancelled': {
      assertRange('timestamp', frame.timestamp, 0, 0xffffffff);
      const type = frame.type === 'acknowledged' ? FRAME_TYPE.ACKNOWLEDGED : FRAME_TYPE.CANCELLED;
      writeHeader(view, type, frame.sequence);
      view.setUint32(4, frame.timestamp, true);
      length = frameLength(type);
      break;
    }
    case 'request_location': {
      writeHeader(view, FRAME_TYPE.REQUEST_LOCATION, frame.sequence);
      length = frameLength(FRAME_TYPE.REQUEST_LOCATION);
      break;
    }
  }

  return new Uint8Array(buffer, 0, length);
}

function expectLength(actual: number, type: number): void {
  const expected = frameLength(type);
  if (actual !== expected) {
    throw new ProtocolError(
      `Rahmen vom Typ 0x${type.toString(16)} muss ${expected} Byte lang sein, hat aber ${actual}`,
    );
  }
}

function toAlarmLevel(value: number): AlarmLevel {
  if (!isAlarmLevel(value)) {
    throw new ProtocolError(`Unbekannte Alarmstufe: ${value}`);
  }
  return value;
}

export function decodeFrame(bytes: Uint8Array): Frame {
  if (bytes.byteLength < HEADER_SIZE) {
    throw new ProtocolError('Rahmen ist kuerzer als der Kopf');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const version = view.getUint8(0);
  if (version !== PROTOCOL_VERSION) {
    throw new ProtocolError(`Unbekannte Protokollversion: ${version}`);
  }

  const type = view.getUint8(1);
  const sequence = view.getUint16(2, true);
  const length = bytes.byteLength;

  switch (type) {
    case FRAME_TYPE.ALARM_TRIGGER:
      expectLength(length, type);
      return {
        type: 'alarm_trigger',
        sequence,
        level: toAlarmLevel(view.getUint8(4)),
        batteryPercent: view.getUint8(5),
        timestamp: view.getUint32(6, true),
      };
    case FRAME_TYPE.ALARM_ESCALATE:
      expectLength(length, type);
      return {
        type: 'alarm_escalate',
        sequence,
        level: toAlarmLevel(view.getUint8(4)),
        timestamp: view.getUint32(5, true),
      };
    case FRAME_TYPE.LOCATION: {
      expectLength(length, type);
      const sourceCode = view.getUint8(14);
      const source = LOCATION_SOURCES[sourceCode];
      if (source === undefined) {
        throw new ProtocolError(`Unbekannte Standortquelle: ${sourceCode}`);
      }
      return {
        type: 'location',
        sequence,
        latitudeE7: view.getInt32(4, true),
        longitudeE7: view.getInt32(8, true),
        accuracyMeters: view.getUint16(12, true),
        source,
        timestamp: view.getUint32(15, true),
      };
    }
    case FRAME_TYPE.HEARTBEAT:
      expectLength(length, type);
      return {
        type: 'heartbeat',
        sequence,
        batteryPercent: view.getUint8(4),
        rssiDbm: view.getInt8(5),
        firmwareMajor: view.getUint8(6),
        firmwareMinor: view.getUint8(7),
        timestamp: view.getUint32(8, true),
      };
    case FRAME_TYPE.RECEIPT:
      expectLength(length, type);
      return { type: 'receipt', sequence, acknowledgedSequence: view.getUint16(4, true) };
    case FRAME_TYPE.ACKNOWLEDGED:
      expectLength(length, type);
      return { type: 'acknowledged', sequence, timestamp: view.getUint32(4, true) };
    case FRAME_TYPE.CANCELLED:
      expectLength(length, type);
      return { type: 'cancelled', sequence, timestamp: view.getUint32(4, true) };
    case FRAME_TYPE.REQUEST_LOCATION:
      expectLength(length, type);
      return { type: 'request_location', sequence };
    default:
      throw new ProtocolError(`Unbekannter Rahmentyp: 0x${type.toString(16)}`);
  }
}

const UPLINK_TYPES = new Set<Frame['type']>([
  'alarm_trigger',
  'alarm_escalate',
  'location',
  'heartbeat',
]);

export function isUplinkFrame(frame: Frame): frame is UplinkFrame {
  return UPLINK_TYPES.has(frame.type);
}

/** Wie decodeFrame, weist aber Rahmen ab, die nur das Backend senden darf. */
export function decodeUplinkFrame(bytes: Uint8Array): UplinkFrame {
  const frame = decodeFrame(bytes);
  if (!isUplinkFrame(frame)) {
    throw new ProtocolError(`Rahmentyp ${frame.type} ist kein Uplink`);
  }
  return frame;
}

export function decodeDownlinkFrame(bytes: Uint8Array): DownlinkFrame {
  const frame = decodeFrame(bytes);
  if (isUplinkFrame(frame)) {
    throw new ProtocolError(`Rahmentyp ${frame.type} ist kein Downlink`);
  }
  return frame;
}

/**
 * Liest mehrere Rahmen hintereinander.
 *
 * Die Antwort auf einen Uplink enthaelt die Empfangsbestaetigung und alles, was
 * sonst noch fuer das Geraet bereitlag. Weil jede Laenge fest ist, laesst sich der
 * Strom ohne Trennzeichen zerlegen.
 */
export function decodeAllFrames(bytes: Uint8Array): Frame[] {
  const frames: Frame[] = [];
  let offset = 0;

  while (offset < bytes.byteLength) {
    if (bytes.byteLength - offset < HEADER_SIZE) {
      throw new ProtocolError('Angehaengte Bytes ergeben keinen vollstaendigen Rahmen');
    }

    const type = bytes[offset + 1] ?? 0;
    const length = frameLength(type);
    if (length === 0 || offset + length > bytes.byteLength) {
      throw new ProtocolError(`Rahmen ab Byte ${offset} ist unvollstaendig oder unbekannt`);
    }

    frames.push(decodeFrame(bytes.subarray(offset, offset + length)));
    offset += length;
  }

  return frames;
}
