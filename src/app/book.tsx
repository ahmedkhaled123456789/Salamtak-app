import { router, useLocalSearchParams } from 'expo-router';
import { Check, LogIn } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ApiError } from '@/api/client';
import { NurseCard } from '@/components/cards/NurseCard';
import { BookingProgress } from '@/components/booking/BookingProgress';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { PriceBreakdown } from '@/components/booking/PriceBreakdown';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { DateField } from '@/components/ui/DateField';
import { DaysStepper } from '@/components/ui/DaysStepper';
import { Skeleton } from '@/components/ui/Skeleton';
import { SmartImage } from '@/components/ui/SmartImage';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { SelectField } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import { emirates, findEmirate } from '@/data/emirates';
import { usePatientProfile } from '@/hooks/useAccount';
import { useCreateBooking, useQuote } from '@/hooks/useBookings';
import { useNurse, useNurses, useServices } from '@/hooks/useCatalog';
import { useI18n, type TranslationKey } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { registerForPush } from '@/lib/push';
import { todayIso } from '@/lib/format';
import { useAuth } from '@/state/auth';
import { useBookingDraft } from '@/state/bookingDraft';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { BookingDraft } from '@/types/booking';
import type { GenderPreference } from '@/types/nurse';

const STEPS: { id: 'service' | 'schedule' | 'preference' | 'nurse' | 'review'; label: TranslationKey }[] = [
  { id: 'service', label: 'booking.steps.service' },
  { id: 'schedule', label: 'booking.steps.schedule' },
  { id: 'preference', label: 'booking.steps.preference' },
  { id: 'nurse', label: 'booking.steps.nurse' },
  { id: 'review', label: 'booking.steps.review' },
];
const STEP_INDEX = { service: 0, schedule: 1, preference: 2, nurse: 3, review: 4 } as const;

type ErrorKey = 'service' | 'startDate' | 'days' | 'address' | 'nurse';

