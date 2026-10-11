import { request, type Page } from './client';

export type NurseAccountStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';

export interface NurseSelf {
  id: string;
  bio: string | null;
  yearsOfExperience: number;
  specializations: string[];
  languages: string[];
  dailyRate: number | null;
  currency: string;
  city: string | null;
  status: NurseAccountStatus;
  verificationStatus: VerificationStatus;
  statusReason: string | null;
  averageRating: number;
  totalReviews: number;
  totalCompletedBookings: number;
  isBookable: boolean;
}

interface ApiNurseSelf extends Omit<NurseSelf, 'dailyRate'> {
  dailyRateMinor: number | null;
}

export interface AvailabilityRule {
  id: string;
  kind: 'WEEKLY' | 'DATE' | 'BLOCKED';
  dayOfWeek: number | null;
  startTime: string | null;
  endTime: string | null;
  date: string | null;
  isAvailable: boolean | null;
  type: 'VACATION' | 'BLOCKED' | 'HOLIDAY' | null;
  dateFrom: string | null;
  dateTo: string | null;
  reason: string | null;
}

export type NewAvailability =
  | { kind: 'WEEKLY'; dayOfWeek: number; startTime: string; endTime: string }
  | { kind: 'BLOCKED'; type: 'VACATION' | 'BLOCKED' | 'HOLIDAY'; dateFrom: string; dateTo: string; reason?: string };

export interface Wallet {
  available: number;
  pending: number;
  totalEarned: number;
  totalWithdrawn: number;
  currency: string;
}
export interface WalletTransaction {
  id: string;
  type: string;
  bucket: string;
  amount: number;
  note: string | null;
  createdAt: string;
}

export const nurseApi = {
  async me(): Promise<NurseSelf> {
    const { dailyRateMinor, ...rest } = await request<ApiNurseSelf>('/nurses/me');
    return { ...rest, dailyRate: dailyRateMinor != null ? dailyRateMinor / 100 : null };
  },
  /** Pause (INACTIVE) or resume (ACTIVE) accepting bookings. */
  async setStatus(status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
    await request('/nurses/me/status', { method: 'PATCH', body: { status } });
  },
  async availability(): Promise<AvailabilityRule[]> {
    const res = await request<{ items: AvailabilityRule[] }>('/nurses/me/availability');
    return res.items;
  },
  async addAvailability(input: NewAvailability): Promise<void> {
    await request('/nurses/me/availability', { method: 'POST', body: input });
  },
  async removeAvailability(id: string): Promise<void> {
    await request(`/nurses/me/availability/${encodeURIComponent(id)}`, { method: 'DELETE' });
  },
  async wallet(): Promise<Wallet> {
    const w = await request<{
      availableBalanceMinor: number;
      pendingBalanceMinor: number;
      totalEarnedMinor: number;
      totalWithdrawnMinor: number;
      currency: string;
    }>('/wallets/me');
    return {
      available: w.availableBalanceMinor / 100,
      pending: w.pendingBalanceMinor / 100,
      totalEarned: w.totalEarnedMinor / 100,
      totalWithdrawn: w.totalWithdrawnMinor / 100,
      currency: w.currency,
    };
  },
  async transactions(): Promise<WalletTransaction[]> {
    const res = await request<Page<{ id: string; type: string; bucket: string; amountMinor: number; note: string | null; createdAt: string }>>(
      '/wallets/me/transactions?limit=50',
    );
    return res.items.map((t) => ({ id: t.id, type: t.type, bucket: t.bucket, amount: t.amountMinor / 100, note: t.note, createdAt: t.createdAt }));
  },
};
