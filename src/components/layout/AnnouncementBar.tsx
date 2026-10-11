import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '@/components/ui/Icons';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';

/** brand-deep strip above the header, as on the website. */
export function AnnouncementBar() {
  const { t } = useI18n();
  return (
    <View style={styles.bar}>
      <Text variant="small" color="rgba(255,255,255,0.85)" numberOfLines={1} style={{ flexShrink: 1 }}>
        {t('announcement.text')}
      </Text>
      <Pressable accessibilityRole="link" onPress={() => router.navigate('/services')} style={styles.link} hitSlop={8}>
        <Text variant="small" weight="semibold" color={colors.mint}>
          {t('announcement.link')}
        </Text>
        <Icon icon={ArrowRight} size={14} color={colors.mint} directional />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.brandDeep, paddingHorizontal: 16, minHeight: 40, paddingVertical: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' },
  link: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