export default function BookScreen() {
  const { t, l, money, daysLabel } = useI18n();
  const params = useLocalSearchParams<{ service?: string }>();
  const { draft, step, setStep, update, reset, hydrated, keyForSubmit } = useBookingDraft();
  const { user, isAuthenticated } = useAuth();
  const { data: services } = useServices();
  const { data: profile } = usePatientProfile(isAuthenticated);
  const create = useCreateBooking();
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [conflict, setConflict] = useState(false);

  const stepIndex = Math.min(step, STEPS.length - 1);
  const stepId = STEPS[stepIndex]!.id;
  const service = useMemo(() => (services ?? []).find((s) => s.id === draft.serviceId), [services, draft.serviceId]);
  const { data: nurse } = useNurse(draft.nurseId ?? '');

  // Seed from ?service=<slug> (e.g. the home "Start a booking" button).
  useEffect(() => {
    if (!hydrated || !params.service || !services) return;
    const found = services.find((s) => s.slug === params.service);
    if (found && found.id !== draft.serviceId) reset({ serviceId: found.id, days: Math.max(found.minDays, Math.min(5, found.maxDays)) });
    router.setParams({ service: undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, services, params.service]);

  // Pre-fill the care address from the patient's profile once.
  useEffect(() => {
    if (hydrated && profile?.address && !draft.address) update({ address: profile.address });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, profile?.address]);

  const patch = (next: Partial<BookingDraft>) => {
    const merged = { ...draft, ...next };
    const stillValid = nurse && (!merged.serviceId || nurse.serviceIds.includes(merged.serviceId)) && (merged.genderPreference === 'any' || nurse.gender === merged.genderPreference);
    update(!draft.nurseId || stillValid ? next : { ...next, nurseId: undefined });
    setErrors({});
    setConflict(false);
  };

  const validate = (): Partial<Record<ErrorKey, string>> => {
    const e: Partial<Record<ErrorKey, string>> = {};
    if (stepId === 'service' && !service) e.service = t('validation.service');
    if (stepId === 'schedule' && service) {
      if (!draft.startDate || draft.startDate < todayIso()) e.startDate = t('validation.date');
      if (draft.days < service.minDays || draft.days > service.maxDays) e.days = t('validation.days', { min: service.minDays, max: service.maxDays });
    }
    if (stepId === 'preference' && (draft.address ?? '').trim().length < 5) e.address = t('validation.address');
    if (stepId === 'nurse' && !draft.nurseId) e.nurse = t('validation.nurse');
    return e;
  };

  const next = () => {
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length === 0) setStep(Math.min(stepIndex + 1, STEPS.length - 1));
  };
  const back = () => {
    setErrors({});
    if (stepIndex === 0) router.back();
    else setStep(stepIndex - 1);
  };

  const quoteInput = { draft, patientCity: profile?.city, nurse };
  const canQuote = stepId === 'review' && isAuthenticated && user?.role === 'PATIENT' && Boolean(draft.serviceId && draft.nurseId && draft.startDate);
  const quote = useQuote(quoteInput, canQuote);

  const submit = () => {
    if (create.isPending || !isAuthenticated) return;
    create.mutate(
      { input: quoteInput, key: keyForSubmit() },
      {
        onSuccess: (booking) => {
          reset();
          router.replace({ pathname: '/checkout/[id]', params: { id: booking.id } });
          // the moment updates matter: ask for notification permission now (never on first launch)
          void registerForPush({ ask: true });
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'conflict') {
            update({ nurseId: undefined });
            setConflict(true);
            setStep(STEP_INDEX.nurse);
          }
        },
      },
    );
  };

  if (!hydrated) {
    return (
      <Screen header="back" title={t('booking.title')}>
        <View style={{ padding: 20, gap: 12 }}>
          <Skeleton height={40} />
          <Skeleton height={180} radius={24} />
        </View>
      </Screen>
    );
  }
  if (user?.role === 'NURSE') {
    return (
      <Screen header="back" title={t('booking.title')}>
        <View style={{ padding: 20 }}>
          <StateMessage title={t('m.nurseCannotBook')} body={t('m.nurseCannotBookBody')} actionLabel={t('nav.dashboard')} onAction={() => router.replace('/dashboard')} />
        </View>
      </Screen>
    );
  }

  const last = stepId === 'review';
  const rate = nurse?.dailyRateSample ?? service?.dailyRateSample ?? undefined;
  const estimate = rate !== undefined ? rate * draft.days : undefined;

  const footer = (
    <View style={styles.footer}>
      <View style={{ flex: 1 }}>
        <Button variant="secondary" fullWidth size="lg" onPress={back} disabled={create.isPending}>
          {t('common.back')}
        </Button>
      </View>
      <View style={{ flex: 2 }}>
        {last ? (
          isAuthenticated ? (
            <Button fullWidth size="lg" onPress={submit} loading={create.isPending} disabled={!quote.data}>
              {create.isPending ? t('booking.creating') : t('m.confirmBooking')}
            </Button>
          ) : (
            <Button fullWidth size="lg" iconStart={<LogIn size={18} color={colors.white} />} onPress={() => router.push({ pathname: '/sign-in', params: { next: '/book' } })}>
              {t('common.signIn')}
            </Button>
          )
        ) : (
          <Button fullWidth size="lg" onPress={next}>
            {t('common.continue')}
          </Button>
        )}
      </View>
    </View>
  );

  return (
    <Screen header="back" title={t('booking.title')} footer={footer} keyboard>
      <BookingProgress steps={STEPS} current={stepIndex} />
      <View style={{ paddingHorizontal: 20, paddingBottom: 32, gap: 20 }}>
        {stepId === 'service' ? <ServiceStep selected={draft.serviceId} error={errors.service} onSelect={(id, minDays, maxDays) => patch({ serviceId: id, days: Math.max(minDays, Math.min(draft.days, maxDays)) })} /> : null}

        {stepId === 'schedule' && service ? (
          <>
            <Text variant="h2" size={28}>
              {t('booking.scheduleTitle')}
            </Text>
            <DateField label={t('booking.startDate')} value={draft.startDate} onChange={(startDate) => patch({ startDate })} error={errors.startDate} placeholder={t('m.pickDate')} />
            <View>
              <Text variant="label" style={{ marginBottom: 8 }}>
                {t('booking.days')}
              </Text>
              <DaysStepper value={draft.days} min={service.minDays} max={service.maxDays} onChange={(days) => patch({ days })} />
              <Text variant="small" color={errors.days ? colors.coral : 'muted'} style={{ marginTop: 8 }}>
                {errors.days ?? t('serviceDetail.durationHint', { min: service.minDays, max: service.maxDays })}
              </Text>
            </View>
          </>
        ) : null}

        {stepId === 'preference' ? (
          <>
            <Text variant="h2" size={28}>
              {t('booking.preferenceTitle')}
            </Text>
            <View>
              <Text variant="label" style={{ marginBottom: 8 }}>
                {t('booking.genderLabel')}
              </Text>
              <View style={styles.chips}>
                {(
                  [
                    ['any', t('common.noPreference')],
                    ['female', t('common.female')],
                    ['male', t('common.male')],
                  ] as [GenderPreference, string][]
                ).map(([v, label]) => (
                  <Chip key={v} label={label} selected={draft.genderPreference === v} onPress={() => patch({ genderPreference: v })} tone="white" />
                ))}
              </View>
            </View>
            <SelectField
              label={t('booking.emirate')}
              sheetTitle={t('booking.emirate')}
              value={draft.emirate ?? findEmirate(profile?.city)?.id ?? ''}
              options={emirates.map((e) => ({ value: e.id, label: l(e.name) }))}
              onChange={(emirate) => patch({ emirate })}
            />
            <TextField label={t('booking.address')} value={draft.address ?? ''} onChangeText={(address) => patch({ address })} placeholder={t('booking.addressPlaceholder')} error={errors.address} autoComplete="street-address" />
            <TextField label={t('booking.notes')} value={draft.notes ?? ''} onChangeText={(notes) => patch({ notes })} placeholder={t('booking.notesPlaceholder')} multiline />
          </>
        ) : null}

        {stepId === 'nurse' ? <NurseStep draft={draft} selected={draft.nurseId} error={errors.nurse} conflict={conflict} onSelect={(id) => patch({ nurseId: id })} /> : null}

        {stepId === 'review' ? (
          <>
            <Text variant="h2" size={28}>
              {t('booking.reviewTitle')}
            </Text>
            <BookingSummary draft={draft} service={service} nurse={nurse} onEdit={(i) => setStep(i)} />
            <View style={styles.priceCard}>
              {!isAuthenticated ? (
                <>
                  <PriceNote estimate={estimate} currency="AED" days={draft.days} />
                  <View style={styles.signin}>
                    <Text variant="title">{t('booking.accountTitle')}</Text>
                    <Text variant="body" color="muted" style={{ marginTop: 6 }}>
                      {t('booking.accountBody')}
                    </Text>
                    <View style={{ marginTop: 14, flexDirection: 'row', gap: 10, flexWrap: 'wrap' }}>
                      <Button variant="secondary" onPress={() => router.push({ pathname: '/sign-up', params: { next: '/book' } })}>
                        {t('common.signUp')}
                      </Button>
                    </View>
                  </View>
                </>
              ) : quote.isLoading ? (
                <View style={{ gap: 10 }}>
                  <Skeleton height={20} />
                  <Skeleton height={20} />
                  <Skeleton height={44} width="60%" />
                </View>
              ) : quote.isError ? (
                <QueryError error={quote.error} onRetry={() => void quote.refetch()} compact />
              ) : quote.data ? (
                <>
                  <PriceBreakdown lines={quote.data.lines} payable={quote.data.payable} currency={quote.data.currency} />
                  <Text variant="small" color="muted" style={{ marginTop: 12 }}>
                    {t('m.priceByServer')}
                  </Text>
                </>
              ) : null}
            </View>
            {create.isError && !(create.error instanceof ApiError && create.error.code === 'conflict') ? (
              <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={styles.alert}>
                {t(errorKey(create.error, 'booking'))}
              </Text>
            ) : null}
            {isAuthenticated ? (
              <Text variant="small" color="muted">
                {t('booking.signedInAs', { email: user?.email ?? '' })}
              </Text>
            ) : null}
            <Text variant="small" color="muted">
              {t('m.noChargeYet')} {daysLabel(draft.days)}
            </Text>
          </>
        ) : null}
      </View>
    </Screen>
  );

  function PriceNote({ estimate: est, currency, days }: { estimate?: number; currency: string; days: number }) {
    return est !== undefined ? (
      <View>
        <View style={styles.estimateRow}>
          <Text variant="label">{t('bookingPreview.estimatedTotal')}</Text>
          <Text variant="price" size={30} color={colors.brandDark}>
            {money(est, currency)}
          </Text>
        </View>
        <Text variant="small" color="muted" style={{ marginTop: 8 }}>
          {t('booking.sampleQuote')} ({daysLabel(days)})
        </Text>
      </View>
    ) : null;
  }
}

