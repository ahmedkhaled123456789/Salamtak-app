import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { statusKey } from '@/lib/bookingStatus';
import { colors } from '@/theme/colors';
import type { HistoryEntry } from '@/types/booking';

/** Booking history as returned by the backend (append-only state log), newest last. */
export function StatusTimeline({ entries, createdAt }: { entries: HistoryEntry[]; createdAt: string }) {
  const { t, date, time } = useI18n();
  const rows = [{ label: t('status.created'), at: createdAt }, ...entries.map((e) => ({ label: t(statusKey[e.status]), at: e.at }))];
  return (
    <View>
      {rows.map((r, i) => (
        <View key={`${r.at}-${i}`} style={styles.row}>
          <View style={styles.rail}>
            <View style={[styles.dot, i === rows.length - 1 && { backgroundColor: colors.brand }]} />
            {i < rows.length - 1 ? <View style={styles.line} /> : null}
          </View>
          <View style={{ flex: 1, paddingBottom: 18 }}>
            <Text variant="body" weight={i === rows.length - 1 ? 'bold' : 'medium'}>
              {r.label}
            </Text>
            <Text variant="small" color="muted">
              {date(r.at)} · {time(r.at)}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 14 },
  rail: { alignItems: 'center', width: 14 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.lineStrong, marginTop: 5 },
  line: { flex: 1, width: 2, backgroundColor: colors.line, marginTop: 2 },
});
