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
  return value && value.startsWith('/') && !value.startsWith('//') ? (value as Href) : undefined;
}
