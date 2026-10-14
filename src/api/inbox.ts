import { request } from './client';

/** Public contact form and newsletter (double opt-in) — care-backend `/public/contact`, `/public/newsletter`. */
export const inboxApi = {
  async sendContact(input: { name: string; email: string; message: string; locale: 'en' | 'ar' }): Promise<void> {
    await request('/public/contact', { method: 'POST', anonymous: true, body: { ...input, topic: 'OTHER' } });
  },
  /** The API emails a confirmation link; nothing is sent to the address until it is confirmed. */
  async subscribeNewsletter(email: string, locale: 'en' | 'ar'): Promise<void> {
    await request('/public/newsletter', { method: 'POST', anonymous: true, body: { email, locale } });
  },
};
