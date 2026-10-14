import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { request } from '@/api/client';

/**
 * Push notifications (booking updates) through the Expo Push service — the backend sends with PUSH_PROVIDER=expo.
 * Permission is asked only at a meaningful moment (after a booking), never on first launch; registration also needs an
 * EAS project id (app.json `extra.eas.projectId`, set by `eas init`). Without one, push is skipped quietly.
 */
let registeredToken: string | null = null;

type NotificationsModule = typeof import('expo-notifications');
let loaded: Promise<NotificationsModule | null> | null = null;

/**
 * Loaded on first use, never at startup: Expo Go (SDK 53+) removed remote push on Android and throws as soon as
 * expo-notifications is imported. In Expo Go and on the web push is simply unavailable; development and store builds
 * get it as before.
 */
function notifications(): Promise<NotificationsModule | null> {
  if (Platform.OS === 'web' || Constants.executionEnvironment === ExecutionEnvironment.StoreClient) return Promise.resolve(null);
  loaded ??= import('expo-notifications')
    .then((N) => {
      N.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      return N;
    })
    .catch(() => null);
  return loaded;
}

function projectId(): string | undefined {
  const c = Constants as unknown as { expoConfig?: { extra?: { eas?: { projectId?: string } } }; easConfig?: { projectId?: string } };
  return c.expoConfig?.extra?.eas?.projectId ?? c.easConfig?.projectId;
}

export type PushResult = 'registered' | 'denied' | 'unsupported' | 'not-configured' | 'failed';

/** `ask: false` registers only if the user already granted permission earlier. Never throws. */
export async function registerForPush({ ask }: { ask: boolean }): Promise<PushResult> {
  try {
    if (Platform.OS === 'web' || !Device.isDevice) return 'unsupported';
    const id = projectId();
    if (!id) return 'not-configured';
    const Notifications = await notifications();
    if (!Notifications) return 'unsupported';
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('bookings', {
        name: 'Booking updates',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }
    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted' && ask) status = (await Notifications.requestPermissionsAsync()).status;
    if (status !== 'granted') return 'denied';
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: id })).data;
    await request('/devices', {
      method: 'POST',
      body: { token, platform: Platform.OS === 'ios' ? 'IOS' : 'ANDROID', appVersion: Constants.expoConfig?.version },
    });
    registeredToken = token;
    return 'registered';
  } catch {
    return 'failed'; // push is a convenience: never block the app on it
  }
}

/** Call BEFORE signing out (needs the session): this device stops receiving the previous user's notifications. */
export async function unregisterPush(): Promise<void> {
  if (!registeredToken) return;
  const token = registeredToken;
  registeredToken = null;
  await request('/devices/unregister', { method: 'POST', body: { token } }).catch(() => undefined);
}
