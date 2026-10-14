import { Redirect } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, View } from 'react-native';
import { BookingCard } from '@/components/cards/BookingCard';
import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SearchBar } from '@/components/ui/SearchBar';
import { Skeleton } from '@/components/ui/Skeleton';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { useBookingList } from '@/hooks/useBookings';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n, type TranslationKey } from '@/i18n';
import { tabForStatus } from '@/lib/bookingStatus';
import { useAuth } from '@/state/auth';
import type { Booking, BookingTab } from '@/types/booking';
import { colors } from '@/theme/colors';

const PATIENT_TABS: BookingTab[] = ['upcoming', 'in_progress', 'completed', 'cancelled'];
type NurseTab = 'requests' | 'schedule' | 'completed';
const NURSE_TABS: { id: NurseTab; label: TranslationKey }[] = [
  { id: 'requests', label: 'm.requests' },
  { id: 'schedule', label: 'm.schedule' },
  { id: 'completed', label: 'm.completed' },
];

function nurseTab(b: Booking): NurseTab | null {
  if (b.status === 'NURSE_PENDING') return 'requests';
  if (b.status === 'COMPLETED') return 'completed';
  if (['NURSE_ACCEPTED', 'CONFIRMED', 'CARE_STARTED', 'CARE_IN_PROGRESS', 'PAID'].includes(b.status)) return 'schedule';
  return null;
}

/** My bookings. Patients: Upcoming / In progress / Completed / Cancelled. Nurses: Requests / Schedule / Completed. */
export default function BookingsScreen() {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Redirect href={{ pathname: '/sign-in', params: { next: '/bookings' } }} />;
  return user?.role === 'NURSE' ? <NurseBookings /> : <PatientBookings />;
}

function PatientBookings() {
  const { t } = useI18n();
  const { data, isLoading, isError, error, refetch, isRefetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useBookingList();
  const { serviceById } = useCatalogData();
  const [tab, setTab] = useState<BookingTab>('upcoming');
  const [term, setTerm] = useState('');

  const list = useMemo(() => {
    const q = term.trim().toLowerCase();
    return (data ?? [])
      .filter((b) => tabForStatus(b.status) === tab)
      .filter((b) => {
        if (!q) return true;
        const s = serviceById(b.serviceId);
        return `${b.reference} ${b.serviceName} ${s ? `${s.title.en} ${s.title.ar}` : ''}`.toLowerCase().includes(q);
      })
      .sort((a, b) => b.startDateTime.localeCompare(a.startDateTime));
  }, [data, tab, term, serviceById]);

  return (
    <Screen scroll={false}>
      <FlatList
        data={isLoading || isError ? [] : list}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.content}
        refreshing={isRefetching && !isFetchingNextPage}
        onRefresh={() => void refetch()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 20 }}>
            <PageTitle title={t('nav.bookings')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingEnd: 20 }}>
              {PATIENT_TABS.map((id) => (
                <Chip key={id} label={t(`account.tabs.${id}`)} selected={tab === id} onPress={() => setTab(id)} tone="white" />
              ))}
            </ScrollView>
            <SearchBar value={term} onChangeText={setTerm} placeholder={t('account.searchBookings')} />
          </View>
        }
        renderItem={({ item }) => <BookingCard booking={item} />}
        ListEmptyComponent={
          isError ? (
            <QueryError error={error} onRetry={() => void refetch()} />
          ) : isLoading ? (
            <View style={{ gap: 12 }}>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} height={110} radius={16} />
              ))}
            </View>
          ) : (
            <StateMessage title={t('account.emptyTab')} body={tab === 'upcoming' ? t('account.noUpcoming') : undefined} />
          )
        }
        ListFooterComponent={
          !isLoading && !isError ? (
            <View style={{ marginTop: 24, gap: 16 }}>
              {isFetchingNextPage ? <ActivityIndicator color={colors.brand} accessibilityLabel={t('common.loading')} /> : null}
              <Button fullWidth href="/book">
                {t('account.qaBook')}
              </Button>
            </View>
          ) : null
        }
      />
    </Screen>
  );
}

function NurseBookings() {
  const { t } = useI18n();
  const { data, isLoading, isError, error, refetch, isRefetching, hasNextPage, fetchNextPage, isFetchingNextPage } = useBookingList();
  const [tab, setTab] = useState<NurseTab>('requests');
  const list = useMemo(() => (data ?? []).filter((b) => nurseTab(b) === tab).sort((a, b) => a.startDateTime.localeCompare(b.startDateTime)), [data, tab]);
  const counts = useMemo(() => {
    const c: Record<NurseTab, number> = { requests: 0, schedule: 0, completed: 0 };
    (data ?? []).forEach((b) => {
      const k = nurseTab(b);
      if (k) c[k] += 1;
    });
    return c;
  }, [data]);
  return (
    <Screen scroll={false}>
      <FlatList
        data={isLoading || isError ? [] : list}
        keyExtractor={(b) => b.id}
        contentContainerStyle={styles.content}
        refreshing={isRefetching && !isFetchingNextPage}
        onRefresh={() => void refetch()}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 20 }}>
            <PageTitle title={t('nav.bookings')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingEnd: 20 }}>
              {NURSE_TABS.map(({ id, label }) => (
                <Chip key={id} label={`${t(label)} (${counts[id]})`} selected={tab === id} onPress={() => setTab(id)} tone="white" />
              ))}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => <BookingCard booking={item} viewer="nurse" />}
        ListEmptyComponent={
          isError ? (
            <QueryError error={error} onRetry={() => void refetch()} />
          ) : isLoading ? (
            <View style={{ gap: 12 }}>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} height={110} radius={16} />
              ))}
            </View>
          ) : (
            <StateMessage title={t('account.emptyTab')} />
          )
        }
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator style={{ marginTop: 20 }} color={colors.brand} accessibilityLabel={t('common.loading')} /> : null
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({ content: { padding: 20, paddingBottom: 48 } });
