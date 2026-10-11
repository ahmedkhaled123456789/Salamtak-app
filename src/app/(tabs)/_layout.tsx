import { Redirect, Tabs } from 'expo-router';
import {
  BookOpen,
  CalendarCheck,
  Compass,
  House,
  LayoutDashboard,
  Stethoscope,
  UserRound,
  Wallet,
  type LucideIcon,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n, type TranslationKey } from '@/i18n';
import { getItem } from '@/lib/storage';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';
import { fontFamily } from '@/theme/typography';

type TabName = 'index' | 'services' | 'nurses' | 'resources' | 'account' | 'explore' | 'bookings' | 'profile' | 'dashboard' | 'earnings';

const ICONS: Record<TabName, LucideIcon> = {
  index: House,
  services: Stethoscope,
  nurses: UserRound,
  resources: BookOpen,
  account: UserRound,
  explore: Compass,
  bookings: CalendarCheck,
  profile: UserRound,
  dashboard: LayoutDashboard,
  earnings: Wallet,
};

const LABELS: Record<TabName, TranslationKey> = {
  index: 'nav.home',
  services: 'nav.services',
  nurses: 'm.tabNurses',
  resources: 'm.tabResources',
  account: 'm.tabAccount',
  explore: 'm.tabExplore',
  bookings: 'm.tabBookings',
  profile: 'nav.profile',
  dashboard: 'm.tabDashboard',
  earnings: 'm.tabEarnings',
};

// Declaration order = tab order for every audience.
const ALL: TabName[] = ['index', 'dashboard', 'services', 'nurses', 'resources', 'explore', 'account', 'bookings', 'earnings', 'profile'];

/** Which tabs exist for each audience. Hidden tabs stay routable (e.g. /nurses from a patient's home screen). */
function visibleTabs(role: string | undefined): TabName[] {
  if (!role) return ['index', 'services', 'nurses', 'resources', 'account'];
  if (role === 'NURSE') return ['dashboard', 'bookings', 'earnings', 'profile'];
  return ['index', 'explore', 'bookings', 'profile'];
}

const STAFF = new Set(['ADMIN', 'FINANCE_APPROVER']);

export default function TabsLayout() {
  const { t, locale } = useI18n();
  const { user, isAuthenticated } = useAuth();
  const insets = useSafeAreaInsets();
  const [onboarded, setOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    void getItem('careflow.onboarded').then((v) => setOnboarded(v === '1'));
  }, []);

  if (user && STAFF.has(user.role)) return <Redirect href="/staff-blocked" />;
  if (Platform.OS !== 'web' && onboarded === false && !isAuthenticated) return <Redirect href="/welcome" />;
  const visible = visibleTabs(isAuthenticated ? user?.role : undefined);

  return (
    <Tabs
      initialRouteName={visible[0]}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fontFamily(locale, 'semibold'), fontSize: 11 },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.line,
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 6),
          paddingTop: 6,
          ...(Platform.OS === 'web' ? { boxShadow: 'none' } : null),
        },
        sceneStyle: { backgroundColor: colors.ivory },
      }}
    >
      {ALL.map((name) => {
        const Glyph = ICONS[name];
        return (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              title: t(LABELS[name]),
              href: visible.includes(name) ? undefined : null,
              tabBarIcon: ({ color, size }) => <Glyph color={color} size={size - 2} strokeWidth={2} />,
            }}
          />
        );
      })}
    </Tabs>
  );
}
