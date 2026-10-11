import { Minus, Plus } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { Text } from './Text';

/** −/+ stepper for the number of care days (website: DaysStepper). */
export function DaysStepper({ value, min, max, onChange }: { value: number; min: number; max: number; onChange: (n: number) => void }) {
  const { t, daysLabel } = useI18n();
  const btn = (disabled: boolean) => [styles.btn, disabled && { opacity: 0.4 }];
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('bookingPreview.decrease')}
        disabled={value <= min}
        onPress={() => onChange(Math.max(min, value - 1))}
        style={btn(value <= min)}
        hitSlop={6}
      >
        <Minus size={18} color={colors.ink} />
      </Pressable>
      <Text weight="semibold" align="center" style={styles.value} accessibilityLiveRegion="polite">
        {daysLabel(value)}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('bookingPreview.increase')}
        disabled={value >= max}
        onPress={() => onChange(Math.min(max, value + 1))}
        style={btn(value >= max)}
        hitSlop={6}
      >
        <Plus size={18} color={colors.ink} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { width: 44, height: 44, borderRadius: radii.full, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  value: { minWidth: 84 },
});
