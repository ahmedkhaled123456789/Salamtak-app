import { Redirect, router } from 'expo-router';
import { CalendarClock, Star } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import { BookingCard } from '@/components/cards/BookingCard';
import { Screen } from '@/components/layout/Screen';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { QueryError } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { useNurseSelf, useSetNurseStatus, useWallet } from '@/hooks/useAccount';
import { useBookings } from '@/hooks/useBookings';
import { useI18n, type TranslationKey } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { VerificationStatus } from '@/api/nurse';

const verification: Record<VerificationStatus, { tone: BadgeTone; key: TranslationKey }> = {
  PENDING: { tone: 'amber', key: 'm.verifPENDING' },
  UNDER_REVIEW: { tone: 'amber', key: 'm.verifUNDER_REVIEW' },
  VERIFIED: { tone: 'mint', key: 'm.verifVERIFIED' },
  REJECTED: { tone: 'coral', key: 'm.verifREJECTED' },
  EXPIRED: { tone: 'coral', key: 'm.verifEXPIRED' },
};

/** Nurse home: verification, availability toggle, request counts, wallet snapshot, next visits. */
export default function DashboardScreen() {
  const { user } = useAuth();
  if (user?.role !== 'NURSE') return <Redirect href="/" />;
  return <Dashboard name={user.firstName} />;
}

function Dashboard({ name }: { name: string }) {
  const { t, money, num } = useI18n();
  const me = useNurseSelf();
  const bookings = useBookings();
  const wallet = useWallet();
  const setStatus = useSetNurseStatus();

  const requests = (bookings.data ?? []).filter((b) => b.status === 'NURSE_PENDING');
  const upcoming = (bookings.data ?? [])
    .filter((b) => ['NURSE_ACCEPTED', 'CONFIRMED', 'CARE_STARTED', 'CARE_IN_PROGRESS', 'PAID'].includes(b.status))
    .sort((a, b) => a.startDateTime.localeCompare(b.startDateTime))
    .slice(0, 3);
  const refreshing = me.isRefetching || bookings.isRefetching;
  const refresh = () => {
    void me.refetch();
    void bookings.refetch();
    void wallet.refetch();
  };

  return (
    <Screen onRefresh={refresh} refreshing={refreshing}>
      <View style={{ padding: 20, paddingBottom: 48, gap: 20 }}>
        <View>
          <Text variant="h1" size={32} accessibilityRole="header">
            {t('account.welcome', { name })}
          </Text>
          <Text variant="body" color="muted" style={{ marginTop: 6 }}>
            {t('m.nurseWelcomeBody')}
          </Text>
        </View>

        {me.isLoading ? (
          <Skeleton height={160} radius={24} />
        ) : me.isError ? (
          <QueryError error={me.error} onRetry={() => void me.refetch()} compact />
        ) : me.data ? (
          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <Text variant="title">{t('m.verification')}</Text>
              <Badge tone={verification[me.data.verificationStatus].tone}>{t(verification[me.data.verificationStatus].key)}</Badge>
            </View>
            {me.data.statusReason ? (
              <Text variant="small" color="muted" style={{ marginTop: 6 }}>
                {me.data.statusReason}
              </Text>
            ) : null}
            <View style={[styles.rowBetween, styles.toggle]}>
              <View style={{ flex: 1 }}>
                <Text variant="body" weight="semibold">
                  {t('m.acceptingBookings')}
                </Text>
                <Text variant="small" color="muted">
                  {me.data.isBookable ? t('m.bookableNow') : me.data.status === 'ACTIVE' ? t('m.notBookableYet') : t('m.pausedNote')}
                </Text>
              </View>
              <Switch
                accessibilityLabel={t('m.acceptingBookings')}
                value={me.data.status === 'ACTIVE'}
                disabled={setStatus.isPending || !['ACTIVE', 'INACTIVE'].includes(me.data.status)}
                onValueChange={(on) => setStatus.mutate(on ? 'ACTIVE' : 'INACTIVE')}
                trackColor={{ true: colors.brand, false: colors.lineStrong }}
                thumbColor={colors.white}
              />
            </View>
            {setStatus.isError ? (
              <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={{ marginTop: 8 }}>
                {t(errorKey(setStatus.error))}
              </Text>
            ) : null}
            <View style={styles.stats}>
              <Stat label={t('m.completedJobs')} value={num(me.data.totalCompletedBookings)} />
              <Stat label={t('m.rating')} value={me.data.totalReviews ? num(Math.round(me.data.averageRating * 10) / 10) : '—'} icon />
              <Stat label={t('m.requests')} value={num(requests.length)} />
            </View>
          </View>
        ) : null}

        {wallet.data ? (
          <View style={[styles.card, { backgroundColor: colors.brandDeep, borderColor: colors.brandDeep }]}>
            <Text variant="small" color="rgba(255,255,255,0.7)">
              {t('m.availableBalance')}
            </Text>
            <Text variant="price" size={34} color={colors.white} style={{ marginTop: 4 }}>
              {money(wallet.data.available, wallet.data.currency)}
            </Text>
            <Text variant="small" color="rgba(255,255,255,0.7)" style={{ marginTop: 6 }}>
              {t('m.pendingBalance')}: {money(wallet.data.pending, wallet.data.currency)}
            </Text>
            <View style={{ marginTop: 14 }}>
              <Button variant="light" size="sm" href="/earnings">
                {t('m.tabEarnings')}
              </Button>
            </View>
          </View>
        ) : null}

        <View>
          <View style={[styles.rowBetween, { marginBottom: 12 }]}>
            <Text variant="h3" size={22}>
              {t('m.newRequests')}
            </Text>
            <Button variant="ghost" size="sm" onPress={() => router.navigate('/bookings')}>
              {t('common.viewAll')}
            </Button>
          </View>
          {bookings.isLoading ? (
            <Skeleton height={110} radius={16} />
          ) : requests.length === 0 ? (
            <Text variant="body" color="muted">
              {t('m.noRequests')}
            </Text>
          ) : (
            <View style={{ gap: 12 }}>
              {requests.slice(0, 3).map((b) => (
                <BookingCard key={b.id} booking={b} viewer="nurse" />
              ))}
            </View>
          )}
        </View>

        <View>
          <Text variant="h3" size={22} style={{ marginBottom: 12 }}>
            {t('m.upcomingVisits')}
          </Text>
          {upcoming.length === 0 ? (
            <Text variant="body" color="muted">
              {t('m.noUpcomingVisits')}
            </Text>
          ) : (
            <View style={{ gap: 12 }}>
              {upcoming.map((b) => (
                <BookingCard key={b.id} booking={b} viewer="nurse" />
              ))}
            </View>
          )}
        </View>

        <Button variant="secondary" fullWidth iconStart={<CalendarClock size={18} color={colors.ink} />} href="/availability">
          {t('m.availability')}
        </Button>
      </View>
    </Screen>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <View style={styles.stat}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text variant="h3" size={24}>
          {value}
        </Text>
        {icon && value !== '—' ? <Star size={16} color={colors.coral} fill={colors.coral} /> : null}
      </View>
      <Text variant="small" color="muted" align="center">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 20 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  toggle: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.line },
  stats: { flexDirection: 'row', marginTop: 18, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.line },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
});
