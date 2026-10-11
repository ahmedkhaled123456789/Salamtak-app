import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { ArticleCard } from '@/components/cards/ArticleCard';
import { Chip } from '@/components/ui/Chip';
import { StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { articles } from '@/data/articles';
import { useI18n } from '@/i18n';

/** Health articles (bundled website content — the API has no articles endpoint). */
export function ResourcesBrowser({ header }: { header?: React.ReactNode }) {
  const { t, l, locale } = useI18n();
  const [category, setCategory] = useState('all');
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    articles.forEach((a) => seen.set(a.category.en, l(a.category)));
    return Array.from(seen.entries());
  }, [l]);
  const list = articles.filter((a) => category === 'all' || a.category.en === category);
  void locale;
  return (
    <FlatList
      data={list}
      keyExtractor={(a) => a.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 32 }} />}
      ListHeaderComponent={
        <View style={{ gap: 16, marginBottom: 28 }}>
          {header}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            <Chip label={t('blogPage.all')} selected={category === 'all'} onPress={() => setCategory('all')} tone="white" />
            {categories.map(([key, label]) => (
              <Chip key={key} label={label} selected={category === key} onPress={() => setCategory(key)} tone="white" />
            ))}
          </ScrollView>
        </View>
      }
      renderItem={({ item }) => <ArticleCard article={item} />}
      ListEmptyComponent={<StateMessage title={t('common.emptyTitle')} />}
      ListFooterComponent={
        <Text variant="small" color="muted" style={{ marginTop: 32 }}>
          {t('blogPage.disclaimer')}
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  chips: { gap: 8, paddingEnd: 20 },
});
