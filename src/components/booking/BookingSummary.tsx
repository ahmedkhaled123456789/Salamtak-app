import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { addDays } from '@/lib/format';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { BookingDraft } from '@/types/booking';
import type { Nurse } from '@/types/nurse';
import type { CareService } from '@/types/service';

interface Props {
  draft: BookingDraft;
  service?: CareService;
  nurse?: Nurse;
  /** Step index to jump back to when "Edit" is pressed. */
  onEdit?: (stepIndex: number) => void;
}

/** Read-only recap of the wizard choices (website: BookingSummary). */
export function BookingSummary({ draft, service, nurse, onEdit }: Props) {
  const { t, l, date, daysLabel } = useI18n();
  const gender = draft.genderPreference === 'any' ? t('common.noPreference') : draft.genderPreference === 'female' ? t('common.female') : t('common.male');
  const range = draft.startDate ? `${date(draft.startDate, { day: 'numeric', month: 'short' })} – ${date(addDays(draft.startDate, draft.days - 1))}` : '';
  const rows: { label: string; value: string; step: number }[] = [
    { label: t('booking.steps.schedule'), value: `${range} · ${daysLabel(draft.days)}`, step: 1 },
    { label: t('booking.genderLabel'), value: gender, step: 2 },
    { label: t('booking.address'), value: draft.address ?? '—', step: 2 },
    ...(draft.notes?.trim() ? [{ label: t('account.notes'), value: draft.notes.trim(), step: 2 }] : []),
    { label: t('booking.steps.nurse'), value: nurse ? l(nurse.name) : '—', step: 3 },
  ];
  return (
    <View style={styles.card}>
      {service ? (
        <View style={styles.service}>
          <SmartImage src={service.image} alt="" width={64} height={64} radius={12} />
          <View style={{ flex: 1 }}>
            <Text variant="small" color="muted">
              {t('bookingPreview.service')}
            </Text>
            <Text variant="title" numberOfLines={2}>
              {l(service.title)}
            </Text>
          </View>
        </View>
      ) : null}
      {rows.map((r) => (
        <View key={r.label} style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text variant="small" color="muted">
              {r.label}
            </Text>
            <Text variant="body" weight="semibold">
              {r.value}
            </Text>
          </View>
          {onEdit ? (
            <Pressable onPress={() => onEdit(r.step)} accessibilityRole="button" hitSlop={8}>
              <Text variant="label" color={colors.brand}>
                {t('booking.edit')}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 18 },
  service: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingBottom: 14, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
});
