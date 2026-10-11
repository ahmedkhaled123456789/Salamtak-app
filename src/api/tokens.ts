import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const KEY = 'careflow.tokens';
let memory: Tokens | null = null;
let loaded = false;

/** Native: Keychain / Keystore via SecureStore. Web preview (no secure storage): sessionStorage only. */
async function readRaw(): Promise<string | null> {
  try {
    if (Platform.OS === 'web') return typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(KEY);
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}
async function writeRaw(value: string | null): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      if (typeof sessionStorage === 'undefined') return;
      if (value) sessionStorage.setItem(KEY, value);
      else sessionStorage.removeItem(KEY);
      return;
    }
    if (value) await SecureStore.setItemAsync(KEY, value);
    else await SecureStore.deleteItemAsync(KEY);
  } catch {
    /* secure storage unavailable: the session just won't survive an app restart */
  }
}

export async function loadTokens(): Promise<Tokens | null> {
  if (!loaded) {
    const raw = await readRaw();
    try {
      memory = raw ? (JSON.parse(raw) as Tokens) : null;
    } catch {
      memory = null;
    }
    loaded = true;
  }
  return memory;
}

export function getTokens(): Tokens | null {
  return memory;
}

export async function saveTokens(tokens: Tokens | null): Promise<void> {
  memory = tokens;
  loaded = true;
  await writeRaw(tokens ? JSON.stringify(tokens) : null);
}
