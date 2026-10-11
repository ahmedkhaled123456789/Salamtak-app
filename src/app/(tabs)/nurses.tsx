import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { NursesBrowser } from '@/features/browse/NursesBrowser';
import { useI18n } from '@/i18n';
import type { GenderPreference } from '@/types/nurse';

export default function NursesScreen() {
  const { t } = useI18n();
  const params = useLocalSearchParams<{ service?: string; gender?: string }>();
  const gender: GenderPreference = params.gender === 'male' || params.gender === 'female' ? params.gender : 'any';
  return (
    <Screen scroll={false}>
      {/* key: a new search from the home panel re-seeds the filters */}
      <NursesBrowser
        key={`${params.service ?? ''}-${gender}`}
        initialService={params.service ?? ''}
        initialGender={gender}
        header={<PageTitle title={t('nursesPage.title')} body={t('nursesPage.body')} />}
      />
    </Screen>
  );
}
