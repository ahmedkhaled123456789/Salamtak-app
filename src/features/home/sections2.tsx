import { router } from 'expo-router';
import { ArrowRight, BookOpenCheck, FileSearch, HeartHandshake, Info, Quote, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { NursePortrait } from '@/components/cards/NurseCard';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { Carousel } from '@/components/layout/Carousel';
import { Section, SectionHeader, SampleNote } from '@/components/layout/Section';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icons';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { articles } from '@/data/articles';
import { faqs } from '@/data/faqs';
import { images } from '@/data/images';
import { testimonials } from '@/data/testimonials';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n, type TranslationKey } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import { NewsletterForm } from './NewsletterForm';

/* ---------------------------- Featured care professionals ---------------------------- */
export function CareProfessionals() {
  const { t, l } = useI18n();
  const { nurses, services } = useCatalogData();
  const ordered = [...nurses].sort((a, b) => Number(b.featured) - Number(a.featured) || (b.experienceYears ?? 0) - (a.experienceYears ?? 0));
  const spotlight = ordered[0];
  if (!spotlight) return null;
  const supporting = ordered.slice(1, 5);
  const offered = services.filter((s) => spotlight.serviceIds.includes(s.id));
  return (
    <Section tone="ivory">
      <SectionHeader title={t('pros.title')} body={t('pros.body')} />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/nurses/[id]', params: { id: spotlight.id } })}
        style={styles.spotlight}
      >
        <NursePortrait nurse={spotlight} aspectRatio={4 / 5} radius={0} />
        <View style={{ padding: 24 }}>
          <Text variant="small" weight="semibold" color={colors.coral}>
            {t('pros.spotlight')}
          </Text>
          <Text variant="h2" size={28} style={{ marginTop: 10 }}>
            {l(spotlight.name)}
          </Text>
          <Text variant="body" weight="medium" color={colors.brand} style={{ marginTop: 4 }}>
            {l(spotlight.role)}
          </Text>
          <Text variant="body" color="muted" style={{ marginTop: 16 }}>
            {l(spotlight.bio)}
          </Text>
          <View style={styles.tags}>
            {offered.map((s) => (
              <View key={s.id} style={styles.tag}>
                <Text variant="caption" weight="medium">
                  {l(s.title)}
                </Text>
              </View>
            ))}
          </View>
          <View style={styles.viewRow}>
            <Text variant="label" color={colors.brand}>
              {t('common.viewProfile')}
            </Text>
            <Icon icon={ArrowRight} size={16} color={colors.brand} directional />
          </View>
        </View>
      </Pressable>
      <View style={{ gap: 12, marginTop: 16 }}>
        {supporting.map((n) => (
          <Pressable key={n.id} accessibilityRole="button" onPress={() => router.push({ pathname: '/nurses/[id]', params: { id: n.id } })} style={styles.listRow}>
            <NursePortrait nurse={n} size={80} radius={16} />
            <View style={{ flex: 1 }}>
              <Text variant="title" numberOfLines={1}>
                {l(n.name)}
              </Text>
              <Text variant="small" color={colors.brand} numberOfLines={1}>
                {l(n.role)}
              </Text>
              <Text variant="small" color="muted" numberOfLines={1} style={{ marginTop: 4 }}>
                {n.languages.map(l).join(' · ')}
              </Text>
            </View>
            <Icon icon={ArrowRight} size={20} color={colors.muted} directional />
          </Pressable>
        ))}
      </View>
      <View style={{ marginTop: 24, gap: 16 }}>
        <Button variant="secondary" fullWidth href="/nurses">
          {t('pros.cta')}
        </Button>
        <SampleNote>{t('finder.sampleNote')}</SampleNote>
      </View>
    </Section>
  );
}

