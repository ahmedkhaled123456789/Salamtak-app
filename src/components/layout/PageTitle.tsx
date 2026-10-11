import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';

/** Page hero for list/detail screens (website: PageHero) — serif headline + muted intro. */
export function PageTitle({ title, body }: { title: string; body?: string }) {
  return (
    <View>
      <Text variant="h1" accessibilityRole="header">
        {title}
      </Text>
      {body ? (
        <Text variant="bodyLg" color="muted" style={{ marginTop: 12 }}>
          {body}
        </Text>
      ) : null}
    </View>
  );
}
