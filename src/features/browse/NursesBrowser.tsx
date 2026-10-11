import { SlidersHorizontal } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { NurseCard } from '@/components/cards/NurseCard';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { SelectField } from '@/components/ui/SelectField';
import { Skeleton } from '@/components/ui/Skeleton';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { useCatalogData, useNurses } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { GenderPreference, NurseSort } from '@/types/nurse';

const SORTS: NurseSort[] = ['recommended', 'price-asc', 'price-desc', 'experience'];

/** Find-a-nurse list; filters live in a bottom sheet (website: FilterDrawer). Query params come from the home search. */
export function NursesBrowser({
  header,
  initialService = '',
  initialGender = 'any',
}: {
  header?: React.ReactNode;
  initialService?: string;
  initialGender?: GenderPreference;
}) {
  const { t, l } = useI18n();
  const { services } = useCatalogData();
  const [search, setSearch] = useState('');
  const [serviceId, setServiceId] = useState(initialService);
  const [gender, setGender] = useState<GenderPreference>(initialGender);
  const [sort, setSort] = useState<NurseSort>('recommended');
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({ serviceId, gender, sort });

  const { data, isLoading, isError, error, refetch, isRefetching } = useNurses({ serviceId: serviceId || undefined, gender, sort, search });
  const active = (serviceId ? 1 : 0) + (gender !== 'any' ? 1 : 0) + (sort !== 'recommended' ? 1 : 0);
  const serviceLabel = useMemo(() => services.find((s) => s.id === serviceId), [services, serviceId]);

  const openSheet = () => {
    setDraft({ serviceId, gender, sort });
    setOpen(true);
  };
  const apply = () => {
    setServiceId(draft.serviceId);
    setGender(draft.gender);
    setSort(draft.sort);
    setOpen(false);
  };
  const clear = () => {
    setServiceId('');
    setGender('any');
    setSort('recommended');
    setOpen(false);
  };

  return (
    <>
      <FlatList
        data={isError ? [] : data ?? []}
        keyExtractor={(n) => n.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshing={isRefetching}
        onRefresh={() => void refetch()}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListHeaderComponent={
          <View style={{ gap: 14, marginBottom: 20 }}>
            {header}
            <View style={styles.searchRow}>
              <View style={{ flex: 1 }}>
                <SearchBar value={search} onChangeText={setSearch} placeholder={t('nursesPage.searchPlaceholder')} />
              </View>
              <Pressable
                onPress={openSheet}
                accessibilityRole="button"
                accessibilityLabel={t('common.showFilters')}
                style={({ pressed }) => [styles.filterBtn, active > 0 && { borderColor: colors.brand, backgroundColor: colors.mint }, pressed && { opacity: 0.8 }]}
              >
                <SlidersHorizontal size={20} color={active ? colors.brandDark : colors.ink} />
                {active > 0 ? (
                  <View style={styles.count}>
                    <Text variant="caption" color={colors.white} size={11}>
                      {String(active)}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            </View>
            {serviceLabel ? (
              <Text variant="small" color="muted">
                {l(serviceLabel.title)}
              </Text>
            ) : null}
            {!isLoading && !isError ? (
              <Text variant="small" color="muted">
                {t('common.results', { n: data?.length ?? 0 })}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => <NurseCard nurse={item} />}
        ListEmptyComponent={
          isError ? (
            <QueryError error={error} onRetry={() => void refetch()} />
          ) : isLoading ? (
            <View style={{ gap: 16 }}>
              <Skeleton height={420} radius={24} />
              <Skeleton height={420} radius={24} />
            </View>
          ) : (
            <StateMessage
              title={t('nursesPage.emptyTitle')}
              body={t('nursesPage.emptyBody')}
              actionLabel={active ? t('common.clearFilters') : undefined}
              onAction={active ? clear : undefined}
            />
          )
        }
      />
      <BottomSheet
        visible={open}
        title={t('common.showFilters')}
        onClose={() => setOpen(false)}
        footer={
          <View style={{ gap: 8 }}>
            <Button fullWidth size="lg" onPress={apply}>
              {t('nursesPage.apply')}
            </Button>
            <Button fullWidth variant="ghost" onPress={clear}>
              {t('common.clearFilters')}
            </Button>
          </View>
        }
      >
        <View style={{ gap: 20 }}>
          <SelectField
            label={t('nursesPage.filterService')}
            value={draft.serviceId}
            onChange={(v) => setDraft((d) => ({ ...d, serviceId: v }))}
            options={[{ value: '', label: t('hero.anyService') }, ...services.map((s) => ({ value: s.id, label: l(s.title) }))]}
          />
          <View>
            <Text variant="label" style={{ marginBottom: 8 }}>
              {t('nursesPage.filterGender')}
            </Text>
            <View style={styles.chips}>
              {(
                [
                  ['any', t('common.noPreference')],
                  ['female', t('common.female')],
                  ['male', t('common.male')],
                ] as const
              ).map(([v, label]) => (
                <Chip key={v} label={label} selected={draft.gender === v} onPress={() => setDraft((d) => ({ ...d, gender: v }))} tone="white" />
              ))}
            </View>
          </View>
          <SelectField
            label={t('sort.label')}
            value={draft.sort}
            onChange={(v) => setDraft((d) => ({ ...d, sort: v as NurseSort }))}
            options={SORTS.map((s) => ({ value: s, label: t(`sort.${s}`) }))}
          />
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  searchRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  filterBtn: { width: 50, height: 50, borderRadius: radii.full, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  count: { position: 'absolute', top: -4, end: -4, minWidth: 20, height: 20, borderRadius: 10, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
