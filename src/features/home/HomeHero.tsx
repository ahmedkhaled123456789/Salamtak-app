import { router } from 'expo-router';
import { CalendarCheck2, HeartHandshake, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SelectField } from '@/components/ui/SelectField';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { NursePortrait } from '@/components/cards/NurseCard';
import { images } from '@/data/images';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import type { GenderPreference } from '@/types/nurse';

const DURATIONS = [3, 7, 14, 30];

/** Illustrative appointment preview floating over the hero photograph (website: HeroVisitCard). */
function HeroVisitCard() {
  const { t, l } = useI18n();
  const nurse = useCatalogData().nurses[0];
  if (!nurse) return null;
  return (
    <View style={[styles.visit, shadows.lift]} accessibilityLabel={`${t('hero.previewLabel')} (${t('common.sample')})`}>
      <View style={styles.visitTop}>
        <View style={styles.visitLabel}>
          <CalendarCheck2 size={14} color={colors.brand} />
          <Text variant="caption" color="muted">
            {t('hero.previewLabel')}
          </Text>
        </View>
        <Badge tone="mint">{t('hero.previewStatus')}</Badge>
      </View>
      <View style={styles.visitRow}>
        <NursePortrait nurse={nurse} size={44} radius={22} />
        <View style={{ flex: 1 }}>
          <Text variant="body" weight="bold" numberOfLines={1}>
            {l(nurse.name)}
          </Text>
          <Text variant="small" color="muted" numberOfLines={1}>
            {t('hero.previewTime')}
          </Text>
        </View>
      </View>
      <Text variant="caption" weight="regular" color="muted" style={styles.sample}>
        {t('common.sample')}
      </Text>
    </View>
  );
}

function HeroSearchPanel() {
  const { t, l, daysLabel } = useI18n();
  const { services } = useCatalogData();
  const [serviceId, setServiceId] = useState('');
  const [gender, setGender] = useState<GenderPreference>('any');
  const [days, setDays] = useState(7);
  const submit = () =>
    router.push({
      pathname: '/nurses',
      params: { ...(serviceId ? { service: serviceId } : {}), ...(gender !== 'any' ? { gender } : {}), days: String(days) },
    });
  return (
    <View style={[styles.panel, shadows.lift]} accessibilityLabel={t('hero.searchTitle')}>
      <Text variant="label" weight="semibold">
        {t('hero.searchTitle')}
      </Text>
      <View style={{ gap: 16, marginTop: 16 }}>
        <SelectField
          label={t('hero.service')}
          value={serviceId}
          onChange={setServiceId}
          options={[{ value: '', label: t('hero.anyService') }, ...services.map((s) => ({ value: s.id, label: l(s.title) }))]}
        />
        <View>
          <Text variant="label" style={{ marginBottom: 6 }}>
            {t('hero.gender')}
          </Text>
          <View style={styles.chips}>
            {(
              [
                ['any', t('common.noPreference')],
                ['female', t('common.female')],
                ['male', t('common.male')],
              ] as const
            ).map(([v, label]) => (
              <Chip key={v} label={label} selected={gender === v} onPress={() => setGender(v)} />
            ))}
          </View>
        </View>
        <View>
          <Text variant="label" style={{ marginBottom: 6 }}>
            {t('hero.duration')}
          </Text>
          <View style={styles.chips}>
            {DURATIONS.map((d) => (
              <Chip key={d} label={daysLabel(d)} selected={days === d} onPress={() => setDays(d)} />
            ))}
          </View>
        </View>
        <Button size="lg" fullWidth onPress={submit} iconStart={<Search size={18} color={colors.white} />}>
          {t('hero.search')}
        </Button>
      </View>
    </View>
  );
}

export function HomeHero() {
  const { t, l, locale } = useI18n();
  const { width } = useWindowDimensions();
  const titleSize = width < 360 ? 40 : width < 400 ? 44 : 48;
  return (
    <View style={styles.section} accessibilityRole="summary">
      <View style={styles.kicker}>
        <View style={styles.disc}>
          <HeartHandshake size={16} color={colors.brandDark} />
        </View>
        <Text variant="body" weight="semibold" color={colors.brandDark} style={{ flex: 1 }}>
          {t('hero.trust')}
        </Text>
      </View>
      <Text variant="hero" size={titleSize} style={styles.title} accessibilityRole="header">
        {t('hero.title1')}
      </Text>
      <Text variant="hero" size={titleSize} italic={locale === 'en'} color={colors.brand} accessibilityRole="header">
        {t('hero.title2')}
      </Text>
      <Text variant="bodyLg" color="muted" style={styles.body}>
        {t('hero.body')}
      </Text>
      <View style={styles.ctas}>
        <Button size="lg" fullWidth href="/nurses">
          {t('hero.primary')}
        </Button>
        <Button size="lg" fullWidth variant="secondary" href="/services">
          {t('hero.secondary')}
        </Button>
      </View>
      <View style={styles.photoWrap}>
        <SmartImage
          src={images.hero}
          alt={l({
            en: 'Home care nurse kneeling beside an older woman in an armchair, holding her hand',
            ar: 'ممرضة رعاية منزلية تجثو بجانب سيدة مسنّة على كرسي وتمسك يدها',
          })}
          aspectRatio={4 / 5}
          radius={radii.hero}
          position="40% 50%"
          priority
          style={shadows.lift}
        />
        <View style={styles.trustCard}>
          <View style={styles.trustDot} />
          <Text variant="small" weight="semibold" style={{ flex: 1 }}>
            {t('hero.trustCard')}
          </Text>
        </View>
        <HeroVisitCard />
      </View>
      <HeroSearchPanel />
    </View>
  );
}

const styles = StyleSheet.create({
  section: { backgroundColor: colors.ivory, paddingHorizontal: 20, paddingTop: 28, paddingBottom: 48 },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  disc: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 24 },
  body: { marginTop: 20 },
  ctas: { gap: 12, marginTop: 28 },
  photoWrap: { marginTop: 36, marginBottom: 28 },
  trustCard: {
    position: 'absolute',
    top: 14,
    end: 14,
    maxWidth: 190,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radii['2xl'],
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  trustDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },
  visit: { position: 'absolute', bottom: -28, start: 14, width: 256, backgroundColor: colors.white, borderRadius: radii['2xl'], borderWidth: 1, borderColor: colors.line, padding: 14 },
  visitTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  visitLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  visitRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  sample: { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.line },
  panel: { marginTop: 24, backgroundColor: colors.white, borderRadius: radii['3xl'] + 4, borderWidth: 1, borderColor: colors.line, padding: 20 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
