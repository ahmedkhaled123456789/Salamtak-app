import { router } from 'expo-router';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CalendarHeart,
  ClipboardList,
  Headset,
  LayoutDashboard,
  LockKeyhole,
  ReceiptText,
  ShieldCheck,
  SlidersHorizontal,
  UserRoundCheck,
  UserRoundCog,
  UsersRound,
  type LucideIcon,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { NurseCard } from '@/components/cards/NurseCard';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { Carousel } from '@/components/layout/Carousel';
import { Section, SectionHeader, SampleNote } from '@/components/layout/Section';
import { Button } from '@/components/ui/Button';
import { DaysStepper } from '@/components/ui/DaysStepper';
import { Icon } from '@/components/ui/Icons';
import { SelectField } from '@/components/ui/SelectField';
import { Skeleton } from '@/components/ui/Skeleton';
import { SmartImage } from '@/components/ui/SmartImage';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { images } from '@/data/images';
import { useCatalogData, useNurses } from '@/hooks/useCatalog';
import { useI18n, type TranslationKey } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import type { GenderPreference } from '@/types/nurse';

/* ------------------------------ Trust indicators ------------------------------ */
const trustItems: { icon: LucideIcon; title: TranslationKey; body: TranslationKey }[] = [
  { icon: UserRoundCheck, title: 'trust.t1', body: 'trust.d1' },
  { icon: SlidersHorizontal, title: 'trust.t2', body: 'trust.d2' },
  { icon: LockKeyhole, title: 'trust.t3', body: 'trust.d3' },
  { icon: Headset, title: 'trust.t4', body: 'trust.d4' },
];

