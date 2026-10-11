import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Screen } from '@/components/layout/Screen';
import { Text } from '@/components/ui/Text';
import { ResourcesBrowser } from '@/features/browse/ResourcesBrowser';
import { NursesBrowser } from '@/features/browse/NursesBrowser';
import { ServicesBrowser } from '@/features/browse/ServicesBrowser';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';

type Tab = 'services' | 'nurses' | 'resources';

/** Patient "Explore" hub: services · nurses · resources behind one segmented control. */
export default function ExploreScreen() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>('services');
  const segment = (
    <View style={styles.segment}>
      {(
        [
          ['services', t('nav.services')],
          ['nurses', t('nav.findNurse')],
          ['resources', t('m.tabResources')],
        ] as const
      ).map(([id, label]) => (
        <Pressable key={id} onPress={() => setTab(id)} accessibilityRole="tab" accessibilityState={{ selected: tab === id }} style={[styles.item, tab === id && styles.active]}>
          <Text variant="label" color={tab === id ? colors.brandDark : colors.muted} numberOfLines={1}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
  return (
    <Screen scroll={false}>
      {tab === 'services' ? <ServicesBrowser header={segment} /> : tab === 'nurses' ? <NursesBrowser header={segment} /> : <ResourcesBrowser header={segment} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  segment: { flexDirection: 'row', backgroundColor: colors.neutralSoft, borderRadius: radii.full, padding: 4 },
  item: { flex: 1, height: 42, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  active: { backgroundColor: colors.white, ...shadows.soft },
});
