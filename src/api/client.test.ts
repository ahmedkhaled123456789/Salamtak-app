import { ApiError, request } from './client';
import * as tokens from './tokens';

jest.mock('@/lib/config', () => ({ config: { apiBaseUrl: 'http://api.test', requestTimeoutMs: 5000, platformUtcOffset: '+04:00', defaultCurrency: 'AED' } }));
jest.mock('./tokens', () => {
  let current: { accessToken: string; refreshToken: string } | null = { accessToken: 'old-access', refreshToken: 'old-refresh' };
  return {
    loadTokens: jest.fn(async () => current),
    getTokens: jest.fn(() => current),
    saveTokens: jest.fn(async (t: typeof current) => {
      current = t;
    }),
  };
});

const json = (status: number, body: unknown) => ({ ok: status >= 200 && status < 300, status, statusText: 'x', json: async () => body }) as Response;

describe('api client', () => {
  const fetchMock = jest.fn();
  beforeEach(() => {
    fetchMock.mockReset();
    (global as unknown as { fetch: typeof fetch }).fetch = fetchMock as unknown as typeof fetch;
  });

  it('unwraps the success envelope and sends the bearer token', async () => {
    fetchMock.mockResolvedValueOnce(json(200, { success: true, data: { ok: 1 } }));
    await expect(request<{ ok: number }>('/ping')).resolves.toEqual({ ok: 1 });
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('http://api.test/api/v1/ping');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer old-access');
  });

  it('maps backend failures to typed errors', async () => {
    fetchMock.mockResolvedValueOnce(json(409, { success: false, message: 'taken', errorCode: 'BOOKING_CONFLICT' }));
    await expect(request('/x', { anonymous: true })).rejects.toMatchObject({ code: 'conflict', status: 409, serverCode: 'BOOKING_CONFLICT' });
    fetchMock.mockResolvedValueOnce(json(401, { success: false, errorCode: 'INVALID_CREDENTIALS' }));
    await expect(request('/x', { anonymous: true })).rejects.toMatchObject({ code: 'invalid_credentials' });
    fetchMock.mockResolvedValueOnce(json(429, { success: false }));
    await expect(request('/x', { anonymous: true })).rejects.toMatchObject({ code: 'rate_limited' });
  });

  it('reports network failures without leaking details', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(request('/x', { anonymous: true })).rejects.toBeInstanceOf(ApiError);
    fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
    await expect(request('/x', { anonymous: true })).rejects.toMatchObject({ code: 'network' });
  });

  it('rotates the refresh token once on 401 and retries the request', async () => {
    fetchMock
      .mockResolvedValueOnce(json(401, { success: false }))
      .mockResolvedValueOnce(json(200, { success: true, data: { accessToken: 'new-access', refreshToken: 'new-refresh' } }))
      .mockResolvedValueOnce(json(200, { success: true, data: { retried: true } }));
    await expect(request<{ retried: boolean }>('/me')).resolves.toEqual({ retried: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('/auth/refresh');
    expect(tokens.saveTokens).toHaveBeenCalledWith({ accessToken: 'new-access', refreshToken: 'new-refresh' });
    const retryHeaders = (fetchMock.mock.calls[2]?.[1] as RequestInit).headers as Record<string, string>;
    expect(retryHeaders.Authorization).toBe('Bearer new-access');
  });
});
