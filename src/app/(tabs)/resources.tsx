import React from 'react';
import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ResourcesBrowser } from '@/features/browse/ResourcesBrowser';
import { useI18n } from '@/i18n';

export default function ResourcesScreen() {
  const { t } = useI18n();
  return (
    <Screen scroll={false}>
      <ResourcesBrowser header={<PageTitle title={t('blogPage.title')} body={t('blogPage.body')} />} />
    </Screen>
  );
}
