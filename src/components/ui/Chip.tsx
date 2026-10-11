import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { Text } from './Text';

/** Pill toggle used for gender preference, categories and durations (website: segmented pills). */
export function Chip({
  label,
  selected,
  onPress,
  tone = 'light',
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  tone?: 'light' | 'white';
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? colors.brand : tone === 'white' ? colors.white : colors.ivory,
          borderColor: selected ? colors.brand : colors.line,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text variant="label" color={selected ? colors.white : colors.ink} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 40,
    minWidth: 48,
    paddingHorizontal: 16,
    borderRadius: radii.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
