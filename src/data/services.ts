import type { CareService } from '../types/service';

/**
 * DEMO CATALOG — illustrative services and sample daily rates.
 * Real availability and pricing come from the platform catalog (backend).
 */
export const services: CareService[] = [
{
  id: 'svc-elderly',
  slug: 'elderly-care',
  category: 'elderly',
  title: { en: 'Elderly Care', ar: 'رعاية كبار السن' },
  summary: {
    en: 'Attentive companionship and everyday support that helps older adults stay safe and comfortable at home.',
    ar: 'رفقة واهتمام ودعم يومي يساعد كبار السن على البقاء بأمان وراحة في منازلهم.'
  },
  description: {
    en: 'A caregiver who gets to know your loved one’s routines, preferences, and pace. Visits focus on safety, mobility, light household support, and the kind of conversation that makes a day feel lighter.',
    ar: 'مقدّم رعاية يتعرّف على روتين من تحب وتفضيلاته وإيقاعه. تركّز الزيارات على السلامة والحركة والمساعدة المنزلية الخفيفة والحديث الذي يجعل اليوم أخف.'
  },
  image: "/7ec06798-ba78-414b-acb4-24e2e1fee68b.jpg",
  imageAlt: { en: 'Caregiver walking arm in arm with an older woman using a cane', ar: 'مقدّمة رعاية تمشي متشابكة الذراع مع سيدة مسنّة تستخدم عصا' },
  dailyRateSample: 380,
  includes: [
  { en: 'Mobility and walking support', ar: 'دعم الحركة والمشي' },
  { en: 'Meal preparation and hydration reminders', ar: 'تحضير الوجبات وتذكير بشرب الماء' },
  { en: 'Companionship and light activities', ar: 'الرفقة والأنشطة الخفيفة' },
  { en: 'Updates shared with family, if you choose', ar: 'مشاركة التحديثات مع العائلة إن رغبت' }],

  notes: {
    en: 'Suitable for older adults who live at home and need regular, non-emergency support.',
    ar: 'مناسبة لكبار السن الذين يعيشون في منازلهم ويحتاجون دعماً منتظماً غير طارئ.'
  },
  minDays: 1,
  maxDays: 30,
  popularity: 98
},
{
  id: 'svc-postsurgery',
  slug: 'post-surgery-care',
  category: 'recovery',
  title: { en: 'Post-Surgery Care', ar: 'رعاية ما بعد الجراحة' },
  summary: {
    en: 'Calm, structured support in the days after a procedure, following the plan your medical team provides.',
    ar: 'دعم هادئ ومنظّم في الأيام التي تلي العملية وفق الخطة التي يقدّمها فريقك الطبي.'
  },
  description: {
    en: 'Help with positioning, moving safely, keeping to your discharge instructions, and noticing when something should be raised with your doctor.',
    ar: 'المساعدة في وضعيات الجسم والحركة الآمنة والالتزام بتعليمات الخروج، والتنبّه لما يستدعي التواصل مع طبيبك.'
  },
  image: "/7a4fed94-6dd6-4fb0-8d99-5a991e39e73c.jpg",
  imageAlt: { en: 'Nurse adjusting pillows for a man resting after knee surgery', ar: 'ممرضة تعدّل الوسائد لرجل يستريح بعد جراحة في الركبة' },
  dailyRateSample: 520,
  includes: [
  { en: 'Support following discharge instructions', ar: 'دعم الالتزام بتعليمات الخروج' },
  { en: 'Safe transfers and repositioning', ar: 'التنقّل وتغيير الوضعية بأمان' },
  { en: 'Comfort and rest routines', ar: 'روتين الراحة والاسترخاء' },
  { en: 'Observation notes to share with your clinician', ar: 'ملاحظات للمشاركة مع طبيبك' }],

  notes: {
    en: 'Care follows the instructions from your treating team and does not replace follow-up appointments.',
    ar: 'تتبع الرعاية تعليمات فريقك المعالج ولا تُغني عن مواعيد المتابعة.'
  },
  minDays: 2,
  maxDays: 21,
  popularity: 92
},
{
  id: 'svc-nursing',
  slug: 'personal-nursing',
  category: 'nursing',
  title: { en: 'Personal Nursing', ar: 'التمريض الشخصي' },
  summary: {
    en: 'One-to-one nursing visits for routine checks, observations, and care tasks within a nurse’s scope.',
    ar: 'زيارات تمريضية فردية للفحوصات الروتينية والملاحظة ومهام الرعاية ضمن نطاق عمل الممرض.'
  },
  description: {
    en: 'A dedicated nurse for regular observations such as blood pressure and temperature, plus guidance on everyday care routines agreed with you.',
    ar: 'ممرض مخصّص لملاحظات منتظمة مثل ضغط الدم والحرارة، مع إرشاد حول روتين الرعاية اليومي المتفق عليه معك.'
  },
  image: "/112b5693-25df-46b2-9c32-9949f1129950.jpg",
  imageAlt: { en: 'Nurse measuring an older woman’s blood pressure at home', ar: 'ممرضة تقيس ضغط دم سيدة مسنّة في المنزل' },
  dailyRateSample: 450,
  includes: [
  { en: 'Routine vital-sign observations', ar: 'قياس العلامات الحيوية الروتينية' },
  { en: 'Care routine guidance', ar: 'إرشاد حول روتين الرعاية' },
  { en: 'Visit notes in your account', ar: 'ملاحظات الزيارة في حسابك' },
  { en: 'Flexible visit scheduling', ar: 'جدولة مرنة للزيارات' }],

  notes: {
    en: 'Tasks depend on each professional’s listed scope and the information on their profile.',
    ar: 'تعتمد المهام على نطاق عمل كل مختص والمعلومات المدرجة في ملفه.'
  },
  minDays: 1,
  maxDays: 30,
  popularity: 88
},
{
  id: 'svc-daily',
  slug: 'daily-living-assistance',
  category: 'daily-living',
  title: { en: 'Daily Living Assistance', ar: 'المساعدة في الحياة اليومية' },
  summary: {
    en: 'Respectful help with dressing, bathing, grooming, and the small routines that keep independence intact.',
    ar: 'مساعدة باحترام في اللبس والاستحمام والعناية الشخصية والروتين الذي يحافظ على الاستقلالية.'
  },
  description: {
    en: 'Support that preserves dignity — your caregiver helps where it’s needed and steps back where it isn’t, so routines stay your own.',
    ar: 'دعم يحفظ الكرامة؛ يساعد مقدّم الرعاية حيث تلزم المساعدة ويترك المجال حيث لا تلزم، ليبقى الروتين ملكك.'
  },
  image: "/463b10b2-602f-45c2-ae5a-1e9064e4de41.jpg",
  imageAlt: { en: 'Caregiver helping an older man button his cardigan', ar: 'مقدّمة رعاية تساعد رجلاً مسناً في إغلاق أزرار سترته' },
  dailyRateSample: 300,
  includes: [
  { en: 'Dressing and grooming', ar: 'اللبس والعناية الشخصية' },
  { en: 'Bathing support', ar: 'المساعدة في الاستحمام' },
  { en: 'Morning and evening routines', ar: 'روتين الصباح والمساء' },
  { en: 'Light tidying', ar: 'ترتيب خفيف للمكان' }],

  notes: {
    en: 'Gender preference for personal care can be set during booking.',
    ar: 'يمكن تحديد تفضيل جنس مقدّم الرعاية الشخصية أثناء الحجز.'
  },
  minDays: 1,
  maxDays: 30,
  popularity: 84
},
{
  id: 'svc-medication',
  slug: 'medication-assistance',
  category: 'nursing',
  title: { en: 'Medication Assistance', ar: 'المساعدة في الأدوية' },
  summary: {
    en: 'Reminders, organisation, and support taking prescribed medication on time, as directed by your prescriber.',
    ar: 'تذكير وتنظيم ودعم لتناول الأدوية الموصوفة في وقتها وفق توجيهات الطبيب.'
  },
  description: {
    en: 'Organise weekly pill organisers, keep a simple log, and make sure doses aren’t missed — always following the prescription as written.',
    ar: 'تنظيم علب الأدوية الأسبوعية وتدوين سجل بسيط وضمان عدم تفويت الجرعات، مع الالتزام الدائم بالوصفة كما هي.'
  },
  image: "/939cb9b5-f380-46dd-bc11-10ec463f0458.jpg",
  imageAlt: { en: 'Nurse organising a weekly pill box with an older woman', ar: 'ممرضة تنظّم علبة أدوية أسبوعية مع سيدة مسنّة' },
  dailyRateSample: 260,
  includes: [
  { en: 'Medication reminders', ar: 'تذكير بمواعيد الأدوية' },
  { en: 'Weekly organiser setup', ar: 'تجهيز منظّم الأدوية الأسبوعي' },
  { en: 'Simple dose log', ar: 'سجل بسيط للجرعات' },
  { en: 'Prescription questions passed to your pharmacist', ar: 'نقل الاستفسارات إلى الصيدلي' }],

  notes: {
    en: 'Caregivers do not change doses or prescribe. Questions go to your doctor or pharmacist.',
    ar: 'لا يغيّر مقدّمو الرعاية الجرعات ولا يصفون الأدوية. تُوجَّه الأسئلة إلى الطبيب أو الصيدلي.'
  },
  minDays: 1,
  maxDays: 30,
  popularity: 80
},
{
  id: 'svc-wound',
  slug: 'wound-care',
  category: 'nursing',
  title: { en: 'Wound Care', ar: 'العناية بالجروح' },
  summary: {
    en: 'Clean, careful dressing changes at home, following the care plan from your treating clinician.',
    ar: 'تغيير الضمادات بعناية ونظافة في المنزل وفق خطة طبيبك المعالج.'
  },
  description: {
    en: 'Scheduled visits for dressing changes with sterile supplies, plus notes on healing progress you can share at your next appointment.',
    ar: 'زيارات مجدولة لتغيير الضمادات بمستلزمات معقّمة، مع ملاحظات عن تقدّم الالتئام لمشاركتها في موعدك القادم.'
  },
  image: "/8cf2dcd5-7c86-4fba-9388-0d80e8833e55.jpg",
  imageAlt: { en: 'Nurse wearing gloves applying a dressing to a man’s forearm', ar: 'ممرضة ترتدي قفازات تضع ضمادة على ساعد رجل' },
  dailyRateSample: 420,
  includes: [
  { en: 'Dressing changes per care plan', ar: 'تغيير الضمادات وفق خطة الرعاية' },
  { en: 'Hygiene and infection-prevention practices', ar: 'ممارسات النظافة والوقاية من العدوى' },
  { en: 'Healing progress notes', ar: 'ملاحظات عن تقدّم الالتئام' },
  { en: 'Guidance on keeping the area protected', ar: 'إرشاد لحماية منطقة الجرح' }],

  notes: {
    en: 'A written care plan from your clinician may be requested before the first visit.',
    ar: 'قد يُطلب خطة رعاية مكتوبة من طبيبك قبل الزيارة الأولى.'
  },
  minDays: 1,
  maxDays: 21,
  popularity: 76
},
{
  id: 'svc-recovery',
  slug: 'recovery-support',
  category: 'recovery',
  title: { en: 'Recovery Support', ar: 'دعم التعافي' },
  summary: {
    en: 'Encouragement and hands-on help to rebuild everyday strength and confidence after illness or a hospital stay.',
    ar: 'تشجيع ومساعدة عملية لاستعادة القوة والثقة اليومية بعد المرض أو الإقامة في المستشفى.'
  },
  description: {
    en: 'Gentle routines, exercises prescribed by your physiotherapist, and a steady presence while you get back on your feet.',
    ar: 'روتين لطيف وتمارين يصفها أخصائي العلاج الطبيعي، وحضور ثابت بينما تستعيد نشاطك.'
  },
  image: "/da53136b-c7d6-409f-ba5b-03fa33b3e861.jpg",
  imageAlt: { en: 'Nurse guiding a woman through stretching with a resistance band', ar: 'ممرضة توجّه سيدة في تمارين إطالة بشريط مطاطي' },
  dailyRateSample: 400,
  includes: [
  { en: 'Support with prescribed exercises', ar: 'دعم التمارين الموصوفة' },
  { en: 'Safe movement around the home', ar: 'الحركة الآمنة داخل المنزل' },
  { en: 'Energy-aware daily planning', ar: 'تخطيط يومي يراعي الطاقة' },
  { en: 'Progress check-ins', ar: 'متابعة التقدّم' }],

  notes: {
    en: 'Exercise routines should come from your physiotherapist or doctor.',
    ar: 'يجب أن تأتي التمارين من أخصائي العلاج الطبيعي أو الطبيب.'
  },
  minDays: 3,
  maxDays: 30,
  popularity: 72
},
{
  id: 'svc-longterm',
  slug: 'long-term-home-care',
  category: 'elderly',
  title: { en: 'Long-Term Home Care', ar: 'الرعاية المنزلية طويلة الأمد' },
  summary: {
    en: 'Consistent, ongoing care with familiar faces, planned around the rhythms of family life.',
    ar: 'رعاية مستمرة وثابتة بوجوه مألوفة، مخطط لها حول إيقاع حياة العائلة.'
  },
  description: {
    en: 'For families who need dependable support week after week — continuity of caregiver where possible, and a plan that evolves as needs change.',
    ar: 'للعائلات التي تحتاج دعماً يُعتمد عليه أسبوعاً بعد أسبوع، مع استمرارية مقدّم الرعاية قدر الإمكان وخطة تتطور مع تغيّر الاحتياجات.'
  },
  image: "/1b4a3f39-5a4f-4460-b7a3-9bcde44a9abc.jpg",
  imageAlt: { en: 'Caregiver reading aloud to an older man in a recliner', ar: 'مقدّمة رعاية تقرأ بصوت عالٍ لرجل مسن على كرسي مريح' },
  dailyRateSample: 340,
  includes: [
  { en: 'A consistent caregiver where available', ar: 'مقدّم رعاية ثابت عند توفّره' },
  { en: 'Regular care plan reviews', ar: 'مراجعة دورية لخطة الرعاية' },
  { en: 'Companionship and daily support', ar: 'رفقة ودعم يومي' },
  { en: 'Family updates', ar: 'تحديثات للعائلة' }],

  notes: {
    en: 'Longer arrangements are booked in blocks you can extend from your account.',
    ar: 'تُحجز الترتيبات الطويلة على فترات يمكنك تمديدها من حسابك.'
  },
  minDays: 7,
  maxDays: 30,
  popularity: 70
},
{
  id: 'svc-companionship',
  slug: 'companionship-and-meals',
  category: 'daily-living',
  title: { en: 'Companionship & Meals', ar: 'الرفقة والوجبات' },
  summary: {
    en: 'Shared meals, conversation, and gentle help in the kitchen for people who would rather not be alone.',
    ar: 'وجبات مشتركة وحديث ومساعدة لطيفة في المطبخ لمن لا يرغب في البقاء وحيداً.'
  },
  description: {
    en: 'Cook together, take a short walk, sort the post — the simple things that make home feel lived in.',
    ar: 'الطبخ معاً ونزهة قصيرة وترتيب البريد؛ أشياء بسيطة تجعل المنزل نابضاً بالحياة.'
  },
  image: "/aefe71ee-45f8-423e-8d49-472e40d685f3.jpg",
  imageAlt: { en: 'Caregiver and older woman preparing vegetables in a bright kitchen', ar: 'مقدّمة رعاية وسيدة مسنّة تحضّران الخضار في مطبخ مشرق' },
  dailyRateSample: 240,
  includes: [
  { en: 'Meal planning and cooking together', ar: 'تخطيط الوجبات والطبخ معاً' },
  { en: 'Conversation and outings', ar: 'الحديث والنزهات' },
  { en: 'Errands and appointments', ar: 'قضاء المشاوير والمواعيد' },
  { en: 'Light housekeeping', ar: 'أعمال منزلية خفيفة' }],

  notes: { en: 'Non-clinical support.', ar: 'دعم غير سريري.' },
  minDays: 1,
  maxDays: 30,
  popularity: 66
},
{
  id: 'svc-checkin',
  slug: 'home-health-check-ins',
  category: 'nursing',
  title: { en: 'Home Health Check-ins', ar: 'زيارات المتابعة الصحية' },
  summary: {
    en: 'Short, regular nursing visits to keep an eye on how things are going between doctor appointments.',
    ar: 'زيارات تمريضية قصيرة ومنتظمة لمتابعة الحالة بين مواعيد الطبيب.'
  },
  description: {
    en: 'Ideal when you want reassurance: a nurse visits, records observations, and talks through anything you’d like to raise.',
    ar: 'مثالية عندما تحتاج إلى الطمأنينة: يزورك ممرض ويدوّن الملاحظات ويناقش معك ما تودّ طرحه.'
  },
  image: "/6868d435-ef53-4a50-9dad-a7b26db1c7df.jpg",
  imageAlt: { en: 'Nurse explaining notes on a tablet to a man at a dining table', ar: 'ممرضة تشرح ملاحظات على جهاز لوحي لرجل على طاولة الطعام' },
  dailyRateSample: 220,
  includes: [
  { en: 'Observation visit', ar: 'زيارة ملاحظة' },
  { en: 'Notes saved to your account', ar: 'ملاحظات محفوظة في حسابك' },
  { en: 'Questions to raise with your doctor', ar: 'أسئلة لطرحها على طبيبك' },
  { en: 'Weekly or twice-weekly options', ar: 'خيارات أسبوعية أو مرتين أسبوعياً' }],

  notes: { en: 'Not a substitute for urgent or emergency care.', ar: 'لا تُغني عن الرعاية العاجلة أو الطارئة.' },
  minDays: 1,
  maxDays: 14,
  popularity: 60
},
{
  id: 'svc-overnight',
  slug: 'overnight-bedside-care',
  category: 'elderly',
  title: { en: 'Overnight Bedside Care', ar: 'الرعاية الليلية بجانب السرير' },
  summary: {
    en: 'A calm presence through the night so families can rest, with help for night-time needs.',
    ar: 'حضور هادئ طوال الليل لتستريح العائلة، مع المساعدة في احتياجات الليل.'
  },
  description: {
    en: 'Overnight support for repositioning, bathroom visits, and reassurance — so everyone wakes up having actually slept.',
    ar: 'دعم ليلي لتغيير الوضعية ودخول الحمّام والطمأنة، ليستيقظ الجميع وقد ناموا فعلاً.'
  },
  image: "/3e761548-6f6b-4d3f-bb1c-49be443da461.jpg",
  imageAlt: { en: 'Nurse checking an older man’s pulse while he rests in bed', ar: 'ممرضة تقيس نبض رجل مسن وهو مستلقٍ في السرير' },
  dailyRateSample: 480,
  includes: [
  { en: 'Night-time repositioning', ar: 'تغيير الوضعية ليلاً' },
  { en: 'Bathroom assistance', ar: 'المساعدة في دخول الحمّام' },
  { en: 'Reassurance and settling', ar: 'الطمأنة والمساعدة على النوم' },
  { en: 'Morning handover notes', ar: 'ملاحظات تسليم صباحية' }],

  notes: { en: 'Overnight availability is limited; confirm dates early.', ar: 'التوفر الليلي محدود؛ يُفضّل تأكيد المواعيد مبكراً.' },
  minDays: 1,
  maxDays: 30,
  popularity: 58
},
{
  id: 'svc-planning',
  slug: 'care-planning-visit',
  category: 'recovery',
  title: { en: 'Care Planning Visit', ar: 'زيارة تخطيط الرعاية' },
  summary: {
    en: 'An introductory home visit to understand needs and shape a care plan before regular visits begin.',
    ar: 'زيارة تعريفية للمنزل لفهم الاحتياجات ووضع خطة رعاية قبل بدء الزيارات المنتظمة.'
  },
  description: {
    en: 'Meet a professional at home, walk through routines and the space, and leave with a clear, written plan you can book against.',
    ar: 'قابل مختصاً في المنزل، وراجعا الروتين والمكان، واحصل على خطة واضحة ومكتوبة يمكنك الحجز بناءً عليها.'
  },
  image: "/3cfeb3b2-93ae-45fd-bb7c-d27c1d2bd60b.jpg",
  imageAlt: { en: 'Nurse greeting an older woman at her front door', ar: 'ممرضة تحيّي سيدة مسنّة عند باب منزلها' },
  dailyRateSample: 180,
  includes: [
  { en: 'Needs and routine conversation', ar: 'حديث حول الاحتياجات والروتين' },
  { en: 'Home safety walk-through', ar: 'جولة سلامة في المنزل' },
  { en: 'Written care plan', ar: 'خطة رعاية مكتوبة' },
  { en: 'Recommended services', ar: 'خدمات مقترحة' }],

  notes: { en: 'Single visit.', ar: 'زيارة واحدة.' },
  minDays: 1,
  maxDays: 1,
  popularity: 64
}];