export function TrustStrip() {
  const { t } = useI18n();
  return (
    <View style={styles.trust}>
      {trustItems.map(({ icon: Glyph, title, body }, i) => (
        <View key={title} style={[styles.trustRow, i > 0 && styles.divider]}>
          <View style={styles.discMint}>
            <Glyph size={20} color={colors.brand} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="body" weight="bold">
              {t(title)}
            </Text>
            <Text variant="body" color="muted" style={{ marginTop: 4 }}>
              {t(body)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

/* ------------------------------- Care services ------------------------------- */
export function ServicesShowcase() {
  const { t } = useI18n();
  const { services, isLoading, isError, refetch } = useCatalogData();
  const showcase = services.slice(0, 8);
  const { width } = useWindowDimensions();
  const colW = (width - 40 - 16) / 2;
  return (
    <Section tone="ivory">
      <SectionHeader title={t('servicesSection.title')} body={t('servicesSection.body')} />
      <View style={{ marginTop: 32 }}>
        {isError ? (
          <QueryError error={null} onRetry={() => void refetch()} />
        ) : isLoading ? (
          <View style={styles.grid}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={{ width: colW, gap: 10 }}>
                <Skeleton height={colW * 0.75} radius={16} />
                <Skeleton height={18} width="80%" />
                <Skeleton height={14} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.grid}>
            {showcase.map((s) => (
              <ServiceCard key={s.id} service={s} style={{ width: colW, flexGrow: 0, flexShrink: 0, flexBasis: 'auto' }} />
            ))}
          </View>
        )}
      </View>
      <View style={{ marginTop: 28 }}>
        <Button variant="secondary" href="/services" fullWidth>
          {t('servicesSection.cta')}
        </Button>
      </View>
      <View style={{ marginTop: 20 }}>
        <SampleNote>{t('servicesSection.note')}</SampleNote>
      </View>
    </Section>
  );
}

/* ---------------------------- Editorial healthcare story ---------------------------- */
export function EditorialStory() {
  const { t, l } = useI18n();
  return (
    <Section tone="white">
      <View style={{ marginBottom: 36 }}>
        <SmartImage
          src={images.story}
          alt={l({ en: 'Caregiver and an older man laughing together while pouring tea at the kitchen table', ar: 'مقدّم رعاية ورجل مسن يضحكان معاً أثناء سكب الشاي على طاولة المطبخ' })}
          aspectRatio={4 / 5}
          radius={radii.hero}
        />
        <View style={[styles.quoteCard, shadows.lift]}>
          <Text variant="h3" italic color={colors.white} size={21} style={{ lineHeight: 28 }}>
            “{t('story.quote')}”
          </Text>
        </View>
      </View>
      <Text variant="h1" accessibilityRole="header">
        {t('story.title')}
      </Text>
      <Text variant="bodyLg" color="rgba(23,43,42,0.85)" style={{ marginTop: 20 }}>
        {t('story.p1')}
      </Text>
      <Text variant="bodyLg" color="muted" style={{ marginTop: 16 }}>
        {t('story.p2')}
      </Text>
      <Pressable accessibilityRole="link" onPress={() => router.push('/how-it-works')} style={styles.underlined}>
        <Text variant="label" size={16} color={colors.brandDark}>
          {t('story.cta')}
        </Text>
        <Icon icon={ArrowRight} size={16} color={colors.brandDark} directional />
      </Pressable>
    </Section>
  );
}

/* ----------------------------- Nurse discovery & search ----------------------------- */
export function NurseFinder() {
  const { t, l } = useI18n();
  const { services } = useCatalogData();
  const [serviceId, setServiceId] = useState('');
  const [gender, setGender] = useState<GenderPreference>('any');
  const { data, isLoading, isError, error, refetch } = useNurses({ serviceId: serviceId || undefined, gender });
  const shown = (data ?? []).slice(0, 4);
  return (
    <Section tone="ivory" flush>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader title={t('finder.title')} body={t('finder.body')} />
        <View style={styles.filterPanel}>
          <SelectField
            label={t('hero.service')}
            value={serviceId}
            onChange={setServiceId}
            options={[{ value: '', label: t('hero.anyService') }, ...services.map((s) => ({ value: s.id, label: l(s.title) }))]}
          />
          <View style={{ marginTop: 16 }}>
            <Text variant="label" style={{ marginBottom: 6 }}>
              {t('hero.gender')}
            </Text>
            <View style={styles.segment}>
              {(
                [
                  ['any', t('common.noPreference')],
                  ['female', t('common.female')],
                  ['male', t('common.male')],
                ] as const
              ).map(([v, label]) => (
                <Pressable key={v} onPress={() => setGender(v)} accessibilityRole="button" accessibilityState={{ selected: gender === v }} style={[styles.segItem, gender === v && styles.segActive]}>
                  <Text variant="label" size={13} align="center" color={gender === v ? colors.brandDark : colors.muted} numberOfLines={2}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 28 }}>
        {isError ? (
          <View style={{ paddingHorizontal: 20 }}>
            <QueryError error={error} onRetry={() => void refetch()} />
          </View>
        ) : isLoading ? (
          <Carousel data={[0, 1]} keyExtractor={(i) => String(i)} renderItem={() => <Skeleton height={430} radius={24} />} />
        ) : shown.length === 0 ? (
          <View style={{ paddingHorizontal: 20 }}>
            <StateMessage title={t('finder.empty')} />
          </View>
        ) : (
          <Carousel data={shown} keyExtractor={(n) => n.id} renderItem={({ item }) => <NurseCard nurse={item} />} itemWidth={0.72} />
        )}
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 28, gap: 16 }}>
        <Button variant="secondary" fullWidth href="/nurses">
          {t('finder.browseAll')}
        </Button>
        <SampleNote>{t('finder.sampleNote')}</SampleNote>
      </View>
    </Section>
  );
}

/* ---------------------------------- How it works ---------------------------------- */
const steps: { icon: LucideIcon; title: TranslationKey; body: TranslationKey }[] = [
  { icon: ClipboardList, title: 'how.s1', body: 'how.b1' },
  { icon: CalendarHeart, title: 'how.s2', body: 'how.b2' },
  { icon: UsersRound, title: 'how.s3', body: 'how.b3' },
  { icon: ShieldCheck, title: 'how.s4', body: 'how.b4' },
];

export function HowItWorksSteps({ showHeader = true }: { showHeader?: boolean }) {
  const { t, num } = useI18n();
  return (
    <Section tone="mint">
      {showHeader ? <SectionHeader title={t('how.title')} body={t('how.body')} align="center" /> : null}
      <View style={{ marginTop: showHeader ? 40 : 0 }}>
        {steps.map(({ icon: Glyph, title, body }, i) => (
          <View key={title} style={styles.step}>
            <View style={styles.railCol}>
              <View style={styles.stepNum}>
                <Text variant="h3" size={20} color={colors.brand}>
                  {num(i + 1)}
                </Text>
              </View>
              {i < steps.length - 1 ? <View style={styles.rail} /> : null}
            </View>
            <View style={{ flex: 1, paddingBottom: i < steps.length - 1 ? 32 : 0 }}>
              <Glyph size={24} color={colors.brandDark} />
              <Text variant="title" size={20} style={{ marginTop: 10 }}>
                {t(title)}
              </Text>
              <Text variant="body" color="rgba(23,43,42,0.7)" style={{ marginTop: 6 }}>
                {t(body)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Section>
  );
}

/* --------------------------------- Care categories --------------------------------- */
const stages = [
  { img: images.stageOlder, alt: { en: 'Older couple in a sunny living room as a caregiver brings tea', ar: 'زوجان مسنّان في غرفة معيشة مشمسة بينما تحضر مقدّمة رعاية الشاي' }, title: 'stages.t1', body: 'stages.b1', slug: 'elderly-care' },
  { img: images.stageSurgery, alt: { en: 'Woman walking with crutches as a nurse supports her', ar: 'سيدة تمشي بعكازات وممرضة تساندها' }, title: 'stages.t2', body: 'stages.b2', slug: 'post-surgery-care' },
  { img: images.stageOngoing, alt: { en: 'Caregiver helping a man in a wheelchair at his desk', ar: 'مقدّم رعاية يساعد رجلاً على كرسي متحرك عند مكتبه' }, title: 'stages.t3', body: 'stages.b3', slug: 'daily-living-assistance' },
  { img: images.stageFamilies, alt: { en: 'Family talking with a home care nurse at the kitchen table', ar: 'عائلة تتحدث مع ممرضة رعاية منزلية على طاولة المطبخ' }, title: 'stages.t4', body: 'stages.b4', slug: 'long-term-home-care' },
] as const;

export function LifeStages() {
  const { t, l } = useI18n();
  return (
    <Section tone="ivory" flush>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader title={t('stages.title')} body={t('stages.body')} />
      </View>
      <View style={{ marginTop: 32 }}>
        <Carousel
          data={stages}
          keyExtractor={(s) => s.title}
          itemWidth={0.76}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(item.title)}
              onPress={() => router.push({ pathname: '/services/[slug]', params: { slug: item.slug } })}
              style={({ pressed }) => pressed && { opacity: 0.9 }}
            >
              <SmartImage src={item.img} alt={l(item.alt)} aspectRatio={3 / 4} radius={radii['3xl']}>
                <View style={styles.stageCard}>
                  <View style={styles.stageHead}>
                    <Text variant="title" size={17} style={{ flex: 1 }}>
                      {t(item.title)}
                    </Text>
                    <Icon icon={ArrowUpRight} size={20} color={colors.brand} directional />
                  </View>
                  <Text variant="small" color="muted" style={{ marginTop: 6 }}>
                    {t(item.body)}
                  </Text>
                </View>
              </SmartImage>
            </Pressable>
          )}
        />
      </View>
    </Section>
  );
}

/* ------------------------------- Why choose CareFlow ------------------------------- */
const benefits: { icon: LucideIcon; title: TranslationKey; body: TranslationKey }[] = [
  { icon: UserRoundCog, title: 'why.t1', body: 'why.b1' },
  { icon: CalendarClock, title: 'why.t2', body: 'why.b2' },
  { icon: ReceiptText, title: 'why.t3', body: 'why.b3' },
  { icon: LayoutDashboard, title: 'why.t4', body: 'why.b4' },
];

export function WhyChoose() {
  const { t, l } = useI18n();
  return (
    <Section tone="white">
      <SmartImage
        src={images.whyMain}
        alt={l({ en: 'Nurse holding a tablet in a bright home hallway', ar: 'ممرضة تحمل جهازاً لوحياً في ممر منزل مشرق' })}
        aspectRatio={4 / 5}
        radius={radii.hero}
        position="50% 30%"
      />
      <Text variant="h1" style={{ marginTop: 36 }} accessibilityRole="header">
        {t('why.title')}
      </Text>
      <Text variant="bodyLg" color="muted" style={{ marginTop: 16 }}>
        {t('why.body')}
      </Text>
      <View style={{ marginTop: 28 }}>
        {benefits.map(({ icon: Glyph, title, body }) => (
          <View key={title} style={styles.benefit}>
            <Glyph size={24} color={colors.brand} />
            <Text variant="title" size={18} style={{ marginTop: 14 }}>
              {t(title)}
            </Text>
            <Text variant="body" color="muted" style={{ marginTop: 8 }}>
              {t(body)}
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.pair}>
        <View style={{ flex: 1 }}>
          <SmartImage
            src={images.whyEquipment}
            alt={l({ en: 'Stethoscope, blood pressure cuff and notebook on a wooden table', ar: 'سماعة طبية وجهاز ضغط ودفتر على طاولة خشبية' })}
            aspectRatio={1}
            radius={radii['3xl']}
          />
        </View>
        <View style={{ flex: 1.3, justifyContent: 'flex-end' }}>
          <SmartImage
            src={images.whyFamily}
            alt={l({ en: 'Daughter and nurse discussing a care plan with an older father', ar: 'ابنة وممرضة تناقشان خطة رعاية مع أب مسن' })}
            aspectRatio={13 / 10}
            radius={radii['3xl']}
          />
        </View>
      </View>
      <View style={{ marginTop: 28 }}>
        <Button variant="secondary" fullWidth href="/why-careflow">
          {t('why.cta')}
        </Button>
      </View>
    </Section>
  );
}

/* --------------------------- Large photographic care-at-home --------------------------- */
export function RealLifeBanner() {
  const { t, l } = useI18n();
  return (
    <View style={{ backgroundColor: colors.ivory, paddingBottom: 48 }}>
      <SmartImage
        src={images.realLife}
        alt={l({ en: 'Nurse and older man reviewing a care notebook on a sofa by a large window', ar: 'ممرضة ورجل مسن يراجعان دفتر رعاية على أريكة قرب نافذة كبيرة' })}
        height={420}
        width="100%"
        position="65% 50%"
      />
      <View style={[styles.floatCard, shadows.lift]}>
        <Text variant="h2" size={34} accessibilityRole="header">
          {t('realLife.title')}
        </Text>
        <Text variant="bodyLg" color="muted" style={{ marginTop: 16 }}>
          {t('realLife.body')}
        </Text>
        <View style={{ marginTop: 24 }}>
          <Button fullWidth href="/services">
            {t('realLife.cta')}
          </Button>
        </View>
      </View>
    </View>
  );
}

/* ----------------------------- Booking experience preview ----------------------------- */
export function BookingPreview() {
  const { t, l, money, daysLabel } = useI18n();
  const [days, setDays] = useState(5);
  const sample = useCatalogData().services.find((s) => s.dailyRateSample !== null);
  if (!sample) return null;
  const rate = sample.dailyRateSample ?? 0;
  const row = (label: string, value: React.ReactNode) => (
    <View style={styles.previewRow}>
      <Text variant="body" color="muted">
        {label}
      </Text>
      {typeof value === 'string' ? (
        <Text variant="body" weight="semibold">
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
  return (
    <Section tone="mint">
      <Text variant="h1" accessibilityRole="header">
        {t('bookingPreview.title')}
      </Text>
      <Text variant="bodyLg" color="rgba(23,43,42,0.75)" style={{ marginTop: 16 }}>
        {t('bookingPreview.body')}
      </Text>
      <View style={styles.formula}>
        <Text variant="small" color={colors.brandDark}>
          {t('bookingPreview.formula')}
        </Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <SampleNote>{t('bookingPreview.backendNote')}</SampleNote>
      </View>
      <View style={[styles.previewCard, shadows.lift]}>
        <Text variant="small" weight="semibold" color="muted">
          {t('bookingPreview.sampleLabel')}
        </Text>
        <View style={styles.previewService}>
          <SmartImage src={sample.image} alt="" width={60} height={60} radius={12} />
          <View style={{ flex: 1 }}>
            <Text variant="small" color="muted">
              {t('bookingPreview.service')}
            </Text>
            <Text variant="body" weight="bold" numberOfLines={2}>
              {l(sample.title)}
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 8 }}>
          {row(t('bookingPreview.preference'), t('common.female'))}
          {row(t('bookingPreview.duration'), <DaysStepper value={days} min={1} max={14} onChange={setDays} />)}
          {row(t('bookingPreview.dailyRate'), money(rate))}
          {row(t('bookingPreview.numberOfDays'), `× ${daysLabel(days)}`)}
        </View>
        <View style={styles.total}>
          <Text variant="label" size={15}>
            {t('bookingPreview.estimatedTotal')}
          </Text>
          <Text variant="price" size={34} color={colors.brandDark} accessibilityLiveRegion="polite">
            {money(rate * days)}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 28 }}>
        <Button fullWidth onPress={() => router.push({ pathname: '/book', params: { service: sample.slug } })}>
          {t('bookingPreview.cta')}
        </Button>
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  trust: { backgroundColor: colors.white, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.line, paddingHorizontal: 20 },
  trustRow: { flexDirection: 'row', gap: 16, paddingVertical: 24 },
  divider: { borderTopWidth: 1, borderTopColor: colors.line },
  discMint: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 32 },
  quoteCard: { position: 'absolute', bottom: -28, end: 12, start: 40, backgroundColor: colors.brandDeep, borderRadius: radii['3xl'], padding: 20 },
  underlined: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 28, paddingBottom: 4, borderBottomWidth: 2, borderBottomColor: colors.brand },
  filterPanel: { marginTop: 24, backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 16 },
  segment: { flexDirection: 'row', backgroundColor: colors.ivory, borderRadius: radii.full, padding: 4 },
  segItem: { flex: 1, minHeight: 40, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  segActive: { backgroundColor: colors.white, ...shadows.soft },
  step: { flexDirection: 'row', gap: 20 },
  railCol: { alignItems: 'center' },
  stepNum: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.white, borderWidth: 1, borderColor: 'rgba(15,118,110,0.2)', alignItems: 'center', justifyContent: 'center' },
  rail: { flex: 1, width: 1, backgroundColor: 'rgba(15,118,110,0.25)', marginVertical: 4 },
  stageCard: { position: 'absolute', start: 12, end: 12, bottom: 12, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: radii['2xl'], padding: 16 },
  stageHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  benefit: { borderTopWidth: 1, borderTopColor: colors.line, paddingVertical: 24 },
  pair: { flexDirection: 'row', gap: 16, marginTop: 8, alignItems: 'flex-end' },
  floatCard: { marginHorizontal: 20, marginTop: -72, backgroundColor: colors.white, borderRadius: radii.card, padding: 28 },
  formula: { alignSelf: 'flex-start', marginTop: 24, borderRadius: radii.full, borderWidth: 1, borderColor: 'rgba(15,118,110,0.2)', backgroundColor: 'rgba(255,255,255,0.6)', paddingHorizontal: 16, paddingVertical: 8 },
  previewCard: { marginTop: 32, backgroundColor: colors.white, borderRadius: radii.card, padding: 22 },
  previewService: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 16, backgroundColor: colors.ivory, borderRadius: radii['2xl'], padding: 12 },
  previewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  total: { marginTop: 8, paddingTop: 18, borderTopWidth: 2, borderTopColor: colors.ink, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
});
