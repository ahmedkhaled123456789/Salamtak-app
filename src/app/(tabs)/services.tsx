import React from 'react';
import { PageTitle } from '@/components/layout/PageTitle';
import { Screen } from '@/components/layout/Screen';
import { ServicesBrowser } from '@/features/browse/ServicesBrowser';
import { useI18n } from '@/i18n';

export default function ServicesScreen() {
  const { t } = useI18n();
  return (
    <Screen scroll={false}>
      <ServicesBrowser header={<PageTitle title={t('servicesPage.title')} body={t('servicesPage.body')} />} />
    </Screen>
  );
}
