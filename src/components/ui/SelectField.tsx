import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { BottomSheet } from './BottomSheet';
import { Text } from './Text';

export interface SelectOption {
  value: string;
  label: string;
}

/** Native replacement for the website's <select>: a field that opens a bottom sheet of options. */
export function SelectField({
  label,
  value,
  options,
  onChange,
  error,
  sheetTitle,
}: {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  sheetTitle?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  return (
    <View>
      <Text variant="label" style={{ marginBottom: 6 }}>
        {label}
      </Text>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current?.label ?? ''}`}
        style={({ pressed }) => [styles.box, error ? { borderColor: colors.coral } : null, pressed && { backgroundColor: colors.mintSoft }]}
      >
        <Text variant="body" numberOfLines={1} style={{ flex: 1 }}>
          {current?.label ?? ''}
        </Text>
        <ChevronDown size={18} color={colors.muted} />
      </Pressable>
      {error ? (
        <Text variant="small" weight="medium" color={colors.coral} style={{ marginTop: 6 }}>
          {error}
        </Text>
      ) : null}
      <BottomSheet visible={open} title={sheetTitle ?? label} onClose={() => setOpen(false)}>
        {options.map((o) => {
          const selected = o.value === value;
          return (
            <Pressable
              key={o.value}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => {
                onChange(o.value);
                setOpen(false);
              }}
              style={({ pressed }) => [styles.option, selected && { backgroundColor: colors.mint }, pressed && { opacity: 0.8 }]}
            >
              <Text variant="bodyLg" weight={selected ? 'semibold' : 'regular'} style={{ flex: 1 }}>
                {o.label}
              </Text>
              {selected ? <Check size={20} color={colors.brand} /> : null}
            </Pressable>
          );
        })}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 50,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  option: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: 16, borderRadius: radii.xl, gap: 8 },
});
