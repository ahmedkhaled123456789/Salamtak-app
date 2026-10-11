import { router } from 'expo-router';
import { ArrowLeft, Menu } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '@/components/ui/Icons';
import { Logo } from '@/components/ui/Logo';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { LanguageSwitch } from './LanguageSwitch';
import { MenuSheet } from './MenuSheet';

/** Compact branded header for tab roots: logo, language, menu (website: SiteHeader). */
export function AppHeader({ showMenu = true }: { showMenu?: boolean }) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <Logo />
      <View style={styles.actions}>
        <LanguageSwitch />
        {showMenu ? (
          <Pressable
            onPress={() => setOpen(true)}
            accessibilityRole="button"
            accessibilityLabel={t('common.menu')}
            style={({ pressed }) => [styles.menu, pressed && { backgroundColor: colors.mint }]}
          >
            <Menu size={20} color={colors.ink} />
          </Pressable>
        ) : null}
      </View>
      <MenuSheet visible={open} onClose={() => setOpen(false)} />
    </View>
  );
}

/** Header for pushed screens: back button + title. */
export function BackHeader({ title, right }: { title?: string; right?: React.ReactNode }) {
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 8 }]}>
      <Pressable
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
        accessibilityRole="button"
        accessibilityLabel={t('common.back')}
        style={({ pressed }) => [styles.menu, pressed && { backgroundColor: colors.mint }]}
      >
        <Icon icon={ArrowLeft} size={20} directional />
      </Pressable>
      <Text variant="title" numberOfLines={1} style={{ flex: 1, textAlign: 'center' }} accessibilityRole="header">
        {title ?? ''}
      </Text>
      <View style={{ minWidth: 44, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: colors.ivory,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  menu: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
});
