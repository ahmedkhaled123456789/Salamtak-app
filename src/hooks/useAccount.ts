import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { nurseApi, type NewAvailability } from '@/api/nurse';
import { useAuth } from '@/state/auth';
import { queryKeys } from './queryKeys';

export function usePatientProfile(enabled = true) {
  return useQuery({ queryKey: queryKeys.patientProfile, queryFn: () => authApi.patientProfile(), enabled });
}

export function useUpdateProfile() {
  const client = useQueryClient();
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: async (v: { firstName: string; lastName: string; address: string; city: string; patient: boolean }) => {
      const user = await authApi.updateAccount({ firstName: v.firstName, lastName: v.lastName });
      // only patients have a /patients/me profile (nurses would get 403)
      if (v.patient) await authApi.updatePatientProfile({ address: v.address, city: v.city });
      return user;
    },
    onSuccess: (user) => {
      setUser(user);
      return client.invalidateQueries({ queryKey: queryKeys.patientProfile });
    },
  });
}

export function useUploadAvatar() {
  const { setUser } = useAuth();
  return useMutation({
    mutationFn: (file: { uri: string; name: string; type: string }) => authApi.uploadAvatar(file),
    onSuccess: (user) => setUser(user),
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: (v: { current: string; next: string }) => authApi.changePassword(v.current, v.next) });
}

/* ------------------------------- nurse role ------------------------------- */
export function useNurseSelf(enabled = true) {
  return useQuery({ queryKey: queryKeys.nurseSelf, queryFn: () => nurseApi.me(), enabled });
}

export function useSetNurseStatus() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (status: 'ACTIVE' | 'INACTIVE') => nurseApi.setStatus(status),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.nurseSelf }),
  });
}

export function useAvailability(enabled = true) {
  return useQuery({ queryKey: queryKeys.availability, queryFn: () => nurseApi.availability(), enabled });
}

export function useAddAvailability() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (input: NewAvailability) => nurseApi.addAvailability(input),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.availability }),
  });
}

export function useRemoveAvailability() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => nurseApi.removeAvailability(id),
    onSuccess: () => client.invalidateQueries({ queryKey: queryKeys.availability }),
  });
}

export function useWallet(enabled = true) {
  return useQuery({ queryKey: queryKeys.wallet, queryFn: () => nurseApi.wallet(), enabled });
}

export function useWalletTransactions(enabled = true) {
  return useQuery({ queryKey: queryKeys.transactions, queryFn: () => nurseApi.transactions(), enabled });
}
