import { Redirect, usePathname } from 'expo-router';
import React from 'react';
import { useAuth } from '@/state/auth';

/** Sends signed-out visitors to sign-in and brings them back afterwards. Navigation is UX only: the API enforces access. */
export function RequireAuth({ children, role }: { children: React.ReactNode; role?: 'PATIENT' | 'NURSE' }) {
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();
  if (!isAuthenticated) return <Redirect href={{ pathname: '/sign-in', params: { next: pathname } }} />;
  if (role && user?.role !== role) return <Redirect href="/" />;
  return <>{children}</>;
}
