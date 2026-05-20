export type IsoDateString = string;
export type AuthRole = "user" | "therapist" | "admin";
export type UserStatus = "active" | "blocked";
export type TherapistStatus = "pending" | "approved" | "rejected" | "review_required";
export type Gender = "male" | "female" | "other";

export interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
  status: UserStatus;
  profileImage?: string;
  isGoogleAuth?: boolean;
  createdAt: IsoDateString;
}

export interface Therapist {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  qualification: string;
  specialization: string[];
  experience: number;
  consultationFee: number;
  bio: string;
  certifications?: string[];
  certificationFiles?: string[];
  profileImage?: string;
  status: TherapistStatus;
  isVerified: boolean;
  pendingUpdates?: Partial<Therapist>;
  adminRejectionReason?: string;
  createdAt: IsoDateString;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  meta?: PaginationMeta;
}

export interface AuthUserData {
  user: User;
}

export interface AuthTherapistData {
  therapist: Therapist;
}

export interface AuthAdminData {
  admin: Admin;
}
