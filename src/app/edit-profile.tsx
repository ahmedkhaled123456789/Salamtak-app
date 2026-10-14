import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { RequireAuth } from '@/components/layout/RequireAuth';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { SelectField } from '@/components/ui/SelectField';
import { emirates, findEmirate } from '@/data/emirates';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { usePatientProfile, useUpdateProfile } from '@/hooks/useAccount';
import { useI18n } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { buildSchemas } from '@/lib/validation';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';

interface Values {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
}

export default function EditProfileScreen() {
  return (
    <RequireAuth>
      <EditProfile />
    </RequireAuth>
  );
}

function EditProfile() {
  const { t, l } = useI18n();
  const { user } = useAuth();
  const isPatient = user?.role === 'PATIENT';
  const { data: profile } = usePatientProfile(isPatient);
  const update = useUpdateProfile();
  const [saved, setSaved] = useState(false);
  const schema = useMemo(() => buildSchemas(t).profile, [t]);
  const { control, handleSubmit, formState, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', address: '', city: '' },
  });
  useEffect(() => {
    if (profile) reset({ firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', address: profile.address ?? '', city: findEmirate(profile.city)?.name.en ?? profile.city ?? '' });
  }, [profile, user?.firstName, user?.lastName, reset]);
  const e = formState.errors;

  const onSubmit = handleSubmit((v) => {
    setSaved(false);
    update.mutate({ ...v, patient: isPatient }, { onSuccess: () => setSaved(true) });
  });

  return (
    <Screen header="back" title={t('m.editProfile')} keyboard contentStyle={{ padding: 20, paddingBottom: 48, gap: 16 }}>
      <Text variant="title">{t('account.personal')}</Text>
      <FormField control={control} name="firstName" label={t('auth.firstName')} error={e.firstName?.message} />
      <FormField control={control} name="lastName" label={t('auth.lastName')} error={e.lastName?.message} />
      <TextField label={t('auth.email')} value={user?.email ?? ''} editable={false} hint={t('m.readOnlyHint')} />
      <TextField label={t('account.phone')} value={user?.phone ?? ''} editable={false} hint={t('m.phoneVerifiedHint')} />
      {isPatient ? (
        <>
          <Text variant="title" style={{ marginTop: 8 }}>
            {t('account.contactDetails')}
          </Text>
          <FormField control={control} name="address" label={t('booking.address')} error={e.address?.message} placeholder={t('booking.addressPlaceholder')} />
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <SelectField
                label={t('account.city')}
                sheetTitle={t('account.city')}
                value={field.value}
                onChange={field.onChange}
                error={e.city?.message}
                options={[
                  ...emirates.map((em) => ({ value: em.name.en, label: l(em.name) })),
                  // keep a previously typed city selectable instead of silently dropping it
                  ...(field.value && !emirates.some((em) => em.name.en === field.value) ? [{ value: field.value, label: field.value }] : []),
                ]}
              />
            )}
          />
        </>
      ) : null}
      {update.isError ? (
        <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert" style={{ backgroundColor: colors.coralSoft, padding: 12, borderRadius: 12 }}>
          {t(errorKey(update.error))}
        </Text>
      ) : null}
      {saved ? (
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }} accessibilityLiveRegion="polite">
          <CheckCircle2 size={18} color={colors.brandDark} />
          <Text variant="body" color={colors.brandDark}>
            {t('account.saved')}
          </Text>
        </View>
      ) : null}
      <Button size="lg" fullWidth loading={update.isPending} onPress={onSubmit}>
        {t('common.save')}
      </Button>
      <Button variant="ghost" fullWidth onPress={() => router.back()}>
        {t('common.back')}
      </Button>
    </Screen>
  );
}
