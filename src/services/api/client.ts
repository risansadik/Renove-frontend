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
  (error: AxiosError<ApiResponse>) => {
    const apiError: ApiError = {
      message: error.response?.data?.message ?? error.message ?? "Something went wrong",
      statusCode: error.response?.data?.statusCode ?? error.response?.status,
    };

    // Auto logout on unauthorized
    if (apiError.statusCode === 401 || apiError.statusCode === 403) {
      useAuthStore.getState().logout();
      // Only redirect if we are not on login/register pages
      const path = window.location.pathname;
      if (!path.includes("/login") && !path.includes("/register") && !path.includes("/verify-otp")) {
        window.location.href = "/user/login";
      }
    }

    return Promise.reject(new ApiClientError(apiError));
  }
);

export default apiClient;
