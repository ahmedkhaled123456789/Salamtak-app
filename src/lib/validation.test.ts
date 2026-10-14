import { buildSchemas } from './validation';
import { safeNext } from './routes';

const s = buildSchemas((key) => String(key));

describe('validation', () => {
  it('accepts the backend password policy and rejects weaker ones', () => {
    const base = { firstName: 'Sara', lastName: 'Ali', email: 'sara@example.com', phone: '+971501234567', confirm: 'Abcdefghi1', terms: true as const };
    expect(s.signUp.safeParse({ ...base, password: 'Abcdefghi1', confirm: 'Abcdefghi1' }).success).toBe(true);
    expect(s.signUp.safeParse({ ...base, password: 'short1A', confirm: 'short1A' }).success).toBe(false);
    expect(s.signUp.safeParse({ ...base, password: 'abcdefghi1', confirm: 'abcdefghi1' }).success).toBe(false);
    expect(s.signUp.safeParse({ ...base, password: 'ABCDEFGHI1', confirm: 'ABCDEFGHI1' }).success).toBe(false);
    expect(s.signUp.safeParse({ ...base, password: 'Abcdefghij', confirm: 'Abcdefghij' }).success).toBe(false);
  });

  it('requires an E.164 phone number and matching passwords', () => {
    const ok = { firstName: 'Sara', lastName: 'Ali', email: 'sara@example.com', password: 'Abcdefghi1', confirm: 'Abcdefghi1', terms: true as const };
    expect(s.signUp.safeParse({ ...ok, phone: '0501234567' }).success).toBe(false);
    expect(s.signUp.safeParse({ ...ok, phone: '+971501234567' }).success).toBe(true);
    expect(s.signUp.safeParse({ ...ok, phone: '+971501234567', confirm: 'nope' }).success).toBe(false);
  });

  it('validates sign-in and forgot-password emails', () => {
    expect(s.signIn.safeParse({ email: 'bad', password: 'x' }).success).toBe(false);
    expect(s.forgot.safeParse({ email: 'a@b.co' }).success).toBe(true);
  });
});

describe('safeNext', () => {
  it('only allows in-app absolute paths', () => {
    expect(safeNext('/bookings')).toBe('/bookings');
    expect(safeNext('//evil.com')).toBeUndefined();
    expect(safeNext('https://evil.com')).toBeUndefined();
    expect(safeNext(undefined)).toBeUndefined();
  });

  it('rejects backslash, encoded and whitespace tricks', () => {
    expect(safeNext('/\\evil.com')).toBeUndefined();
    expect(safeNext('/%5Cevil.com')).toBeUndefined();
    expect(safeNext('/%2F/evil.com')).toBeUndefined();
    expect(safeNext('/ /evil.com')).toBeUndefined();
    expect(safeNext('/%E0%A4%A')).toBeUndefined();
    expect(safeNext(['/bookings', '//evil.com'])).toBe('/bookings');
    expect(safeNext('/bookings/123?tab=history')).toBe('/bookings/123?tab=history');
  });
});
