export type IsoDateString = string;
export type AuthRole = "user" | "therapist" | "admin";
export type UserStatus = "active" | "blocked";
export type TherapistStatus = "pending" | "approved" | "rejected" | "review_required";
export type Gender = "male" | "female" | "other";


type OrbConfig = {
  size: number;
  top: string;
  left?: string;
  right?: string;
  delay: number;
  duration: number;
  purple: boolean;
};

export const ORB_CONFIG: OrbConfig[] = [
  { size: 320, top: "5%", left: "10%", delay: 0, duration: 7, purple: true },
  { size: 240, top: "55%", right: "8%", delay: 2, duration: 9, purple: false },
  { size: 180, top: "25%", left: "55%", delay: 1, duration: 6, purple: true },
];


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
  averageRating?: number;
  totalRatings?: number;
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
  errors?: unknown;
}

export interface WalletBalanceCardProps {
  pendingBalance: number;
  availableBalance: number;
  withdrawnBalance: number;
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


export const QUOTES = [
  { text: "Every expert was once a beginner.", author: "Helen Hayes" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.", author: "Rikki Rogers" },
  { text: "The only way out is through.", author: "Robert Frost" },
  { text: "Fall seven times. Stand up eight.", author: "Japanese Proverb" },
  { text: "Your present circumstances don't determine where you go — they merely determine where you start.", author: "Nido Qubein" },
  { text: "It always seems impossible until it is done.", author: "Nelson Mandela" },
  { text: "Rock bottom became the solid foundation on which I rebuilt my life.", author: "J.K. Rowling" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The comeback is always stronger than the setback.", author: "Unknown" },
];


