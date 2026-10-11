import { useQueryClient } from '@tanstack/react-query';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '@/api/auth';
import { onSessionExpired } from '@/api/client';
import { getTokens, loadTokens } from '@/api/tokens';
import type { AccountUser, SignUpInput } from '@/types/auth';

type Status = 'loading' | 'anonymous' | 'authenticated';

interface AuthValue {
  status: Status;
  user: AccountUser | null;
  isAuthenticated: boolean;
  /** True after the session ended on its own (refresh failed), so the UI can explain why. */
  sessionExpired: boolean;
  signIn: (email: string, password: string) => Promise<AccountUser>;
  signUp: (input: SignUpInput) => Promise<AccountUser>;
  signOut: () => Promise<void>;
  setUser: (user: AccountUser) => void;
  clearExpired: () => void;
}

const AuthContext = createContext<AuthValue | null>(null);

/** Restores the session from secure storage (refreshing the access token through /users/me) and exposes role + actions. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const client = useQueryClient();
  const [status, setStatus] = useState<Status>('loading');
  const [user, setUserState] = useState<AccountUser | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const tokens = await loadTokens();
      if (!tokens) {
        if (alive) setStatus('anonymous');
        return;
      }
      try {
        const me = await authApi.me();
        if (!alive) return;
        setUserState(me);
        setStatus('authenticated');
      } catch {
        // Offline at launch: the stored tokens stay in secure storage (only a refresh failure clears them),
        // the app opens signed out and a fresh sign-in replaces them.
        if (alive) setStatus('anonymous');
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(
    () =>
      onSessionExpired(() => {
        client.clear();
        setUserState(null);
        setStatus('anonymous');
        setSessionExpired(true);
      }),
    [client],
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await authApi.signIn(email.trim(), password);
    setUserState(u);
    setStatus('authenticated');
    setSessionExpired(false);
    return u;
  }, []);

  const signUp = useCallback(async (input: SignUpInput) => {
    const u = await authApi.signUp(input);
    setUserState(u);
    setStatus('authenticated');
    setSessionExpired(false);
    return u;
  }, []);

  const signOut = useCallback(async () => {
    const refresh = getTokens()?.refreshToken;
    await authApi.signOut(refresh);
    client.clear();
    setUserState(null);
    setStatus('anonymous');
  }, [client]);

  const value = useMemo<AuthValue>(
    () => ({
      status,
      user,
      isAuthenticated: status === 'authenticated',
      sessionExpired,
      signIn,
      signUp,
      signOut,
      setUser: setUserState,
      clearExpired: () => setSessionExpired(false),
    }),
    [status, user, sessionExpired, signIn, signUp, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
