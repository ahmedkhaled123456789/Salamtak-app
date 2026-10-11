import { CircleAlert, Inbox, WifiOff } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ApiError } from '@/api/client';
import { useI18n } from '@/i18n';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';
import { Button } from './Button';
import { Text } from './Text';

interface StateMessageProps {
  kind?: 'empty' | 'error' | 'offline';
  title: string;
  body?: string;
  actionLabel?: string;
  onAction?: () => void;
  compact?: boolean;
}

/** Empty / error / offline panel with an optional retry action — used by every data screen. */
export function StateMessage({ kind = 'empty', title, body, actionLabel, onAction, compact }: StateMessageProps) {
  const tone = kind === 'error' ? colors.coral : colors.brand;
  const Glyph = kind === 'error' ? CircleAlert : kind === 'offline' ? WifiOff : Inbox;
  return (
    <View style={[styles.box, compact && { paddingVertical: 28 }]} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <View style={[styles.disc, { backgroundColor: kind === 'error' ? colors.coralSoft : colors.mint }]}>
        <Glyph size={26} color={tone} strokeWidth={1.8} />
      </View>
      <Text variant="title" align="center" style={styles.title}>
        {title}
      </Text>
      {body ? (
        <Text variant="body" color="muted" align="center" style={styles.body}>
          {body}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <Button onPress={onAction} variant={kind === 'error' ? 'primary' : 'secondary'}>
            {actionLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

/** Query error → panel; network failures read as "offline", 403 hides the retry. */
export function QueryError({ error, onRetry, compact }: { error: unknown; onRetry?: () => void; compact?: boolean }) {
  const { t } = useI18n();
  const offline = error instanceof ApiError && (error.code === 'network' || error.code === 'timeout' || error.code === 'not_configured');
  const forbidden = error instanceof ApiError && error.code === 'forbidden';
  return (
    <StateMessage
      compact={compact}
      kind={offline ? 'offline' : 'error'}
      title={offline ? t('m.offlineTitle') : forbidden ? t('m.forbiddenTitle') : t('common.errorTitle')}
      body={offline ? t('m.offlineBody') : forbidden ? t('m.forbiddenBody') : t('common.errorBody')}
      actionLabel={forbidden ? undefined : t('common.retry')}
      onAction={forbidden ? undefined : onRetry}
    />
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24, backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line },
  disc: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  title: { marginTop: 16 },
  body: { marginTop: 8, maxWidth: 320 },
  action: { marginTop: 20, alignSelf: 'center' },
});
