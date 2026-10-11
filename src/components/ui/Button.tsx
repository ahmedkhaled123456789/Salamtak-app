import { router, type Href } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { colors, alpha } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'light' | 'outlineLight' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: string;
  onPress?: () => void;
  /** Navigates with expo-router when no onPress is given. */
  href?: Href;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  testID?: string;
}

const heights: Record<ButtonSize, number> = { sm: 40, md: 48, lg: 54 };
const paddings: Record<ButtonSize, number> = { sm: 16, md: 22, lg: 28 };
const textSize: Record<ButtonSize, number> = { sm: 14, md: 15, lg: 16 };

const palette: Record<ButtonVariant, { bg: string; pressed: string; fg: string; border?: string }> = {
  primary: { bg: colors.brand, pressed: colors.brandDark, fg: colors.white },
  secondary: { bg: colors.white, pressed: colors.mintSoft, fg: colors.ink, border: colors.line },
  ghost: { bg: 'transparent', pressed: alpha(colors.mint, 0.6), fg: colors.ink },
  light: { bg: colors.white, pressed: colors.mint, fg: colors.brandDeep },
  outlineLight: { bg: 'transparent', pressed: alpha(colors.white, 0.1), fg: colors.white, border: alpha(colors.white, 0.35) },
  danger: { bg: colors.white, pressed: colors.coralSoft, fg: colors.coralText, border: colors.coral },
};

export function Button({
  children,
  onPress,
  href,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconStart,
  iconEnd,
  fullWidth = false,
  style,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const p = palette[variant];
  const inactive = disabled || loading;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? children}
      accessibilityState={{ disabled: inactive, busy: loading }}
      disabled={inactive}
      onPress={() => (onPress ? onPress() : href ? router.push(href) : undefined)}
      style={({ pressed }) => [
        styles.base,
        {
          height: heights[size],
          paddingHorizontal: paddings[size],
          backgroundColor: pressed ? p.pressed : p.bg,
          borderColor: p.border ?? 'transparent',
          borderWidth: p.border ? 1 : 0,
          opacity: inactive && !loading ? 0.55 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          alignSelf: fullWidth ? 'stretch' : 'flex-start',
        },
        variant === 'primary' && !inactive ? shadows.brand : null,
        style,
      ]}
    >
      <View style={styles.row}>
        {loading ? <ActivityIndicator size="small" color={p.fg} /> : iconStart}
        <Text weight="semibold" size={textSize[size]} color={p.fg} numberOfLines={1} style={styles.label}>
          {children}
        </Text>
        {!loading && iconEnd}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', minWidth: 48 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  label: { flexShrink: 1 },
});
