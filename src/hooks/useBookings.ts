import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookingsApi, type QuoteInput } from '@/api/bookings';
import type { Booking, BookingStatus } from '@/types/booking';
import { queryKeys } from './queryKeys';

/** States in which the money has been confirmed by the backend (from the provider's signed webhook). */
export const PAID_STATUSES: ReadonlySet<BookingStatus> = new Set([
  'PAID',
  'NURSE_PENDING',
  'NURSE_ACCEPTED',
  'CONFIRMED',
  'CARE_STARTED',
  'CARE_IN_PROGRESS',
  'COMPLETED',
  'DISPUTED',
]);

export function useBookings(enabled = true) {
  return useQuery({ queryKey: queryKeys.bookings, queryFn: () => bookingsApi.list(), enabled });
}

/** `poll` re-reads the booking every few seconds (used while a payment is in flight). */
export function useBooking(id: string, poll = false) {
  return useQuery({
    queryKey: queryKeys.booking(id),
    queryFn: () => bookingsApi.get(id),
    enabled: Boolean(id),
    refetchInterval: (query) => (poll && query.state.data && !PAID_STATUSES.has(query.state.data.status) ? 3000 : false),
  });
}

export function useBookingHistory(id: string) {
  return useQuery({ queryKey: queryKeys.history(id), queryFn: () => bookingsApi.history(id), enabled: Boolean(id) });
}

export function useQuote(input: QuoteInput, enabled: boolean) {
  const { draft } = input;
  return useQuery({
    queryKey: queryKeys.quote([draft.serviceId, draft.nurseId, draft.startDate, draft.days, draft.genderPreference, input.patientCity]),
    queryFn: () => bookingsApi.quote(input),
    enabled,
    retry: false,
  });
}

export function useCreateBooking() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ input, key }: { input: QuoteInput; key: string }) => bookingsApi.create(input, key),
    onSuccess: (booking) => {
      client.setQueryData(queryKeys.booking(booking.id), booking);
      return client.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
}

function useBookingMutation(fn: (id: string, extra?: string) => Promise<Booking>) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ id, extra }: { id: string; extra?: string }) => fn(id, extra),
    onSuccess: (booking) => {
      client.setQueryData(queryKeys.booking(booking.id), booking);
      void client.invalidateQueries({ queryKey: queryKeys.bookings });
      void client.invalidateQueries({ queryKey: queryKeys.history(booking.id) });
      void client.invalidateQueries({ queryKey: queryKeys.wallet });
    },
  });
}

export const useCancelBooking = () => useBookingMutation((id) => bookingsApi.cancel(id));
export const useAcceptBooking = () => useBookingMutation((id) => bookingsApi.accept(id));
export const useRejectBooking = () => useBookingMutation((id, reason) => bookingsApi.reject(id, reason));
export const useStartCare = () => useBookingMutation((id) => bookingsApi.start(id));
export const useCompleteCare = () => useBookingMutation((id) => bookingsApi.complete(id));

export function useStartPayment() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (bookingId: string) => bookingsApi.startPayment(bookingId),
    onSuccess: (_payment, bookingId) => {
      void client.invalidateQueries({ queryKey: queryKeys.booking(bookingId) });
      void client.invalidateQueries({ queryKey: queryKeys.bookings });
    },
  });
}
