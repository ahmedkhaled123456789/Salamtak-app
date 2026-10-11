import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { authApi } from '@/api/auth';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { buildSchemas } from '@/lib/validation';
import { colors } from '@/theme/colors';

export default function ForgotPasswordScreen() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const schema = useMemo(() => buildSchemas(t).forgot, [t]);
  const { control, handleSubmit, formState } = useForm<{ email: string }>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const onSubmit = handleSubmit(async (v) => {
    setFailure(null);
    try {
      await authApi.forgotPassword(v.email.trim());
      setSent(true);
    } catch (error) {
      setFailure(t(errorKey(error)));
    }
  });

  return (
    <AuthLayout title={t('auth.forgotTitle')} body={t('auth.forgotBody')}>
      {sent ? (
        <View style={{ gap: 16 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', backgroundColor: colors.mint, padding: 14, borderRadius: 14 }} accessibilityLiveRegion="polite">
            <CheckCircle2 size={20} color={colors.brandDark} />
            <Text variant="body" color={colors.brandDark} style={{ flex: 1 }}>
              {t('m.forgotSent')}
            </Text>
          </View>
          <Button fullWidth size="lg" onPress={() => router.replace('/reset-password')}>
            {t('m.haveResetCode')}
          </Button>
          <Button fullWidth variant="secondary" onPress={() => router.replace('/sign-in')}>
            {t('auth.backToSignIn')}
          </Button>
        </View>
      ) : (
        <>
          <FormField control={control} name="email" label={t('auth.email')} error={formState.errors.email?.message} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" />
          {failure ? (
            <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={{ backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 }}>
              {failure}
            </Text>
          ) : null}
          <Button size="lg" fullWidth loading={formState.isSubmitting} onPress={onSubmit}>
            {t('auth.submitForgot')}
          </Button>
          <Button fullWidth variant="ghost" onPress={() => router.replace('/sign-in')}>
            {t('auth.backToSignIn')}
          </Button>
        </>
      )}
    </AuthLayout>
  );
}
