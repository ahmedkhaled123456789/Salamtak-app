import React from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { Screen } from '@/components/layout/Screen';
import { images } from '@/data/images';
import { BookingPreview, WhyChoose } from '@/features/home/sections1';
import { CareStandards, FinalCta } from '@/features/home/sections2';
import { useI18n } from '@/i18n';

export default function WhyCareFlowScreen() {
  const { t, l } = useI18n();
  return (
    <Screen header="back" title={t('nav.why')}>
      <PageHero
        title={t('whyPage.title')}
        body={t('whyPage.body')}
        image={images.galleryConsult}
        imageAlt={l({ en: 'Nurse explaining notes on a tablet to a man at home', ar: 'ممرضة تشرح ملاحظات على جهاز لوحي لرجل في منزله' })}
      />
      <WhyChoose />
      <BookingPreview />
      <CareStandards />
      <FinalCta />
    </Screen>
  );
}
