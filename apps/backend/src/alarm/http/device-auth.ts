import { UnauthorizedException } from '@nestjs/common';
import { verifySecret } from '../../common/secrets.js';
import type { DeviceRecord, DeviceStore } from '../../persistence/ports.js';

/**
 * Geraetepruefung fuer die jetzige Ausbaustufe: Geraete-Kennung im Pfad oder im
 * Kopf, Geheimnis als Bearer-Token. Im Feldeinsatz wird daraus ein Zertifikat je
 * Geraet auf der Transportschicht (siehe docs/entscheidungen/0003).
 */
export async function authenticateDevice(
  devices: DeviceStore,
  deviceId: string | undefined,
  authorizationHeader: string | undefined,
): Promise<DeviceRecord> {
  const secret = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice('Bearer '.length).trim()
    : null;

  if (!deviceId || !secret) {
    throw new UnauthorizedException('Geraetekennung oder Geheimnis fehlt');
  }

  const device = await devices.findById(deviceId);
  if (!device || !verifySecret(secret, device.secretHash)) {
    // Bewusst dieselbe Meldung wie oben: von aussen soll nicht erkennbar sein,
    // ob es die Kennung gibt.
    throw new UnauthorizedException('Geraetekennung oder Geheimnis fehlt');
  }

  return device;
}
