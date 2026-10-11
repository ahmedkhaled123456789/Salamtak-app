import { Redirect, router, type Href } from 'expo-router';
import { Camera, ChevronRight, CircleHelp, FileText, KeyRound, LifeBuoy, LogOut, UserPen, CalendarClock } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LanguageSwitch } from '@/components/layout/LanguageSwitch';
import { Screen } from '@/components/layout/Screen';
import { Badge } from '@/components/ui/Badge';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { Icon } from '@/components/ui/Icons';
import { SmartImage } from '@/components/ui/SmartImage';
import { Text } from '@/components/ui/Text';
import { useUploadAvatar } from '@/hooks/useAccount';
import { useI18n } from '@/i18n';
import { errorKey } from '@/lib/errors';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

interface RowProps {
  icon: React.ComponentProps<typeof Icon>['icon'];
  label: string;
  href?: Href;
  onPress?: () => void;
  danger?: boolean;
}

function Row({ icon, label, href, onPress, danger }: RowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => (onPress ? onPress() : href ? router.push(href) : undefined)}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.mintSoft }]}
    >
      <Icon icon={icon} size={20} color={danger ? colors.coral : colors.brand} />
      <Text variant="body" weight="medium" color={danger ? colors.coralText : colors.ink} style={{ flex: 1 }}>
        {label}
      </Text>
      {!danger ? <Icon icon={ChevronRight} size={18} color={colors.muted} directional /> : null}
    </Pressable>
  );
}

/** Account hub for patients and nurses: profile, language, security, support, sign out. */
export default function ProfileScreen() {
  const { t } = useI18n();
  const { user, isAuthenticated, signOut } = useAuth();
  const upload = useUploadAvatar();
  const [confirmOut, setConfirmOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  if (!isAuthenticated || !user) return <Redirect href={{ pathname: '/sign-in', params: { next: '/profile' } }} />;
  const isNurse = user.role === 'NURSE';
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    const asset = result.canceled ? undefined : result.assets[0];
    if (!asset) return;
    const type = asset.mimeType ?? 'image/jpeg';
    const ext = type.split('/')[1] ?? 'jpg';
    upload.mutate({ uri: asset.uri, name: `avatar.${ext}`, type });
  };

  return (
    <Screen>
      <View style={{ padding: 20, paddingBottom: 48, gap: 24 }}>
        <View style={styles.head}>
          <Pressable onPress={() => void pickPhoto()} accessibilityRole="button" accessibilityLabel={t('account.changePhoto')} style={styles.avatarWrap}>
            {user.avatarUrl ? (
              <SmartImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} width={84} height={84} radius={42} />
            ) : (
              <View style={styles.avatar}>
                <Text variant="h2" size={28} color={colors.white}>
                  {initials}
                </Text>
              </View>
            )}
            <View style={styles.cam}>
              <Camera size={14} color={colors.white} />
            </View>
          </Pressable>
          <View style={{ flex: 1, gap: 4 }}>
            <Text variant="h3" size={24} numberOfLines={1}>
              {user.firstName} {user.lastName}
            </Text>
            <Text variant="small" color="muted" numberOfLines={1}>
              {user.email}
            </Text>
            <Badge tone={isNurse ? 'teal' : 'mint'}>{isNurse ? t('m.roleNurse') : t('m.rolePatient')}</Badge>
          </View>
        </View>
        {upload.isError ? (
          <Text variant="small" weight="medium" color={colors.coralText} accessibilityRole="alert">
            {t(errorKey(upload.error))}
          </Text>
        ) : (
          <Text variant="small" color="muted">
            {t('account.photoHint')}
          </Text>
        )}

        <View>
          <Text variant="label" color="muted" style={styles.group}>
            {t('account.personal')}
          </Text>
          <View style={styles.card}>
            <Row icon={UserPen} label={t('m.editProfile')} href="/edit-profile" />
            {isNurse ? <Row icon={CalendarClock} label={t('m.availability')} href="/availability" /> : null}
            <Row icon={KeyRound} label={t('m.changePassword')} href="/change-password" />
          </View>
        </View>

        <View>
          <Text variant="label" color="muted" style={styles.group}>
            {t('common.language')}
          </Text>
          <LanguageSwitch block />
        </View>

        <View>
          <Text variant="label" color="muted" style={styles.group}>
            {t('m.support')}
          </Text>
          <View style={styles.card}>
            <Row icon={CircleHelp} label={t('nav.faqs')} href="/faqs" />
            <Row icon={LifeBuoy} label={t('nav.contact')} href="/contact" />
            <Row icon={FileText} label={t('footer.privacy')} href={{ pathname: '/legal/[doc]', params: { doc: 'privacy' } }} />
            <Row icon={FileText} label={t('footer.terms')} href={{ pathname: '/legal/[doc]', params: { doc: 'terms' } }} />
          </View>
        </View>

        <View style={styles.card}>
          <Row icon={LogOut} label={t('common.signOut')} onPress={() => setConfirmOut(true)} danger />
        </View>
      </View>
      <ConfirmSheet
        visible={confirmOut}
        title={t('m.signOutTitle')}
        confirmLabel={t('common.signOut')}
        cancelLabel={t('common.cancel')}
        destructive
        loading={signingOut}
        onCancel={() => setConfirmOut(false)}
        onConfirm={() => {
          setSigningOut(true);
          void signOut().finally(() => {
            setSigningOut(false);
            setConfirmOut(false);
            router.replace('/');
          });
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarWrap: { width: 84, height: 84 },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.brand, alignItems: 'center', justifyContent: 'center' },
  cam: { position: 'absolute', bottom: 0, end: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.brandDark, borderWidth: 2, borderColor: colors.ivory, alignItems: 'center', justifyContent: 'center' },
  group: { marginBottom: 8, marginStart: 4 },
  card: { backgroundColor: colors.white, borderRadius: radii['3xl'], borderWidth: 1, borderColor: colors.line, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 56, paddingHorizontal: 18 },
});
