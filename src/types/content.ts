import type { Localized } from './i18n';

export interface Article {
  id: string;
  slug: string;
  category: Localized;
  title: Localized;
  excerpt: Localized;
  cover: string;
  coverAlt: Localized;
  date: string;
  readMinutes: number;
  author: {name: Localized;role: Localized;} | null;
  body: Localized[];
}

export interface Testimonial {
  id: string;
  initials: string;
  author: Localized;
  relation: Localized;
  serviceId: string;
  quote: Localized;
}

export type FaqTopic = 'booking' | 'pricing' | 'payment' | 'changes' | 'account';

export interface Faq {
  id: string;
  topic: FaqTopic;
  question: Localized;
  answer: Localized;
  /** true when the answer is a placeholder pending a documented policy */
  placeholder?: boolean;
}