/* -------------------------------- Service photography gallery -------------------------------- */
const galleryItems = [
  { img: images.galleryVisit, alt: { en: 'Nurse greeting an older woman at her front door', ar: 'ممرضة تحيّي سيدة مسنّة عند باب منزلها' }, caption: 'gallery.c1', slug: 'care-planning-visit', service: { en: 'Care Planning Visit', ar: 'زيارة تخطيط الرعاية' } },
  { img: images.galleryBedside, alt: { en: 'Nurse checking a resting man’s pulse at his bedside', ar: 'ممرضة تقيس نبض رجل مستلقٍ بجانب سريره' }, caption: 'gallery.c2', slug: 'overnight-bedside-care', service: { en: 'Overnight Bedside Care', ar: 'الرعاية الليلية بجانب السرير' } },
  { img: images.galleryMeal, alt: { en: 'Caregiver and older woman preparing vegetables together', ar: 'مقدّمة رعاية وسيدة مسنّة تحضّران الخضار معاً' }, caption: 'gallery.c3', slug: 'companionship-and-meals', service: { en: 'Companionship & Meals', ar: 'الرفقة والوجبات' } },
  { img: images.galleryConsult, alt: { en: 'Nurse explaining notes on a tablet to a man at home', ar: 'ممرضة تشرح ملاحظات على جهاز لوحي لرجل في منزله' }, caption: 'gallery.c4', slug: 'home-health-check-ins', service: { en: 'Home Health Check-ins', ar: 'زيارات المتابعة الصحية' } },
] as const;

export function ServiceGallery() {
  const { t, l } = useI18n();
  return (
    <Section tone="white" flush>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader title={t('gallery.title')} body={t('gallery.body')} />
      </View>
      <View style={{ marginTop: 32 }}>
        <Carousel
          data={galleryItems}
          keyExtractor={(i) => i.slug}
          itemWidth={0.82}
          renderItem={({ item }) => (
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/services/[slug]', params: { slug: item.slug } })}>
              <SmartImage src={item.img} alt={l(item.alt)} aspectRatio={3 / 2} radius={radii['3xl']} />
              <View style={styles.captionRow}>
                <View style={{ flex: 1 }}>
                  <Text variant="label" color={colors.brand}>
                    {l(item.service)}
                  </Text>
                  <Text variant="h3" size={20} style={{ marginTop: 4 }}>
                    {t(item.caption)}
                  </Text>
                </View>
                <Icon icon={ArrowRight} size={20} color={colors.muted} directional />
              </View>
            </Pressable>
          )}
        />
      </View>
    </Section>
  );
}

/* ------------------------------------- Testimonials ------------------------------------- */
export function FamilyStories() {
  const { t, l } = useI18n();
  const [lead, ...rest] = testimonials;
  if (!lead) return null;
  return (
    <Section tone="ivory" flush>
      <View style={{ paddingHorizontal: 20 }}>
        <Text variant="h1" accessibilityRole="header">
          {t('stories.title')}
        </Text>
        <Text variant="bodyLg" color="muted" style={{ marginTop: 14 }}>
          {t('stories.body')}
        </Text>
        <View style={styles.lead}>
          <SmartImage
            src={images.stories}
            alt={l({ en: 'Grandmother laughing with her granddaughter as a caregiver smiles nearby', ar: 'جدة تضحك مع حفيدتها بينما تبتسم مقدّمة الرعاية بالقرب' })}
            aspectRatio={4 / 3}
          />
          <View style={{ padding: 24 }}>
            <Quote size={30} color={colors.mint} />
            <Text variant="h3" size={24} color={colors.white} style={{ marginTop: 16, lineHeight: 32 }}>
              {l(lead.quote)}
            </Text>
            <View style={styles.leadFoot}>
              <View style={styles.leadAvatar}>
                <Text variant="small" weight="bold" color={colors.brandDeep}>
                  {lead.initials}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="label" color={colors.white}>
                  {l(lead.author)}
                </Text>
                <Text variant="small" color="rgba(255,255,255,0.65)">
                  {l(lead.relation)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View style={{ marginTop: 20 }}>
        <Carousel data={rest} keyExtractor={(x) => x.id} itemWidth={0.84} renderItem={({ item }) => <TestimonialCard testimonial={item} style={{ flex: 1 }} />} />
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 16 }}>
        <Button variant="secondary" fullWidth href="/stories">
          {t('stories.all')}
        </Button>
        <SampleNote>{t('stories.sampleLabel')}</SampleNote>
      </View>
    </Section>
  );
}

