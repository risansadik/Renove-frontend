import apiClient from "./client.ts";
import type { ApiResponse } from "../../domain/model/index.ts";
import type { Notification } from "../../domain/model/index.ts";

const BASE = "/api/notifications";

export const notificationService = {
  getNotifications: () =>
    apiClient.get<ApiResponse<Notification[]>>(BASE),

  markAsRead: (notificationId: string) =>
    apiClient.patch<ApiResponse<null>>(`${BASE}/${notificationId}/read`),

  markAllAsRead: () =>
    apiClient.patch<ApiResponse<null>>(`${BASE}/read-all`),
};