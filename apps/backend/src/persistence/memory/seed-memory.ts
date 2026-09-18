import { buildDemoData } from '../demo-data.js';
import type { MemoryContactStore, MemoryDeviceStore, MemoryPartnerStore } from './memory-store.js';

/** Legt die Demo-Daten im Arbeitsspeicher an (STORAGE=memory). */
export function seedMemory(
  devices: MemoryDeviceStore,
  contacts: MemoryContactStore,
  partners: MemoryPartnerStore,
): void {
  const data = buildDemoData();

  data.devices.forEach((device) => devices.put(device));
  data.contacts.forEach((contact) => contacts.put(contact));
  data.partners.forEach((partner) => partners.put(partner));
}
