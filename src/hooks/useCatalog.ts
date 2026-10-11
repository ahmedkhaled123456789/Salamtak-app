import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { catalogApi } from '@/api/catalog';
import type { Nurse, NurseQuery } from '@/types/nurse';
import type { CareService } from '@/types/service';
import { queryKeys } from './queryKeys';

const NONE: never[] = [];

export function useServices() {
  return useQuery({ queryKey: queryKeys.services, queryFn: () => catalogApi.listServices(), staleTime: 5 * 60_000 });
}

export function useService(slug: string) {
  return useQuery({ queryKey: queryKeys.service(slug), queryFn: () => catalogApi.getService(slug), enabled: Boolean(slug) });
}

export function useNurses(query: NurseQuery) {
  return useQuery({
    queryKey: queryKeys.nurses(query),
    queryFn: () => catalogApi.listNurses(query),
    placeholderData: (previous) => previous,
  });
}

export function useNurse(id: string) {
  return useQuery({ queryKey: queryKeys.nurse(id), queryFn: () => catalogApi.getNurse(id), enabled: Boolean(id) });
}

/**
 * Services + nurses as served by the backend. Components that look things up by id (booking cards, summaries)
 * use this instead of importing bundled sample arrays, so ids, prices and pictures always come from the API.
 */
export function useCatalogData() {
  const query = useQuery({
    queryKey: queryKeys.catalog,
    queryFn: async () => {
      const [services, nurses] = await Promise.all([catalogApi.listServices(), catalogApi.listNurses({})]);
      return { services, nurses };
    },
    staleTime: 5 * 60_000,
  });
  const services: CareService[] = query.data?.services ?? NONE;
  const nurses: Nurse[] = query.data?.nurses ?? NONE;

  /** Matches the live id, the slug, or the id the bundled editorial content (testimonials, articles) uses. */
  const serviceById = useCallback(
    (id: string | undefined) => services.find((s) => s.id === id || s.legacyId === id || s.slug === id),
    [services],
  );
  const nurseById = useCallback((id: string | undefined) => nurses.find((n) => n.id === id), [nurses]);

  return useMemo(
    () => ({
      services,
      nurses,
      serviceById,
      nurseById,
      isLoading: query.isLoading,
      isError: query.isError,
      refetch: query.refetch,
    }),
    [services, nurses, serviceById, nurseById, query.isLoading, query.isError, query.refetch],
  );
}
