import { BellRing, CreditCard, ListChecks, type LucideIcon } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { PageHero } from '@/components/layout/PageHero';
import { Screen } from '@/components/layout/Screen';
import { Section } from '@/components/layout/Section';
import { Text } from '@/components/ui/Text';
import { images } from '@/data/images';
import { BookingPreview, HowItWorksSteps } from '@/features/home/sections1';
import { FinalCta } from '@/features/home/sections2';
import { useI18n, type TranslationKey } from '@/i18n';
import { colors } from '@/theme/colors';

const after: { icon: LucideIcon; key: TranslationKey }[] = [
  { icon: ListChecks, key: 'howPage.a1' },
  { icon: CreditCard, key: 'howPage.a2' },
  { icon: BellRing, key: 'howPage.a3' },
];

export default function HowItWorksScreen() {
  const { t, l } = useI18n();
  return (
    <Screen header="back" title={t('nav.howItWorks')}>
      <PageHero
        title={t('howPage.title')}
        body={t('howPage.body')}
        image={images.galleryVisit}
        imageAlt={l({ en: 'Nurse greeting an older woman at her front door', ar: 'ممرضة تحيّي سيدة مسنّة عند باب منزلها' })}
      />
      <HowItWorksSteps showHeader={false} />
      <Section tone="white">
        <Text variant="h2" accessibilityRole="header">
          {t('howPage.afterTitle')}
        </Text>
        <View style={{ marginTop: 28, gap: 28 }}>
          {after.map(({ icon: Glyph, key }) => (
            <View key={key} style={{ borderTopWidth: 2, borderTopColor: colors.brand, paddingTop: 20 }}>
              <Glyph size={24} color={colors.brand} />
              <Text variant="bodyLg" style={{ marginTop: 12 }}>
                {t(key)}
              </Text>
            </View>
          ))}
        </View>
      </Section>
      <BookingPreview />
      <FinalCta />
    </Screen>
  );
}
