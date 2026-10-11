import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { Screen } from '@/components/layout/Screen';
import { SampleNote } from '@/components/layout/Section';
import { SmartImage } from '@/components/ui/SmartImage';
import { StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { articles } from '@/data/articles';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

export default function ArticleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { t, l, date } = useI18n();
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    return (
      <Screen header="back">
        <View style={{ padding: 20 }}>
          <StateMessage kind="error" title={t('articlePage.notFound')} actionLabel={t('articlePage.back')} onAction={() => router.replace('/resources')} />
        </View>
      </Screen>
    );
  }
  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);
  return (
    <Screen header="back" title={l(article.category)}>
      <View style={{ padding: 20 }}>
        <Text variant="small" weight="semibold" color={colors.brand}>
          {l(article.category)}
        </Text>
        <Text variant="h1" size={34} style={{ marginTop: 10 }} accessibilityRole="header">
          {l(article.title)}
        </Text>
        <Text variant="small" color="muted" style={{ marginTop: 14 }}>
          {article.author ? `${t('common.by', { name: l(article.author.name) })} · ` : ''}
          {date(article.date, { day: 'numeric', month: 'long', year: 'numeric' })} · {t('common.minRead', { n: article.readMinutes })}
        </Text>
        <SmartImage src={article.cover} alt={l(article.coverAlt)} aspectRatio={16 / 10} radius={radii.hero} style={{ marginTop: 24 }} priority />
        <Text variant="h3" size={22} style={{ marginTop: 28, lineHeight: 32 }}>
          {l(article.excerpt)}
        </Text>
        {article.body.map((p) => (
          <Text key={p.en} variant="bodyLg" size={17} color="rgba(23,43,42,0.85)" style={{ marginTop: 20, lineHeight: 29 }}>
            {l(p)}
          </Text>
        ))}
        <View style={{ marginTop: 32, paddingTop: 20, borderTopWidth: 1, borderTopColor: colors.line }}>
          <SampleNote>{t('blogPage.disclaimer')}</SampleNote>
        </View>
        <Text variant="h3" style={{ marginTop: 40 }}>
          {t('articlePage.related')}
        </Text>
        <View style={{ gap: 24, marginTop: 20, paddingBottom: 32 }}>
          {related.map((a) => (
            <ArticleCard key={a.id} article={a} layout="row" />
          ))}
        </View>
      </View>
    </Screen>
  );
}
