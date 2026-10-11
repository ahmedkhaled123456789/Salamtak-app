import { ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';
import { colors } from '@/theme/colors';
import { Text } from './Text';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

/** FAQ-style accordion (website: Radix accordion, hairline dividers, single item open). */
export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const [open, setOpen] = useState<string | undefined>(defaultOpen);
  return (
    <View style={styles.list}>
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <View key={item.id} style={styles.item}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: isOpen }}
              onPress={() => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setOpen(isOpen ? undefined : item.id);
              }}
              style={styles.head}
            >
              <Text variant="title" size={17} style={{ flex: 1 }}>
                {item.title}
              </Text>
              <View style={{ transform: [{ rotate: isOpen ? '180deg' : '0deg' }] }}>
                <ChevronDown size={20} color={colors.brand} />
              </View>
            </Pressable>
            {isOpen ? <View style={styles.body}>{item.content}</View> : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { borderTopWidth: 1, borderTopColor: colors.line },
  item: { borderBottomWidth: 1, borderBottomColor: colors.line },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 64, paddingVertical: 14 },
  body: { paddingBottom: 20 },
});
