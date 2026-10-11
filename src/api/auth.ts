import type { AccountUser, PatientProfile, SignUpInput } from '@/types/auth';
import { mediaUrl, request } from './client';
import { saveTokens, type Tokens } from './tokens';

interface ApiUser {
  id: string;
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
  isVerified?: boolean;
}
interface AuthResult {
  user: ApiUser;
  tokens: Tokens;
}

export const toUser = (u: ApiUser): AccountUser => ({
  id: u.id,
  role: u.role,
  firstName: u.firstName,
  lastName: u.lastName,
  email: u.email,
  phone: u.phone,
  avatarUrl: u.profileImageUrl ? mediaUrl(u.profileImageUrl) : undefined,
  isVerified: Boolean(u.isVerified),
});

async function startSession(result: AuthResult): Promise<AccountUser> {
  await saveTokens({ accessToken: result.tokens.accessToken, refreshToken: result.tokens.refreshToken });
  return toUser(result.user);
}

export const authApi = {
  async signIn(email: string, password: string): Promise<AccountUser> {
    return startSession(await request<AuthResult>('/auth/login', { method: 'POST', anonymous: true, body: { email, password } }));
  },
  async signUp(input: SignUpInput): Promise<AccountUser> {
    return startSession(await request<AuthResult>('/auth/register', { method: 'POST', anonymous: true, body: input }));
  },
  async me(): Promise<AccountUser> {
    return toUser(await request<ApiUser>('/users/me'));
  },
  async signOut(refreshToken: string | undefined): Promise<void> {
    await saveTokens(null);
    if (refreshToken) {
      await request('/auth/logout', { method: 'POST', anonymous: true, body: { refreshToken } }).catch(() => undefined);
    }
  },
  async forgotPassword(email: string): Promise<void> {
    await request('/auth/forgot-password', { method: 'POST', anonymous: true, body: { email } });
  },
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await request('/auth/reset-password', { method: 'POST', anonymous: true, body: { token, newPassword } });
  },
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await request('/auth/change-password', { method: 'POST', body: { currentPassword, newPassword } });
  },
  async patientProfile(): Promise<PatientProfile> {
    const p = await request<{ address: string | null; city: string | null }>('/patients/me');
    return { address: p.address ?? undefined, city: p.city ?? undefined };
  },
  async updateAccount(input: { firstName: string; lastName: string }): Promise<AccountUser> {
    return toUser(await request<ApiUser>('/users/me', { method: 'PATCH', body: input }));
  },
  async updatePatientProfile(input: { address: string; city: string }): Promise<PatientProfile> {
    await request('/patients/me', { method: 'PATCH', body: input });
    return input;
  },
  async uploadAvatar(file: { uri: string; name: string; type: string }): Promise<AccountUser> {
    const form = new FormData();
    form.append('file', file as unknown as Blob);
    return toUser(await request<ApiUser>('/users/me/avatar', { method: 'PUT', form }));
  },
};
