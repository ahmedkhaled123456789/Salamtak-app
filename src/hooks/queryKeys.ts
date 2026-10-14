import type { NurseQuery } from '@/types/nurse';

export const queryKeys = {
  catalog: ['catalog'] as const,
  services: ['services'] as const,
  service: (slug: string) => ['service', slug] as const,
  nurses: (q: NurseQuery) => ['nurses', q] as const,
  nurse: (id: string) => ['nurse', id] as const,
  bookings: ['bookings'] as const,
  bookingPages: ['bookings', 'pages'] as const,
  booking: (id: string) => ['booking', id] as const,
  history: (id: string) => ['booking-history', id] as const,
  quote: (key: unknown) => ['quote', key] as const,
  patientProfile: ['patient-profile'] as const,
  nurseSelf: ['nurse-self'] as const,
  availability: ['nurse-availability'] as const,
  wallet: ['wallet'] as const,
  transactions: ['wallet-transactions'] as const,
};
