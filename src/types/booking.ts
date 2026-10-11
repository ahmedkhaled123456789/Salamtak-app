import type { GenderPreference } from './nurse';

/** The backend's 16 booking states, shown as-is (the website collapses them; the app does not). */
export const BOOKING_STATUSES = [
  'PENDING',
  'PAYMENT_PENDING',
  'PAID',
  'NURSE_PENDING',
  'NURSE_ACCEPTED',
  'NURSE_REJECTED',
  'CONFIRMED',
  'CARE_STARTED',
  'CARE_IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
  'EXPIRED',
  'REFUND_PENDING',
  'REFUNDED',
  'DISPUTED',
  'FAILED',
] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export type BookingTab = 'upcoming' | 'in_progress' | 'completed' | 'cancelled';

export interface BookingDraft {
  serviceId?: string;
  startDate?: string;
  days: number;
  genderPreference: GenderPreference;
  nurseId?: string;
  address?: string;
  notes?: string;
}

export interface PriceLine {
  code: 'BASE' | 'WEEKEND_SURCHARGE' | 'HOLIDAY_SURCHARGE' | 'FEE' | 'DISCOUNT' | string;
  label: string;
  quantity: number;
  unitAmount: number;
  amount: number;
}

/** Server-calculated price. `payable` is the only amount the patient is asked to pay. */
export interface PriceQuote {
  quoteToken?: string;
  expiresAt?: string;
  currency: string;
  rate: number;
  days: number;
  lines: PriceLine[];
  base: number;
  surcharge: number;
  fees: number;
  discount: number;
  payable: number;
  /** true = local estimate (daily rate x days) shown before the backend can quote */
  isEstimate: boolean;
}

export interface BookingPricing {
  currency: string;
  lines: PriceLine[];
  payable: number;
  base: number;
  surcharge: number;
  fees: number;
  discount: number;
}

export interface Booking {
  id: string;
  reference: string;
  status: BookingStatus;
  statusReason?: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  nurseId?: string;
  nurseName?: string;
  patientName?: string;
  startDateTime: string;
  endDateTime: string;
  /** Local calendar dates in the platform timezone */
  startDate: string;
  endDate: string;
  days: number;
  address: string;
  city: string;
  notes?: string;
  createdAt: string;
  holdExpiresAt?: string;
  nurseResponseDeadline?: string;
  pricing?: BookingPricing;
  /** Nurse view only */
  nurseEarning?: { amount: number; currency: string };
  refund?: { status: string; amount: number; percent: number };
}

export interface HistoryEntry {
  status: BookingStatus;
  at: string;
}

export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';

export interface PaymentIntent {
  id: string;
  bookingId: string;
  status: PaymentStatus;
  redirectUrl: string | null;
}
