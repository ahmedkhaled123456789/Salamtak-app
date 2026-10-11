import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useI18n, type TranslationKey } from '@/i18n';
import { colors } from '@/theme/colors';

/** Step indicator for the booking wizard: filled bar + numbered dots + current step title. */
export function BookingProgress({ steps, current }: { steps: { id: string; label: TranslationKey }[]; current: number }) {
  const { t, num } = useI18n();
  return (
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: steps.length, now: current + 1 }} style={styles.wrap}>
      <View style={styles.dots}>
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <React.Fragment key={s.id}>
              <View style={[styles.dot, (done || active) && { backgroundColor: colors.brand, borderColor: colors.brand }]}>
                {done ? (
                  <Check size={14} color={colors.white} strokeWidth={3} />
                ) : (
                  <Text variant="caption" color={active ? colors.white : colors.muted}>
                    {num(i + 1)}
                  </Text>
                )}
              </View>
              {i < steps.length - 1 ? <View style={[styles.line, done && { backgroundColor: colors.brand }]} /> : null}
            </React.Fragment>
          );
        })}
      </View>
      <Text variant="small" weight="semibold" color="muted" style={{ marginTop: 10 }}>
        {t('m.stepOf', { n: current + 1, total: steps.length })} · {t(steps[current]?.label ?? 'booking.title')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 20, paddingVertical: 14, backgroundColor: colors.ivory },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, borderColor: colors.lineStrong, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  line: { flex: 1, height: 2, backgroundColor: colors.line, marginHorizontal: 4 },
});
