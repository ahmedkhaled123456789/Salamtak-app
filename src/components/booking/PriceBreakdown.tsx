import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import type { PriceLine } from '@/types/booking';

/** Server-calculated price lines + payable total. The app never derives the payable amount itself. */
export function PriceBreakdown({ lines, payable, currency, estimate }: { lines: PriceLine[]; payable: number; currency: string; estimate?: boolean }) {
  const { t, money } = useI18n();
  return (
    <View>
      {lines.map((line, i) => (
        <View key={`${line.code}-${i}`} style={styles.row}>
          <Text variant="body" color="muted" style={{ flex: 1 }}>
            {line.label}
            {line.quantity > 1 ? ` × ${line.quantity}` : ''}
          </Text>
          <Text variant="body" weight="semibold" color={line.code === 'DISCOUNT' ? colors.brand : colors.ink}>
            {money(line.amount, currency)}
          </Text>
        </View>
      ))}
      <View style={styles.total}>
        <Text variant="label" size={15}>
          {estimate ? t('bookingPreview.estimatedTotal') : t('m.payable')}
        </Text>
        <Text variant="price" size={32} color={colors.brandDark} accessibilityLiveRegion="polite">
          {money(payable, currency)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  total: { marginTop: 8, paddingTop: 16, borderTopWidth: 2, borderTopColor: colors.ink, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
});
