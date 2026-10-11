import type { Locale } from '@/types/i18n';

export type Weight = 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';

/** Family names registered in src/theme/fonts.ts. Android needs one family per weight. */
const manrope: Record<Weight, string> = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
};
const plexArabic: Record<Weight, string> = {
  regular: 'IBMPlexSansArabic_400Regular',
  medium: 'IBMPlexSansArabic_500Medium',
  semibold: 'IBMPlexSansArabic_600SemiBold',
  bold: 'IBMPlexSansArabic_700Bold',
  extrabold: 'IBMPlexSansArabic_700Bold',
};
const newsreader: Record<'regular' | 'medium' | 'semibold', string> = {
  regular: 'Newsreader_400Regular',
  medium: 'Newsreader_500Medium',
  semibold: 'Newsreader_600SemiBold',
};
export const NEWSREADER_ITALIC = 'Newsreader_400Regular_Italic';

export function fontFamily(locale: Locale, weight: Weight = 'regular', display = false, italic = false): string {
  // The website swaps display headings to IBM Plex Sans Arabic in RTL.
  if (locale === 'ar') return plexArabic[display && weight === 'regular' ? 'semibold' : weight];
  if (display) {
    if (italic) return NEWSREADER_ITALIC;
    return newsreader[weight === 'bold' || weight === 'extrabold' ? 'semibold' : (weight as 'regular' | 'medium' | 'semibold')];
  }
  return manrope[weight];
}

export type TextVariant =
  | 'hero'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'title'
  | 'bodyLg'
  | 'body'
  | 'small'
  | 'caption'
  | 'label'
  | 'price';

interface VariantSpec {
  size: number;
  line: number;
  weight: Weight;
  display?: boolean;
  tracking?: number;
}

/** Mobile adaptations of the website's responsive type scale. */
export const variants: Record<TextVariant, VariantSpec> = {
  hero: { size: 46, line: 48, weight: 'medium', display: true, tracking: -1.1 },
  h1: { size: 38, line: 41, weight: 'medium', display: true, tracking: -0.7 },
  h2: { size: 32, line: 35, weight: 'medium', display: true, tracking: -0.5 },
  h3: { size: 22, line: 28, weight: 'medium', display: true },
  title: { size: 18, line: 24, weight: 'bold' },
  bodyLg: { size: 17, line: 27, weight: 'regular' },
  body: { size: 15, line: 24, weight: 'regular' },
  small: { size: 13, line: 19, weight: 'regular' },
  caption: { size: 12, line: 16, weight: 'semibold' },
  label: { size: 14, line: 20, weight: 'semibold' },
  price: { size: 40, line: 44, weight: 'medium', display: true },
};

/** Arabic script needs a little more vertical room than Latin at the same size. */
export const arabicLineBoost = 1.12;
