import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { Testimonial } from '@/types/content';

export function TestimonialCard({ testimonial, style }: { testimonial: Testimonial; style?: StyleProp<ViewStyle> }) {
  const { l, t } = useI18n();
  const { serviceById } = useCatalogData();
  const service = serviceById(testimonial.serviceId);
  return (
    <View style={[styles.card, style]} accessibilityRole="text">
      <View style={styles.top}>
        {service ? (
          <View style={styles.tag}>
            <Text variant="caption" color={colors.brandDark} numberOfLines={1}>
              {l(service.title)}
            </Text>
          </View>
        ) : (
          <View />
        )}
        <Text variant="caption" weight="medium" color="muted">
          {t('common.sample')}
        </Text>
      </View>
      <Text variant="bodyLg" size={16} style={{ marginTop: 18 }}>
        “{l(testimonial.quote)}”
      </Text>
      <View style={styles.foot}>
        <View style={styles.avatar}>
          <Text variant="small" weight="bold" color={colors.white}>
            {testimonial.initials}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="label">{l(testimonial.author)}</Text>
          <Text variant="small" color="muted">
            {l(testimonial.relation)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 24 },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  tag: { backgroundColor: colors.mint, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 4, flexShrink: 1 },
  foot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.line },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
});
