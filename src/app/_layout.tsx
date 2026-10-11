import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ApiError } from '@/api/client';
import { I18nProvider } from '@/i18n';
import { AuthProvider, useAuth } from '@/state/auth';
import { BookingDraftProvider } from '@/state/bookingDraft';
import { colors } from '@/theme/colors';
import { fontAssets } from '@/theme/fonts';
import { SafeAreaProvider } from 'react-native-safe-area-context';

void SplashScreen.preventAutoHideAsync();

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        // Don't hammer the API for failures a retry cannot fix.
        retry: (count, error) => !(error instanceof ApiError && error.status && error.status < 500) && count < 2,
      },
    },
  });
}

function Gate({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync();
  }, [status]);
  if (status === 'loading') return null;
  return <>{children}</>;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts(fontAssets);
  const [client] = useState(makeQueryClient);
  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={client}>
        <I18nProvider>
          <AuthProvider>
            <BookingDraftProvider>
              <Gate>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.ivory }, animation: 'slide_from_right' }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
                  <Stack.Screen name="book" options={{ presentation: 'card' }} />
                </Stack>
              </Gate>
            </BookingDraftProvider>
          </AuthProvider>
        </I18nProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
