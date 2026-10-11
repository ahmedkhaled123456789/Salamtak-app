import { router } from 'expo-router';
import { Languages, MapPin } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Badge } from '@/components/ui/Badge';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { shadows } from '@/theme/shadows';
import type { Nurse } from '@/types/nurse';

export function NursePortrait({ nurse, aspectRatio, radius, size }: { nurse: Nurse; aspectRatio?: number; radius: number; size?: number }) {
  const { l } = useI18n();
  const name = l(nurse.name);
  if (nurse.portrait) {
    return <SmartImage src={nurse.portrait} alt={name} aspectRatio={aspectRatio} radius={radius} position="50% 20%" width={size} height={size} />;
  }
  const initials = name
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('');
  return (
    <View style={{ aspectRatio, width: size, height: size, borderRadius: radius, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel={name}>
      <Text variant="h3" color={colors.brandDark}>
        {initials}
      </Text>
    </View>
  );
}

interface NurseCardProps {
  nurse: Nurse;
  selected?: boolean;
  onSelect?: () => void;
  actionLabel?: string;
  style?: StyleProp<ViewStyle>;
}

/** Website NurseCard. In selection mode (booking wizard) it behaves like a radio. */
export function NurseCard({ nurse, selected, onSelect, actionLabel, style }: NurseCardProps) {
  const { t, l, money } = useI18n();
  const { services } = useCatalogData();
  const offered = services.filter((s) => nurse.serviceIds.includes(s.id)).slice(0, 3);
  const selectable = Boolean(onSelect);
  const open = () => router.push({ pathname: '/nurses/[id]', params: { id: nurse.id } });
  return (
    <Pressable
      accessibilityRole={selectable ? 'radio' : 'button'}
      accessibilityState={{ selected: Boolean(selected) }}
      accessibilityLabel={l(nurse.name)}
      onPress={selectable ? onSelect : open}
      style={({ pressed }) => [
        styles.card,
        selected ? styles.selected : null,
        !selected && !selectable ? shadows.none : null,
        pressed && { opacity: 0.9 },
        style,
      ]}
    >
      <View>
        <NursePortrait nurse={nurse} aspectRatio={4 / 5} radius={18} />
        <View style={styles.pill}>
          <Badge tone="white" icon={<View style={styles.dot} />}>
            {t('common.available')}
          </Badge>
        </View>
      </View>
      <View style={styles.body}>
        <Text variant="small" weight="medium" color={colors.brand}>
          {l(nurse.role)}
        </Text>
        <Text variant="title" numberOfLines={1} style={{ marginTop: 2 }}>
          {l(nurse.name)}
        </Text>
        <View style={styles.meta}>
          {nurse.languages.length ? (
            <View style={styles.metaRow}>
              <Languages size={14} color={colors.muted} />
              <Text variant="small" color="muted" numberOfLines={1} style={{ flex: 1 }}>
                {nurse.languages.map(l).join(' · ')}
              </Text>
            </View>
          ) : null}
          <View style={styles.metaRow}>
            <MapPin size={14} color={colors.muted} />
            <Text variant="small" color="muted" numberOfLines={1} style={{ flex: 1 }}>
              {l(nurse.city)}
              {nurse.experienceYears !== undefined ? ` · ${t('common.experience', { n: nurse.experienceYears })}` : ''}
            </Text>
          </View>
        </View>
        {offered.length ? (
          <View style={styles.tags}>
            {offered.map((s) => (
              <View key={s.id} style={styles.tag}>
                <Text variant="caption" weight="medium" numberOfLines={1}>
                  {l(s.title)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
        <View style={styles.foot}>
          {nurse.dailyRateSample !== undefined ? (
            <Text variant="small" color="muted">
              <Text variant="body" weight="bold">
                {money(nurse.dailyRateSample)}
              </Text>{' '}
              {t('common.perDay')}
            </Text>
          ) : (
            <View />
          )}
          {selectable ? (
            <View style={[styles.choose, selected && { backgroundColor: colors.brand, borderColor: colors.brand }]}>
              <Text variant="label" color={selected ? colors.white : colors.ink}>
                {actionLabel ?? ''}
              </Text>
            </View>
          ) : (
            <Text variant="label" color={colors.brand}>
              {t('common.viewProfile')}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, padding: 12 },
  selected: { borderColor: colors.brand, borderWidth: 2, padding: 11 },
  pill: { position: 'absolute', top: 10, start: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.brand },
  body: { paddingHorizontal: 6, paddingTop: 14, paddingBottom: 4 },
  meta: { marginTop: 10, gap: 6 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tag: { backgroundColor: colors.ivory, borderRadius: radii.full, paddingHorizontal: 10, paddingVertical: 4, maxWidth: '100%' },
  foot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, gap: 8 },
  choose: { height: 38, paddingHorizontal: 16, borderRadius: radii.full, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' },
});
