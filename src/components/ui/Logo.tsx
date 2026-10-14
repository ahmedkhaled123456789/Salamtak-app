import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text as RNText, View } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

/** Salamtak mark (brand/salamtak-icon.svg): a roof over a heart with a care cross, on a teal tile. Same on any background. */
export function LogoMark({ size = 40 }: { tone?: 'dark' | 'light'; size?: number }) {
  return (
    <Svg viewBox="0 0 256 256" width={size} height={size}>
      <Defs>
        <LinearGradient id="salamtak-tile" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#14857B" />
          <Stop offset="1" stopColor="#0B3F3B" />
        </LinearGradient>
      </Defs>
      <Rect width="256" height="256" rx="64" fill="url(#salamtak-tile)" />
      <Path d="M54 116 128 54l74 62" fill="none" stroke="#DDF5EC" strokeWidth={18} strokeLinecap="round" strokeLinejoin="round" />
      <G transform="translate(128 166) scale(0.86) translate(-128 -156)">
        <Path d="M128 204c-30-19-56-40-56-66 0-17 12-29 27-29 12 0 22 7 29 18 7-11 17-18 29-18 15 0 27 12 27 29 0 26-26 47-56 66z" fill="#FFFFFF" />
        <Path d="M128 132v34M111 149h34" stroke="#D9694A" strokeWidth={11} strokeLinecap="round" />
      </G>
    </Svg>
  );
}

export function Logo({ tone = 'dark', link = true }: { tone?: 'dark' | 'light'; link?: boolean }) {
  const { t, locale } = useI18n();
  const dark = tone === 'dark';
  const name = locale === 'ar' ? 'سلامتك' : 'Salamtak';
  const content = (
    <View style={styles.row} accessible accessibilityLabel={name}>
      <LogoMark />
      <View style={styles.word}>
        <RNText style={[styles.ar, { color: dark ? colors.brandDeep : colors.white }]}>سلامتك</RNText>
        <RNText style={[styles.en, { color: dark ? colors.brand : colors.mint }]}>SALAMTAK</RNText>
      </View>
    </View>
  );
  if (!link) return content;
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={`${name} — ${t('nav.home')}`} onPress={() => router.navigate('/')}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  word: { alignItems: 'center' },
  // wordmark keeps the brand font in both languages (IBM Plex Sans Arabic is loaded in src/theme/fonts.ts)
  ar: { fontFamily: 'IBMPlexSansArabic_700Bold', fontSize: 23, lineHeight: 30 },
  en: { fontFamily: 'Manrope_700Bold', fontSize: 8.5, letterSpacing: 2.7, marginTop: -3, paddingLeft: 2.7 },
});
