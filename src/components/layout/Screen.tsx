import React from 'react';
import { KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { AppHeader, BackHeader } from './AppHeader';

interface ScreenProps {
  children: React.ReactNode;
  /** Branded tab-root header, a back header with a title, or none. */
  header?: 'brand' | 'back' | 'none';
  title?: string;
  headerRight?: React.ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Pinned bar above the safe-area bottom (booking CTAs). */
  footer?: React.ReactNode;
  background?: string;
  contentStyle?: StyleProp<ViewStyle>;
  keyboard?: boolean;
  testID?: string;
}

export function Screen({
  children,
  header = 'brand',
  title,
  headerRight,
  scroll = true,
  refreshing,
  onRefresh,
  footer,
  background = colors.ivory,
  contentStyle,
  keyboard = false,
  testID,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[{ paddingBottom: footer ? 24 : 0 }, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={onRefresh ? <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} tintColor={colors.brand} colors={[colors.brand]} /> : undefined}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );
  const content = (
    <View style={[styles.flex, { backgroundColor: background }]} testID={testID}>
      {header === 'brand' ? <AppHeader /> : header === 'back' ? <BackHeader title={title} right={headerRight} /> : <View style={{ height: insets.top }} />}
      {body}
      {footer ? <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>{footer}</View> : null}
    </View>
  );
  if (!keyboard) return content;
  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {content}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  footer: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.line },
});
