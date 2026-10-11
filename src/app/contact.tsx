import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, CheckCircle2, Mail, Phone } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { z } from 'zod';
import { PageHero } from '@/components/layout/PageHero';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

interface Values {
  name: string;
  email: string;
  message: string;
}

/** No contact endpoint exists in the backend: the form validates and says plainly that nothing was sent. */
export default function ContactScreen() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);
  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().min(2, t('validation.nameMin')),
        email: z.string().trim().email(t('validation.email')),
        message: z.string().trim().min(20, t('validation.messageMin')),
      }),
    [t],
  );
  const { control, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', message: '' } });
  const e = formState.errors;
  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
    reset();
  });
  return (
    <Screen header="back" title={t('nav.contact')} keyboard>
      <PageHero title={t('contactPage.title')} body={t('contactPage.body')} />
      <View style={{ padding: 20, gap: 16, paddingBottom: 48 }}>
        <View style={{ backgroundColor: colors.white, borderRadius: radii.card, borderWidth: 1, borderColor: colors.line, padding: 20, gap: 16 }}>
          <FormField control={control} name="name" label={t('contactPage.name')} error={e.name?.message} autoComplete="name" />
          <FormField control={control} name="email" label={t('contactPage.email')} error={e.email?.message} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
          <FormField control={control} name="message" label={t('contactPage.message')} error={e.message?.message} multiline />
          {sent ? (
            <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }} accessibilityLiveRegion="polite">
              <CheckCircle2 size={18} color={colors.brandDark} />
              <Text variant="small" color={colors.brandDark} style={{ flex: 1 }}>
                {t('contactPage.success')}
              </Text>
            </View>
          ) : null}
          <Button size="lg" fullWidth loading={formState.isSubmitting} onPress={onSubmit}>
            {t('contactPage.send')}
          </Button>
        </View>
        <View style={{ gap: 12 }}>
          <Text variant="title">{t('contactPage.detailsTitle')}</Text>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Mail size={18} color={colors.brand} />
            <Text variant="body" color="muted">
              {t('footer.contactEmail')}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Phone size={18} color={colors.brand} />
            <Text variant="body" color="muted">
              {t('footer.contactPhone')}
            </Text>
          </View>
          <Text variant="small" color="muted">
            {t('footer.contactNote')}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 12, backgroundColor: colors.coralSoft, borderRadius: radii['2xl'], padding: 16 }}>
          <AlertTriangle size={20} color={colors.coral} />
          <Text variant="small" color={colors.coralText} style={{ flex: 1 }}>
            {t('contactPage.emergency')}
          </Text>
        </View>
      </View>
    </Screen>
  );
}
