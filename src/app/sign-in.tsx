import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { homeFor, safeNext } from '@/lib/routes';
import { buildSchemas } from '@/lib/validation';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';

interface Values {
  email: string;
  password: string;
}

export default function SignInScreen() {
  const { t } = useI18n();
  const { signIn, sessionExpired, clearExpired } = useAuth();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const [failure, setFailure] = useState<string | null>(null);
  const schema = useMemo(() => buildSchemas(t).signIn, [t]);
  const { control, handleSubmit, formState } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  const onSubmit = handleSubmit(async (v) => {
    setFailure(null);
    try {
      const user = await signIn(v.email, v.password);
      clearExpired();
      router.replace(safeNext(next) ?? homeFor(user.role));
    } catch (error) {
      setFailure(t(errorKey(error, 'auth')));
    }
  });

  return (
    <AuthLayout title={t('auth.signInTitle')} body={t('auth.signInBody')}>
      {sessionExpired ? (
        <Text variant="small" weight="medium" color={colors.amberText} style={{ backgroundColor: colors.amberSoft, padding: 12, borderRadius: 12 }}>
          {t('auth.sessionExpired')}
        </Text>
      ) : null}
      <FormField control={control} name="email" label={t('auth.email')} error={formState.errors.email?.message} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
      <FormField control={control} name="password" label={t('auth.password')} error={formState.errors.password?.message} password autoCapitalize="none" autoComplete="current-password" textContentType="password" />
      {failure ? (
        <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={{ backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 }}>
          {failure}
        </Text>
      ) : null}
      <Button size="lg" fullWidth loading={formState.isSubmitting} onPress={onSubmit}>
        {t('auth.submitSignIn')}
      </Button>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Button variant="ghost" onPress={() => router.push('/forgot-password')}>
          {t('auth.forgot')}
        </Button>
        <Text variant="small" color="muted">
          {t('auth.noAccount')}
        </Text>
        <Button variant="secondary" onPress={() => router.replace({ pathname: '/sign-up', params: next ? { next } : {} })}>
          {t('auth.submitSignUp')}
        </Button>
      </View>
    </AuthLayout>
  );
}