/* ---------------------------------- Professional standards ---------------------------------- */
const standards: { icon: LucideIcon; title: TranslationKey; body: TranslationKey }[] = [
  { icon: FileSearch, title: 'standards.t1', body: 'standards.b1' },
  { icon: BookOpenCheck, title: 'standards.t2', body: 'standards.b2' },
  { icon: HeartHandshake, title: 'standards.t3', body: 'standards.b3' },
  { icon: Info, title: 'standards.t4', body: 'standards.b4' },
];

export function CareStandards() {
  const { t, l } = useI18n();
  return (
    <Section tone="white">
      <Text variant="h1" accessibilityRole="header">
        {t('standards.title')}
      </Text>
      <Text variant="bodyLg" color="muted" style={{ marginTop: 16 }}>
        {t('standards.body')}
      </Text>
      <View style={{ marginTop: 28, gap: 24 }}>
        {standards.map(({ icon: Glyph, title, body }) => (
          <View key={title} style={styles.pointRow}>
            <View style={styles.pointIcon}>
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
      <View style={{ marginTop: 28 }}>
        <SampleNote>{t('standards.disclaimer')}</SampleNote>
      </View>
      <SmartImage
        src={images.standards}
        alt={l({ en: 'Nurse reviewing a care checklist on a clipboard in a bright entryway', ar: 'ممرضة تراجع قائمة رعاية على لوح في مدخل منزل مشرق' })}
        aspectRatio={4 / 5}
        radius={radii.hero}
        style={{ marginTop: 32 }}
      />
    </Section>
  );
}

/* ------------------------------ Health articles & resources ------------------------------ */
export function HomeJournal() {
  const { t, l, date } = useI18n();
  const [featured, ...secondary] = articles;
  if (!featured) return null;
  return (
    <Section tone="ivory">
      <SectionHeader title={t('journal.title')} body={t('journal.body')} />
      <Pressable
        accessibilityRole="button"
        onPress={() => router.push({ pathname: '/resources/[slug]', params: { slug: featured.slug } })}
        style={{ marginTop: 32 }}
      >
        <SmartImage src={featured.cover} alt={l(featured.coverAlt)} aspectRatio={16 / 10} radius={radii.card} />
        <Text variant="small" weight="semibold" color={colors.brand} style={{ marginTop: 20 }}>
          {t('journal.featured')} · {l(featured.category)}
        </Text>
        <Text variant="h2" size={28} style={{ marginTop: 8 }}>
          {l(featured.title)}
        </Text>
        <Text variant="body" color="muted" style={{ marginTop: 12 }}>
          {l(featured.excerpt)}
        </Text>
        <Text variant="small" color="muted" style={{ marginTop: 12 }}>
          {featured.author ? `${t('common.by', { name: l(featured.author.name) })} · ` : ''}
          {date(featured.date)} · {t('common.minRead', { n: featured.readMinutes })}
        </Text>
      </Pressable>
      <View style={styles.secondary}>
        {secondary.map((a) => (
          <ArticleCard key={a.id} article={a} layout="row" />
        ))}
      </View>
      <View style={{ marginTop: 28 }}>
        <Button variant="secondary" fullWidth href="/resources">
          {t('journal.cta')}
        </Button>
      </View>
    </Section>
  );
}

/* ------------------------------------------ FAQs ------------------------------------------ */
export function HomeFaq() {
  const { t, l } = useI18n();
  const items = faqs.slice(0, 7).map((f) => ({
    id: f.id,
    title: l(f.question),
    content: (
      <View style={{ gap: 12 }}>
        {f.placeholder ? <Badge tone="amber">{t('faqSection.placeholder')}</Badge> : null}
        <Text variant="body" color="muted">
          {l(f.answer)}
        </Text>
      </View>
    ),
  }));
  return (
    <Section tone="white">
      <Text variant="h1" accessibilityRole="header">
        {t('faqSection.title')}
      </Text>
      <Text variant="bodyLg" color="muted" style={{ marginTop: 14 }}>
        {t('faqSection.body')}
      </Text>
      <View style={{ marginTop: 28 }}>
        <Accordion items={items} defaultOpen={items[0]?.id} />
      </View>
      <View style={{ marginTop: 28, gap: 12 }}>
        <Button variant="secondary" fullWidth href="/faqs">
          {t('faqSection.cta')}
        </Button>
        <Button variant="ghost" fullWidth href="/contact">
          {t('nav.contact')}
        </Button>
      </View>
    </Section>
  );
}

/* ----------------------------------------- Final CTA ----------------------------------------- */
export function FinalCta() {
  const { t, l } = useI18n();
  return (
    <Section tone="ivory" paddingTop={48} paddingBottom={32}>
      <View style={styles.finalCard}>
        <View style={styles.finalBody}>
          <Svg viewBox="0 0 400 400" width={320} height={320} style={styles.rings} pointerEvents="none">
            {[60, 110, 160, 200].map((r) => (
              <Circle key={r} cx={200} cy={200} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={1.5} />
            ))}
          </Svg>
          <Text variant="h1" size={38} color={colors.white} accessibilityRole="header">
            {t('finalCta.title')}
          </Text>
          <Text variant="bodyLg" color="rgba(255,255,255,0.75)" style={{ marginTop: 18 }}>
            {t('finalCta.body')}
          </Text>
          <View style={{ marginTop: 28, gap: 12 }}>
            <Button size="lg" variant="light" fullWidth href="/nurses">
              {t('finalCta.primary')}
            </Button>
            <Button size="lg" variant="outlineLight" fullWidth href="/services">
              {t('finalCta.secondary')}
            </Button>
          </View>
        </View>
        <SmartImage
          src={images.finalCta}
          alt={l({ en: 'Caregiver holding an older woman’s hands on a knitted blanket', ar: 'مقدّمة رعاية تمسك يدي سيدة مسنّة فوق بطانية محاكة' })}
          aspectRatio={4 / 3}
        />
      </View>
    </Section>
  );
}

/* --------------------------------------- Newsletter --------------------------------------- */
export function NewsletterSection() {
  const { t } = useI18n();
  return (
    <Section tone="ivory" paddingTop={0} paddingBottom={48}>
      <View style={styles.newsletter}>
        <Text variant="h3" size={28} accessibilityRole="header">
          {t('newsletter.title')}
        </Text>
        <Text variant="body" color="rgba(23,43,42,0.7)" style={{ marginTop: 8, marginBottom: 20 }}>
          {t('newsletter.body')}
        </Text>
        <NewsletterForm />
      </View>
    </Section>
  );
}

const styles = StyleSheet.create({
  spotlight: { marginTop: 32, overflow: 'hidden', backgroundColor: colors.white, borderRadius: radii.hero },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 16 },
  tag: { backgroundColor: colors.ivory, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 4 },
  viewRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 20 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: colors.white, borderRadius: radii['3xl'], padding: 12 },
  captionRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginTop: 16 },
  lead: { marginTop: 28, overflow: 'hidden', backgroundColor: colors.brandDeep, borderRadius: radii.hero },
  leadFoot: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 28 },
  leadAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  pointRow: { flexDirection: 'row', gap: 16 },
  pointIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  secondary: { marginTop: 32, gap: 24, paddingTop: 28, borderTopWidth: 1, borderTopColor: colors.line },
  finalCard: { overflow: 'hidden', backgroundColor: colors.brandDeep, borderRadius: radii.panel, ...shadows.soft },
  finalBody: { padding: 28, paddingTop: 36, paddingBottom: 32, overflow: 'hidden' },
  rings: { position: 'absolute', bottom: -120, end: -120 },
  newsletter: { backgroundColor: colors.mint, borderRadius: radii.card, padding: 24 },
});
