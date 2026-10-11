import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { DaysStepper } from '@/components/ui/DaysStepper';
import { Skeleton } from '@/components/ui/Skeleton';
import { SmartImage } from '@/components/ui/SmartImage';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { useService, useServices } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { useBookingDraft } from '@/state/bookingDraft';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

export default function ServiceDetailScreen() {
  const { slug = '' } = useLocalSearchParams<{ slug: string }>();
  const { t, l, money, daysLabel } = useI18n();
  const { data: service, isLoading, isError, error, refetch } = useService(slug);
  const { data: all } = useServices();
  const { reset } = useBookingDraft();
  const [days, setDays] = useState<number | null>(null);

  if (isLoading) {
    return (
      <Screen header="back">
        <View style={{ padding: 20, gap: 16 }}>
          <Skeleton height={240} radius={24} />
          <Skeleton height={34} width="70%" />
          <Skeleton height={80} />
        </View>
      </Screen>
    );
  }
  if (isError || !service) {
    const notFound = (error as { code?: string } | null)?.code === 'not_found';
    return (
      <Screen header="back">
        <View style={{ padding: 20 }}>
          {notFound ? <StateMessage title={t('serviceDetail.notFound')} actionLabel={t('nav.allServices')} onAction={() => router.replace('/services')} /> : <QueryError error={error} onRetry={() => void refetch()} />}
        </View>
      </Screen>
    );
  }

  const value = days ?? Math.max(service.minDays, Math.min(5, service.maxDays));
  const related = (all ?? []).filter((s) => s.id !== service.id && s.category === service.category).slice(0, 3);
  const book = () => {
    reset({ serviceId: service.id, days: value });
    router.push('/book');
  };

  return (
    <Screen
      header="back"
      title={l(service.title)}
      footer={
        <Button fullWidth size="lg" onPress={book}>
          {t('serviceDetail.book')}
        </Button>
      }
    >
      <View style={{ padding: 20, paddingBottom: 40 }}>
        <SmartImage src={service.image} alt={l(service.imageAlt)} aspectRatio={4 / 3} radius={radii.hero} />
        <Text variant="h1" size={34} style={{ marginTop: 24 }} accessibilityRole="header">
          {l(service.title)}
        </Text>
        <Text variant="bodyLg" color="muted" style={{ marginTop: 12 }}>
          {l(service.summary)}
        </Text>

        {service.dailyRateSample !== null ? (
          <View style={styles.rate}>
            <Text variant="small" color="muted">
              {t('common.from')}
            </Text>
            <Text variant="price" size={32} color={colors.brandDark}>
              {money(service.dailyRateSample)}
            </Text>
            <Text variant="small" color="muted">
              {t('common.perDay')}
            </Text>
          </View>
        ) : null}

        <Text variant="h3" style={{ marginTop: 32 }}>
          {t('serviceDetail.about')}
        </Text>
        <Text variant="bodyLg" color="rgba(23,43,42,0.85)" style={{ marginTop: 10 }}>
          {l(service.description)}
        </Text>

        {service.includes.length ? (
          <>
            <Text variant="h3" style={{ marginTop: 32 }}>
              {t('serviceDetail.included')}
            </Text>
            <View style={{ marginTop: 14, gap: 12 }}>
              {service.includes.map((item, i) => (
                <View key={i} style={styles.include}>
                  <View style={styles.tick}>
                    <Check size={14} color={colors.brand} strokeWidth={3} />
                  </View>
                  <Text variant="body" style={{ flex: 1 }}>
                    {l(item)}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {l(service.notes) ? (
          <View style={styles.note}>
            <Text variant="label">{t('serviceDetail.notes')}</Text>
            <Text variant="body" color="muted" style={{ marginTop: 6 }}>
              {l(service.notes)}
            </Text>
          </View>
        ) : null}

        <View style={styles.estimate}>
          <Text variant="title">{t('serviceDetail.duration')}</Text>
          <Text variant="small" color="muted" style={{ marginTop: 2 }}>
            {t('serviceDetail.durationHint', { min: service.minDays, max: service.maxDays })}
          </Text>
          <View style={{ marginTop: 14 }}>
            <DaysStepper value={value} min={service.minDays} max={service.maxDays} onChange={setDays} />
          </View>
          {service.dailyRateSample !== null ? (
            <View style={styles.estimateTotal}>
              <Text variant="label">{t('serviceDetail.estimate')}</Text>
              <Text variant="h3" color={colors.brandDark}>
                {money(service.dailyRateSample * value)}
              </Text>
            </View>
          ) : null}
          <Text variant="caption" weight="regular" color="muted" style={{ marginTop: 10 }}>
            {t('booking.sampleQuote')} · {daysLabel(value)}
          </Text>
        </View>

        <Text variant="small" color="muted" style={{ marginTop: 20 }}>
          {t('serviceDetail.scopeNote')}
        </Text>

        {related.length ? (
          <View style={{ marginTop: 40 }}>
            <Text variant="h3">{t('serviceDetail.related')}</Text>
            <View style={{ gap: 28, marginTop: 20 }}>
              {related.map((s) => (
                <ServiceCard key={s.id} service={s} showPrice />
              ))}
            </View>
          </View>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  rate: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 20 },
  include: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  tick: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  note: { marginTop: 28, padding: 18, borderRadius: radii['2xl'], backgroundColor: colors.mint },
  estimate: { marginTop: 32, padding: 20, borderRadius: radii['3xl'], backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  estimateTotal: { marginTop: 18, paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.line, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
