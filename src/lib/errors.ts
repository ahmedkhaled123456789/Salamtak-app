import { ApiError } from '@/api/client';
import type { TranslationKey } from '@/i18n';

/** Localized, user-safe text for a failed request. Never echoes raw server payloads. */
export function errorKey(error: unknown, context: 'auth' | 'general' | 'booking' = 'general'): TranslationKey {
  if (!(error instanceof ApiError)) return 'common.errorBody';
  switch (error.code) {
    case 'invalid_credentials':
      return 'auth.invalidCredentials';
    case 'network':
    case 'timeout':
    case 'not_configured':
      return 'm.offlineBody';
    case 'rate_limited':
      return 'm.rateLimited';
    case 'forbidden':
      return 'm.forbiddenBody';
    case 'conflict':
      if (context === 'auth') return 'm.accountExists';
      if (context === 'booking') return 'booking.conflict';
      return 'm.conflictBody';
    case 'unauthorized':
      return context === 'auth' ? 'auth.invalidCredentials' : 'auth.sessionExpired';
    default:
      return 'common.errorBody';
  }
}
