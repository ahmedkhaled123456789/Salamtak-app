import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { Text } from '@/components/ui/Text';

export type SectionTone = 'ivory' | 'white' | 'mint' | 'deep';

const bg: Record<SectionTone, string> = {
  ivory: colors.ivory,
  white: colors.white,
  mint: colors.mint,
  deep: colors.brandDeep,
};

/** Full-width band with the website's alternating backgrounds and a consistent gutter. */
export function Section({
  tone = 'ivory',
  children,
  flush = false,
  paddingTop,
  paddingBottom,
  style,
}: {
  tone?: SectionTone;
  children: React.ReactNode;
  /** No horizontal padding (carousels bleed to the screen edge). */
  flush?: boolean;
  paddingTop?: number;
  paddingBottom?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: bg[tone],
          paddingTop: paddingTop ?? spacing.section,
          paddingBottom: paddingBottom ?? spacing.section,
          paddingHorizontal: flush ? 0 : spacing.gutter,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function SectionHeader({
  title,
  body,
  align = 'start',
  tone = 'dark',
  action,
  accessibilityRole = 'header',
}: {
  title: string;
  body?: string;
  align?: 'start' | 'center';
  tone?: 'dark' | 'light';
  action?: React.ReactNode;
  accessibilityRole?: 'header' | 'text';
}) {
  const light = tone === 'light';
  return (
    <View style={[styles.header, align === 'center' && { alignItems: 'center' }]}>
      <Text variant="h2" align={align === 'center' ? 'center' : undefined} color={light ? colors.white : colors.ink} accessibilityRole={accessibilityRole}>
        {title}
      </Text>
      {body ? (
        <Text variant="bodyLg" align={align === 'center' ? 'center' : undefined} color={light ? 'rgba(255,255,255,0.75)' : colors.muted} style={styles.body}>
          {body}
        </Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

/** "Sample" disclaimer line the website shows under illustrative content. */
export function SampleNote({ children, tone = 'muted' }: { children: string; tone?: 'muted' | 'light' }) {
  return (
    <Text variant="small" color={tone === 'light' ? 'rgba(255,255,255,0.7)' : colors.muted}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  header: { gap: 0 },
  body: { marginTop: 14 },
  action: { marginTop: 20 },
});
