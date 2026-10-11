import type { Article } from '../types/content';

/** DEMO EDITORIAL CONTENT — general wellbeing reading, not medical advice. */
export const articles: Article[] = [
{
  id: 'ar-1',
  slug: 'making-home-safer-for-older-adults',
  category: { en: 'Home & Safety', ar: 'المنزل والسلامة' },
  title: { en: 'Small changes that make a home safer for older adults', ar: 'تغييرات صغيرة تجعل المنزل أكثر أماناً لكبار السن' },
  excerpt: {
    en: 'Clear walkways, warmer lighting, and a few well-placed rails can do more than a full renovation. A room-by-room starting point.',
    ar: 'ممرات واضحة وإضاءة أدفأ وبعض المقابض في أماكنها الصحيحة قد تفيد أكثر من تجديد كامل. نقطة بداية لكل غرفة.'
  },
  cover: "/1a111683-afe1-4096-b4ba-46fed098beb5.jpg",
  coverAlt: { en: 'Calm living room with a teal armchair, grab rail and clear walkway', ar: 'غرفة معيشة هادئة بكرسي أخضر مزرق ومقبض ثابت وممر واضح' },
  date: '2026-09-28',
  readMinutes: 6,
  author: { name: { en: 'CareFlow Editorial', ar: 'فريق تحرير كيرفلو' }, role: { en: 'Health Resources', ar: 'الموارد الصحية' } },
  body: [
  {
    en: 'Most falls at home happen in familiar places — the hallway at night, the bathroom floor, the step into the kitchen. The good news is that the most effective changes are often the simplest.',
    ar: 'تحدث معظم حالات السقوط في المنزل في أماكن مألوفة: الممر ليلاً، أرضية الحمّام، الدرجة المؤدية إلى المطبخ. والخبر الجيد أن أكثر التغييرات فعالية غالباً ما تكون الأبسط.'
  },
  {
    en: 'Start with light. Warm, even lighting along the route from bed to bathroom, and switches reachable from the doorway, remove a surprising amount of risk.',
    ar: 'ابدأ بالإضاءة. إضاءة دافئة ومتساوية على طول الطريق من السرير إلى الحمّام، ومفاتيح يمكن الوصول إليها من الباب، تقلّل قدراً كبيراً من المخاطر.'
  },
  {
    en: 'Then look at the floor: loose rugs, trailing cables, and clutter near seating. If you are unsure where to begin, an occupational therapist or a care planning visit can help you prioritise.',
    ar: 'ثم انظر إلى الأرضية: السجاد غير الثابت والأسلاك الممتدة والفوضى قرب المقاعد. وإن لم تكن متأكداً من أين تبدأ، يمكن لأخصائي العلاج الوظيفي أو زيارة تخطيط الرعاية مساعدتك في تحديد الأولويات.'
  }]

},
{
  id: 'ar-2',
  slug: 'eating-well-during-recovery',
  category: { en: 'Recovery', ar: 'التعافي' },
  title: { en: 'Eating well during recovery, without the fuss', ar: 'التغذية الجيدة أثناء التعافي دون تعقيد' },
  excerpt: {
    en: 'Appetite often dips after a hospital stay. Simple, gentle ways to keep meals nourishing and manageable.',
    ar: 'غالباً ما تقلّ الشهية بعد الإقامة في المستشفى. طرق بسيطة ولطيفة لإبقاء الوجبات مغذية وسهلة.'
  },
  cover: "/4633e88f-ba07-4752-82ba-b17d14b47262.jpg",
  coverAlt: { en: 'Tray with soup, bread, fruit and water by a window', ar: 'صينية عليها شوربة وخبز وفاكهة وماء بجانب نافذة' },
  date: '2026-09-14',
  readMinutes: 5,
  author: { name: { en: 'CareFlow Editorial', ar: 'فريق تحرير كيرفلو' }, role: { en: 'Health Resources', ar: 'الموارد الصحية' } },
  body: [
  {
    en: 'Smaller, more frequent meals are often easier than three large ones. Keep water within reach and make it a habit, not an afterthought.',
    ar: 'غالباً ما تكون الوجبات الصغيرة المتكررة أسهل من ثلاث وجبات كبيرة. اجعل الماء في متناول اليد وحوّله إلى عادة.'
  },
  {
    en: 'Any dietary restrictions from your medical team come first. If you are unsure, ask before changing what you eat.',
    ar: 'تأتي أي قيود غذائية من فريقك الطبي أولاً. إن لم تكن متأكداً، اسأل قبل تغيير نظامك الغذائي.'
  }]

},
{
  id: 'ar-3',
  slug: 'starting-the-care-conversation',
  category: { en: 'Family', ar: 'العائلة' },
  title: { en: 'How to start the care conversation with a parent', ar: 'كيف تبدأ الحديث عن الرعاية مع أحد والديك' },
  excerpt: {
    en: 'Talking about help at home can feel delicate. Lead with what they want to keep doing, not what they can’t.',
    ar: 'قد يبدو الحديث عن المساعدة المنزلية حساساً. ابدأ بما يريدون الاستمرار في فعله، لا بما لا يستطيعون.'
  },
  cover: "/fcf437a6-a938-4b2c-a0ce-c4cb4939c3da.jpg",
  coverAlt: { en: 'Adult son and older mother talking on a porch bench', ar: 'ابن بالغ ووالدته المسنّة يتحدثان على مقعد في الشرفة' },
  date: '2026-08-30',
  readMinutes: 7,
  author: null,
  body: [
  {
    en: 'Choose a calm moment, not a crisis. Ask open questions about how the week has felt and what has become harder.',
    ar: 'اختر لحظة هادئة لا وقت أزمة. اطرح أسئلة مفتوحة عن شعورهم خلال الأسبوع وما الذي أصبح أصعب.'
  },
  {
    en: 'Frame support as a way to protect independence. Offer to try a short arrangement first, so the decision never feels permanent.',
    ar: 'قدّم الدعم كوسيلة لحماية الاستقلالية، واقترح تجربة ترتيب قصير أولاً حتى لا يبدو القرار نهائياً.'
  }]

},
{
  id: 'ar-4',
  slug: 'building-a-weekly-care-routine',
  category: { en: 'Care Planning', ar: 'تخطيط الرعاية' },
  title: { en: 'Building a weekly care routine that actually sticks', ar: 'بناء روتين رعاية أسبوعي يمكن الالتزام به' },
  excerpt: {
    en: 'A shared schedule reduces worry for everyone. What to include, and what to leave flexible.',
    ar: 'الجدول المشترك يقلّل القلق للجميع. ما الذي يجب تضمينه وما الذي يُترك مرناً.'
  },
  cover: "/272a8f16-828d-4f89-bc19-d145fbb8df50.jpg",
  coverAlt: { en: 'Notebook, calendar, glasses and tea on a wooden table', ar: 'دفتر وتقويم ونظارة وشاي على طاولة خشبية' },
  date: '2026-08-12',
  readMinutes: 4,
  author: { name: { en: 'CareFlow Editorial', ar: 'فريق تحرير كيرفلو' }, role: { en: 'Health Resources', ar: 'الموارد الصحية' } },
  body: [
  {
    en: 'Anchor the week with a few fixed points — medication times, meals, appointments — and let everything else move around them.',
    ar: 'ثبّت الأسبوع ببعض النقاط الثابتة مثل مواعيد الأدوية والوجبات والمواعيد الطبية، ودع كل شيء آخر يتحرك حولها.'
  },
  {
    en: 'Keep the schedule somewhere everyone can see it, and review it together every couple of weeks.',
    ar: 'احتفظ بالجدول في مكان يراه الجميع، وراجعوه معاً كل أسبوعين تقريباً.'
  }]

}];