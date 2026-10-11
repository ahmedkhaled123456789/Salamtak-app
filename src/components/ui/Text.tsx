import React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';
import { useI18n } from '@/i18n';
import { colors, type ColorName } from '@/theme/colors';
import { arabicLineBoost, fontFamily, variants, type TextVariant, type Weight } from '@/theme/typography';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: Weight;
  color?: ColorName | (string & {});
  /** Force the editorial serif (Newsreader) on/off regardless of variant. */
  display?: boolean;
  italic?: boolean;
  align?: TextStyle['textAlign'];
  size?: number;
}

/**
 * The one text primitive. Picks Manrope / Newsreader (EN) or IBM Plex Sans Arabic (AR) per weight,
 * because React Native needs a distinct font family for every weight.
 */
export function Text({ variant = 'body', weight, color = 'ink', display, italic, align, size, style, ...rest }: TextProps) {
  const { locale } = useI18n();
  const spec = variants[variant];
  const isDisplay = display ?? spec.display ?? false;
  const w = weight ?? spec.weight;
  const arabic = locale === 'ar';
  const fontSize = size ?? spec.size;
  const lineHeight = Math.round((size ? (size * spec.line) / spec.size : spec.line) * (arabic ? arabicLineBoost : 1));
  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: fontFamily(locale, w, isDisplay, italic),
          fontSize,
          lineHeight,
          letterSpacing: arabic ? 0 : spec.tracking ? (spec.tracking * fontSize) / spec.size : 0,
          color: color in colors ? colors[color as ColorName] : color,
          textAlign: align,
        },
        style,
      ]}
    />
  );
}
