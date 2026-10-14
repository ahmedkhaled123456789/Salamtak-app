import type { Localized } from '@/types/i18n';

/**
 * Service area: the United Arab Emirates (the backend prices in AED on Asia/Dubai time).
 * Coordinates are city centres — used only when the patient hasn't shared a precise location — so the API can
 * check the booking address against the nurse's service radius. Same data as website/src/data/emirates.ts.
 */
export interface Emirate {
  id: string;
  name: Localized;
  latitude: number;
  longitude: number;
}

export const emirates: Emirate[] = [
{ id: 'dubai', name: { en: 'Dubai', ar: 'دبي' }, latitude: 25.2048, longitude: 55.2708 },
{ id: 'abu-dhabi', name: { en: 'Abu Dhabi', ar: 'أبوظبي' }, latitude: 24.4539, longitude: 54.3773 },
{ id: 'al-ain', name: { en: 'Al Ain', ar: 'العين' }, latitude: 24.2075, longitude: 55.7447 },
{ id: 'sharjah', name: { en: 'Sharjah', ar: 'الشارقة' }, latitude: 25.3463, longitude: 55.4209 },
{ id: 'ajman', name: { en: 'Ajman', ar: 'عجمان' }, latitude: 25.4052, longitude: 55.5136 },
{ id: 'umm-al-quwain', name: { en: 'Umm Al Quwain', ar: 'أم القيوين' }, latitude: 25.5647, longitude: 55.5552 },
{ id: 'ras-al-khaimah', name: { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' }, latitude: 25.8007, longitude: 55.9762 },
{ id: 'fujairah', name: { en: 'Fujairah', ar: 'الفجيرة' }, latitude: 25.1288, longitude: 56.3265 }];


export const DEFAULT_EMIRATE: Emirate = { id: 'dubai', name: { en: 'Dubai', ar: 'دبي' }, latitude: 25.2048, longitude: 55.2708 };

const norm = (s: string) => s.toLowerCase().replace(/[\s\-_'’.]/g, '').replace(/^ال/, '');

/** Finds an emirate from an id, an English or Arabic name, or free text that starts with one ("Dubai Marina"). */
export function findEmirate(value: string | null | undefined): Emirate | undefined {
  if (!value?.trim()) return undefined;
  const v = norm(value);
  return emirates.find((e) => e.id === value || norm(e.name.en) === v || norm(e.name.ar) === v) ??
  emirates.find((e) => v.startsWith(norm(e.name.en)) || v.startsWith(norm(e.name.ar)));
}
