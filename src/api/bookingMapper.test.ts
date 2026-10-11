import { careWindow, platformDate, toBooking, type ApiBooking } from './bookingMapper';

describe('care window', () => {
  it('starts at 09:00 platform time and lasts whole 24h days', () => {
    const w = careWindow('2026-10-12', 3);
    expect(w.startDateTime).toBe('2026-10-12T05:00:00.000Z'); // 09:00 at +04:00
    expect(new Date(w.endDateTime).getTime() - new Date(w.startDateTime).getTime()).toBe(3 * 24 * 3600 * 1000);
  });

  it('maps an instant back to the platform calendar date', () => {
    expect(platformDate('2026-10-12T05:00:00.000Z')).toBe('2026-10-12');
    expect(platformDate('2026-10-12T21:00:00.000Z')).toBe('2026-10-13'); // 01:00 next day at +04:00
  });
});

const api: ApiBooking = {
  id: 'b1',
  bookingNumber: 'BK-1',
  status: 'PAYMENT_PENDING',
  service: { id: 's1', name: 'Elderly Care', slug: 'elderly-care' },
  nurse: { id: 'n1', displayName: 'Layla H.' },
  startDateTime: '2026-10-12T05:00:00.000Z',
  endDateTime: '2026-10-15T05:00:00.000Z',
  durationMinutes: 3 * 1440,
  createdAt: '2026-10-10T08:00:00.000Z',
  location: { address: '1 Palm St', city: 'Dubai' },
  pricing: {
    currency: 'AED',
    lines: [{ code: 'BASE', label: 'Care', quantity: 3, unitAmountMinor: 42000, amountMinor: 126000 }],
    baseMinor: 126000,
    surchargeMinor: 0,
    feesMinor: 5000,
    discountMinor: 0,
    patientPayableMinor: 131000,
  },
};

describe('toBooking', () => {
  it('converts minor units to major and derives dates and days', () => {
    const b = toBooking(api);
    expect(b.days).toBe(3);
    expect(b.startDate).toBe('2026-10-12');
    expect(b.endDate).toBe('2026-10-14');
    expect(b.pricing?.payable).toBe(1310);
    expect(b.pricing?.lines[0]?.amount).toBe(1260);
    expect(b.status).toBe('PAYMENT_PENDING');
  });

  it('keeps nurse-only earning separate from patient pricing', () => {
    const b = toBooking({ ...api, pricing: undefined, earnings: { currency: 'AED', nurseEarningMinor: 100000 } });
    expect(b.pricing).toBeUndefined();
    expect(b.nurseEarning).toEqual({ amount: 1000, currency: 'AED' });
  });
});
