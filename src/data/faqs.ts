import type { Faq } from '../types/content';

/**
 * FAQ content. Entries marked `placeholder` describe policies that have not
 * been documented yet and must be replaced with the confirmed product rules.
 */
export const faqs: Faq[] = [
{
  id: 'fq-1',
  topic: 'booking',
  question: { en: 'How do I book a nurse?', ar: 'كيف أحجز ممرضاً؟' },
  answer: {
    en: 'Choose a service, set your dates and duration, add any preferences, then pick from the professionals available for those dates. You review the full summary before continuing to payment.',
    ar: 'اختر الخدمة وحدد التواريخ والمدة وأضف تفضيلاتك، ثم اختر من المختصين المتاحين لتلك التواريخ. تراجع الملخص الكامل قبل متابعة الدفع.'
  }
},
{
  id: 'fq-2',
  topic: 'booking',
  question: { en: 'How do I choose the right duration?', ar: 'كيف أختار المدة المناسبة؟' },
  answer: {
    en: 'Each service shows its minimum and maximum number of days. If you are unsure, start with a shorter booking — you can book again from your account.',
    ar: 'تعرض كل خدمة الحد الأدنى والأقصى لعدد الأيام. إن لم تكن متأكداً، ابدأ بحجز أقصر، ويمكنك الحجز مجدداً من حسابك.'
  }
},
{
  id: 'fq-3',
  topic: 'booking',
  question: { en: 'Can I request a female or male nurse?', ar: 'هل يمكنني طلب ممرضة أو ممرض؟' },
  answer: {
    en: 'Yes. Set a gender preference during booking and only matching professionals will be shown. You can also choose “No preference”.',
    ar: 'نعم. حدّد تفضيل الجنس أثناء الحجز وسيُعرض المختصون المطابقون فقط. ويمكنك أيضاً اختيار "بلا تفضيل".'
  }
},
{
  id: 'fq-4',
  topic: 'pricing',
  question: { en: 'How is the price calculated?', ar: 'كيف يُحتسب السعر؟' },
  answer: {
    en: 'Estimates are the daily rate multiplied by the number of days. Any fees or discounts and the final amount are confirmed by the platform before you pay.',
    ar: 'التقدير هو السعر اليومي مضروباً في عدد الأيام. تُؤكَّد أي رسوم أو خصومات والمبلغ النهائي من المنصة قبل الدفع.'
  }
},
{
  id: 'fq-5',
  topic: 'payment',
  question: { en: 'Which payment methods are accepted?', ar: 'ما طرق الدفع المقبولة؟' },
  answer: {
    en: 'Placeholder — accepted payment methods will be listed here once confirmed by the payment provider integration.',
    ar: 'محتوى مؤقت — ستُدرج طرق الدفع المقبولة هنا بعد تأكيدها من مزوّد خدمة الدفع.'
  },
  placeholder: true
},
{
  id: 'fq-6',
  topic: 'changes',
  question: { en: 'Can I change a booking?', ar: 'هل يمكنني تعديل الحجز؟' },
  answer: {
    en: 'Available actions appear on each booking in your account. If an action isn’t shown, it isn’t currently permitted for that booking.',
    ar: 'تظهر الإجراءات المتاحة على كل حجز في حسابك. إن لم يظهر إجراء ما، فهو غير متاح حالياً لهذا الحجز.'
  }
},
{
  id: 'fq-7',
  topic: 'changes',
  question: { en: 'What is the cancellation policy?', ar: 'ما سياسة الإلغاء؟' },
  answer: {
    en: 'Placeholder — the cancellation and refund policy has not been published yet. The confirmed policy will appear here and on each booking.',
    ar: 'محتوى مؤقت — لم تُنشر سياسة الإلغاء والاسترداد بعد. ستظهر السياسة المؤكدة هنا وعلى كل حجز.'
  },
  placeholder: true
},
{
  id: 'fq-8',
  topic: 'account',
  question: { en: 'How do I manage my account?', ar: 'كيف أدير حسابي؟' },
  answer: {
    en: 'Sign in to view bookings, update contact details and preferences, and choose your language.',
    ar: 'سجّل الدخول لعرض الحجوزات وتحديث بيانات التواصل والتفضيلات واختيار اللغة.'
  }
}];