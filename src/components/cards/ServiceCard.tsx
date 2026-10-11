import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Icon } from '@/components/ui/Icons';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { CareService } from '@/types/service';

/** Website ServiceCard: 4:3 photo, bold title, summary, "Explore service →". */
export function ServiceCard({ service, showPrice = false, style }: { service: CareService; showPrice?: boolean; style?: StyleProp<ViewStyle> }) {
  const { t, l, money } = useI18n();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={l(service.title)}
      onPress={() => router.push({ pathname: '/services/[slug]', params: { slug: service.slug } })}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }, style]}
    >
      <SmartImage src={service.image} alt={l(service.imageAlt)} aspectRatio={4 / 3} radius={radii['2xl']} />
      <View style={styles.body}>
        <Text variant="title" numberOfLines={2}>
          {l(service.title)}
        </Text>
        {showPrice && service.dailyRateSample !== null ? (
          <Text variant="small" color="muted" style={{ marginTop: 2 }}>
            <Text variant="small" weight="bold" color="ink">
              {money(service.dailyRateSample)}
            </Text>{' '}
            {t('common.perDay')}
          </Text>
        ) : null}
        <Text variant="body" color="muted" numberOfLines={3} style={styles.summary}>
          {l(service.summary)}
        </Text>
        <View style={styles.cta}>
          <Text variant="label" color={colors.brand}>
            {t('common.exploreService')}
          </Text>
          <Icon icon={ArrowRight} size={16} color={colors.brand} directional />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1 },
  body: { paddingTop: 14, flex: 1 },
  summary: { marginTop: 6 },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
});
