import type { Nurse } from '../types/nurse';

/**
 * DEMO PROFILES — fictional professionals for design previews.
 * Qualifications are sample text and are NOT verified credentials.
 */
export const nurses: Nurse[] = [
{
  id: 'nr-layla',
  slug: 'layla-haddad',
  name: { en: 'Layla Haddad', ar: 'ليلى حداد' },
  role: { en: 'Home Care Nurse', ar: 'ممرضة رعاية منزلية' },
  gender: 'female',
  portrait: "/66866729-3cd3-44d9-9da2-7ac60d52e356.jpg",
  bio: {
    en: 'Layla focuses on elderly and post-surgery care. Families describe her as unhurried and observant — she notices the small changes that matter.',
    ar: 'تركّز ليلى على رعاية كبار السن وما بعد الجراحة. تصفها العائلات بالهدوء ودقة الملاحظة؛ فهي تلاحظ التغييرات الصغيرة المهمة.'
  },
  city: { en: 'Riyadh', ar: 'الرياض' },
  serviceIds: ['svc-elderly', 'svc-postsurgery', 'svc-medication'],
  languages: [{ en: 'Arabic', ar: 'العربية' }, { en: 'English', ar: 'الإنجليزية' }],
  experienceYears: 9,
  qualifications: [{ en: 'Nursing diploma (sample)', ar: 'دبلوم تمريض (نموذج)' }],
  availability: 'available',
  nextAvailable: '2026-10-11',
  dailyRateSample: 420,
  featured: true
},
{
  id: 'nr-daniel',
  slug: 'daniel-okafor',
  name: { en: 'Daniel Okafor', ar: 'دانيال أوكافور' },
  role: { en: 'Registered Nurse', ar: 'ممرض' },
  gender: 'male',
  portrait: "/49ef787c-878c-46b0-b0d8-0fbf687f81b0.jpg",
  bio: {
    en: 'Daniel supports recovery after hospital stays and wound care at home. He is known for clear explanations and steady, practical help.',
    ar: 'يدعم دانيال التعافي بعد الإقامة في المستشفى والعناية بالجروح في المنزل. يُعرف بشرحه الواضح ومساعدته العملية الثابتة.'
  },
  city: { en: 'Jeddah', ar: 'جدة' },
  serviceIds: ['svc-wound', 'svc-recovery', 'svc-postsurgery', 'svc-checkin'],
  languages: [{ en: 'English', ar: 'الإنجليزية' }],
  experienceYears: 14,
  qualifications: [{ en: 'Bachelor of Nursing (sample)', ar: 'بكالوريوس تمريض (نموذج)' }],
  availability: 'limited',
  nextAvailable: '2026-10-15',
  dailyRateSample: 480,
  featured: true
},
{
  id: 'nr-grace',
  slug: 'grace-lin',
  name: { en: 'Grace Lin', ar: 'غريس لين' },
  role: { en: 'Senior Care Nurse', ar: 'ممرضة رعاية أولى' },
  gender: 'female',
  portrait: "/1a0f8998-01f0-4a9e-8166-7916690fa938.jpg",
  bio: {
    en: 'Grace has spent most of her career with older adults and long-term arrangements. She builds routines that feel familiar, not clinical.',
    ar: 'أمضت غريس معظم مسيرتها مع كبار السن والترتيبات طويلة الأمد. تبني روتيناً مألوفاً لا يشعر بالطابع السريري.'
  },
  city: { en: 'Riyadh', ar: 'الرياض' },
  serviceIds: ['svc-longterm', 'svc-elderly', 'svc-overnight', 'svc-daily'],
  languages: [{ en: 'English', ar: 'الإنجليزية' }, { en: 'Mandarin', ar: 'الماندرين' }],
  experienceYears: 21,
  availability: 'available',
  nextAvailable: '2026-10-10',
  dailyRateSample: 460,
  featured: true
},
{
  id: 'nr-omar',
  slug: 'omar-khalil',
  name: { en: 'Omar Khalil', ar: 'عمر خليل' },
  role: { en: 'Home Care Nurse', ar: 'ممرض رعاية منزلية' },
  gender: 'male',
  portrait: "/b7c50e35-c776-483c-87fe-73ef80aa5a68.jpg",
  bio: {
    en: 'Omar works with men who prefer a male caregiver for personal care and recovery. Patient, good-humoured, and reliable on timing.',
    ar: 'يعمل عمر مع الرجال الذين يفضّلون مقدّم رعاية رجلاً في العناية الشخصية والتعافي. صبور وخفيف الظل ومنضبط في المواعيد.'
  },
  city: { en: 'Dammam', ar: 'الدمام' },
  serviceIds: ['svc-daily', 'svc-recovery', 'svc-medication', 'svc-companionship'],
  languages: [{ en: 'Arabic', ar: 'العربية' }, { en: 'English', ar: 'الإنجليزية' }],
  availability: 'available',
  nextAvailable: '2026-10-10',
  dailyRateSample: 360,
  featured: true
},
{
  id: 'nr-sofia',
  slug: 'sofia-ramirez',
  name: { en: 'Sofia Ramirez', ar: 'صوفيا راميريز' },
  role: { en: 'Clinical Home Nurse', ar: 'ممرضة منزلية سريرية' },
  gender: 'female',
  portrait: "/b11517e1-b2b2-4f46-8053-ca226de42c79.jpg",
  bio: {
    en: 'Sofia handles routine nursing visits and wound care with a calm, precise approach. She keeps thorough visit notes for families.',
    ar: 'تتولى صوفيا الزيارات التمريضية الروتينية والعناية بالجروح بأسلوب هادئ ودقيق، وتحتفظ بملاحظات زيارة وافية للعائلات.'
  },
  city: { en: 'Jeddah', ar: 'جدة' },
  serviceIds: ['svc-nursing', 'svc-wound', 'svc-checkin'],
  languages: [{ en: 'English', ar: 'الإنجليزية' }, { en: 'Spanish', ar: 'الإسبانية' }],
  experienceYears: 7,
  qualifications: [{ en: 'Wound care course (sample)', ar: 'دورة العناية بالجروح (نموذج)' }],
  availability: 'unavailable',
  nextAvailable: '2026-10-24',
  dailyRateSample: 440,
  featured: false
},
{
  id: 'nr-priya',
  slug: 'priya-nair',
  name: { en: 'Priya Nair', ar: 'بريا ناير' },
  role: { en: 'Registered Nurse', ar: 'ممرضة' },
  gender: 'female',
  portrait: "/38c41a10-7979-446c-a0b2-e63a84bea742.jpg",
  bio: {
    en: 'Priya supports families through care planning and medication routines, and is happiest when everyone understands the plan.',
    ar: 'تدعم بريا العائلات في تخطيط الرعاية وروتين الأدوية، وتسعد حين يفهم الجميع الخطة.'
  },
  city: { en: 'Riyadh', ar: 'الرياض' },
  serviceIds: ['svc-planning', 'svc-medication', 'svc-nursing', 'svc-elderly'],
  languages: [{ en: 'English', ar: 'الإنجليزية' }, { en: 'Hindi', ar: 'الهندية' }, { en: 'Malayalam', ar: 'المالايالامية' }],
  experienceYears: 12,
  availability: 'limited',
  nextAvailable: '2026-10-13',
  dailyRateSample: 410,
  featured: true
}];