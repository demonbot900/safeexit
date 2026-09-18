/**
 * Erzeugt c/test/generated_vectors.h aus testvectors/button-frames.json.
 *
 * Damit pruefen die C-Tests genau dieselben Beispiele wie die TypeScript-Tests,
 * ohne dass die Firmware einen JSON-Parser braucht. Die erzeugte Datei wird
 * eingecheckt; die CI prueft, dass sie zum JSON passt.
 *
 * Aufruf: npm run protocols:generate
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const vectorsPath = new URL('../testvectors/button-frames.json', import.meta.url);
const outputPath = new URL('../c/test/generated_vectors.h', import.meta.url);

const vectors = JSON.parse(readFileSync(vectorsPath, 'utf8'));

const LOCATION_SOURCE_CONSTANT = {
  gnss: 'SE_LOCATION_SOURCE_GNSS',
  cell: 'SE_LOCATION_SOURCE_CELL',
  phone: 'SE_LOCATION_SOURCE_PHONE',
};

function payloadInitializer(frame) {
  switch (frame.type) {
    case 'alarm_trigger':
      return `{ .alarm_trigger = { ${frame.level}, ${frame.batteryPercent}, ${frame.timestamp}u } }`;
    case 'alarm_escalate':
      return `{ .alarm_escalate = { ${frame.level}, ${frame.timestamp}u } }`;
    case 'location':
      return `{ .location = { ${frame.latitudeE7}, ${frame.longitudeE7}, ${frame.accuracyMeters}, ${LOCATION_SOURCE_CONSTANT[frame.source]}, ${frame.timestamp}u } }`;
    case 'heartbeat':
      return `{ .heartbeat = { ${frame.batteryPercent}, ${frame.rssiDbm}, ${frame.firmwareMajor}, ${frame.firmwareMinor}, ${frame.timestamp}u } }`;
    case 'receipt':
      return `{ .receipt = { ${frame.acknowledgedSequence} } }`;
    case 'acknowledged':
      return `{ .acknowledged = { ${frame.timestamp}u } }`;
    case 'cancelled':
      return `{ .cancelled = { ${frame.timestamp}u } }`;
    case 'request_location':
      return `{ .receipt = { 0 } }`;
    default:
      throw new Error(`Unbekannter Rahmentyp im Testvektor: ${frame.type}`);
  }
}

const TYPE_CONSTANT = {
  alarm_trigger: 'SE_FRAME_ALARM_TRIGGER',
  alarm_escalate: 'SE_FRAME_ALARM_ESCALATE',
  location: 'SE_FRAME_LOCATION',
  heartbeat: 'SE_FRAME_HEARTBEAT',
  receipt: 'SE_FRAME_RECEIPT',
  acknowledged: 'SE_FRAME_ACKNOWLEDGED',
  cancelled: 'SE_FRAME_CANCELLED',
  request_location: 'SE_FRAME_REQUEST_LOCATION',
};

function bytesInitializer(hex) {
  const bytes = hex.match(/../g) ?? [];
  return bytes.map((byte) => `0x${byte}`).join(', ');
}

const all = [...vectors.uplink, ...vectors.downlink];

const lines = [
  '/*',
  ' * Erzeugte Datei. Nicht von Hand aendern.',
  ' * Quelle: packages/protocols/testvectors/button-frames.json',
  ' * Erzeugen mit: npm run protocols:generate',
  ' */',
  '#ifndef SAFEEXIT_GENERATED_VECTORS_H',
  '#define SAFEEXIT_GENERATED_VECTORS_H',
  '',
  '#include "safeexit/protocol.h"',
  '',
  'typedef struct {',
  '    const char *name;',
  '    const uint8_t *bytes;',
  '    size_t length;',
  '    se_frame_t frame;',
  '} se_test_vector_t;',
  '',
];

all.forEach((vector, index) => {
  lines.push(
    `static const uint8_t se_vector_bytes_${index}[] = { ${bytesInitializer(vector.hex)} };`,
  );
});

lines.push('', 'static const se_test_vector_t se_test_vectors[] = {');
all.forEach((vector, index) => {
  const { frame } = vector;
  lines.push(`    { "${vector.name}", se_vector_bytes_${index}, sizeof se_vector_bytes_${index},`);
  lines.push(
    `      { ${TYPE_CONSTANT[frame.type]}, ${frame.sequence}, ${payloadInitializer(frame)} } },`,
  );
});
lines.push('};', '');
lines.push(
  'static const size_t se_test_vector_count = sizeof se_test_vectors / sizeof se_test_vectors[0];',
);
lines.push('', '#endif /* SAFEEXIT_GENERATED_VECTORS_H */', '');

writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`${all.length} Testvektoren geschrieben nach ${fileURLToPath(outputPath)}`);
