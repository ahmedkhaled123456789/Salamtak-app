import type { TranslationKey } from '@/i18n';
import type { BadgeTone } from '@/components/ui/Badge';
import type { Booking, BookingStatus, BookingTab } from '@/types/booking';

export function tabForStatus(status: BookingStatus): BookingTab {
  switch (status) {
    case 'CARE_STARTED':
    case 'CARE_IN_PROGRESS':
      return 'in_progress';
    case 'COMPLETED':
      return 'completed';
    case 'CANCELLED':
    case 'EXPIRED':
    case 'NURSE_REJECTED':
    case 'FAILED':
    case 'REFUND_PENDING':
    case 'REFUNDED':
      return 'cancelled';
    default:
      return 'upcoming';
  }
}

export const statusTone: Record<BookingStatus, BadgeTone> = {
  PENDING: 'amber',
  PAYMENT_PENDING: 'amber',
  PAID: 'mint',
  NURSE_PENDING: 'amber',
  NURSE_ACCEPTED: 'mint',
  NURSE_REJECTED: 'coral',
  CONFIRMED: 'mint',
  CARE_STARTED: 'teal',
  CARE_IN_PROGRESS: 'teal',
  COMPLETED: 'neutral',
  CANCELLED: 'coral',
  EXPIRED: 'coral',
  REFUND_PENDING: 'amber',
  REFUNDED: 'neutral',
  DISPUTED: 'coral',
  FAILED: 'coral',
};

export const statusKey: Record<BookingStatus, TranslationKey> = {
  PENDING: 'm.statusPENDING',
  PAYMENT_PENDING: 'm.statusPAYMENT_PENDING',
  PAID: 'm.statusPAID',
  NURSE_PENDING: 'm.statusNURSE_PENDING',
  NURSE_ACCEPTED: 'm.statusNURSE_ACCEPTED',
  NURSE_REJECTED: 'm.statusNURSE_REJECTED',
  CONFIRMED: 'm.statusCONFIRMED',
  CARE_STARTED: 'm.statusCARE_STARTED',
  CARE_IN_PROGRESS: 'm.statusCARE_IN_PROGRESS',
  COMPLETED: 'm.statusCOMPLETED',
  CANCELLED: 'm.statusCANCELLED',
  EXPIRED: 'm.statusEXPIRED',
  REFUND_PENDING: 'm.statusREFUND_PENDING',
  REFUNDED: 'm.statusREFUNDED',
  DISPUTED: 'm.statusDISPUTED',
  FAILED: 'm.statusFAILED',
};

/** One plain-language sentence per state, so every one of the 16 states is explained. */
export const statusHintKey: Record<BookingStatus, TranslationKey> = {
  PENDING: 'm.hintPENDING',
  PAYMENT_PENDING: 'm.hintPAYMENT_PENDING',
  PAID: 'm.hintPAID',
  NURSE_PENDING: 'm.hintNURSE_PENDING',
  NURSE_ACCEPTED: 'm.hintNURSE_ACCEPTED',
  NURSE_REJECTED: 'm.hintNURSE_REJECTED',
  CONFIRMED: 'm.hintCONFIRMED',
  CARE_STARTED: 'm.hintCARE_STARTED',
  CARE_IN_PROGRESS: 'm.hintCARE_IN_PROGRESS',
  COMPLETED: 'm.hintCOMPLETED',
  CANCELLED: 'm.hintCANCELLED',
  EXPIRED: 'm.hintEXPIRED',
  REFUND_PENDING: 'm.hintREFUND_PENDING',
  REFUNDED: 'm.hintREFUNDED',
  DISPUTED: 'm.hintDISPUTED',
  FAILED: 'm.hintFAILED',
};

const PATIENT_CANCELLABLE: ReadonlySet<BookingStatus> = new Set(['PAYMENT_PENDING', 'NURSE_PENDING', 'NURSE_ACCEPTED', 'CONFIRMED']);

/** Pre-checks mirroring the backend state machine; the server remains the authority and may still answer 409. */
export const patientActions = (b: Pick<Booking, 'status'>) => ({
  canPay: b.status === 'PAYMENT_PENDING',
  canCancel: PATIENT_CANCELLABLE.has(b.status),
});

export const nurseActions = (b: Pick<Booking, 'status'>) => ({
  canRespond: b.status === 'NURSE_PENDING',
  canStart: b.status === 'CONFIRMED' || b.status === 'NURSE_ACCEPTED',
  canComplete: b.status === 'CARE_STARTED' || b.status === 'CARE_IN_PROGRESS',
});

export const isFinal = (s: BookingStatus) =>
  s === 'COMPLETED' || s === 'CANCELLED' || s === 'EXPIRED' || s === 'NURSE_REJECTED' || s === 'REFUNDED' || s === 'FAILED';
