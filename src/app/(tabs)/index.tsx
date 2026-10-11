import React from 'react';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { HomeHero } from '@/features/home/HomeHero';
import { SiteFooter } from '@/features/home/SiteFooter';
import {
  BookingPreview,
  EditorialStory,
  HowItWorksSteps,
  LifeStages,
  NurseFinder,
  RealLifeBanner,
  ServicesShowcase,
  TrustStrip,
  WhyChoose,
} from '@/features/home/sections1';
import {
  CareProfessionals,
  CareStandards,
  FamilyStories,
  FinalCta,
  HomeFaq,
  HomeJournal,
  NewsletterSection,
  ServiceGallery,
} from '@/features/home/sections2';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';

/** The website's homepage, section for section (see docs/DESIGN_PARITY_PLAN.md §4). */
export default function HomeScreen() {
  const { t } = useI18n();
  const { refetch } = useCatalogData();
  const [refreshing, setRefreshing] = React.useState(false);
  return (
    <Screen
      testID="home-screen"
      onRefresh={() => {
        setRefreshing(true);
        void refetch().finally(() => setRefreshing(false));
      }}
      refreshing={refreshing}
      footer={
        <Button fullWidth size="md" href="/book">
          {t('common.bookCare')}
        </Button>
      }
    >
      <AnnouncementBar />
      <HomeHero />
      <TrustStrip />
      <ServicesShowcase />
      <EditorialStory />
      <NurseFinder />
      <HowItWorksSteps />
      <LifeStages />
      <WhyChoose />
      <RealLifeBanner />
      <BookingPreview />
      <CareProfessionals />
      <ServiceGallery />
      <FamilyStories />
      <CareStandards />
      <HomeJournal />
      <HomeFaq />
      <FinalCta />
      <NewsletterSection />
      <SiteFooter />
    </Screen>
  );
}
