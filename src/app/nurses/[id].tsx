import { router, useLocalSearchParams } from 'expo-router';
import { Languages, MapPin, ShieldCheck } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { NursePortrait } from '@/components/cards/NurseCard';
import { Screen } from '@/components/layout/Screen';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { useCatalogData, useNurse } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { useAuth } from '@/state/auth';
import { useBookingDraft } from '@/state/bookingDraft';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

export default function NurseProfileScreen() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { t, l, money } = useI18n();
  const { data: nurse, isLoading, isError, error, refetch } = useNurse(id);
  const { services } = useCatalogData();
  const { reset } = useBookingDraft();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Screen header="back">
        <View style={{ padding: 20, gap: 16 }}>
          <Skeleton height={360} radius={32} />
          <Skeleton height={30} width="60%" />
          <Skeleton height={90} />
        </View>
      </Screen>
    );
  }
  if (isError || !nurse) {
    const notFound = (error as { code?: string } | null)?.code === 'not_found';
    return (
      <Screen header="back">
        <View style={{ padding: 20 }}>{notFound ? <StateMessage title={t('nurseProfile.notFound')} actionLabel={t('nav.findNurse')} onAction={() => router.replace('/nurses')} /> : <QueryError error={error} onRetry={() => void refetch()} />}</View>
      </Screen>
    );
  }

  const offered = services.filter((s) => nurse.serviceIds.includes(s.id));
  const canBook = user?.role !== 'NURSE';
  const book = () => {
    reset({ nurseId: nurse.id, serviceId: offered[0]?.id, genderPreference: nurse.gender });
    router.push('/book');
  };

  return (
    <Screen
      header="back"
      title={l(nurse.name)}
      footer={
        canBook ? (
          <Button fullWidth size="lg" onPress={book}>
            {t('nurseProfile.book', { name: l(nurse.name).split(' ')[0] ?? '' })}
          </Button>
        ) : undefined
      }
    >
      <View style={{ padding: 20, paddingBottom: 40 }}>
        <NursePortrait nurse={nurse} aspectRatio={4 / 5} radius={radii.hero} />
        <View style={{ marginTop: 22, gap: 6 }}>
          <Text variant="small" weight="semibold" color={colors.brand}>
            {l(nurse.role)}
          </Text>
          <Text variant="h1" size={34} accessibilityRole="header">
            {l(nurse.name)}
          </Text>
          <View style={styles.badges}>
            <Badge tone="mint">{t('common.available')}</Badge>
            {nurse.dailyRateSample !== undefined ? <Badge tone="neutral">{`${money(nurse.dailyRateSample)} ${t('common.perDay')}`}</Badge> : null}
          </View>
        </View>

        <Text variant="h3" style={{ marginTop: 28 }}>
          {t('nurseProfile.about')}
        </Text>
        <Text variant="bodyLg" color="rgba(23,43,42,0.85)" style={{ marginTop: 10 }}>
          {l(nurse.bio)}
        </Text>

        <View style={styles.card}>
          <Text variant="title">{t('nurseProfile.details')}</Text>
          <View style={{ marginTop: 12, gap: 12 }}>
            <View style={styles.row}>
              <MapPin size={18} color={colors.brand} />
              <Text variant="body" style={{ flex: 1 }}>
                {t('nurseProfile.location')}: {l(nurse.city)}
              </Text>
            </View>
            {nurse.languages.length ? (
              <View style={styles.row}>
                <Languages size={18} color={colors.brand} />
                <Text variant="body" style={{ flex: 1 }}>
                  {t('common.languages')}: {nurse.languages.map(l).join(' · ')}
                </Text>
              </View>
            ) : null}
            {nurse.experienceYears !== undefined ? (
              <View style={styles.row}>
                <ShieldCheck size={18} color={colors.brand} />
                <Text variant="body" style={{ flex: 1 }}>
                  {t('nurseProfile.experience')}: {t('common.experience', { n: nurse.experienceYears })}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {nurse.qualifications?.length ? (
          <View style={{ marginTop: 24 }}>
            <Text variant="h3">{t('nurseProfile.qualifications')}</Text>
            {nurse.qualifications.map((q, i) => (
              <Text key={i} variant="body" style={{ marginTop: 8 }}>
                • {l(q)}
              </Text>
            ))}
            <Text variant="small" color="muted" style={{ marginTop: 8 }}>
              {t('nurseProfile.qualificationsNote')}
            </Text>
          </View>
        ) : null}

        {offered.length ? (
          <View style={{ marginTop: 28 }}>
            <Text variant="h3">{t('nurseProfile.services')}</Text>
            <View style={styles.tags}>
              {offered.map((s) => (
                <View key={s.id} style={styles.tag}>
                  <Text variant="label">{l(s.title)}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={{ marginTop: 28 }}>
          <Text variant="h3">{t('nurseProfile.reviews')}</Text>
          <Text variant="body" color="muted" style={{ marginTop: 8 }}>
            {t('nurseProfile.noReviews')}
          </Text>
        </View>
        <Text variant="small" color="muted" style={{ marginTop: 24 }}>
          {t('nurseProfile.privacy')}
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  badges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 4 },
  card: { marginTop: 28, padding: 20, borderRadius: radii['3xl'], backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  tag: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, borderRadius: radii.full, paddingHorizontal: 14, paddingVertical: 8 },
});
