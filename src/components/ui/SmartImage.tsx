import { Image } from 'expo-image';
import { ImageOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { StyleSheet, View, type DimensionValue, type StyleProp, type ViewStyle } from 'react-native';
import { resolveImage } from '@/assets/imageMap';
import { colors } from '@/theme/colors';

interface SmartImageProps {
  /** Website path ("/uuid.jpg"), backend/remote URL. */
  src: string | null | undefined;
  alt: string;
  aspectRatio?: number;
  radius?: number;
  /** CSS-like object-position, e.g. "40% 50%" or "50% 20%". */
  position?: string;
  width?: DimensionValue;
  height?: DimensionValue;
  priority?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

function parsePosition(position?: string): { left: `${number}%`; top: `${number}%` } {
  const [x = '50%', y = '50%'] = (position ?? '50% 50%').split(' ');
  return { left: x as `${number}%`, top: y as `${number}%` };
}

/** Photo with a mint placeholder, a graceful fallback when the picture is missing/unreachable, and an accessibility label. */
export function SmartImage({ src, alt, aspectRatio, radius = 0, position, width, height, priority, style, children }: SmartImageProps) {
  const [failed, setFailed] = useState(false);
  const source = resolveImage(src);
  return (
    <View
      style={[
        styles.box,
        { borderRadius: radius, aspectRatio, width: width ?? undefined, height: height ?? undefined },
        style,
      ]}
    >
      {source && !failed ? (
        <Image
          source={source}
          accessibilityLabel={alt}
          accessible
          contentFit="cover"
          contentPosition={parsePosition(position)}
          transition={180}
          priority={priority ? 'high' : 'normal'}
          recyclingKey={typeof src === 'string' ? src : undefined}
          onError={() => setFailed(true)}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={styles.fallback} accessibilityLabel={alt}>
          <ImageOff size={24} color={colors.brand} strokeWidth={1.6} />
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { overflow: 'hidden', backgroundColor: colors.mint },
  fallback: { position: 'absolute', top: 0, bottom: 0, start: 0, end: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mint },
});
