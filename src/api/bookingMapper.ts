import { config } from '@/lib/config';
import { addDays } from '@/lib/format';
import type { Booking, BookingStatus, HistoryEntry, PriceLine } from '@/types/booking';

export const MIN_PER_DAY = 1440;
/** Local wall-clock start of a care day; the API stores UTC and checks it against the platform timezone. */
export const START_TIME = '09:00:00';

function offsetMinutes(): number {
  const m = /^([+-])(\d{2}):(\d{2})$/.exec(config.platformUtcOffset);
  return m ? (m[1] === '-' ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
}

/** Calendar date (yyyy-mm-dd) of an instant in the platform timezone. */
export function platformDate(iso: string): string {
  return new Date(new Date(iso).getTime() + offsetMinutes() * 60_000).toISOString().slice(0, 10);
}

export function careWindow(startDate: string, days: number): { startDateTime: string; endDateTime: string } {
  const start = new Date(`${startDate}T${START_TIME}${config.platformUtcOffset}`);
  return {
    startDateTime: start.toISOString(),
    endDateTime: new Date(start.getTime() + days * MIN_PER_DAY * 60_000).toISOString(),
  };
}

interface ApiLine {
  code: string;
  label: string;
  quantity: number;
  unitAmountMinor: number;
  amountMinor: number;
}
export interface ApiBooking {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  statusReason?: string | null;
  service: { id: string; name: string; slug: string };
  nurse?: { id: string; displayName: string };
  patient?: { displayName: string };
  startDateTime: string;
  endDateTime: string;
  durationMinutes: number;
  notes?: string | null;
  holdExpiresAt?: string | null;
  nurseResponseDeadline?: string | null;
  createdAt: string;
  location: { address: string | null; city: string | null };
  pricing?: {
    currency: string;
    lines: ApiLine[];
    baseMinor: number;
    surchargeMinor: number;
    feesMinor: number;
    discountMinor: number;
    patientPayableMinor: number;
  };
  earnings?: { currency: string; nurseEarningMinor: number };
  refund?: { status: string; amountMinor: number; percent: number } | null;
}
export interface ApiHistory {
  newState: BookingStatus;
  createdAt: string;
}

export const toLine = (l: ApiLine): PriceLine => ({
  code: l.code,
  label: l.label,
  quantity: l.quantity,
  unitAmount: l.unitAmountMinor / 100,
  amount: l.amountMinor / 100,
});

export function toBooking(api: ApiBooking): Booking {
  const days = Math.max(1, Math.ceil(api.durationMinutes / MIN_PER_DAY));
  return {
    id: api.id,
    reference: api.bookingNumber,
    status: api.status,
    statusReason: api.statusReason ?? undefined,
    serviceId: api.service.id,
    serviceName: api.service.name,
    serviceSlug: api.service.slug,
    nurseId: api.nurse?.id,
    nurseName: api.nurse?.displayName,
    patientName: api.patient?.displayName,
    startDateTime: api.startDateTime,
    endDateTime: api.endDateTime,
    startDate: platformDate(api.startDateTime),
    endDate: addDays(platformDate(api.startDateTime), days - 1),
    days,
    address: api.location.address ?? '',
    city: api.location.city ?? '',
    notes: api.notes ?? undefined,
    createdAt: api.createdAt,
    holdExpiresAt: api.holdExpiresAt ?? undefined,
    nurseResponseDeadline: api.nurseResponseDeadline ?? undefined,
    pricing: api.pricing && {
      currency: api.pricing.currency,
      lines: api.pricing.lines.map(toLine),
      payable: api.pricing.patientPayableMinor / 100,
      base: api.pricing.baseMinor / 100,
      surcharge: api.pricing.surchargeMinor / 100,
      fees: api.pricing.feesMinor / 100,
      discount: api.pricing.discountMinor / 100,
    },
    nurseEarning: api.earnings && { amount: api.earnings.nurseEarningMinor / 100, currency: api.earnings.currency },
    refund: api.refund ? { status: api.refund.status, amount: api.refund.amountMinor / 100, percent: api.refund.percent } : undefined,
  };
}

export const toHistory = (h: ApiHistory): HistoryEntry => ({ status: h.newState, at: h.createdAt });
