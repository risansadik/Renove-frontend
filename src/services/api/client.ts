import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../../domain/model";
import { useAuthStore } from "../../store/use-auth-store.js";

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: unknown;
}

export class ApiClientError extends Error implements ApiError {
  statusCode?: number;
  errors?: unknown;

  constructor({ message, statusCode, errors }: ApiError) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;
    const apiError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? "Something went wrong",
      statusCode: error.response?.data?.statusCode ?? error.response?.status,
      errors: error.response?.data?.errors,
    };

    // Skip token refresh for all authentication-related requests (e.g. login, register, google auth, OTP, refresh token)
    const isAuthRoute = originalRequest?.url && (
      originalRequest.url.includes("/auth/") ||
      originalRequest.url.includes("/admin/login") ||
      originalRequest.url.includes("/admin/logout")
    );

    if (apiError.statusCode === 401 && originalRequest && !isAuthRoute && !(originalRequest as typeof originalRequest & { _retry?: boolean })._retry) {
      (originalRequest as typeof originalRequest & { _retry?: boolean })._retry = true;

      try {
        // Attempt to refresh the token
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL ?? ""}/api/user/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed -> logout
        useAuthStore.getState().logout();
        const path = window.location.pathname;
        if (!path.includes("/login") && !path.includes("/register") && !path.includes("/verify-otp")) {
          window.location.href = "/user/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // For 401/403 or failed refresh
    if (apiError.statusCode === 401 || apiError.statusCode === 403) {
      const session = useAuthStore.getState().session;
      const role = session?.role;

      if (apiError.statusCode === 403) {
        sessionStorage.setItem(
          "blocked_reason",
          apiError.message || "Your account has been blocked by the administrator."
        );
      }

      useAuthStore.getState().logout();
      const path = window.location.pathname;
      if (!path.includes("/login") && !path.includes("/register") && !path.includes("/verify-otp")) {
        if (role === "therapist") {
          window.location.href = "/therapist/login";
        } else {
          window.location.href = "/user/login";
        }
      }
    }

    return Promise.reject(new ApiClientError(apiError));
  }
);

export default apiClient;
