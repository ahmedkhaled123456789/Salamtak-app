import type { Testimonial } from '../types/content';

/** SAMPLE TESTIMONIALS — illustrative only, not genuine customer feedback. */
export const testimonials: Testimonial[] = [
{
  id: 'ts-1',
  initials: 'NA',
  author: { en: 'Sample — Nadia A.', ar: 'نموذج — نادية أ.' },
  relation: { en: 'Daughter of a patient', ar: 'ابنة مريض' },
  serviceId: 'svc-elderly',
  quote: {
    en: 'For the first time in months I could go to work without checking my phone every hour. Dad looks forward to the visits now.',
    ar: 'لأول مرة منذ أشهر استطعت الذهاب إلى العمل دون أن أتفقد هاتفي كل ساعة. أصبح أبي ينتظر الزيارات بشوق.'
  }
},
{
  id: 'ts-2',
  initials: 'MR',
  author: { en: 'Sample — Marcus R.', ar: 'نموذج — ماركوس ر.' },
  relation: { en: 'Recovering at home', ar: 'يتعافى في المنزل' },
  serviceId: 'svc-postsurgery',
  quote: {
    en: 'After my knee operation I was nervous about managing alone. Having someone calm there in the mornings made the first two weeks far easier.',
    ar: 'بعد عملية الركبة كنت قلقاً من التعامل وحدي. وجود شخص هادئ في الصباح جعل الأسبوعين الأولين أسهل بكثير.'
  }
},
{
  id: 'ts-3',
  initials: 'SH',
  author: { en: 'Sample — Sara H.', ar: 'نموذج — سارة ح.' },
  relation: { en: 'Caring for her mother', ar: 'ترعى والدتها' },
  serviceId: 'svc-daily',
  quote: {
    en: 'Being able to choose a female caregiver mattered a lot to my mother. Booking took minutes, and the price was clear before we paid.',
    ar: 'كان اختيار مقدّمة رعاية امرأة أمراً مهماً لوالدتي. استغرق الحجز دقائق، وكان السعر واضحاً قبل الدفع.'
  }
},
{
  id: 'ts-4',
  initials: 'KT',
  author: { en: 'Sample — Khalid T.', ar: 'نموذج — خالد ت.' },
  relation: { en: 'Son of a patient', ar: 'ابن مريض' },
  serviceId: 'svc-medication',
  quote: {
    en: 'The medication routine finally stopped being a daily argument. Everything is organised and I can see the visit notes from abroad.',
    ar: 'لم يعد روتين الأدوية جدالاً يومياً. كل شيء منظّم وأستطيع رؤية ملاحظات الزيارة من الخارج.'
  }
},
{
  id: 'ts-5',
  initials: 'EL',
  author: { en: 'Sample — Elena L.', ar: 'نموذج — إيلينا ل.' },
  relation: { en: 'Patient', ar: 'مريضة' },
  serviceId: 'svc-recovery',
  quote: {
    en: 'Gentle, encouraging, and never rushed. I got my confidence back walking around my own home.',
    ar: 'لطيفة ومشجّعة ولا تستعجل أبداً. استعدت ثقتي بالمشي في منزلي.'
  }
}];