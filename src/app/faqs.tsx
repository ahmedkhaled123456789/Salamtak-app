import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { PageHero } from '@/components/layout/PageHero';
import { Screen } from '@/components/layout/Screen';
import { Accordion } from '@/components/ui/Accordion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { faqs } from '@/data/faqs';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { FaqTopic } from '@/types/content';

const topics: (FaqTopic | 'all')[] = ['all', 'booking', 'pricing', 'payment', 'changes', 'account'];

export default function FaqsScreen() {
  const { t, l } = useI18n();
  const [topic, setTopic] = useState<FaqTopic | 'all'>('all');
  const [term, setTerm] = useState('');
  const items = useMemo(() => {
    const q = term.trim().toLowerCase();
    return faqs
      .filter((f) => (topic === 'all' || f.topic === topic) && (!q || `${l(f.question)} ${l(f.answer)}`.toLowerCase().includes(q)))
      .map((f) => ({
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
  }, [topic, term, l, t]);
  return (
    <Screen header="back" title={t('nav.faqs')}>
      <PageHero title={t('faqPage.title')} body={t('faqPage.body')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {topics.map((tp) => (
          <Chip key={tp} label={t(`faqPage.${tp}`)} selected={topic === tp} onPress={() => setTopic(tp)} tone="white" />
        ))}
      </ScrollView>
      <View style={{ padding: 20, gap: 20, paddingBottom: 48 }}>
        <SearchBar value={term} onChangeText={setTerm} placeholder={t('faqPage.searchPlaceholder')} />
        {items.length ? <Accordion items={items} /> : <StateMessage title={t('faqPage.empty')} />}
        <View style={{ backgroundColor: colors.mint, borderRadius: radii['3xl'], padding: 22, gap: 14 }}>
          <Text variant="title">{t('faqSection.body')}</Text>
          <Button href="/contact">{t('nav.contact')}</Button>
        </View>
      </View>
    </Screen>
  );
}
