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
  errors?: unknown;
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
  toggleMute: () => void;
  toggleCamera: () => void;
  joinCall: (bookingId: string) => Promise<void>;
  leaveCall: () => void;
}

