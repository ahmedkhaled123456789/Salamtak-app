import React from 'react';
import { View } from 'react-native';
import { PageHero } from '@/components/layout/PageHero';
import { Screen } from '@/components/layout/Screen';
import { Section } from '@/components/layout/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { images } from '@/data/images';
import { CareStandards, FinalCta } from '@/features/home/sections2';
import { useI18n, type TranslationKey } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

const values: { title: TranslationKey; body: TranslationKey }[] = [
  { title: 'aboutPage.v1', body: 'aboutPage.vb1' },
  { title: 'aboutPage.v2', body: 'aboutPage.vb2' },
  { title: 'aboutPage.v3', body: 'aboutPage.vb3' },
];

export default function AboutScreen() {
  const { t, l } = useI18n();
  return (
    <Screen header="back" title={t('nav.about')}>
      <PageHero
        title={t('aboutPage.title')}
        body={t('aboutPage.body')}
        image={images.about}
        imageAlt={l({ en: 'Two nurses reviewing a care schedule on a tablet in a bright kitchen', ar: 'ممرضتان تراجعان جدول رعاية على جهاز لوحي في مطبخ مشرق' })}
      />
      <Section tone="white">
        <Text variant="h2" accessibilityRole="header">
          {t('aboutPage.missionTitle')}
        </Text>
        <Text variant="h3" size={24} color="rgba(23,43,42,0.85)" style={{ marginTop: 18, lineHeight: 34 }}>
          {t('aboutPage.mission')}
        </Text>
      </Section>
      <Section tone="ivory">
        <Text variant="h2" accessibilityRole="header">
          {t('aboutPage.valuesTitle')}
        </Text>
        <View style={{ marginTop: 28, borderTopWidth: 1, borderTopColor: colors.line }}>
          {values.map((v) => (
            <View key={v.title} style={{ paddingVertical: 24, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 6 }}>
              <Text variant="h3" color={colors.brandDark}>
                {t(v.title)}
              </Text>
              <Text variant="bodyLg" color="muted">
                {t(v.body)}
              </Text>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 16, marginTop: 32 }}>
          <View style={{ flex: 1 }}>
            <SmartImage src={images.stageOlder} alt={l({ en: 'Older couple at home with a caregiver', ar: 'زوجان مسنّان في المنزل مع مقدّمة رعاية' })} aspectRatio={3 / 4} radius={radii['3xl']} />
          </View>
          <View style={{ flex: 1, paddingTop: 40 }}>
            <SmartImage src={images.whyFamily} alt={l({ en: 'Family discussing care with a nurse', ar: 'عائلة تناقش الرعاية مع ممرضة' })} aspectRatio={3 / 4} radius={radii['3xl']} />
          </View>
        </View>
      </Section>
      <CareStandards />
      <FinalCta />
    </Screen>
  );
}
