import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { images } from '@/data/images';
import { useI18n } from '@/i18n';
import { radii } from '@/theme/radii';

export function AuthLayout({ title, body, children }: { title: string; body: string; children: React.ReactNode }) {
  const { t, l } = useI18n();
  return (
    <Screen header="back" keyboard contentStyle={{ padding: 20, paddingBottom: 48 }}>
      <SmartImage
        src={images.auth}
        alt={l({ en: 'A caregiver and an older woman smiling together', ar: 'مقدّمة رعاية وسيدة مسنّة تبتسمان معاً' })}
        aspectRatio={16 / 8}
        radius={radii['3xl']}
        position="50% 35%"
      />
      <Text variant="small" weight="semibold" color="muted" style={{ marginTop: 20 }}>
        {t('auth.side')}
      </Text>
      <Text variant="h1" size={34} style={{ marginTop: 8 }} accessibilityRole="header">
        {title}
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: 10 }}>
        {body}
      </Text>
      <View style={{ marginTop: 24, gap: 16 }}>{children}</View>
    </Screen>
  );
}
