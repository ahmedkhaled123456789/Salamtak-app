import React, { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { SelectField } from '@/components/ui/SelectField';
import { Skeleton } from '@/components/ui/Skeleton';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { useServices } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import type { CareService, ServiceCategory, ServiceSort } from '@/types/service';

const CATEGORIES: (ServiceCategory | 'all')[] = ['all', 'elderly', 'recovery', 'nursing', 'daily-living'];
const SORTS: ServiceSort[] = ['popular', 'price-asc', 'price-desc', 'name'];

/** Services list with search, category chips and sort (website: /services). `header` renders above the filters. */
export function ServicesBrowser({ header, onRefresh }: { header?: React.ReactNode; onRefresh?: () => void }) {
  const { t, l } = useI18n();
  const { data, isLoading, isError, error, refetch, isRefetching } = useServices();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ServiceCategory | 'all'>('all');
  const [sort, setSort] = useState<ServiceSort>('popular');

  const list = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = (data ?? []).filter(
      (s) =>
        (category === 'all' || s.category === category) &&
        (!term || `${s.title.en} ${s.title.ar} ${s.summary.en} ${s.summary.ar}`.toLowerCase().includes(term)),
    );
    const sorter: Record<ServiceSort, (a: CareService, b: CareService) => number> = {
      popular: (a, b) => b.popularity - a.popularity,
      'price-asc': (a, b) => (a.dailyRateSample ?? 0) - (b.dailyRateSample ?? 0),
      'price-desc': (a, b) => (b.dailyRateSample ?? 0) - (a.dailyRateSample ?? 0),
      name: (a, b) => l(a.title).localeCompare(l(b.title)),
    };
    return [...filtered].sort(sorter[sort]);
  }, [data, search, category, sort, l]);

  return (
    <FlatList
      data={isLoading || isError ? [] : list}
      keyExtractor={(s) => s.id}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshing={isRefetching}
      onRefresh={() => {
        onRefresh?.();
        void refetch();
      }}
      ItemSeparatorComponent={() => <View style={{ height: 32 }} />}
      ListHeaderComponent={
        <View style={{ gap: 16, marginBottom: 28 }}>
          {header}
          <SearchBar value={search} onChangeText={setSearch} placeholder={t('servicesPage.searchPlaceholder')} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {CATEGORIES.map((c) => (
              <Chip key={c} label={t(`categories.${c}`)} selected={category === c} onPress={() => setCategory(c)} tone="white" />
            ))}
          </ScrollView>
          <SelectField
            label={t('sort.label')}
            value={sort}
            onChange={(v) => setSort(v as ServiceSort)}
            options={SORTS.map((s) => ({ value: s, label: t(`sort.${s}`) }))}
          />
          {!isLoading && !isError ? (
            <Text variant="small" color="muted">
              {t('servicesPage.showing', { shown: list.length, total: data?.length ?? 0 })}
            </Text>
          ) : null}
        </View>
      }
      renderItem={({ item }) => <ServiceCard service={item} showPrice />}
      ListEmptyComponent={
        isError ? (
          <QueryError error={error} onRetry={() => void refetch()} />
        ) : isLoading ? (
          <View style={{ gap: 24 }}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={{ gap: 10 }}>
                <Skeleton height={200} radius={16} />
                <Skeleton height={20} width="60%" />
                <Skeleton height={14} />
              </View>
            ))}
          </View>
        ) : (
          <StateMessage title={t('servicesPage.emptyTitle')} body={t('servicesPage.emptyBody')} />
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  chips: { gap: 8, paddingEnd: 20 },
});
