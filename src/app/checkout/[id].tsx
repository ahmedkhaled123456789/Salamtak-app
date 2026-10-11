import { useQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { CheckCircle2, Clock3, Loader, XCircle, type LucideIcon } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { bookingsApi } from '@/api/bookings';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { SmartImage } from '@/components/ui/SmartImage';
import { QueryError } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { PAID_STATUSES, useBooking, useStartPayment } from '@/hooks/useBookings';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n, type TranslationKey } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { statusKey } from '@/lib/bookingStatus';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

type View_ = 'pending' | 'processing' | 'succeeded' | 'failed';
const visuals: Record<View_, { icon: LucideIcon; bg: string; fg: string }> = {
  pending: { icon: Clock3, bg: colors.amberSoft, fg: colors.amberText },
  processing: { icon: Loader, bg: colors.mint, fg: colors.brand },
  succeeded: { icon: CheckCircle2, bg: colors.mint, fg: colors.brand },
  failed: { icon: XCircle, bg: colors.coralSoft, fg: colors.coral },
};
const POLL_LIMIT_MS = 5 * 60_000;

/**
 * Payment status screen. Every state is derived from what the backend returns: success is shown only when the booking
 * has actually reached a paid state (the provider's signed webhook moves it there) — never because a button was tapped.
 */
export default function CheckoutScreen() {
  return (
    <RequireAuth>
      <CheckoutContent />
    </RequireAuth>
  );
}

