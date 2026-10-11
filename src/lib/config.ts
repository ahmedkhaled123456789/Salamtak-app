import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Runtime configuration. Only public values live here (EXPO_PUBLIC_* is embedded in the bundle).
 * See .env.example. Nothing in this file is a secret.
 */
function expoHost(): string | undefined {
  const c = Constants as unknown as { expoConfig?: { hostUri?: string }; expoGoConfig?: { debuggerHost?: string } };
  const uri = c.expoConfig?.hostUri ?? c.expoGoConfig?.debuggerHost;
  return uri?.split(':')[0];
}

export function resolveApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, '');
  if (!__DEV__) return '';
  const port = process.env.EXPO_PUBLIC_API_DEV_PORT?.trim() || '5050';
  if (Platform.OS === 'web') {
    const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    return `http://${host}:${port}`;
  }
  const host = expoHost();
  if (host && host !== 'localhost' && host !== '127.0.0.1') return `http://${host}:${port}`;
  return Platform.OS === 'android' ? `http://10.0.2.2:${port}` : `http://localhost:${port}`;
}

export const config = {
  apiBaseUrl: resolveApiBaseUrl(),
  requestTimeoutMs: 20_000,
  /** Offset of the backend's platform timezone (platform.timezone, default Asia/Dubai). */
  platformUtcOffset: process.env.EXPO_PUBLIC_PLATFORM_UTC_OFFSET?.trim() || '+04:00',
  /** The backend prices in AED; the app formats whatever currency the API returns. */
  defaultCurrency: 'AED',
} as const;
