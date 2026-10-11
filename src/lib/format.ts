import type { Locale } from '@/types/i18n';

/** Gregorian calendar for both locales so dates match booking records. */
export function intlLocale(locale: Locale): string {
  return locale === 'ar' ? 'ar-u-ca-gregory' : 'en-GB';
}

function safe<T>(fn: () => T, fallback: () => T): T {
  try {
    return fn();
  } catch {
    return fallback();
  }
}

export function formatCurrency(amount: number, currency: string, locale: Locale): string {
  return safe(
    () => new Intl.NumberFormat(intlLocale(locale), { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount),
    () => `${currency} ${Math.round(amount)}`,
  );
}

export function formatNumber(value: number, locale: Locale): string {
  return safe(() => new Intl.NumberFormat(intlLocale(locale)).format(value), () => String(value));
}

export function formatDate(
  iso: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return safe(
    () => new Intl.DateTimeFormat(intlLocale(locale), { ...options, timeZone: /^\d{4}-\d{2}-\d{2}$/.test(iso) ? 'UTC' : undefined }).format(d),
    () => d.toDateString(),
  );
}

export function formatTime(iso: string, locale: Locale): string {
  return safe(
    () => new Intl.DateTimeFormat(intlLocale(locale), { hour: '2-digit', minute: '2-digit' }).format(new Date(iso)),
    () => iso,
  );
}

/** Days-of-care label with correct Arabic plural forms (mirrors the website). */
export function daysLabel(n: number, locale: Locale): string {
  const numeric = formatNumber(n, locale);
  if (locale === 'en') return `${numeric} ${n === 1 ? 'day' : 'days'}`;
  if (n === 1) return 'يوم واحد';
  if (n === 2) return 'يومان';
  if (n <= 10) return `${numeric} أيام`;
  return `${numeric} يوماً`;
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Local calendar date (yyyy-mm-dd) of the user's device. */
export function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
export function todayIso(): string {
  return toIsoDate(new Date());
}
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number];
  return toIsoDate(new Date(y, m - 1, d + days));
}
export const minorToMajor = (minor: number): number => minor / 100;
