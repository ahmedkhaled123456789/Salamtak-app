import { Search, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { fontFamily } from '@/theme/typography';

export function SearchBar({ value, onChangeText, placeholder }: { value: string; onChangeText: (v: string) => void; placeholder: string }) {
  const { t, locale, isRTL } = useI18n();
  return (
    <View style={styles.box}>
      <Search size={18} color={colors.muted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        accessibilityLabel={placeholder}
        returnKeyType="search"
        style={[styles.input, { fontFamily: fontFamily(locale, 'regular'), textAlign: isRTL ? 'right' : 'left' }]}
      />
      {value ? (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityRole="button" accessibilityLabel={t('common.close')}>
          <X size={18} color={colors.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, borderRadius: radii.full, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, paddingHorizontal: 18 },
  input: { flex: 1, fontSize: 15, color: colors.ink, paddingVertical: 0, outlineWidth: 0 } as object,
});
