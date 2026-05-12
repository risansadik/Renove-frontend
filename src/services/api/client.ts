import axios, { AxiosError } from "axios";
import type { ApiResponse } from "../../domain/model";

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: unknown;
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

    return Promise.reject(apiError);
  }
);

export default apiClient;
