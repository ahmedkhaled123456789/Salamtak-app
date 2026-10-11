import { Redirect } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { Skeleton } from '@/components/ui/Skeleton';
import { QueryError, StateMessage } from '@/components/ui/StateMessage';
import { Text } from '@/components/ui/Text';
import { useWallet, useWalletTransactions } from '@/hooks/useAccount';
import { useI18n, type TranslationKey } from '@/i18n';
import { useAuth } from '@/state/auth';
import { colors } from '@/theme/colors';
import { radii } from '@/theme/radii';

const TYPE_KEYS: Record<string, TranslationKey> = {
  EARNING: 'm.txEARNING',
  RELEASE: 'm.txRELEASE',
  REVERSAL: 'm.txREVERSAL',
  REFUND: 'm.txREFUND',
  ADJUSTMENT: 'm.txADJUSTMENT',
  PAYOUT: 'm.txPAYOUT',
  PAYOUT_SETTLED: 'm.txPAYOUT_SETTLED',
  PAYOUT_REVERSAL: 'm.txPAYOUT_REVERSAL',
  COMMISSION: 'm.txCOMMISSION',
};

/** Wallet figures and ledger come straight from /wallets/me — the nurse sees only their own money. */
export default function EarningsScreen() {
  const { user } = useAuth();
  if (user?.role !== 'NURSE') return <Redirect href="/" />;
  return <Earnings />;
}

function Earnings() {
  const { t, money, date, time } = useI18n();
  const wallet = useWallet();
  const tx = useWalletTransactions();
  const cur = wallet.data?.currency ?? 'AED';
  return (
    <Screen scroll={false}>
      <FlatList
        data={tx.data ?? []}
        keyExtractor={(x) => x.id}
        contentContainerStyle={styles.content}
        refreshing={wallet.isRefetching || tx.isRefetching}
        onRefresh={() => {
          void wallet.refetch();
          void tx.refetch();
        }}
        ListHeaderComponent={
          <View style={{ gap: 16, marginBottom: 24 }}>
            <PageTitle title={t('m.tabEarnings')} body={t('m.earningsBody')} />
            {wallet.isLoading ? (
              <Skeleton height={190} radius={24} />
            ) : wallet.isError ? (
              <QueryError error={wallet.error} onRetry={() => void wallet.refetch()} compact />
            ) : wallet.data ? (
              <>
                <View style={styles.hero}>
                  <Text variant="small" color="rgba(255,255,255,0.7)">
                    {t('m.availableBalance')}
                  </Text>
                  <Text variant="price" size={38} color={colors.white} style={{ marginTop: 4 }}>
                    {money(wallet.data.available, cur)}
                  </Text>
                  <Text variant="small" color="rgba(255,255,255,0.7)" style={{ marginTop: 8 }}>
                    {t('m.pendingBalance')}: {money(wallet.data.pending, cur)}
                  </Text>
                </View>
                <View style={styles.pair}>
                  <View style={styles.small}>
                    <Text variant="small" color="muted">
                      {t('m.totalEarned')}
                    </Text>
                    <Text variant="title">{money(wallet.data.totalEarned, cur)}</Text>
                  </View>
                  <View style={styles.small}>
                    <Text variant="small" color="muted">
                      {t('m.totalWithdrawn')}
                    </Text>
                    <Text variant="title">{money(wallet.data.totalWithdrawn, cur)}</Text>
                  </View>
                </View>
              </>
            ) : null}
            <Text variant="h3" size={22}>
              {t('m.ledger')}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.line }} />}
        renderItem={({ item }) => (
          <View style={styles.tx}>
            <View style={{ flex: 1 }}>
              <Text variant="body" weight="semibold">
                {TYPE_KEYS[item.type] ? t(TYPE_KEYS[item.type]!) : item.type}
              </Text>
              <Text variant="small" color="muted">
                {date(item.createdAt)} · {time(item.createdAt)}
              </Text>
            </View>
            <Text variant="body" weight="bold" color={item.amount >= 0 ? colors.brandDark : colors.coralText}>
              {money(item.amount, cur)}
            </Text>
          </View>
        )}
        ListEmptyComponent={tx.isLoading ? <Skeleton height={60} /> : tx.isError ? <QueryError error={tx.error} onRetry={() => void tx.refetch()} compact /> : <StateMessage title={t('m.noTransactions')} compact />}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingBottom: 48 },
  hero: { backgroundColor: colors.brandDeep, borderRadius: radii.card, padding: 24 },
  pair: { flexDirection: 'row', gap: 12 },
  small: { flex: 1, backgroundColor: colors.white, borderRadius: radii['2xl'], borderWidth: 1, borderColor: colors.line, padding: 16, gap: 4 },
  tx: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
});
