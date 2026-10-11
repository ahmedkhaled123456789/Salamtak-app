import type { Localized } from './i18n';

export type Gender = 'female' | 'male';
export type GenderPreference = Gender | 'any';
export type Availability = 'available' | 'limited' | 'unavailable';
export type NurseSort = 'recommended' | 'price-asc' | 'price-desc' | 'experience';

export interface Nurse {
  id: string;
  slug: string;
  name: Localized;
  role: Localized;
  gender: Gender;
  portrait: string;
  bio: Localized;
  city: Localized;
  serviceIds: string[];
  languages: Localized[];
  /** Only present when the profile provides it. */
  experienceYears?: number;
  /** Sample qualifications for demo profiles — never verified credentials. */
  qualifications?: Localized[];
  availability: Availability;
  nextAvailable?: string;
  dailyRateSample?: number;
  featured: boolean;
}

export interface NurseQuery {
  serviceId?: string;
  gender?: GenderPreference;
  availableOnly?: boolean;
  sort?: NurseSort;
  search?: string;
}