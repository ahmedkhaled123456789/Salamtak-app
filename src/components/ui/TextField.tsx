import { Eye, EyeOff } from 'lucide-react-native';
import React, { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { fontFamily } from '@/theme/typography';
import { Text } from './Text';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  hint?: string;
  multiline?: boolean;
  /** Password fields get a show/hide toggle. */
  password?: boolean;
}

/** Labelled input matching the website's `controlClass`: white, 12px radius, brand focus ring, coral on error. */
export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, error, hint, multiline, password, onFocus, onBlur, ...rest },
  ref,
) {
  const { t, locale, isRTL } = useI18n();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(Boolean(password));
  return (
    <View>
      <Text variant="label" style={styles.label}>
        {label}
      </Text>
      <View
        style={[
          styles.box,
          focused && { borderColor: colors.brand, shadowColor: colors.brand },
          error ? { borderColor: colors.coral } : null,
          multiline && { alignItems: 'flex-start' },
        ]}
      >
        <TextInput
          ref={ref}
          {...rest}
          multiline={multiline}
          secureTextEntry={password && hidden}
          placeholderTextColor={colors.muted}
          accessibilityLabel={label}
          accessibilityHint={error ?? hint}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            styles.input,
            { fontFamily: fontFamily(locale, 'regular'), textAlign: isRTL ? 'right' : 'left' },
            multiline && { minHeight: 96, textAlignVertical: 'top', paddingTop: 12 },
          ]}
        />
        {password ? (
          <Pressable
            onPress={() => setHidden((h) => !h)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={hidden ? t('auth.show') : t('auth.hide')}
            style={styles.eye}
          >
            {hidden ? <Eye size={20} color={colors.muted} /> : <EyeOff size={20} color={colors.muted} />}
          </Pressable>
        ) : null}
      </View>
      {error ? (
        <Text variant="small" weight="medium" color={colors.coral} style={styles.msg} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text variant="small" color="muted" style={styles.msg}>
          {hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  label: { marginBottom: 6 },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    shadowOpacity: 0,
  },
  input: { flex: 1, fontSize: 15, color: colors.ink, paddingVertical: 12, outlineWidth: 0 } as object,
  eye: { paddingStart: 8, height: 44, justifyContent: 'center' },
  msg: { marginTop: 6 },
});