/* ------------------------------------ step: service ------------------------------------ */
function ServiceStep({ selected, error, onSelect }: { selected?: string; error?: string; onSelect: (id: string, min: number, max: number) => void }) {
  const { t, l, money } = useI18n();
  const { data, isLoading, isError, error: loadError, refetch } = useServices();
  return (
    <>
      <Text variant="h2" size={28}>
        {t('booking.serviceTitle')}
      </Text>
      {isLoading ? (
        <View style={{ gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} height={84} radius={20} />
          ))}
        </View>
      ) : isError ? (
        <QueryError error={loadError} onRetry={() => void refetch()} />
      ) : (
        <View style={{ gap: 12 }}>
          {(data ?? []).map((s) => {
            const active = s.id === selected;
            return (
              <Pressable
                key={s.id}
                accessibilityRole="radio"
                accessibilityState={{ selected: active }}
                onPress={() => onSelect(s.id, s.minDays, s.maxDays)}
                style={[styles.option, active && { borderColor: colors.brand, borderWidth: 2, padding: 11 }]}
              >
                <SmartImage src={s.image} alt={l(s.imageAlt)} width={60} height={60} radius={12} />
                <View style={{ flex: 1 }}>
                  <Text variant="body" weight="bold" numberOfLines={2}>
                    {l(s.title)}
                  </Text>
                  {s.dailyRateSample !== null ? (
                    <Text variant="small" color="muted">
                      {money(s.dailyRateSample)} {t('common.perDay')}
                    </Text>
                  ) : null}
                </View>
                {active ? (
                  <View style={styles.check}>
                    <Check size={14} color={colors.white} strokeWidth={3} />
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </View>
      )}
      {error ? (
        <Text variant="small" weight="medium" color={colors.coral}>
          {error}
        </Text>
      ) : null}
    </>
  );
}

/* ------------------------------------- step: nurse ------------------------------------- */
function NurseStep({ draft, selected, error, conflict, onSelect }: { draft: BookingDraft; selected?: string; error?: string; conflict: boolean; onSelect: (id: string) => void }) {
  const { t } = useI18n();
  const { data, isLoading, isError, error: loadError, refetch } = useNurses({ serviceId: draft.serviceId, gender: draft.genderPreference });
  return (
    <>
      <Text variant="h2" size={28}>
        {t('booking.nurseTitle')}
      </Text>
      {conflict ? (
        <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={styles.alert}>
          {t('booking.conflict')}
        </Text>
      ) : null}
      {isLoading ? (
        <Skeleton height={420} radius={24} />
      ) : isError ? (
        <QueryError error={loadError} onRetry={() => void refetch()} />
      ) : (data ?? []).length === 0 ? (
        <StateMessage title={t('nursesPage.emptyTitle')} body={t('booking.nurseEmpty')} />
      ) : (
        <View style={{ gap: 16 }}>
          {(data ?? []).map((n) => (
            <NurseCard key={n.id} nurse={n} selected={n.id === selected} onSelect={() => onSelect(n.id)} actionLabel={n.id === selected ? t('booking.selected') : t('booking.choose')} />
          ))}
        </View>
      )}
      {error ? (
        <Text variant="small" weight="medium" color={colors.coral}>
          {error}
        </Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', gap: 12 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderRadius: radii['2xl'], borderWidth: 1, borderColor: colors.line, padding: 12 },
  check: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  priceCard: { backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 18 },
  signin: { marginTop: 18, paddingTop: 18, borderTopWidth: 1, borderTopColor: colors.line },
  estimateRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 },
  alert: { backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 },
});
