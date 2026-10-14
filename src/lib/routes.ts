import type { Href } from 'expo-router';

/** Landing route per role after sign-in. */
export function homeFor(role: string | undefined): Href {
  if (role === 'NURSE') return '/dashboard';
  if (role === 'ADMIN' || role === 'FINANCE_APPROVER') return '/staff-blocked';
  return '/';
}

/** Only allow in-app relative return paths (no open redirects through a crafted `next` param). */
export function safeNext(next: string | string[] | undefined): Href | undefined {
  const value = Array.isArray(next) ? next[0] : next;
  if (!value || !value.startsWith('/') || value.startsWith('//')) return undefined;
  // backslashes and whitespace/control characters can be normalised into another origin (`/\host`)
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    return undefined;
  }
  if (decoded.startsWith('//') || /[\\\s\u0000-\u001f]/.test(decoded)) return undefined;
  return value as Href;
}
