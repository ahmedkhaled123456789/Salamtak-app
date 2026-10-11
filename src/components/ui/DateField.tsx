import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useI18n } from '@/i18n';
import { addDays, toIsoDate, todayIso } from '@/lib/format';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { BottomSheet } from './BottomSheet';
import { Text } from './Text';

/** Month-grid date picker in a sheet (no native picker dependency, works in both directions). */
export function DateField({
  label,
  value,
  onChange,
  error,
  min = todayIso(),
  placeholder,
}: {
  label: string;
  value?: string;
  onChange: (iso: string) => void;
  error?: string;
  min?: string;
  placeholder: string;
}) {
  const { date, isRTL, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const initial = value ?? min;
  const [cursor, setCursor] = useState(() => {
    const [y, m] = initial.split('-').map(Number) as [number, number];
    return { y, m: m - 1 };
  });

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const lead = first.getDay(); // Sunday-first grid in both languages
    const count = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const out: (string | null)[] = Array.from({ length: lead }, () => null);
    for (let d = 1; d <= count; d++) out.push(toIsoDate(new Date(cursor.y, cursor.m, d)));
    while (out.length % 7) out.push(null);
    return out;
  }, [cursor]);

  const weekdays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => date(addDays('2026-01-04', i), { weekday: 'narrow' })),
    [date],
  );
  const monthTitle = date(toIsoDate(new Date(cursor.y, cursor.m, 15)), { month: 'long', year: 'numeric' });
  const shift = (delta: number) =>
    setCursor((c) => {
      const d = new Date(c.y, c.m + delta, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  const Prev = isRTL ? ChevronRight : ChevronLeft;
  const Next = isRTL ? ChevronLeft : ChevronRight;
  void locale;

  return (
    <View>
      <Text variant="label" style={{ marginBottom: 6 }}>
        {label}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value ? date(value) : placeholder}`}
        style={({ pressed }) => [styles.box, error ? { borderColor: colors.coral } : null, pressed && { backgroundColor: colors.mintSoft }]}
      >
        <CalendarDays size={18} color={colors.brand} />
        <Text variant="body" color={value ? 'ink' : 'muted'} style={{ flex: 1 }}>
          {value ? date(value, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : placeholder}
        </Text>
      </Pressable>
      {error ? (
        <Text variant="small" weight="medium" color={colors.coral} style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : null}
      <BottomSheet visible={open} title={label} onClose={() => setOpen(false)}>
        <View style={styles.nav}>
          <Pressable onPress={() => shift(-1)} style={styles.navBtn} accessibilityRole="button" hitSlop={8} accessibilityLabel="Previous month">
            <Prev size={20} color={colors.ink} />
          </Pressable>
          <Text variant="title">{monthTitle}</Text>
          <Pressable onPress={() => shift(1)} style={styles.navBtn} accessibilityRole="button" hitSlop={8} accessibilityLabel="Next month">
            <Next size={20} color={colors.ink} />
          </Pressable>
        </View>
        <View style={styles.week}>
          {weekdays.map((w, i) => (
            <Text key={i} variant="caption" color="muted" align="center" style={styles.cell}>
              {w}
            </Text>
          ))}
        </View>
        <View style={styles.grid}>
          {cells.map((iso, i) => {
            if (!iso) return <View key={i} style={styles.cell} />;
            const disabled = iso < min;
            const selected = iso === value;
            return (
              <Pressable
                key={iso}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ selected, disabled }}
                onPress={() => {
                  onChange(iso);
                  setOpen(false);
                }}
                style={[styles.cell, styles.day, selected && { backgroundColor: colors.brand }, iso === todayIso() && !selected && { borderColor: colors.brand, borderWidth: 1 }]}
              >
                <Text variant="label" color={selected ? colors.white : disabled ? colors.lineStrong : colors.ink}>
                  {String(Number(iso.slice(8)))}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 50, borderRadius: radii.xl, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, paddingHorizontal: 16 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  navBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  week: { flexDirection: 'row' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  day: { borderRadius: radii.full },
});
