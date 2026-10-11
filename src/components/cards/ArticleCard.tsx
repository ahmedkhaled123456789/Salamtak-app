import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import type { Article } from '@/types/content';

export function ArticleCard({ article, layout = 'stacked', style }: { article: Article; layout?: 'stacked' | 'row'; style?: StyleProp<ViewStyle> }) {
  const { t, l, date } = useI18n();
  const row = layout === 'row';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={l(article.title)}
      onPress={() => router.push({ pathname: '/resources/[slug]', params: { slug: article.slug } })}
      style={({ pressed }) => [row ? styles.row : null, pressed && { opacity: 0.85 }, style]}
    >
      <SmartImage
        src={article.cover}
        alt={l(article.coverAlt)}
        aspectRatio={row ? 1 : 4 / 3}
        radius={radii['2xl']}
        width={row ? 112 : undefined}
        style={row ? { flexShrink: 0 } : undefined}
      />
      <View style={row ? { flex: 1 } : { paddingTop: 16 }}>
        <Text variant="small" weight="semibold" color={colors.brand}>
          {l(article.category)}
        </Text>
        <Text variant="h3" size={row ? 18 : 22} numberOfLines={row ? 3 : 3} style={{ marginTop: 4 }}>
          {l(article.title)}
        </Text>
        <Text variant="small" color="muted" style={{ marginTop: 8 }}>
          {date(article.date)} · {t('common.minRead', { n: article.readMinutes })}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
});
