import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Text } from '@/components/ui/Text';
import { useChangePassword } from '@/hooks/useAccount';
import { useI18n } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { buildSchemas } from '@/lib/validation';
import { colors } from '@/theme/colors';

interface Values {
  current: string;
  password: string;
  confirm: string;
}

export default function ChangePasswordScreen() {
  return (
    <RequireAuth>
      <ChangePassword />
    </RequireAuth>
  );
}

function ChangePassword() {
  const { t } = useI18n();
  const change = useChangePassword();
  const [done, setDone] = useState(false);
  const schema = useMemo(() => buildSchemas(t).changePassword, [t]);
  const { control, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { current: '', password: '', confirm: '' } });
  const e = formState.errors;
  const onSubmit = handleSubmit((v) => {
    setDone(false);
    change.mutate(
      { current: v.current, next: v.password },
      {
        onSuccess: () => {
          setDone(true);
          reset();
        },
      },
    );
  });
  return (
    <Screen header="back" title={t('m.changePassword')} keyboard contentStyle={{ padding: 20, paddingBottom: 48, gap: 16 }}>
      <FormField control={control} name="current" label={t('m.currentPassword')} error={e.current?.message} password autoCapitalize="none" autoComplete="current-password" />
      <FormField control={control} name="password" label={t('m.newPassword')} error={e.password?.message} password autoCapitalize="none" autoComplete="new-password" />
      <FormField control={control} name="confirm" label={t('auth.confirmPassword')} error={e.confirm?.message} password autoCapitalize="none" autoComplete="new-password" />
      {change.isError ? (
        <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={{ backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 }}>
          {t(errorKey(change.error, 'auth'))}
        </Text>
      ) : null}
      {done ? (
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} accessibilityLiveRegion="polite">
          <CheckCircle2 size={18} color={colors.brandDark} />
          <Text variant="body" color={colors.brandDark}>
            {t('m.passwordChanged')}
          </Text>
        </View>
      ) : null}
      <Button size="lg" fullWidth loading={change.isPending} onPress={onSubmit}>
        {t('common.save')}
      </Button>
    </Screen>
  );
}
