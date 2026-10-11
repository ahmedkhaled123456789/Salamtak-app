import { useLocalSearchParams } from 'expo-router';
import { FileText } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { PageHero } from '@/components/layout/PageHero';
import { Screen } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { useI18n, type TranslationKey } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

const titles: Record<string, TranslationKey> = {
  privacy: 'footer.privacy',
  terms: 'footer.terms',
  accessibility: 'footer.accessibility',
};

/** Placeholder until the official documents are published (same as the website). */
export default function LegalScreen() {
  const { doc = 'privacy' } = useLocalSearchParams<{ doc: string }>();
  const { t, l } = useI18n();
  const title = t(titles[doc] ?? 'footer.privacy');
  return (
    <Screen header="back" title={title}>
      <PageHero title={title} />
      <View style={{ margin: 20, flexDirection: 'row', gap: 14, padding: 24, borderRadius: radii['3xl'], borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, backgroundColor: colors.white }}>
        <FileText size={24} color={colors.brand} />
        <Text variant="bodyLg" color="muted" style={{ flex: 1 }}>
          {l({
            en: 'Placeholder — this document has not been published yet. The official version will be provided by CareFlow before launch.',
            ar: 'محتوى مؤقت — لم يُنشر هذا المستند بعد. ستوفّر كيرفلو النسخة الرسمية قبل الإطلاق.',
          })}
        </Text>
      </View>
    </Screen>
  );
}
