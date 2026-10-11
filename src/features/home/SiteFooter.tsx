import { router, type Href } from 'expo-router';
import { Mail, Phone } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Logo } from '@/components/ui/Logo';
import { Text } from '@/components/ui/Text';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n, type TranslationKey } from '@/i18n';
import { colors } from '@/theme/colors';
import { NewsletterForm } from './NewsletterForm';

const company: { href: Href; key: TranslationKey }[] = [
  { href: '/about', key: 'nav.about' },
  { href: '/why-careflow', key: 'nav.why' },
  { href: '/how-it-works', key: 'nav.howItWorks' },
  { href: '/stories', key: 'nav.reviews' },
  { href: '/contact', key: 'nav.contact' },
];
const patients: { href: Href; key: TranslationKey }[] = [
  { href: '/nurses', key: 'nav.findNurse' },
  { href: '/resources', key: 'nav.resources' },
  { href: '/faqs', key: 'nav.faqs' },
  { href: '/profile', key: 'nav.account' },
];

/** Native equivalent of the website footer (brand-deep, link columns, newsletter, legal). */
export function SiteFooter() {
  const { t, l } = useI18n();
  const { services } = useCatalogData();
  const Link = ({ href, label }: { href: Href; label: string }) => (
    <Pressable accessibilityRole="link" onPress={() => router.push(href)} style={styles.link} hitSlop={4}>
      <Text variant="body" color="rgba(255,255,255,0.7)" numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
  return (
    <View style={styles.footer}>
      <Logo tone="light" />
      <Text variant="body" color="rgba(255,255,255,0.7)" style={{ marginTop: 20 }}>
        {t('footer.tagline')}
      </Text>
      <Text variant="label" color={colors.white} style={{ marginTop: 28, marginBottom: 12 }}>
        {t('footer.newsletter')}
      </Text>
      <NewsletterForm tone="light" />

      <View style={styles.cols}>
        <View style={styles.col}>
          <Text variant="label" color={colors.white} style={styles.heading}>
            {t('footer.services')}
          </Text>
          {services.slice(0, 5).map((s) => (
            <Link key={s.id} href={{ pathname: '/services/[slug]', params: { slug: s.slug } }} label={l(s.title)} />
          ))}
        </View>
        <View style={styles.col}>
          <Text variant="label" color={colors.white} style={styles.heading}>
            {t('footer.company')}
          </Text>
          {company.map((c) => (
            <Link key={c.key} href={c.href} label={t(c.key)} />
          ))}
        </View>
        <View style={styles.col}>
          <Text variant="label" color={colors.white} style={styles.heading}>
            {t('footer.resources')}
          </Text>
          {patients.map((c) => (
            <Link key={c.key} href={c.href} label={t(c.key)} />
          ))}
        </View>
        <View style={styles.col}>
          <Text variant="label" color={colors.white} style={styles.heading}>
            {t('footer.contact')}
          </Text>
          <View style={styles.contact}>
            <Mail size={16} color="rgba(255,255,255,0.7)" />
            <Text variant="small" color="rgba(255,255,255,0.7)" style={{ flex: 1 }}>
              {t('footer.contactEmail')}
            </Text>
          </View>
          <View style={styles.contact}>
            <Phone size={16} color="rgba(255,255,255,0.7)" />
            <Text variant="small" color="rgba(255,255,255,0.7)" style={{ flex: 1 }}>
              {t('footer.contactPhone')}
            </Text>
          </View>
          <Text variant="caption" weight="regular" color="rgba(255,255,255,0.5)" style={{ marginTop: 4 }}>
            {t('footer.contactNote')}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 28 }}>
        <LanguageSwitch block />
      </View>

      <View style={styles.legal}>
        <Text variant="small" color="rgba(255,255,255,0.6)">
          {t('footer.rights', { year: String(new Date().getFullYear()) })}
        </Text>
        <View style={styles.legalLinks}>
          {(
            [
              ['privacy', 'footer.privacy'],
              ['terms', 'footer.terms'],
              ['accessibility', 'footer.accessibility'],
            ] as const
          ).map(([doc, key]) => (
            <Pressable key={doc} accessibilityRole="link" hitSlop={6} onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc } })}>
              <Text variant="small" color="rgba(255,255,255,0.6)">
                {t(key)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { backgroundColor: colors.brandDeep, paddingHorizontal: 20, paddingTop: 48, paddingBottom: 40 },
  cols: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 32, columnGap: 16, marginTop: 40 },
  col: { width: '47%', gap: 2 },
  heading: { marginBottom: 10 },
  link: { paddingVertical: 8, minHeight: 36, justifyContent: 'center' },
  contact: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingVertical: 6 },
  legal: { marginTop: 36, paddingTop: 24, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', gap: 12 },
  legalLinks: { flexDirection: 'row', flexWrap: 'wrap', gap: 20 },
});
