import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { inboxApi } from '@/api/inbox';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { fontFamily } from '@/theme/typography';

const schema = z.object({ email: z.string().trim().email() });
type Values = z.infer<typeof schema>;

/** Newsletter sign-up → POST /public/newsletter (double opt-in: the API emails a confirmation link). */
export function NewsletterForm({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { t, locale, isRTL } = useI18n();
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const { control, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '' } });
  const light = tone === 'light';
  const onSubmit = async (v: Values) => {
    setFailed(false);
    try {
      await inboxApi.subscribeNewsletter(v.email.trim(), locale);
      setDone(true);
      reset();
    } catch {
      setFailed(true); // keep the address so the user can retry
    }
  };
  return (
    <View>
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextInput
            value={field.value}
            onChangeText={(v) => {
              setDone(false);
              field.onChange(v);
            }}
            onBlur={field.onBlur}
            accessibilityLabel={t('newsletter.label')}
            placeholder={t('newsletter.placeholder')}
            placeholderTextColor={light ? 'rgba(255,255,255,0.6)' : colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={[
              styles.input,
              { fontFamily: fontFamily(locale, 'regular'), textAlign: isRTL ? 'right' : 'left' },
              light
                ? { borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.1)', color: colors.white }
                : { borderColor: colors.line, backgroundColor: colors.white, color: colors.ink },
            ]}
          />
        )}
      />
      <View style={{ marginTop: 10 }}>
        <Button size="lg" fullWidth variant={light ? 'light' : 'primary'} loading={formState.isSubmitting} onPress={handleSubmit(onSubmit)}>
          {t('newsletter.submit')}
        </Button>
      </View>
      <View style={styles.msg} accessibilityLiveRegion="polite">
        {formState.errors.email ? (
          <Text variant="small" color={light ? '#FFC9B8' : colors.coralText}>
            {t('validation.email')}
          </Text>
        ) : failed ? (
          <Text variant="small" color={light ? '#FFC9B8' : colors.coralText} accessibilityRole="alert">
            {t('newsletter.error')}
          </Text>
        ) : done ? (
          <View style={styles.done}>
            <CheckCircle2 size={16} color={light ? colors.mint : colors.brandDark} />
            <Text variant="small" color={light ? colors.mint : colors.brandDark} style={{ flex: 1 }}>
              {t('newsletter.successLive')}
            </Text>
          </View>
        ) : (
          <Text variant="small" color={light ? 'rgba(255,255,255,0.6)' : colors.muted}>
            {t('newsletter.privacy')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: { height: 50, borderWidth: 1, borderRadius: radii.full, paddingHorizontal: 20, fontSize: 15 },
  msg: { marginTop: 10, minHeight: 20 },
  done: { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
});
