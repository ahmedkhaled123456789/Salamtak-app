import { router, type Href } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Icon } from '@/components/ui/Icons';
import { useI18n, type TranslationKey } from '@/i18n';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { LanguageSwitch } from './LanguageSwitch';

/** The website's ten navigation links (MobileMenu.tsx), in the same order. */
export const MENU_LINKS: { href: Href; key: TranslationKey }[] = [
  { href: '/', key: 'nav.home' },
  { href: '/services', key: 'nav.services' },
  { href: '/nurses', key: 'nav.findNurse' },
  { href: '/how-it-works', key: 'nav.howItWorks' },
  { href: '/why-careflow', key: 'nav.why' },
  { href: '/about', key: 'nav.about' },
  { href: '/stories', key: 'nav.reviews' },
  { href: '/resources', key: 'nav.resources' },
  { href: '/faqs', key: 'nav.faqs' },
  { href: '/contact', key: 'nav.contact' },
];

export function MenuSheet({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const go = (href: Href) => {
    onClose();
    router.navigate(href);
  };
  const isNurse = user?.role === 'NURSE';
  return (
    <BottomSheet
      visible={visible}
      title={t('common.menu')}
      onClose={onClose}
      footer={
        <View style={{ gap: 12 }}>
          <LanguageSwitch block />
          <View style={styles.cta}>
            <View style={{ flex: 1 }}>
              <Button fullWidth variant="secondary" onPress={() => go(isAuthenticated ? (isNurse ? '/profile' : '/profile') : '/sign-in')}>
                {isAuthenticated ? t('nav.account') : t('common.signIn')}
              </Button>
            </View>
            {!isNurse ? (
              <View style={{ flex: 1 }}>
                <Button fullWidth onPress={() => go('/book')}>
                  {t('common.bookCare')}
                </Button>
              </View>
            ) : null}
          </View>
        </View>
      }
    >
      {MENU_LINKS.map((l) => (
        <Pressable
          key={l.key}
          accessibilityRole="link"
          onPress={() => go(l.href)}
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.mint }]}
        >
          <Text variant="bodyLg" weight="medium" style={{ flex: 1 }}>
            {t(l.key)}
          </Text>
          <Icon icon={ArrowRight} size={18} color={colors.muted} directional />
        </Pressable>
      ))}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', minHeight: 52, paddingHorizontal: 16, borderRadius: radii.xl },
  cta: { flexDirection: 'row', gap: 12 },
});
