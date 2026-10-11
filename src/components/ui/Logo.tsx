import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { Text } from './Text';

/** Brand mark from the website: two arcs forming a sheltering roofline over a smile, in a rounded square. */
export function LogoMark({ tone = 'dark', size = 36 }: { tone?: 'dark' | 'light'; size?: number }) {
  const dark = tone === 'dark';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.305,
        backgroundColor: dark ? colors.brand : colors.white,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56}>
        <Path d="M4 12.5 12 5l8 7.5" fill="none" stroke={dark ? colors.mint : colors.brand} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
        <Path
          d="M7.5 15.5c1.2 1.9 2.7 2.9 4.5 2.9s3.3-1 4.5-2.9"
          fill="none"
          stroke={dark ? colors.white : colors.brandDark}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export function Logo({ tone = 'dark', link = true }: { tone?: 'dark' | 'light'; link?: boolean }) {
  const { t } = useI18n();
  const dark = tone === 'dark';
  const content = (
    <View style={styles.row}>
      <LogoMark tone={tone} />
      <Text weight="extrabold" size={19} color={dark ? colors.ink : colors.white} style={styles.word} accessibilityLabel={t('common.brand')}>
        Care<Text weight="extrabold" size={19} color={dark ? colors.brand : colors.mint}>Flow</Text>
      </Text>
    </View>
  );
  if (!link) return content;
  return (
    <Pressable accessibilityRole="link" accessibilityLabel={`${t('common.brand')} — ${t('nav.home')}`} onPress={() => router.navigate('/')}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  word: { letterSpacing: -0.4 },
});
