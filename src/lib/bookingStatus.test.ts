import { BOOKING_STATUSES } from '@/types/booking';
import { mEn } from '@/i18n/mobileEn';
import { nurseActions, patientActions, statusHintKey, statusKey, statusTone, tabForStatus } from './bookingStatus';

describe('booking status model', () => {
  it('covers every backend state with a label, hint and tone', () => {
    for (const s of BOOKING_STATUSES) {
      expect(statusTone[s]).toBeDefined();
      expect(`status${s}` in mEn).toBe(true);
      expect(`hint${s}` in mEn).toBe(true);
      expect(statusKey[s]).toBe(`m.status${s}`);
      expect(statusHintKey[s]).toBe(`m.hint${s}`);
    }
  });

  it('files each state under one patient tab', () => {
    expect(tabForStatus('PAYMENT_PENDING')).toBe('upcoming');
    expect(tabForStatus('NURSE_PENDING')).toBe('upcoming');
    expect(tabForStatus('CARE_IN_PROGRESS')).toBe('in_progress');
    expect(tabForStatus('COMPLETED')).toBe('completed');
    expect(tabForStatus('NURSE_REJECTED')).toBe('cancelled');
    expect(tabForStatus('REFUNDED')).toBe('cancelled');
  });

  it('offers pay only while payment is pending and cancel only where the backend allows it', () => {
    expect(patientActions({ status: 'PAYMENT_PENDING' })).toEqual({ canPay: true, canCancel: true });
    expect(patientActions({ status: 'CONFIRMED' })).toEqual({ canPay: false, canCancel: true });
    expect(patientActions({ status: 'COMPLETED' })).toEqual({ canPay: false, canCancel: false });
    expect(patientActions({ status: 'PAID' }).canPay).toBe(false);
  });

  it('lets a nurse respond only to pending requests', () => {
    expect(nurseActions({ status: 'NURSE_PENDING' }).canRespond).toBe(true);
    expect(nurseActions({ status: 'CONFIRMED' })).toMatchObject({ canRespond: false, canStart: true });
    expect(nurseActions({ status: 'CARE_STARTED' }).canComplete).toBe(true);
    expect(nurseActions({ status: 'COMPLETED' })).toEqual({ canRespond: false, canStart: false, canComplete: false });
  });
});
