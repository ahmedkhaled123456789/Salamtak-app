import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { newIdempotencyKey } from '@/lib/id';
import { getItem, setItem } from '@/lib/storage';
import type { BookingDraft } from '@/types/booking';

interface DraftState {
  draft: BookingDraft;
  step: number;
  idempotencyKey: string;
  /** Snapshot of the draft the key was issued for; a changed draft needs a new key. */
  keySignature: string;
}

interface BookingDraftValue extends DraftState {
  hydrated: boolean;
  update: (patch: Partial<BookingDraft>) => void;
  setStep: (step: number) => void;
  reset: (seed?: Partial<BookingDraft>) => void;
  /** Same key for a retry of the same draft (safe on flaky networks), a new one once the draft changed. */
  keyForSubmit: () => string;
}

const STORAGE_KEY = 'careflow.bookingDraft.v1';
export const emptyDraft: BookingDraft = { days: 3, genderPreference: 'any' };

const signature = (d: BookingDraft) =>
  JSON.stringify([d.serviceId, d.startDate, d.days, d.genderPreference, d.nurseId, d.address, d.notes]);

const fresh = (seed?: Partial<BookingDraft>): DraftState => {
  const draft = { ...emptyDraft, ...seed };
  return { draft, step: 0, idempotencyKey: newIdempotencyKey(), keySignature: signature(draft) };
};

const BookingDraftContext = createContext<BookingDraftValue | null>(null);

/** Keeps the wizard state across steps and app restarts (AsyncStorage; contains no credentials). */
export function BookingDraftProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DraftState>(() => fresh());
  const [hydrated, setHydrated] = useState(false);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const raw = await getItem(STORAGE_KEY);
      if (alive && raw) {
        try {
          const parsed = JSON.parse(raw) as DraftState;
          // Drop a stale start date rather than offering a date in the past.
          if (parsed.draft.startDate && parsed.draft.startDate < new Date().toISOString().slice(0, 10)) parsed.draft.startDate = undefined;
          setState(parsed);
        } catch {
          /* corrupt draft: start fresh */
        }
      }
      if (alive) setHydrated(true);
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (hydrated) void setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<BookingDraft>) => {
    setState((s) => ({ ...s, draft: { ...s.draft, ...patch } }));
  }, []);
  const setStep = useCallback((step: number) => setState((s) => ({ ...s, step })), []);
  const reset = useCallback((seed?: Partial<BookingDraft>) => setState(fresh(seed)), []);

  const keyForSubmit = useCallback(() => {
    const s = stateRef.current;
    const sig = signature(s.draft);
    if (sig === s.keySignature) return s.idempotencyKey;
    const key = newIdempotencyKey();
    setState((prev) => ({ ...prev, idempotencyKey: key, keySignature: sig }));
    return key;
  }, []);

  const value = useMemo(
    () => ({ ...state, hydrated, update, setStep, reset, keyForSubmit }),
    [state, hydrated, update, setStep, reset, keyForSubmit],
  );
  return <BookingDraftContext.Provider value={value}>{children}</BookingDraftContext.Provider>;
}

export function useBookingDraft(): BookingDraftValue {
  const ctx = useContext(BookingDraftContext);
  if (!ctx) throw new Error('useBookingDraft must be used inside BookingDraftProvider');
  return ctx;
}
