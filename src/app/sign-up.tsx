import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { Check } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';
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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirm: string;
  terms: boolean;
}

export default function SignUpScreen() {
  const { t } = useI18n();
  const { signUp } = useAuth();
  const { next } = useLocalSearchParams<{ next?: string }>();
  const [failure, setFailure] = useState<string | null>(null);
  const schema = useMemo(() => buildSchemas(t).signUp, [t]);
  const { control, handleSubmit, formState } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '', confirm: '', terms: false },
  });
  const e = formState.errors;

  const onSubmit = handleSubmit(async (v) => {
    setFailure(null);
    try {
      const user = await signUp({ firstName: v.firstName.trim(), lastName: v.lastName.trim(), email: v.email.trim(), phone: v.phone.trim(), password: v.password, role: 'PATIENT' });
      router.replace(safeNext(next) ?? homeFor(user.role));
    } catch (error) {
      setFailure(t(errorKey(error, 'auth')));
    }
  });

  return (
    <AuthLayout title={t('auth.signUpTitle')} body={t('auth.signUpBody')}>
      <FormField control={control} name="firstName" label={t('auth.firstName')} error={e.firstName?.message} autoComplete="given-name" textContentType="givenName" />
      <FormField control={control} name="lastName" label={t('auth.lastName')} error={e.lastName?.message} autoComplete="family-name" textContentType="familyName" />
      <FormField control={control} name="email" label={t('auth.email')} error={e.email?.message} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoComplete="email" textContentType="emailAddress" />
      <FormField control={control} name="phone" label={t('auth.phone')} hint="+971501234567" error={e.phone?.message} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
      <FormField control={control} name="password" label={t('auth.password')} error={e.password?.message} password autoCapitalize="none" autoComplete="new-password" textContentType="newPassword" />
      <FormField control={control} name="confirm" label={t('auth.confirmPassword')} error={e.confirm?.message} password autoCapitalize="none" autoComplete="new-password" />
      <Controller
        control={control}
        name="terms"
        render={({ field }) => (
          <View>
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: field.value }}
              onPress={() => field.onChange(!field.value)}
              style={styles.terms}
              hitSlop={6}
            >
              <View style={[styles.box, field.value && { backgroundColor: colors.brand, borderColor: colors.brand }]}>{field.value ? <Check size={14} color={colors.white} strokeWidth={3} /> : null}</View>
              <Text variant="body" style={{ flex: 1 }}>
                {t('auth.terms')}
              </Text>
            </Pressable>
            {e.terms ? (
              <Text variant="small" weight="medium" color={colors.coral} style={{ marginTop: 6 }}>
                {e.terms.message}
              </Text>
            ) : null}
          </View>
        )}
      />
      {failure ? (
        <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={{ backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 }}>
          {failure}
        </Text>
      ) : null}
      <Button size="lg" fullWidth loading={formState.isSubmitting} onPress={onSubmit}>
        {t('auth.submitSignUp')}
      </Button>
      <View style={{ alignItems: 'center', gap: 4 }}>
        <Text variant="small" color="muted">
          {t('auth.haveAccount')}
        </Text>
        <Button variant="secondary" onPress={() => router.replace({ pathname: '/sign-in', params: next ? { next } : {} })}>
          {t('auth.submitSignIn')}
        </Button>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  terms: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 44 },
  box: { width: 24, height: 24, borderRadius: 7, borderWidth: 1.5, borderColor: colors.lineStrong, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
});
