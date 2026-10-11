import { Plus, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { AvailabilityRule } from '@/api/nurse';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Screen } from '@/components/layout/Screen';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { DateField } from '@/components/ui/DateField';
import { Skeleton } from '@/components/ui/Skeleton';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useAddAvailability, useAvailability, useRemoveAvailability } from '@/hooks/useAccount';
import { useI18n } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { addDays, todayIso } from '@/lib/format';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

const TIME = /^([01]\d|2[0-3]):[0-5]\d$|^24:00$/;
const DAYS = [1, 2, 3, 4, 5, 6, 7]; // ISO weekday, 1 = Monday
type OffType = 'VACATION' | 'BLOCKED' | 'HOLIDAY';

export default function AvailabilityScreen() {
  return (
    <RequireAuth role="NURSE">
      <Availability />
    </RequireAuth>
  );
}

function Availability() {
  const { t, date } = useI18n();
  const { data, isLoading, isError, error, refetch } = useAvailability();
  const add = useAddAvailability();
  const remove = useRemoveAvailability();
  const [sheet, setSheet] = useState<null | 'weekly' | 'off'>(null);

  // weekly form
  const [day, setDay] = useState(1);
  const [from, setFrom] = useState('09:00');
  const [to, setTo] = useState('17:00');
  const [timeError, setTimeError] = useState<string | undefined>();
  // time off form
  const [offType, setOffType] = useState<OffType>('VACATION');
  const [dateFrom, setDateFrom] = useState<string | undefined>();
  const [dateTo, setDateTo] = useState<string | undefined>();
  const [reason, setReason] = useState('');
  const [offError, setOffError] = useState<string | undefined>();

  const weekly = (data ?? []).filter((r) => r.kind === 'WEEKLY').sort((a, b) => (a.dayOfWeek ?? 0) - (b.dayOfWeek ?? 0) || (a.startTime ?? '').localeCompare(b.startTime ?? ''));
  const off = (data ?? []).filter((r) => r.kind === 'BLOCKED').sort((a, b) => (a.dateFrom ?? '').localeCompare(b.dateFrom ?? ''));
  const dayName = (d: number) => date(addDays('2026-01-05', d - 1), { weekday: 'long' }); // 2026-01-05 is a Monday

  const saveWeekly = () => {
    if (!TIME.test(from) || !TIME.test(to) || from >= to) {
      setTimeError(t('m.timeInvalid'));
      return;
    }
    setTimeError(undefined);
    add.mutate({ kind: 'WEEKLY', dayOfWeek: day, startTime: from, endTime: to }, { onSuccess: () => setSheet(null) });
  };
  const saveOff = () => {
    if (!dateFrom || !dateTo || dateTo < dateFrom) {
      setOffError(t('m.rangeInvalid'));
      return;
    }
    setOffError(undefined);
    add.mutate({ kind: 'BLOCKED', type: offType, dateFrom, dateTo, ...(reason.trim() && { reason: reason.trim() }) }, { onSuccess: () => setSheet(null) });
  };

  const rule = (r: AvailabilityRule) => (
    <View key={r.id} style={styles.rule}>
      <View style={{ flex: 1 }}>
        {r.kind === 'WEEKLY' ? (
          <>
            <Text variant="body" weight="semibold">
              {dayName(r.dayOfWeek ?? 1)}
            </Text>
            <Text variant="small" color="muted">
              {r.startTime} – {r.endTime}
            </Text>
          </>
        ) : (
          <>
            <Text variant="body" weight="semibold">
              {r.dateFrom ? date(r.dateFrom) : ''}
              {r.dateTo && r.dateTo !== r.dateFrom ? ` – ${date(r.dateTo)}` : ''}
            </Text>
            <Text variant="small" color="muted">
              {r.type ? t(`m.off${r.type}` as 'm.offVACATION') : ''}
              {r.reason ? ` · ${r.reason}` : ''}
            </Text>
          </>
        )}
      </View>
      <Pressable
        onPress={() => remove.mutate(r.id)}
        disabled={remove.isPending}
        accessibilityRole="button"
        accessibilityLabel={t('m.remove')}
        hitSlop={8}
        style={styles.trash}
      >
        <Trash2 size={18} color={colors.coral} />
      </Pressable>
    </View>
  );

  return (
    <Screen header="back" title={t('m.availability')}>
      <View style={{ padding: 20, paddingBottom: 48, gap: 28 }}>
        <Text variant="body" color="muted">
          {t('m.availabilityBody')}
        </Text>
        {isLoading ? (
          <Skeleton height={180} radius={24} />
        ) : isError ? (
          <QueryError error={error} onRetry={() => void refetch()} />
        ) : (
          <>
            <View>
              <View style={styles.head}>
                <Text variant="h3" size={22}>
                  {t('m.weeklyHours')}
                </Text>
                <Button size="sm" variant="secondary" iconStart={<Plus size={16} color={colors.ink} />} onPress={() => setSheet('weekly')}>
                  {t('m.add')}
                </Button>
              </View>
              <View style={{ gap: 10, marginTop: 14 }}>{weekly.length ? weekly.map(rule) : <StateMessage title={t('m.noWeekly')} compact />}</View>
            </View>
            <View>
              <View style={styles.head}>
                <Text variant="h3" size={22}>
                  {t('m.timeOff')}
                </Text>
                <Button size="sm" variant="secondary" iconStart={<Plus size={16} color={colors.ink} />} onPress={() => setSheet('off')}>
                  {t('m.add')}
                </Button>
              </View>
              <View style={{ gap: 10, marginTop: 14 }}>{off.length ? off.map(rule) : <StateMessage title={t('m.noTimeOff')} compact />}</View>
            </View>
          </>
        )}
        {remove.isError ? (
          <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert">
            {t(errorKey(remove.error))}
          </Text>
        ) : null}
      </View>

      <BottomSheet
        visible={sheet === 'weekly'}
        title={t('m.addWeekly')}
        onClose={() => setSheet(null)}
        footer={
          <Button fullWidth size="lg" loading={add.isPending} onPress={saveWeekly}>
            {t('common.save')}
          </Button>
        }
      >
        <View style={{ gap: 16 }}>
          <View style={styles.chips}>
            {DAYS.map((d) => (
              <Chip key={d} label={dayName(d)} selected={day === d} onPress={() => setDay(d)} tone="white" />
            ))}
          </View>
          <TextField label={t('m.from')} value={from} onChangeText={setFrom} placeholder="09:00" keyboardType="numbers-and-punctuation" maxLength={5} />
          <TextField label={t('m.to')} value={to} onChangeText={setTo} placeholder="17:00" keyboardType="numbers-and-punctuation" maxLength={5} error={timeError} />
          {add.isError ? (
            <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert">
              {t(errorKey(add.error))}
            </Text>
          ) : null}
        </View>
      </BottomSheet>

      <BottomSheet
        visible={sheet === 'off'}
        title={t('m.addTimeOff')}
        onClose={() => setSheet(null)}
        footer={
          <Button fullWidth size="lg" loading={add.isPending} onPress={saveOff}>
            {t('common.save')}
          </Button>
        }
      >
        <View style={{ gap: 16 }}>
          <View style={styles.chips}>
            {(['VACATION', 'HOLIDAY', 'BLOCKED'] as OffType[]).map((o) => (
              <Chip key={o} label={t(`m.off${o}` as 'm.offVACATION')} selected={offType === o} onPress={() => setOffType(o)} tone="white" />
            ))}
          </View>
          <DateField label={t('m.from')} value={dateFrom} min={todayIso()} onChange={(v) => { setDateFrom(v); if (dateTo && dateTo < v) setDateTo(v); }} placeholder={t('m.pickDate')} />
          <DateField label={t('m.to')} value={dateTo} min={dateFrom ?? todayIso()} onChange={setDateTo} placeholder={t('m.pickDate')} error={offError} />
          <TextField label={t('m.rejectReason')} value={reason} onChangeText={setReason} maxLength={200} />
          {add.isError ? (
            <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert">
              {t(errorKey(add.error))}
            </Text>
          ) : null}
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radii['2xl'], borderWidth: 1, borderColor: colors.line, padding: 16 },
  trash: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coralSoft },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
