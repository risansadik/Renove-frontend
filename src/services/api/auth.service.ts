import apiClient from "./client.js";
import { API_ROUTES } from "../../core/constants/api-routes.js";
import type {
  ApiResponse,
  AuthAdminData,
  AuthTherapistData,
  AuthUserData,
  Gender,
  Therapist,
  TherapistStatus,
  User,
  UserStatus,
} from "../../domain/model/index.js";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterTherapistPayload {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  qualification: string;
  specialization: string[];
  experience: number;
  consultationFee: number;
  bio: string;
  certifications?: string[];
}

type RegisterResponse = ApiResponse<{ email: string }>;
type EmptyResponse = ApiResponse<null>;

export const userAuthService = {
  register: (data: RegisterUserPayload) =>
    apiClient.post<RegisterResponse>(API_ROUTES.USER.REGISTER, data),

  verifyOtp: (data: VerifyOtpPayload) =>
    apiClient.post<EmptyResponse>(API_ROUTES.USER.VERIFY_OTP, data),

  resendOtp: (email: string) =>
    apiClient.post<EmptyResponse>(API_ROUTES.USER.RESEND_OTP, { email }),

  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthUserData>>(API_ROUTES.USER.LOGIN, data),

  googleAuth: (idToken: string) =>
    apiClient.post<ApiResponse<AuthUserData>>(API_ROUTES.USER.GOOGLE, { idToken }),

  forgotPassword: (email: string) =>
    apiClient.post<EmptyResponse>(API_ROUTES.USER.FORGOT_PASSWORD, { email }),

  verifyResetOtp: (data: VerifyOtpPayload) =>
    apiClient.post<EmptyResponse>(API_ROUTES.USER.VERIFY_RESET_OTP, data),

  resetPassword: (data: ResetPasswordPayload) =>
    apiClient.post<EmptyResponse>(API_ROUTES.USER.RESET_PASSWORD, data),

  logout: () => apiClient.post<EmptyResponse>(API_ROUTES.USER.LOGOUT),
  refreshToken: () => apiClient.post<EmptyResponse>(API_ROUTES.USER.REFRESH_TOKEN),
};

export const therapistAuthService = {
  register: (data: FormData) =>
    apiClient.post<RegisterResponse>(API_ROUTES.THERAPIST.REGISTER, data),

  verifyOtp: (data: VerifyOtpPayload) =>
    apiClient.post<EmptyResponse>(API_ROUTES.THERAPIST.VERIFY_OTP, data),

  resendOtp: (email: string) =>
    apiClient.post<EmptyResponse>(API_ROUTES.THERAPIST.RESEND_OTP, { email }),

  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthTherapistData>>(API_ROUTES.THERAPIST.LOGIN, data),

  forgotPassword: (email: string) =>
    apiClient.post<EmptyResponse>(API_ROUTES.THERAPIST.FORGOT_PASSWORD, { email }),

  verifyResetOtp: (data: VerifyOtpPayload) =>
    apiClient.post<EmptyResponse>(API_ROUTES.THERAPIST.VERIFY_RESET_OTP, data),

  resetPassword: (data: ResetPasswordPayload) =>
    apiClient.post<EmptyResponse>(API_ROUTES.THERAPIST.RESET_PASSWORD, data),

  logout: () => apiClient.post<EmptyResponse>(API_ROUTES.THERAPIST.LOGOUT),
};

export const adminService = {
  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthAdminData>>(API_ROUTES.ADMIN.LOGIN, data),

  logout: () => apiClient.post<EmptyResponse>(API_ROUTES.ADMIN.LOGOUT),

  getUsers: (page: number = 1, limit: number = 10) => 
    apiClient.get<ApiResponse<User[]>>(`${API_ROUTES.ADMIN.USERS}?page=${page}&limit=${limit}`),

  updateUserStatus: (id: string, status: UserStatus) =>
    apiClient.patch<ApiResponse<User>>(API_ROUTES.ADMIN.USER_STATUS(id), { status }),

  getTherapists: (page: number = 1, limit: number = 10) =>
    apiClient.get<ApiResponse<Therapist[]>>(`${API_ROUTES.ADMIN.THERAPISTS}?page=${page}&limit=${limit}`),

  updateTherapistStatus: (id: string, status: TherapistStatus) =>
    apiClient.patch<ApiResponse<Therapist>>(API_ROUTES.ADMIN.THERAPIST_STATUS(id), {
      status,
    }),
};

/* ── User Dashboard ────────────────────────────────────── */
export interface DashboardMission {
  id: string;
  label: string;
  xp: number;
  done: boolean;
}

export interface DashboardHabit {
  label: string;
  color: string;
  streak: number;
  done: boolean[];
}

export interface DashboardData {
  xp: number;
  level: number;
  xpPercent: number;
  streakDays: number;
  totalSessionsDone: number;
  pendingPayments: number;
  missions: DashboardMission[];
  recentMoods: { mood: string; loggedAt: string }[];
  habits: DashboardHabit[];
  weekDays: string[];
}

export interface ApprovedTherapist {
  id: string;
  name: string;
  specialization: string[];
  experience: number;
  consultationFee: number;
  bio: string;
  avatar: string;
  profileImage?: string;
}

export const userDashboardService = {
  getDashboard: () =>
    apiClient.get<ApiResponse<DashboardData>>(API_ROUTES.USER.DASHBOARD),

  logMood: (mood: string) =>
    apiClient.post<EmptyResponse>(API_ROUTES.USER.MOOD, { mood }),

  toggleMission: (missionId: string) =>
    apiClient.patch<ApiResponse<{ missions: DashboardMission[] }>>(
      API_ROUTES.USER.MISSION(missionId)
    ),

  getTherapists: (page: number = 1, limit: number = 10) =>
    apiClient.get<ApiResponse<ApprovedTherapist[]>>(`${API_ROUTES.USER.THERAPISTS}?page=${page}&limit=${limit}`),
};

/* ── Therapist Dashboard ───────────────────────────────── */
export interface TherapistDashboardData {
  therapistName: string;
  specialization: string[];
  experience: number;
  consultationFee: number;
  status: string;
  platformUsers: number;
  joinedDaysAgo: number;
  sessionsToday: number;
  upcomingSessionsThisWeek: number;
  wallet: {
    pendingBalance: number;
    availableBalance: number;
    withdrawnBalance: number;
  };
}

export const therapistDashboardService = {
  getDashboard: () =>
    apiClient.get<ApiResponse<TherapistDashboardData>>(API_ROUTES.THERAPIST.DASHBOARD),
};

