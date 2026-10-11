import { z } from 'zod';
import type { TranslationKey } from '@/i18n';

type T = (key: TranslationKey, vars?: Record<string, string | number>) => string;

/** Same rules the backend enforces (min 10 chars with upper, lower and a digit; E.164 phone). */
export const buildSchemas = (t: T) => {
  const email = z.string().trim().min(1, t('validation.required')).email(t('validation.email'));
  const password = z
    .string()
    .min(10, t('validation.passwordMin'))
    .regex(/[a-z]/, t('validation.passwordMin'))
    .regex(/[A-Z]/, t('validation.passwordMin'))
    .regex(/\d/, t('validation.passwordMin'));
  const name = z.string().trim().min(2, t('validation.nameMin')).max(80);
  const phone = z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{7,14}$/, t('validation.phone'));
  return {
    signIn: z.object({ email, password: z.string().min(1, t('validation.required')) }),
    signUp: z
      .object({ firstName: name, lastName: name, email, phone, password, confirm: z.string(), terms: z.literal(true, { errorMap: () => ({ message: t('validation.terms') }) }) })
      .refine((v) => v.password === v.confirm, { path: ['confirm'], message: t('validation.passwordMatch') }),
    forgot: z.object({ email }),
    reset: z
      .object({ token: z.string().trim().min(10, t('validation.required')), password, confirm: z.string() })
      .refine((v) => v.password === v.confirm, { path: ['confirm'], message: t('validation.passwordMatch') }),
    changePassword: z
      .object({ current: z.string().min(1, t('validation.required')), password, confirm: z.string() })
      .refine((v) => v.password === v.confirm, { path: ['confirm'], message: t('validation.passwordMatch') }),
    profile: z.object({ firstName: name, lastName: name, address: z.string().trim().max(300), city: z.string().trim().max(100) }),
  };
};
