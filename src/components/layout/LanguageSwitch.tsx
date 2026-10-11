import { Globe } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { Text } from '@/components/ui/Text';

/** Toggles EN ⇄ AR. Switching to/from Arabic flips the native layout direction (the app reloads once on device). */
export function LanguageSwitch({ block = false }: { block?: boolean }) {
  const { locale, setLocale, t } = useI18n();
  const next = locale === 'ar' ? 'en' : 'ar';
  return (
    <Pressable
      onPress={() => void setLocale(next)}
      accessibilityRole="button"
      accessibilityLabel={`${t('common.language')}: ${next === 'ar' ? 'العربية' : 'English'}`}
      hitSlop={6}
      style={({ pressed }) => [styles.pill, block && styles.block, pressed && { backgroundColor: colors.mint }]}
    >
      <Globe size={16} color={colors.brandDark} />
      <Text variant="label" color={colors.brandDark}>
        {next === 'ar' ? 'العربية' : 'English'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  block: { justifyContent: 'center', alignSelf: 'stretch', height: 48 },
});
