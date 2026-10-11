export type Role = 'PATIENT' | 'NURSE' | 'ADMIN' | 'FINANCE_APPROVER' | string;

export interface AccountUser {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface PatientProfile {
  address?: string;
  city?: string;
}

export interface SignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  /** E.164, e.g. +971501234567 (required by the backend). */
  phone: string;
  password: string;
  role: 'PATIENT' | 'NURSE';
}
