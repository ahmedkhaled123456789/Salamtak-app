import { router } from 'expo-router';
import { Calendar } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { statusKey, statusTone } from '@/lib/bookingStatus';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { Booking } from '@/types/booking';

/** Website BookingCard; shows what the backend returned (status, reference, dates, payable amount). */
export function BookingCard({ booking, viewer = 'patient' }: { booking: Booking; viewer?: 'patient' | 'nurse' }) {
  const { t, l, date, money, daysLabel } = useI18n();
  const { serviceById } = useCatalogData();
  const service = serviceById(booking.serviceId);
  const range = `${date(booking.startDate, { day: 'numeric', month: 'short' })} – ${date(booking.endDate)}`;
  const amount = viewer === 'nurse' ? booking.nurseEarning : booking.pricing && { amount: booking.pricing.payable, currency: booking.pricing.currency };
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/bookings/[id]', params: { id: booking.id } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.88 }]}
    >
      {service?.image ? <SmartImage src={service.image} alt="" width={64} height={64} radius={12} /> : null}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={styles.badges}>
          <Badge tone={statusTone[booking.status]}>{t(statusKey[booking.status])}</Badge>
          <Text variant="caption" color="muted" numberOfLines={1} style={{ flexShrink: 1 }}>
            {booking.reference}
          </Text>
        </View>
        <Text variant="body" weight="bold" numberOfLines={1}>
          {service ? l(service.title) : booking.serviceName}
        </Text>
        {viewer === 'nurse' && booking.patientName ? (
          <Text variant="small" color="muted" numberOfLines={1}>
            {booking.patientName}
          </Text>
        ) : null}
        <View style={styles.date}>
          <Calendar size={14} color={colors.muted} />
          <Text variant="small" color="muted" numberOfLines={1} style={{ flex: 1 }}>
            {range} · {daysLabel(booking.days)}
          </Text>
        </View>
        {amount ? (
          <Text variant="label" style={{ marginTop: 2 }}>
            {money(amount.amount, amount.currency)}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 14, backgroundColor: colors.white, borderRadius: radii['2xl'], borderWidth: 1, borderColor: colors.line, padding: 14 },
  badges: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  date: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
