import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { authApi } from '@/api/auth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { buildSchemas } from '@/lib/validation';
import { colors } from '@/theme/colors';

interface Values {
  token: string;
  password: string;
  confirm: string;
}

/** Opened by `careflow://reset-password?token=…` or by pasting the token from the reset email. */
export default function ResetPasswordScreen() {
  const { t } = useI18n();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [failure, setFailure] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const schema = useMemo(() => buildSchemas(t).reset, [t]);
  const { control, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { token: token ?? '', password: '', confirm: '' } });
  const e = formState.errors;

  const onSubmit = handleSubmit(async (v) => {
    setFailure(null);
    try {
      await authApi.resetPassword(v.token.trim(), v.password);
      setDone(true);
    } catch (error) {
      setFailure(t(errorKey(error)));
    }
  });

  return (
    <AuthLayout title={t('m.resetTitle')} body={t('m.resetBody')}>
      {done ? (
        <>
          <Text variant="body" color={colors.brandDark} style={{ backgroundColor: colors.mint, padding: 14, borderRadius: 14 }} accessibilityLiveRegion="polite">
            {t('m.resetDone')}
          </Text>
          <Button fullWidth size="lg" onPress={() => router.replace('/sign-in')}>
            {t('auth.submitSignIn')}
          </Button>
        </>
      ) : (
        <>
          <FormField control={control} name="token" label={t('m.resetToken')} error={e.token?.message} autoCapitalize="none" autoCorrect={false} />
          <FormField control={control} name="password" label={t('m.newPassword')} error={e.password?.message} password autoCapitalize="none" autoComplete="new-password" />
          <FormField control={control} name="confirm" label={t('auth.confirmPassword')} error={e.confirm?.message} password autoCapitalize="none" autoComplete="new-password" />
          {failure ? (
            <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={{ backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 }}>
              {failure}
            </Text>
          ) : null}
          <Button size="lg" fullWidth loading={formState.isSubmitting} onPress={onSubmit}>
            {t('m.resetSubmit')}
          </Button>
        </>
      )}
    </AuthLayout>
  );
}