function CheckoutContent() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { t, l, money, date, daysLabel } = useI18n();
  const { serviceById, nurseById } = useCatalogData();
  const pay = useStartPayment();
  const [paymentId, setPaymentId] = useState<string | undefined>();
  const [awaiting, setAwaiting] = useState(false);
  const startedAt = useRef<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  const { data: booking, isLoading, isError, error, refetch } = useBooking(id, awaiting && !timedOut);
  const payment = useQuery({
    queryKey: ['payment', paymentId],
    queryFn: () => bookingsApi.payment(paymentId as string),
    enabled: Boolean(paymentId) && awaiting,
    refetchInterval: (q) => (q.state.data && ['FAILED', 'CANCELLED', 'PAID'].includes(q.state.data.status) ? false : 3000),
  });

  const paid = booking ? PAID_STATUSES.has(booking.status) : false;
  const payFailed = payment.data?.status === 'FAILED' || payment.data?.status === 'CANCELLED' || booking?.status === 'FAILED' || booking?.status === 'EXPIRED';

  // stop spinning once the backend says paid / failed (derived below), or after a bounded wait
  useEffect(() => {
    if (!awaiting) return;
    const timer = setInterval(() => {
      if (startedAt.current && Date.now() - startedAt.current > POLL_LIMIT_MS) setTimedOut(true);
    }, 5000);
    return () => clearInterval(timer);
  }, [awaiting]);

  if (isLoading) {
    return (
      <Screen header="back" title={t('payment.title')}>
        <View style={{ padding: 20, gap: 16, alignItems: 'center' }}>
          <Skeleton height={64} width={64} radius={32} />
          <Skeleton height={34} width="70%" />
          <Skeleton height={160} radius={24} />
        </View>
      </Screen>
    );
  }
  if (isError || !booking) {
    return (
      <Screen header="back" title={t('payment.title')}>
        <View style={{ padding: 20 }}>
          <QueryError error={error} onRetry={() => void refetch()} />
        </View>
      </Screen>
    );
  }

  const view: View_ = paid ? 'succeeded' : payFailed ? 'failed' : awaiting || timedOut ? 'processing' : 'pending';
  const { icon: Glyph, bg, fg } = visuals[view];
  const service = serviceById(booking.serviceId);
  const nurse = nurseById(booking.nurseId);
  const amount = booking.pricing ? money(booking.pricing.payable, booking.pricing.currency) : '';
  const canPay = booking.status === 'PAYMENT_PENDING' && (!awaiting || payFailed) && !pay.isPending;

  const startPay = () => {
    pay.mutate(booking.id, {
      onSuccess: async (p) => {
        setPaymentId(p.id);
        setTimedOut(false);
        startedAt.current = Date.now();
        setAwaiting(true);
        if (p.redirectUrl) {
          try {
            await WebBrowser.openBrowserAsync(p.redirectUrl);
          } catch {
            /* the user can reopen from the booking; status is read from the backend either way */
          }
          void refetch();
        }
      },
    });
  };

  const titleKey = `payment.${view}` as TranslationKey;
  const bodyKey = `payment.${view}Body` as TranslationKey;

  return (
    <Screen header="back" title={t('payment.title')}>
      <View style={{ padding: 20, paddingBottom: 48 }}>
        <View style={styles.center} accessibilityLiveRegion="polite">
          <View style={[styles.disc, { backgroundColor: bg }]}>{view === 'processing' ? <ActivityIndicator color={fg} size="large" /> : <Glyph size={32} color={fg} />}</View>
          <Text variant="small" weight="semibold" color="muted" style={{ marginTop: 20 }}>
            {t('payment.title')}
          </Text>
          <Text variant="h1" size={32} align="center" style={{ marginTop: 4 }} accessibilityRole="header">
            {t(titleKey)}
          </Text>
          <Text variant="bodyLg" color="muted" align="center" style={{ marginTop: 10 }}>
            {t(bodyKey)}
          </Text>
          {view === 'processing' ? (
            <Text variant="small" color="muted" align="center" style={{ marginTop: 8 }}>
              {timedOut ? t('m.paymentStillProcessing') : t('m.paymentWebhookNote')}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
            {service ? <SmartImage src={service.image} alt="" width={60} height={60} radius={12} /> : null}
            <View style={{ flex: 1 }}>
              <Text variant="body" weight="bold" numberOfLines={2}>
                {service ? l(service.title) : booking.serviceName}
              </Text>
              <Text variant="small" color="muted">
                {date(booking.startDate)} · {daysLabel(booking.days)}
                {nurse ? ` · ${l(nurse.name)}` : booking.nurseName ? ` · ${booking.nurseName}` : ''}
              </Text>
            </View>
          </View>
          <View style={styles.dl}>
            <Row label={t('account.reference')} value={booking.reference} />
            <Row label={t('account.amount')} value={amount} />
            <Row label={t('account.status')} value={t(statusKey[booking.status])} />
          </View>
        </View>

        {canPay ? (
          <View style={{ marginTop: 20, gap: 12 }}>
            {pay.isError ? (
              <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={styles.alert}>
                {t(errorKey(pay.error))}
              </Text>
            ) : null}
            <Button size="lg" fullWidth loading={pay.isPending} onPress={startPay}>
              {view === 'failed' ? t('payment.retry') : t('payment.pay', { amount })}
            </Button>
          </View>
        ) : null}
        {view === 'processing' ? (
          <View style={{ marginTop: 20 }}>
            <Button fullWidth variant="secondary" onPress={() => void refetch()}>
              {t('m.refreshStatus')}
            </Button>
          </View>
        ) : null}

        <View style={{ marginTop: 24, gap: 12 }}>
          <Button fullWidth variant="secondary" onPress={() => router.replace({ pathname: '/bookings/[id]', params: { id: booking.id } })}>
            {t('payment.viewBooking')}
          </Button>
          {view === 'succeeded' ? (
            <Button fullWidth onPress={() => router.replace('/bookings')}>
              {t('payment.goDashboard')}
            </Button>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text variant="body" color="muted">
        {label}
      </Text>
      <Text variant="body" weight="semibold" style={{ flexShrink: 1, textAlign: 'right' }}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingTop: 12 },
  disc: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  card: { marginTop: 28, backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 18 },
  dl: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.line, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  alert: { backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 },
});
