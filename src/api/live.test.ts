/**
 * Opt-in end-to-end check of the mobile API layer against a running care-backend.
 * Run against a DISPOSABLE local database only (never Atlas):
 *   LIVE_API=1 EXPO_PUBLIC_API_BASE_URL=http://localhost:5050 LIVE_NURSE_EMAIL=... LIVE_NURSE_PASSWORD=... npx jest src/api/live.test.ts
 */
import { authApi } from './auth';
import { bookingsApi } from './bookings';
import { catalogApi } from './catalog';
import { nurseApi } from './nurse';
import { ApiError, request } from './client';
import { saveTokens } from './tokens';
import { addDays, todayIso } from '@/lib/format';

const live = process.env.LIVE_API === '1' ? describe : describe.skip;

live('live backend', () => {
  jest.setTimeout(60_000);
  const email = `mobile-${Date.now()}@careflow-test.dev`;
  const password = 'Abcdefghi1x';
  let bookingId = '';

  it('serves the public catalogue', async () => {
    const services = await catalogApi.listServices();
    expect(services.length).toBeGreaterThan(5);
    expect(services[0]?.dailyRateSample).not.toBeUndefined();
    const nurses = await catalogApi.listNurses({});
    expect(nurses.length).toBeGreaterThan(0);
    expect(nurses[0]?.portrait).toMatch(/^http/);
  });

  it('registers and signs in a patient', async () => {
    const user = await authApi.signUp({ firstName: 'Mobile', lastName: 'Tester', email, phone: `+9715${String(Date.now()).slice(-8)}`, password, role: 'PATIENT' });
    expect(user.role).toBe('PATIENT');
    await saveTokens(null);
    await expect(authApi.signIn(email, 'WrongPassword1')).rejects.toMatchObject({ code: 'invalid_credentials' });
    const again = await authApi.signIn(email, password);
    expect(again.email).toBe(email);
    expect((await authApi.me()).id).toBe(again.id);
  });

  it('quotes, books idempotently and starts a payment without assuming success', async () => {
    const services = await catalogApi.listServices();
    const service = services[0]!;
    const nurse = (await catalogApi.listNurses({ serviceId: service.id }))[0]!;
    const draft = { serviceId: service.id, nurseId: nurse.id, startDate: addDays(todayIso(), 10 + Math.floor(Math.random() * 40)), days: 2, genderPreference: 'any' as const, address: '1 Palm Street' };
    const input = { draft, patientCity: 'Dubai', nurse };

    const quote = await bookingsApi.quote(input);
    expect(quote.payable).toBeGreaterThan(0);
    expect(quote.isEstimate).toBe(false);

    const key = `mob-live-${Date.now()}`;
    const first = await bookingsApi.create(input, key);
    const second = await bookingsApi.create(input, key);
    expect(second.id).toBe(first.id); // same idempotency key → same booking
    expect(first.status).toBe('PAYMENT_PENDING');
    expect(first.pricing?.payable).toBe(quote.payable);
    bookingId = first.id;

    const intent = await bookingsApi.startPayment(first.id);
    expect(['PENDING', 'PROCESSING']).toContain(intent.status);
    const after = await bookingsApi.get(first.id);
    expect(after.status).toBe('PAYMENT_PENDING'); // never paid until the provider webhook says so

    const list = await bookingsApi.list();
    expect(list.some((b) => b.id === bookingId)).toBe(true);
    expect((await bookingsApi.history(bookingId)).length).toBeGreaterThan(0);
  });

  it('lets a patient cancel a pending booking', async () => {
    const cancelled = await bookingsApi.cancel(bookingId);
    expect(cancelled.status).toBe('CANCELLED');
  });

  it('forbids a patient from nurse-only endpoints', async () => {
    await expect(nurseApi.me()).rejects.toBeInstanceOf(ApiError);
    await expect(bookingsApi.accept(bookingId)).rejects.toBeInstanceOf(ApiError);
  });

  const nurseEmail = process.env.LIVE_NURSE_EMAIL;
  (nurseEmail ? it : it.skip)('signs in a nurse and reads role-scoped data', async () => {
    await saveTokens(null);
    const user = await authApi.signIn(nurseEmail!, process.env.LIVE_NURSE_PASSWORD!);
    expect(user.role).toBe('NURSE');
    const me = await nurseApi.me();
    expect(me.currency).toBe('AED');
    const wallet = await nurseApi.wallet();
    expect(wallet.available).toBeGreaterThanOrEqual(0);
    const rules = await nurseApi.availability();
    expect(Array.isArray(rules)).toBe(true);
    const bookings = await bookingsApi.list();
    expect(Array.isArray(bookings)).toBe(true);
  });

  const adminEmail = process.env.LIVE_ADMIN_EMAIL;
  (nurseEmail && adminEmail ? it : it.skip)('walks a paid booking through nurse acceptance (webhook simulated by an admin, dev only)', async () => {
    await saveTokens(null);
    await authApi.signIn(email, password);
    const nurse = (await catalogApi.listNurses({})).find((n) => n.name.en.startsWith('Layla'))!;
    const serviceId = nurse.serviceIds[0]!;
    const draft = { serviceId, nurseId: nurse.id, startDate: addDays(todayIso(), 20 + Math.floor(Math.random() * 60)), days: 1, genderPreference: 'any' as const, address: '1 Palm Street' };
    const booking = await bookingsApi.create({ draft, patientCity: 'Dubai', nurse }, `mob-live-${Date.now()}`);
    const pay = await request<{ clientSecret: string }>('/payments/create', { method: 'POST', body: { bookingId: booking.id } });

    await saveTokens(null);
    await authApi.signIn(adminEmail!, process.env.LIVE_ADMIN_PASSWORD!);
    await request('/payments/dev/simulate', { method: 'POST', body: { providerTransactionId: pay.clientSecret.split('_secret_')[0], outcome: 'succeeded' } });

    await saveTokens(null);
    await authApi.signIn(email, password);
    let status = (await bookingsApi.get(booking.id)).status;
    for (let i = 0; i < 20 && status === 'PAYMENT_PENDING'; i++) {
      await new Promise((r) => setTimeout(r, 500));
      status = (await bookingsApi.get(booking.id)).status;
    }
    expect(status).toBe('NURSE_PENDING');

    await saveTokens(null);
    await authApi.signIn(nurseEmail!, process.env.LIVE_NURSE_PASSWORD!);
    const seen = (await bookingsApi.list()).find((b) => b.id === booking.id);
    expect(seen?.patientName).toBeTruthy();
    expect(seen?.nurseEarning?.amount).toBeGreaterThan(0);
    expect(seen?.pricing).toBeUndefined(); // nurse view never carries the patient's pricing
    const accepted = await bookingsApi.accept(booking.id);
    expect(['NURSE_ACCEPTED', 'CONFIRMED']).toContain(accepted.status);
    await expect(bookingsApi.accept(booking.id)).rejects.toBeInstanceOf(ApiError); // the state machine rejects a repeat (400)
  });
});
