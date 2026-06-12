import { Award, BookOpen, Clock, Flame, Frown, Meh, Smile, Sparkles, Target } from "lucide-react";

export type IsoDateString = string;
export type AuthRole = "user" | "therapist" | "admin";
export type UserStatus = "active" | "blocked";
export type TherapistStatus = "pending" | "approved" | "rejected" | "review_required";
export type Gender = "male" | "female" | "other";

export type CallStatus =
  "idle"
  | "connecting"
  | "waiting"
  | "connected"
  | "reconnecting"
  | "ended";
  

export const CALL_EVENTS = {
  JOIN: "call:join",
  OFFER: "call:offer",
  ANSWER: "call:answer",
  ICE_CANDIDATE: "call:ice-candidate",
  LEAVE: "call:leave",
  PEER_JOINED: "call:peer-joined",
  PEER_LEFT: "call:peer-left",
  MEDIA_STATE: "call:media-state",
} as const;

export const STATUS_CONFIG = {
  idle: { label: "Initializing…", color: "var(--fg-muted)" },
  connecting: { label: "Setting up your camera…", color: "var(--fg-muted)" },
  waiting: { label: "Waiting for the other person to join…", color: "var(--accent-primary)" },
  connected: { label: "Connected", color: "var(--accent-secondary)" },
  reconnecting: { label: "Connection interrupted — reconnecting…", color: "#f59e0b" },
  ended: { label: "Call ended", color: "var(--fg-muted)" },
};

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

export interface Transaction {
  id: string;
  walletId: string;
  walletType: string;
  amount: number;
  type: "credit" | "debit";
  description: string;
  status: "pending" | "completed" | "failed";
  bookingId?: string;
  consultationFee?: number;
  commissionPercentage?: number;
  platformFee?: number;
  totalPaid?: number;
  therapistEarnings?: number;
  refundAmount?: number;
  createdAt: string;
}

export interface FinanceStats {
  totalRevenue: number;
  totalTherapistEarnings: number;
  totalPendingPayouts: number;
  totalWithdrawn: number;
  totalRefunded: number;
  commissionPercentage: number;
  transactions: Transaction[];
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

export interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  callStatus: CallStatus;
  isMuted: boolean;
  isCameraOff: boolean;
  remoteMuted: boolean;
  remoteCameraOff: boolean;
  isRecording: boolean;
  toggleMute: () => void;
  toggleCamera: () => void;
  joinCall: (bookingId: string) => Promise<void>;
  leaveCall: () => void;
  startRecording: () => void;
  stopRecording: () => void;
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


export const MOOD_OPTIONS = [
  { value: "great", icon: Smile, label: "Great", color: "#22c55e", bg: "rgba(34,197,94,0.1)" },
  { value: "good", icon: Smile, label: "Good", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
  { value: "okay", icon: Meh, label: "Okay", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  { value: "low", icon: Frown, label: "Low", color: "#6366f1", bg: "rgba(99,102,241,0.1)" },
  { value: "crisis", icon: Frown, label: "Crisis", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
] as const;

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  targetDate?: string;
  createdAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: typeof Award;
  color: string;
  check: (stats: {
    moodLogsCount: number;
    journalsCount: number;
    completedGoalsCount: number;
    sessionsCount: number;
    streakDays: number;
  }) => boolean;
}

export const MILESTONES: Milestone[] = [
  {
    id: "first_mood",
    title: "First Step Taken",
    description: "Log your first emotional state",
    icon: Smile,
    color: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    check: (s) => s.moodLogsCount > 0,
  },
  {
    id: "reflective",
    title: "Reflective Mind",
    description: "Write your first journal entry",
    icon: BookOpen,
    color: "linear-gradient(135deg, #10b981, #3b82f6)",
    check: (s) => s.journalsCount > 0,
  },
  {
    id: "streak_3",
    title: "Consistent Spirit",
    description: "Reach a 3-day recovery streak",
    icon: Flame,
    color: "linear-gradient(135deg, #f59e0b, #ef4444)",
    check: (s) => s.streakDays >= 3,
  },
  {
    id: "goal_getter",
    title: "Goal Achiever",
    description: "Complete at least one recovery goal",
    icon: Target,
    color: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    check: (s) => s.completedGoalsCount > 0,
  },
  {
    id: "session_1",
    title: "Healing Journey",
    description: "Attend your first therapy session",
    icon: Clock,
    color: "linear-gradient(135deg, #6366f1, #a855f7)",
    check: (s) => s.sessionsCount > 0,
  },
  {
    id: "deep_journal",
    title: "Insight Seeker",
    description: "Log 3 journal entries",
    icon: Sparkles,
    color: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    check: (s) => s.journalsCount >= 3,
  },
];


