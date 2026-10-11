import type { Localized } from './i18n';

export type ServiceCategory = 'elderly' | 'recovery' | 'nursing' | 'daily-living';

export interface CareService {
  id: string;
  /** Id this service had in the bundled sample content (testimonials and articles still reference it). */
  legacyId?: string;
  slug: string;
  category: ServiceCategory;
  title: Localized;
  summary: Localized;
  description: Localized;
  image: string;
  imageAlt: Localized;
  /** Illustrative daily rate. Real pricing is always returned by the backend. */
  dailyRateSample: number | null;
  includes: Localized[];
  notes: Localized;
  minDays: number;
  maxDays: number;
  popularity: number;
}

export type ServiceSort = 'popular' | 'price-asc' | 'price-desc' | 'name';

export interface ServiceQuery {
  search?: string;
  category?: ServiceCategory | 'all';
  sort?: ServiceSort;
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}