import { router } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions, type ViewToken } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/ui/Logo';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { images } from '@/data/images';
import { useI18n, type TranslationKey } from '@/i18n';
import { setItem } from '@/lib/storage';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

const slides: { img: string; title: TranslationKey; body: TranslationKey; alt: { en: string; ar: string } }[] = [
  { img: images.hero, title: 'hero.title1', body: 'hero.body', alt: { en: 'Nurse kneeling beside an older woman', ar: 'ممرضة تجثو بجانب سيدة مسنّة' } },
  { img: images.stageOlder, title: 'm.onboardTitle2', body: 'm.onboardBody2', alt: { en: 'Older couple at home with a caregiver', ar: 'زوجان مسنّان في المنزل مع مقدّمة رعاية' } },
  { img: images.whyMain, title: 'm.onboardTitle3', body: 'm.onboardBody3', alt: { en: 'Nurse holding a tablet', ar: 'ممرضة تحمل جهازاً لوحياً' } },
];

/** First-launch welcome (3 slides). Shown once; "Skip" and "Get started" both mark it as seen. */
export default function WelcomeScreen() {
  const { t, l } = useI18n();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList>(null);
  const onView = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems[0]?.index;
    if (first != null) setIndex(first);
  }, []);

  const finish = async (to: '/' | '/sign-in') => {
    await setItem('careflow.onboarded', '1');
    router.replace(to);
  };
  const last = index === slides.length - 1;

  return (
    <View style={[styles.root, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 16) }]}>
      <View style={styles.top}>
        <Logo link={false} />
        <LanguageSwitch />
      </View>
      <FlatList
        ref={list}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.title}
        onViewableItemsChanged={onView}
        viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
        style={{ flex: 1 }}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: 20, paddingTop: 16 }}>
            <SmartImage src={item.img} alt={l(item.alt)} aspectRatio={4 / 4.2} radius={radii.hero} position="40% 40%" />
            <Text variant="h1" size={36} style={{ marginTop: 24 }} accessibilityRole="header">
              {t(item.title)}
            </Text>
            <Text variant="bodyLg" color="muted" style={{ marginTop: 12 }}>
              {t(item.body)}
            </Text>
          </View>
        )}
      />
      <View style={styles.dots} accessibilityRole="progressbar">
        {slides.map((s, i) => (
          <View key={s.title} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
      <View style={{ paddingHorizontal: 20, gap: 10 }}>
        {last ? (
          <>
            <Button size="lg" fullWidth onPress={() => void finish('/')}>
              {t('m.getStarted')}
            </Button>
            <Button size="lg" fullWidth variant="secondary" onPress={() => void finish('/sign-in')}>
              {t('common.signIn')}
            </Button>
          </>
        ) : (
          <>
            <Button size="lg" fullWidth onPress={() => list.current?.scrollToIndex({ index: index + 1 })}>
              {t('common.continue')}
            </Button>
            <Button size="lg" fullWidth variant="ghost" onPress={() => void finish('/')}>
              {t('m.skip')}
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ivory },
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginVertical: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.lineStrong },
  dotActive: { width: 24, backgroundColor: colors.brand },
});
