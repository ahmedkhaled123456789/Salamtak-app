import React from 'react';
import { View } from 'react-native';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { radii } from '@/theme/radii';

/** Website PageHero adapted to mobile: photo banner, serif title, intro. */
export function PageHero({ title, body, image, imageAlt, children }: { title: string; body?: string; image?: string; imageAlt?: string; children?: React.ReactNode }) {
  return (
    <View style={{ padding: 20, paddingBottom: 28 }}>
      {image ? <SmartImage src={image} alt={imageAlt ?? ''} aspectRatio={16 / 10} radius={radii.hero} position="50% 35%" /> : null}
      <Text variant="h1" style={{ marginTop: image ? 24 : 4 }} accessibilityRole="header">
        {title}
      </Text>
      {body ? (
        <Text variant="bodyLg" color="muted" style={{ marginTop: 12 }}>
          {body}
        </Text>
      ) : null}
      {children ? <View style={{ marginTop: 16 }}>{children}</View> : null}
    </View>
  );
}
