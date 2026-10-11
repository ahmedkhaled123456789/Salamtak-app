import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { StatusTimeline } from '@/components/booking/StatusTimeline';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Screen } from '@/components/layout/Screen';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { Skeleton } from '@/components/ui/Skeleton';
import { SmartImage } from '@/components/ui/SmartImage';
import { QueryError } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import {
  useAcceptBooking,
  useBooking,
  useBookingHistory,
  useCancelBooking,
  useCompleteCare,
  useRejectBooking,
  useStartCare,
} from '@/hooks/useBookings';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { nurseActions, patientActions, statusHintKey, statusKey, statusTone } from '@/lib/bookingStatus';
import { errorKey } from '@/lib/errors';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

export default function BookingDetailScreen() {
  return (
    <RequireAuth>
      <BookingDetail />
    </RequireAuth>
  );
}

function BookingDetail() {
  const { id = '' } = useLocalSearchParams<{ id: string }>();
  const { t, l, date, money, daysLabel } = useI18n();
  const { user } = useAuth();
  const isNurse = user?.role === 'NURSE';
  const { data: booking, isLoading, isError, error, refetch } = useBooking(id);
  const { data: history } = useBookingHistory(id);
  const { serviceById, nurseById } = useCatalogData();
  const cancel = useCancelBooking();
  const accept = useAcceptBooking();
  const reject = useRejectBooking();
  const start = useStartCare();
  const complete = useCompleteCare();
  const [sheet, setSheet] = useState<null | 'cancel' | 'reject'>(null);

  if (isLoading) {
    return (
      <Screen header="back" title={t('nav.bookings')}>
        <View style={{ padding: 20, gap: 14 }}>
          <Skeleton height={28} width="50%" />
          <Skeleton height={120} radius={24} />
          <Skeleton height={200} radius={24} />
        </View>
      </Screen>
    );
  }
  if (isError || !booking) {
    return (
      <Screen header="back" title={t('nav.bookings')}>
        <View style={{ padding: 20 }}>
          <QueryError error={error} onRetry={() => void refetch()} />
        </View>
      </Screen>
    );
  }

  const service = serviceById(booking.serviceId);
  const nurse = nurseById(booking.nurseId);
  const range = `${date(booking.startDate, { weekday: 'short', day: 'numeric', month: 'short' })} – ${date(booking.endDate, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}`;
  const pa = patientActions(booking);
  const na = nurseActions(booking);
  const busy = accept.isPending || reject.isPending || start.isPending || complete.isPending;
  const actionError = [accept, reject, start, complete].find((m) => m.isError)?.error;

  return (
    <Screen header="back" title={booking.reference} onRefresh={() => void refetch()} refreshing={false}>
      <View style={{ padding: 20, paddingBottom: 48, gap: 20 }}>
        <View>
          <Badge tone={statusTone[booking.status]}>{t(statusKey[booking.status])}</Badge>
          <Text variant="h1" size={30} style={{ marginTop: 12 }} accessibilityRole="header">
            {service ? l(service.title) : booking.serviceName}
          </Text>
          <Text variant="body" color="muted" style={{ marginTop: 8 }}>
            {t(statusHintKey[booking.status])}
          </Text>
          {booking.statusReason ? (
            <Text variant="small" color="muted" style={{ marginTop: 6 }}>
              {booking.statusReason}
            </Text>
          ) : null}
        </View>

        <View style={styles.card}>
          {service ? (
            <View style={styles.service}>
              <SmartImage src={service.image} alt="" width={60} height={60} radius={12} />
              <View style={{ flex: 1 }}>
                <Text variant="small" color="muted">
                  {t('account.reference')}
                </Text>
                <Text variant="body" weight="bold">
                  {booking.reference}
                </Text>
              </View>
            </View>
          ) : null}
          <Info label={t('account.schedule')} value={`${range} · ${daysLabel(booking.days)}`} />
          {isNurse ? (
            <Info label={t('m.patient')} value={booking.patientName ?? '—'} />
          ) : (
            <Info label={t('account.yourNurse')} value={nurse ? l(nurse.name) : booking.nurseName ?? '—'} />
          )}
          {booking.address ? <Info label={t('account.address')} value={[booking.address, booking.city].filter(Boolean).join(', ')} /> : null}
          {booking.notes ? <Info label={t('account.notes')} value={booking.notes} /> : null}
        </View>

        {isNurse && booking.nurseEarning ? (
          <View style={styles.card}>
            <Text variant="title">{t('m.yourEarning')}</Text>
            <Text variant="price" size={30} color={colors.brandDark} style={{ marginTop: 8 }}>
              {money(booking.nurseEarning.amount, booking.nurseEarning.currency)}
            </Text>
          </View>
        ) : null}

        {!isNurse && booking.pricing ? (
          <View style={styles.card}>
            <Text variant="title" style={{ marginBottom: 6 }}>
              {t('account.paymentSummary')}
            </Text>
            <PriceBreakdown lines={booking.pricing.lines} payable={booking.pricing.payable} currency={booking.pricing.currency} />
          </View>
        ) : null}

        {booking.refund ? (
          <View style={[styles.card, { backgroundColor: colors.mint }]}>
            <Text variant="title">{t('m.refund')}</Text>
            <Text variant="body" style={{ marginTop: 6 }}>
              {money(booking.refund.amount, booking.pricing?.currency ?? 'AED')} · {booking.refund.status}
            </Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Text variant="title" style={{ marginBottom: 14 }}>
            {t('account.timeline')}
          </Text>
          <StatusTimeline entries={history ?? []} createdAt={booking.createdAt} />
        </View>

        {actionError ? (
          <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={styles.alert}>
            {t(errorKey(actionError))}
          </Text>
        ) : null}

        <View style={{ gap: 12 }}>
          <Text variant="title">{t('account.actions')}</Text>
          {!isNurse && pa.canPay ? (
            <Button size="lg" fullWidth onPress={() => router.push({ pathname: '/checkout/[id]', params: { id: booking.id } })}>
              {t('account.payNow')}
            </Button>
          ) : null}
          {!isNurse && pa.canCancel ? (
            <Button variant="danger" fullWidth onPress={() => setSheet('cancel')}>
              {t('account.cancelBooking')}
            </Button>
          ) : null}
          {isNurse && na.canRespond ? (
            <>
              <Button size="lg" fullWidth loading={accept.isPending} disabled={busy} onPress={() => accept.mutate({ id: booking.id })}>
                {t('m.accept')}
              </Button>
              <Button variant="danger" fullWidth disabled={busy} onPress={() => setSheet('reject')}>
                {t('m.reject')}
              </Button>
            </>
          ) : null}
          {isNurse && na.canStart ? (
            <Button size="lg" fullWidth loading={start.isPending} disabled={busy} onPress={() => start.mutate({ id: booking.id })}>
              {t('m.startCare')}
            </Button>
          ) : null}
          {isNurse && na.canComplete ? (
            <Button size="lg" fullWidth loading={complete.isPending} disabled={busy} onPress={() => complete.mutate({ id: booking.id })}>
              {t('m.completeCare')}
            </Button>
          ) : null}
          {!(isNurse ? na.canRespond || na.canStart || na.canComplete : pa.canPay || pa.canCancel) ? (
            <Text variant="body" color="muted">
              {t('account.noActions')}
            </Text>
          ) : null}
        </View>
      </View>

      <ConfirmSheet
        visible={sheet === 'cancel'}
        title={t('account.cancelConfirm')}
        body={t('account.cancelBody')}
        confirmLabel={t('account.cancelBooking')}
        cancelLabel={t('account.keep')}
        destructive
        loading={cancel.isPending}
        error={cancel.isError ? t(errorKey(cancel.error)) : undefined}
        onCancel={() => setSheet(null)}
        onConfirm={() => cancel.mutate({ id: booking.id }, { onSuccess: () => setSheet(null) })}
      />
      <ConfirmSheet
        visible={sheet === 'reject'}
        title={t('m.rejectTitle')}
        body={t('m.rejectBody')}
        inputLabel={t('m.rejectReason')}
        confirmLabel={t('m.reject')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={reject.isPending}
        error={reject.isError ? t(errorKey(reject.error)) : undefined}
        onCancel={() => setSheet(null)}
        onConfirm={(reason) => reject.mutate({ id: booking.id, extra: reason || undefined }, { onSuccess: () => setSheet(null) })}
      />
    </Screen>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text variant="small" color="muted">
        {label}
      </Text>
      <Text variant="body" weight="semibold">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 18 },
  service: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingBottom: 12, marginBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.line },
  info: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.line, gap: 2 },
  alert: { backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 },
});
