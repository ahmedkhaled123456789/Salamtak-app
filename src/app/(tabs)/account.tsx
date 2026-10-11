import { Redirect } from 'expo-router';
import { CalendarCheck, ShieldCheck, UserRoundCheck } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { images } from '@/data/images';
import { useI18n } from '@/i18n';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

/** Signed-out "Account" tab: sign in / create account with the website's side-panel copy. */
export default function AccountScreen() {
  const { t, l } = useI18n();
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Redirect href="/profile" />;
  const perks = [
    { icon: CalendarCheck, text: t('nav.bookings') },
    { icon: UserRoundCheck, text: t('trust.t2') },
    { icon: ShieldCheck, text: t('trust.t3') },
  ];
  return (
    <Screen contentStyle={{ padding: 20, paddingBottom: 48 }}>
      <SmartImage
        src={images.auth}
        alt={l({ en: 'A caregiver and an older woman smiling together', ar: 'مقدّمة رعاية وسيدة مسنّة تبتسمان معاً' })}
        aspectRatio={4 / 3}
        radius={radii.hero}
        position="50% 35%"
      />
      <Text variant="h1" size={34} style={{ marginTop: 24 }} accessibilityRole="header">
        {t('auth.side')}
      </Text>
      <Text variant="bodyLg" color="muted" style={{ marginTop: 12 }}>
        {t('auth.sideBody')}
      </Text>
      <View style={{ marginTop: 24, gap: 14 }}>
        {perks.map(({ icon: Glyph, text }) => (
          <View key={text} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' }}>
              <Glyph size={20} color={colors.brand} />
            </View>
            <Text variant="body" weight="medium" style={{ flex: 1 }}>
              {text}
            </Text>
          </View>
        ))}
      </View>
      <View style={{ marginTop: 32, gap: 12 }}>
        <Button size="lg" fullWidth href="/sign-in">
          {t('common.signIn')}
        </Button>
        <Button size="lg" fullWidth variant="secondary" href="/sign-up">
          {t('common.signUp')}
        </Button>
        <LanguageSwitch block />
      </View>
    </Screen>
  );
}
