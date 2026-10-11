import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';

export default function NotFoundScreen() {
  const { t } = useI18n();
  return (
    <Screen header="brand" scroll={false}>
      <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 16 }}>
        <Text variant="h1" accessibilityRole="header">
          {t('notFound.title')}
        </Text>
        <Text variant="bodyLg" color="muted">
          {t('notFound.body')}
        </Text>
        <Button size="lg" onPress={() => router.replace('/')}>
          {t('notFound.home')}
        </Button>
        <Button size="lg" variant="secondary" onPress={() => router.replace('/services')}>
          {t('notFound.services')}
        </Button>
      </View>
    </Screen>
  );
}
