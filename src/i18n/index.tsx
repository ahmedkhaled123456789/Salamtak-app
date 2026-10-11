import * as Localization from 'expo-localization';
import { createInstance } from 'i18next';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DevSettings, I18nManager, Platform } from 'react-native';
import { ar } from '@/data/translationsAr';
import { en } from '@/data/translationsEn';
import { daysLabel as daysLabelFor, formatCurrency, formatDate, formatNumber, formatTime } from '@/lib/format';
import { config } from '@/lib/config';
import { getItem, setItem } from '@/lib/storage';
import type { Locale, Localized } from '@/types/i18n';
import { mAr } from './mobileAr';
import { mEn, type MobileDictionary } from './mobileEn';

const dictEn = { ...en, m: mEn };
const dictAr = { ...ar, m: mAr as MobileDictionary };
export type Dictionary = typeof dictEn;

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];
export type TranslationKey = Leaves<Dictionary>;
type Vars = Record<string, string | number>;

const STORAGE_KEY = 'careflow.locale';

const i18n = createInstance();
void i18n.init({
  resources: { en: { translation: dictEn }, ar: { translation: dictAr } },
  lng: 'en',
  fallbackLng: 'en',
  // The website dictionaries use {name} placeholders.
  interpolation: { prefix: '{', suffix: '}', escapeValue: false },
  returnNull: false,
  initAsync: false,
});

export interface I18nValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  isRTL: boolean;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: TranslationKey, vars?: Vars) => string;
  l: (value: Localized) => string;
  money: (amount: number, currency?: string) => string;
  date: (iso: string, options?: Intl.DateTimeFormatOptions) => string;
  time: (iso: string) => string;
  num: (value: number) => string;
  daysLabel: (n: number) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

function deviceLocale(): Locale {
  const code = Localization.getLocales()[0]?.languageCode;
  return code === 'ar' ? 'ar' : 'en';
}

/** Native layout direction only changes after a reload; returns true when one is needed. */
function applyNativeDirection(locale: Locale): boolean {
  const rtl = locale === 'ar';
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    }
    return false;
  }
  I18nManager.allowRTL(rtl);
  if (I18nManager.isRTL !== rtl) {
    I18nManager.forceRTL(rtl);
    return true;
  }
  return false;
}

async function reloadApp(): Promise<void> {
  try {
    const Updates = await import('expo-updates');
    await Updates.reloadAsync();
    return;
  } catch {
    /* expo-updates unavailable (e.g. dev client without updates): fall back to the dev reload */
  }
  try {
    DevSettings.reload();
  } catch {
    /* the new direction applies on the next launch */
  }
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => (I18nManager.isRTL ? 'ar' : 'en'));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      const stored = await getItem(STORAGE_KEY);
      // `?lang=ar` lets the web preview open in either language (used for RTL visual checks).
      const query = Platform.OS === 'web' && typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('lang') : null;
      const initial: Locale = query === 'ar' || query === 'en' ? query : stored === 'ar' || stored === 'en' ? stored : deviceLocale();
      await i18n.changeLanguage(initial);
      const needsReload = applyNativeDirection(initial);
      if (!alive) return;
      setLocaleState(initial);
      if (needsReload) void reloadApp();
      setReady(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    await setItem(STORAGE_KEY, next);
    await i18n.changeLanguage(next);
    const needsReload = applyNativeDirection(next);
    setLocaleState(next);
    if (needsReload) await reloadApp();
  }, []);

  const value = useMemo<I18nValue>(() => {
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    const numeric = (n: number) => formatNumber(n, locale);
    return {
      locale,
      dir,
      isRTL: dir === 'rtl',
      setLocale,
      t: (key, vars) => {
        const prepared: Record<string, string> = {};
        for (const [k, v] of Object.entries(vars ?? {})) prepared[k] = typeof v === 'number' ? numeric(v) : v;
        return i18n.t(key, { lng: locale, ...prepared }) as string;
      },
      l: (v) => v[locale] || v.en,
      money: (amount, currency = config.defaultCurrency) => formatCurrency(amount, currency, locale),
      date: (iso, options) => formatDate(iso, locale, options),
      time: (iso) => formatTime(iso, locale),
      num: numeric,
      daysLabel: (n) => daysLabelFor(n, locale),
    };
  }, [locale, setLocale]);

  if (!ready) return null;
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}
