import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { StateMessage } from '@/components/ui/StateMessage';
import { useI18n } from '@/i18n';
import { useAuth } from '@/state/auth';

/** Admin / finance accounts use the web dashboard; the app exposes none of their data or actions. */
export default function StaffBlockedScreen() {
  const { t } = useI18n();
  const { signOut } = useAuth();
  return (
    <Screen header="none" scroll={false}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
        <StateMessage kind="error" title={t('m.staffTitle')} body={t('m.staffBody')} />
        <View style={{ marginTop: 20 }}>
          <Button fullWidth size="lg" onPress={() => void signOut().then(() => router.replace('/'))}>
            {t('common.signOut')}
          </Button>
        </View>
      </View>
    </Screen>
  );
}
