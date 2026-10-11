import { config } from '@/lib/config';
import { getTokens, loadTokens, saveTokens, type Tokens } from './tokens';

export type ApiErrorCode =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'invalid_credentials'
  | 'not_found'
  | 'validation'
  | 'conflict'
  | 'rate_limited'
  | 'not_configured'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  /** The backend's own `errorCode` (e.g. BOOKING_CONFLICT), when it sent one. */
  serverCode?: string;

  constructor(code: ApiErrorCode, message?: string, status?: number, serverCode?: string) {
    super(message ?? code);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.serverCode = serverCode;
  }
}

function codeFromStatus(status: number, serverCode?: string): ApiErrorCode {
  if (serverCode === 'INVALID_CREDENTIALS') return 'invalid_credentials';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not_found';
  if (status === 409) return 'conflict';
  if (status === 429) return 'rate_limited';
  if (status === 400 || status === 422) return 'validation';
  if (status >= 500) return 'server';
  return 'unknown';
}

/** Absolute URL for backend-served pictures (`/api/v1/media/:id`). Empty when there is none. */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return '';
  return /^https?:\/\//.test(path) ? path : `${config.apiBaseUrl}${path}`;
}

/* ------------------------------ session events ------------------------------ */
type Listener = () => void;
const expiredListeners = new Set<Listener>();
export function onSessionExpired(listener: Listener): () => void {
  expiredListeners.add(listener);
  return () => expiredListeners.delete(listener);
}

interface Envelope<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  /** Multipart upload; React Native sets the boundary. */
  form?: FormData;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  /** Public endpoints skip the Authorization header and the refresh dance. */
  anonymous?: boolean;
}

let refreshing: Promise<boolean> | null = null;

/** Rotates the refresh token once for any number of concurrent 401s. */
function refreshSession(): Promise<boolean> {
  refreshing ??= (async () => {
    const tokens = getTokens();
    if (!tokens) return false;
    try {
      const res = await fetch(`${config.apiBaseUrl}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });
      if (!res.ok) return false;
      const body = (await res.json()) as Envelope<Tokens>;
      await saveTokens({ accessToken: body.data.accessToken, refreshToken: body.data.refreshToken });
      return true;
    } catch {
      return false;
    } finally {
      setTimeout(() => {
        refreshing = null;
      }, 0);
    }
  })();
  return refreshing;
}

async function send(path: string, options: RequestOptions): Promise<Response> {
  const tokens = options.anonymous ? null : getTokens();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.requestTimeoutMs);
  options.signal?.addEventListener('abort', () => controller.abort());
  try {
    return await fetch(`${config.apiBaseUrl}/api/v1${path}`, {
      method: options.method ?? 'GET',
      headers: {
        ...(options.form ? {} : { 'Content-Type': 'application/json' }),
        Accept: 'application/json',
        ...(tokens ? { Authorization: `Bearer ${tokens.accessToken}` } : {}),
        ...options.headers,
      },
      body: options.form ?? (options.body === undefined ? undefined : JSON.stringify(options.body)),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Typed fetch wrapper for care-backend (`/api/v1`). Sends the bearer token, rotates it once on a 401,
 * unwraps the `{ success, data }` envelope and maps failures to `ApiError`.
 */
export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!config.apiBaseUrl) throw new ApiError('not_configured', 'EXPO_PUBLIC_API_BASE_URL is not set');
  if (!options.anonymous) await loadTokens();
  let response: Response;
  try {
    response = await send(path, options);
    if (response.status === 401 && !options.anonymous && getTokens()) {
      if (await refreshSession()) response = await send(path, options);
      else {
        await saveTokens(null);
        expiredListeners.forEach((l) => l());
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') throw new ApiError('timeout', error.message);
    throw new ApiError('network', error instanceof Error ? error.message : undefined);
  }
  let payload: Envelope<T> | undefined;
  try {
    payload = (await response.json()) as Envelope<T>;
  } catch {
    payload = undefined;
  }
  if (!response.ok || payload?.success === false) {
    throw new ApiError(
      codeFromStatus(response.status, payload?.errorCode),
      payload?.message ?? response.statusText,
      response.status,
      payload?.errorCode,
    );
  }
  return payload?.data as T;
}

export interface Page<T> {
  items: T[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}
