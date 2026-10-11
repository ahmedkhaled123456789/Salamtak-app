import { nurses as sampleNurses } from '@/data/nurses';
import { services as sampleServices } from '@/data/services';
import type { Nurse, NurseQuery } from '@/types/nurse';
import type { CareService, ServiceCategory } from '@/types/service';
import type { Localized } from '@/types/i18n';
import { mediaUrl, request, type Page } from './client';
import { MIN_PER_DAY } from './bookingMapper';

/**
 * Maps care-backend's public catalogue onto the website's content model.
 * The backend owns ids, prices, pictures and availability. The bundled website content only supplies editorial
 * text the API has no field for (Arabic titles, "what's included", qualifications), matched by service slug /
 * nurse name and never used for ids, prices or nurse pictures.
 */

interface ApiService {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  minDurationMinutes: number;
  maxDurationMinutes: number;
  sortOrder: number;
  imageUrl: string | null;
  baseRatesMinor?: { daily: number | null };
}
interface ApiNurseCard {
  id: string;
  serviceIds: string[];
  dailyRateMinor: number | null;
  displayName: string;
  imageUrl: string | null;
  bio: string | null;
  yearsOfExperience: number;
  specializations: string[];
  languages: string[];
  gender: string | null;
  averageRating: number;
  totalReviews: number;
  city: string | null;
  price?: { unitAmountMinor: number } | null;
}

const l = (en: string, ar = en): Localized => ({ en, ar });

const CATEGORY: Record<string, ServiceCategory> = {
  ELDERLY_CARE: 'elderly',
  POST_SURGERY: 'recovery',
  CHRONIC_CARE: 'recovery',
  NURSING: 'nursing',
  MEDICATION: 'nursing',
  MONITORING: 'nursing',
  DAILY_ASSISTANCE: 'daily-living',
  COMPANIONSHIP: 'daily-living',
};

const sampleBySlug = new Map(sampleServices.map((s) => [s.slug, s]));

export function toService(api: ApiService): CareService {
  const sample = sampleBySlug.get(api.slug);
  const text = api.description ?? '';
  return {
    id: api.id,
    legacyId: sample?.id,
    slug: api.slug,
    category: CATEGORY[api.category] ?? sample?.category ?? 'nursing',
    title: sample?.title ?? l(api.name),
    summary: sample?.summary ?? l(text.length > 140 ? `${text.slice(0, 137)}…` : text),
    description: sample?.description ?? l(text),
    // The backend picture wins; the bundled website photo is only a fallback for services without one.
    image: mediaUrl(api.imageUrl) || sample?.image || '',
    imageAlt: sample?.imageAlt ?? l(api.name),
    dailyRateSample: api.baseRatesMinor?.daily != null ? api.baseRatesMinor.daily / 100 : null,
    includes: sample?.includes ?? [],
    notes: sample?.notes ?? l(''),
    minDays: Math.max(1, Math.round(api.minDurationMinutes / MIN_PER_DAY)),
    maxDays: Math.max(1, Math.round(api.maxDurationMinutes / MIN_PER_DAY)),
    popularity: sample?.popularity ?? Math.max(0, 100 - api.sortOrder),
  };
}

export function toNurse(card: ApiNurseCard): Nurse {
  const [first = '', last = ''] = card.displayName.split(' ');
  const sample = sampleNurses.find((n) => {
    const [f = '', ...rest] = n.name.en.split(' ');
    return f === first && `${(rest.pop() ?? '').charAt(0)}.` === last;
  });
  const city = card.city ?? '';
  return {
    id: card.id,
    slug: card.id,
    name: sample?.name ?? l(card.displayName),
    role: sample?.role ?? l(card.specializations[0] ?? 'Nurse'),
    gender: card.gender === 'MALE' ? 'male' : 'female',
    portrait: mediaUrl(card.imageUrl),
    bio: sample?.bio ?? l(card.bio ?? ''),
    city: sample?.city ?? l(city),
    serviceIds: card.serviceIds,
    languages: sample?.languages ?? card.languages.map((x) => l(x.charAt(0).toUpperCase() + x.slice(1))),
    experienceYears: card.yearsOfExperience || undefined,
    qualifications: sample?.qualifications,
    availability: 'available',
    dailyRateSample: card.price ? card.price.unitAmountMinor / 100 : card.dailyRateMinor != null ? card.dailyRateMinor / 100 : undefined,
    featured: sample?.featured ?? card.averageRating >= 4.5,
  };
}

export const catalogApi = {
  async listServices(): Promise<CareService[]> {
    const res = await request<Page<ApiService>>('/public/services', { anonymous: true });
    return res.items.map(toService);
  },

  async getService(slug: string): Promise<CareService> {
    return toService(await request<ApiService>(`/public/services/${encodeURIComponent(slug)}`, { anonymous: true }));
  },

  async listNurses({ serviceId, gender = 'any', sort = 'recommended', search = '' }: NurseQuery): Promise<Nurse[]> {
    const params = new URLSearchParams({ limit: '100' });
    if (serviceId) params.set('serviceId', serviceId);
    if (gender !== 'any') params.set('gender', gender.toUpperCase());
    if (sort === 'experience') params.set('sort', 'experience');
    if (sort === 'price-asc' && serviceId) params.set('sort', 'price');
    const res = await request<Page<ApiNurseCard>>(`/public/nurses?${params}`, { anonymous: true });
    const term = search.trim().toLowerCase();
    const list = res.items.map(toNurse).filter((n) => !term || `${n.name.en} ${n.name.ar} ${n.role.en}`.toLowerCase().includes(term));
    if (sort === 'price-desc') list.sort((a, b) => (b.dailyRateSample ?? 0) - (a.dailyRateSample ?? 0));
    if (sort === 'price-asc' && !serviceId) list.sort((a, b) => (a.dailyRateSample ?? 0) - (b.dailyRateSample ?? 0));
    return list;
  },

  async getNurse(id: string): Promise<Nurse> {
    return toNurse(await request<ApiNurseCard>(`/public/nurses/${encodeURIComponent(id)}`, { anonymous: true }));
  },
};
