export const API_ROUTES = {
  USER: {
    REGISTER: "/api/user/auth/register",
    VERIFY_OTP: "/api/user/auth/verify-otp",
    RESEND_OTP: "/api/user/auth/resend-otp",
    LOGIN: "/api/user/auth/login",
    GOOGLE: "/api/user/auth/google",
    FORGOT_PASSWORD: "/api/user/auth/forgot-password",
    RESET_PASSWORD: "/api/user/auth/reset-password",
    LOGOUT: "/api/user/auth/logout",
  },
  THERAPIST: {
    REGISTER: "/api/therapist/auth/register",
    VERIFY_OTP: "/api/therapist/auth/verify-otp",
    RESEND_OTP: "/api/therapist/auth/resend-otp",
    LOGIN: "/api/therapist/auth/login",
    LOGOUT: "/api/therapist/auth/logout",
  },
  ADMIN: {
    LOGIN: "/api/admin/login",
    LOGOUT: "/api/admin/logout",
    USERS: "/api/admin/users",
    USER_STATUS: (id: string) => `/api/admin/users/${id}/status`,
    THERAPISTS: "/api/admin/therapists",
    THERAPIST_STATUS: (id: string) => `/api/admin/therapists/${id}/status`,
  },
} as const;