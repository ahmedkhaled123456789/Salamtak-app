import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, TextInput, View } from 'react-native';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { fontFamily } from '@/theme/typography';

const schema = z.object({ email: z.string().trim().email() });
type Values = z.infer<typeof schema>;

/**
 * The backend has no subscription endpoint: the address is validated and the user is told plainly that it was
 * not saved (same behaviour as the website's demonstration form).
 */
export function NewsletterForm({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const { t, locale, isRTL } = useI18n();
  const [done, setDone] = useState(false);
  const { control, handleSubmit, formState, reset } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { email: '' } });
  const light = tone === 'light';
  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 350));
    setDone(true);
    reset();
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
          <Text variant="small" color={light ? '#FFC9B8' : colors.coral}>
            {t('validation.email')}
          </Text>
        ) : done ? (
          <View style={styles.done}>
            <CheckCircle2 size={16} color={light ? colors.mint : colors.brandDark} />
            <Text variant="small" color={light ? colors.mint : colors.brandDark} style={{ flex: 1 }}>
              {t('newsletter.success')}
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
