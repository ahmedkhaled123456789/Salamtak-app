export type Locale = 'en' | 'ar';

/** A piece of content authored in both supported languages. */
export interface Localized {
  en: string;
  ar: string;
}