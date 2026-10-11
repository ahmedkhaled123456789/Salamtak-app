import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { Text } from './Text';

export type BadgeTone = 'mint' | 'neutral' | 'coral' | 'white' | 'amber' | 'teal';

const tones: Record<BadgeTone, { bg: string; fg: string }> = {
  mint: { bg: colors.mint, fg: colors.brandDark },
  neutral: { bg: colors.neutralSoft, fg: colors.ink },
  coral: { bg: colors.coralSoft, fg: colors.coralText },
  white: { bg: 'rgba(255,255,255,0.95)', fg: colors.ink },
  amber: { bg: colors.amberSoft, fg: colors.amberText },
  teal: { bg: colors.brand, fg: colors.white },
};

export function Badge({ tone = 'mint', children, icon }: { tone?: BadgeTone; children: string; icon?: React.ReactNode }) {
  const t = tones[tone];
  return (
    <View style={[styles.base, { backgroundColor: t.bg }]}>
      {icon}
      <Text variant="caption" color={t.fg} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    borderRadius: radii.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
});
