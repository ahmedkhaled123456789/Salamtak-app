import type { Booking, BookingDraft, HistoryEntry, PaymentIntent, PriceQuote } from '@/types/booking';
import type { Nurse } from '@/types/nurse';
import { ApiError, request, type Page } from './client';
import { careWindow, toBooking, toHistory, toLine, type ApiBooking, type ApiHistory } from './bookingMapper';

/** City-centre coordinates the website uses: the API checks a booking address against the nurse's service radius. */
const CITY_COORDS: Record<string, { latitude: number; longitude: number }> = {
  riyadh: { latitude: 24.7136, longitude: 46.6753 },
  jeddah: { latitude: 21.4858, longitude: 39.1925 },
  dammam: { latitude: 26.4207, longitude: 50.0888 },
  dubai: { latitude: 25.2048, longitude: 55.2708 },
  'abu dhabi': { latitude: 24.4539, longitude: 54.3773 },
  sharjah: { latitude: 25.3463, longitude: 55.4209 },
};
const DEFAULT_COORDS = CITY_COORDS.dubai!;

export function coordsFor(...cities: (string | undefined)[]): { latitude: number; longitude: number } {
  for (const c of cities) {
    const hit = c ? CITY_COORDS[c.trim().toLowerCase()] : undefined;
    if (hit) return hit;
  }
  return DEFAULT_COORDS;
}

interface ApiQuote {
  quoteToken: string;
  expiresAt: string;
  currency: string;
  rateMinor: number;
  lines: Parameters<typeof toLine>[0][];
  baseMinor: number;
  surchargeMinor: number;
  feesMinor: number;
  discountMinor: number;
  patientPayableMinor: number;
}

const toQuote = (q: ApiQuote, days: number): PriceQuote => ({
  quoteToken: q.quoteToken,
  expiresAt: q.expiresAt,
  currency: q.currency,
  rate: q.rateMinor / 100,
  days,
  lines: q.lines.map(toLine),
  base: q.baseMinor / 100,
  surcharge: q.surchargeMinor / 100,
  fees: q.feesMinor / 100,
  discount: q.discountMinor / 100,
  payable: q.patientPayableMinor / 100,
  isEstimate: false,
});

interface ApiPayment {
  id: string;
  bookingId: string;
  status: PaymentIntent['status'];
  redirectUrl: string | null;
}

export interface QuoteInput {
  draft: BookingDraft;
  /** Patient's city and the nurse, used only to pick coordinates for the radius check. */
  patientCity?: string;
  nurse?: Nurse;
}

function locationFor({ patientCity, nurse }: QuoteInput) {
  return coordsFor(patientCity, nurse?.city.en);
}

/** Quote token per idempotency key, so a retry (same key) sends an identical body and the backend recognises it. */
const quoteByKey = new Map<string, ApiQuote>();

export const bookingsApi = {
  /** Server-calculated price. Requires an authenticated patient. */
  async quote(input: QuoteInput): Promise<PriceQuote> {
    const { draft } = input;
    if (!draft.serviceId || !draft.nurseId || !draft.startDate) throw new ApiError('validation', 'quote_incomplete');
    const q = await request<ApiQuote>('/bookings/quote', {
      method: 'POST',
      body: {
        serviceId: draft.serviceId,
        nurseId: draft.nurseId,
        ...careWindow(draft.startDate, draft.days),
        location: locationFor(input),
        ...(draft.genderPreference !== 'any' && { genderPreference: draft.genderPreference.toUpperCase() }),
      },
    });
    return toQuote(q, draft.days);
  },

  /** Quotes again (a quote token is single-purpose) and creates the booking under the wizard's idempotency key. */
  async create(input: QuoteInput, idempotencyKey: string): Promise<Booking> {
    const { draft } = input;
    if (!draft.serviceId || !draft.nurseId || !draft.startDate) throw new ApiError('validation', 'booking_incomplete');
    const when = careWindow(draft.startDate, draft.days);
    const coords = locationFor(input);
    let quote = quoteByKey.get(idempotencyKey);
    if (!quote || new Date(quote.expiresAt).getTime() < Date.now() + 30_000) {
      quote = await request<ApiQuote>('/bookings/quote', {
        method: 'POST',
        body: {
          serviceId: draft.serviceId,
          nurseId: draft.nurseId,
          ...when,
          location: coords,
          ...(draft.genderPreference !== 'any' && { genderPreference: draft.genderPreference.toUpperCase() }),
        },
      });
      quoteByKey.set(idempotencyKey, quote);
    }
    const created = await request<ApiBooking>('/bookings', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: {
        serviceId: draft.serviceId,
        nurseId: draft.nurseId,
        ...when,
        location: {
          ...coords,
          address: draft.address ?? '',
          city: input.patientCity ?? input.nurse?.city.en ?? '',
        },
        ...(draft.genderPreference !== 'any' && { genderPreference: draft.genderPreference.toUpperCase() }),
        ...(draft.notes?.trim() && { notes: draft.notes.trim() }),
        quoteToken: quote.quoteToken,
      },
    });
    return toBooking(created);
  },

  async list(): Promise<Booking[]> {
    const res = await request<Page<ApiBooking>>('/bookings?limit=100');
    return res.items.map(toBooking);
  },

  async get(id: string): Promise<Booking> {
    return toBooking(await request<ApiBooking>(`/bookings/${encodeURIComponent(id)}`));
  },

  async history(id: string): Promise<HistoryEntry[]> {
    const res = await request<Page<ApiHistory>>(`/bookings/${encodeURIComponent(id)}/history`);
    return res.items.map(toHistory);
  },

  async cancel(id: string): Promise<Booking> {
    return toBooking(await request<ApiBooking>(`/bookings/${encodeURIComponent(id)}/cancel`, { method: 'POST' }));
  },

  /* Nurse actions — the backend's state machine decides what is legal; a 409 is shown inline. */
  async accept(id: string): Promise<Booking> {
    return toBooking(await request<ApiBooking>(`/bookings/${encodeURIComponent(id)}/accept`, { method: 'POST' }));
  },
  async reject(id: string, reason?: string): Promise<Booking> {
    return toBooking(
      await request<ApiBooking>(`/bookings/${encodeURIComponent(id)}/reject`, { method: 'POST', body: reason ? { reason } : {} }),
    );
  },
  async start(id: string): Promise<Booking> {
    return toBooking(await request<ApiBooking>(`/bookings/${encodeURIComponent(id)}/start`, { method: 'POST' }));
  },
  async complete(id: string): Promise<Booking> {
    return toBooking(await request<ApiBooking>(`/bookings/${encodeURIComponent(id)}/complete`, { method: 'POST' }));
  },

  /** Starts a payment. Success is only ever read back from the booking/payment status, never assumed. */
  async startPayment(bookingId: string): Promise<PaymentIntent> {
    const p = await request<ApiPayment>('/payments/create', { method: 'POST', body: { bookingId } });
    return { id: p.id, bookingId: p.bookingId, status: p.status, redirectUrl: p.redirectUrl };
  },
  async payment(id: string): Promise<PaymentIntent> {
    const p = await request<ApiPayment>(`/payments/${encodeURIComponent(id)}`);
    return { id: p.id, bookingId: p.bookingId, status: p.status, redirectUrl: p.redirectUrl };
  },
};
