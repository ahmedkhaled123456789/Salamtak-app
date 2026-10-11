import React from 'react';
import { FlatList, StyleSheet, View, useWindowDimensions, type ListRenderItem } from 'react-native';
import { spacing } from '@/theme/spacing';

interface CarouselProps<T> {
  data: readonly T[];
  keyExtractor: (item: T) => string;
  renderItem: ListRenderItem<T>;
  /** Card width as a fraction of the screen width (default 0.78) or a fixed number of dp. */
  itemWidth?: number;
  gap?: number;
}

/** Horizontal snap carousel that bleeds to the screen edges (website: snap-x overflow rows). Direction follows the layout (RTL-safe). */
export function Carousel<T>({ data, keyExtractor, renderItem, itemWidth = 0.78, gap = 16 }: CarouselProps<T>) {
  const { width } = useWindowDimensions();
  const w = itemWidth <= 1 ? Math.round(width * itemWidth) : itemWidth;
  return (
    <FlatList
      horizontal
      data={data as T[]}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      snapToInterval={w + gap}
      snapToAlignment="start"
      decelerationRate="fast"
      contentContainerStyle={{ paddingHorizontal: spacing.gutter, gap }}
      renderItem={(info) => <View style={[styles.item, { width: w }]}>{renderItem(info) as React.ReactElement}</View>}
    />
  );
}

const styles = StyleSheet.create({ item: { flexShrink: 0 } });
