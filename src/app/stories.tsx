import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { TestimonialCard } from '@/components/cards/TestimonialCard';
import { PageHero } from '@/components/layout/PageHero';
import { SampleNote } from '@/components/layout/Section';
import { Screen } from '@/components/layout/Screen';
import { Chip } from '@/components/ui/Chip';
import { StateMessage } from '@/components/ui/StateMessage';
import { images } from '@/data/images';
import { testimonials } from '@/data/testimonials';
import { useCatalogData } from '@/hooks/useCatalog';
import { useI18n } from '@/i18n';

export default function StoriesScreen() {
  const { t, l } = useI18n();
  const { services, serviceById } = useCatalogData();
  const [filter, setFilter] = useState('all');
  // testimonials reference the bundled sample ids, so match through the catalogue (live id, slug or sample id)
  const used = services.filter((s) => testimonials.some((x) => serviceById(x.serviceId)?.id === s.id));
  const list = filter === 'all' ? testimonials : testimonials.filter((x) => serviceById(x.serviceId)?.id === filter);
  return (
    <Screen header="back" title={t('nav.reviews')}>
      <PageHero
        title={t('reviewsPage.title')}
        body={t('reviewsPage.body')}
        image={images.stories}
        imageAlt={l({ en: 'Grandmother and granddaughter laughing with a caregiver', ar: 'جدة وحفيدتها تضحكان مع مقدّمة رعاية' })}
      >
        <SampleNote>{t('stories.sampleLabel')}</SampleNote>
      </PageHero>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
        {[{ id: 'all', label: t('categories.all') }, ...used.map((s) => ({ id: s.id, label: l(s.title) }))].map((o) => (
          <Chip key={o.id} label={o.label} selected={filter === o.id} onPress={() => setFilter(o.id)} tone="white" />
        ))}
      </ScrollView>
      <View style={{ padding: 20, gap: 16, paddingBottom: 48 }}>
        {list.length === 0 ? <StateMessage title={t('common.emptyTitle')} /> : list.map((item) => <TestimonialCard key={item.id} testimonial={item} />)}
      </View>
    </Screen>
  );
}
