import type { LucideIcon } from 'lucide-react-native';
import React from 'react';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

interface IconProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  /** Mirror in RTL (arrows, chevrons). Transforms are not auto-flipped by React Native. */
  directional?: boolean;
}

/** Thin wrapper so every icon shares defaults and directional icons mirror in Arabic. */
export function Icon({ icon: Glyph, size = 20, color = colors.ink, strokeWidth = 2, directional = false }: IconProps) {
  const { isRTL } = useI18n();
  return (
    <Glyph
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      style={directional && isRTL ? { transform: [{ scaleX: -1 }] } : undefined}
    />
  );
}
