import apiClient from "./client.ts";
import { API_ROUTES } from "../../core/constants/api-routes.ts";
import type { ApiResponse } from "../../domain/model/index.ts";

export interface ChatMessage {
  id?: string;
  role: "user" | "assistant";
  content: string;
  createdAt?: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
}

export const chatApiService = {
  getSessions: () =>
    apiClient.get<ApiResponse<ChatSession[]>>(API_ROUTES.USER.CHAT_SESSIONS),

  createSession: () =>
    apiClient.post<ApiResponse<ChatSession>>(API_ROUTES.USER.CHAT_SESSIONS),

  deleteSession: (sessionId: string) =>
    apiClient.delete<ApiResponse<null>>(API_ROUTES.USER.CHAT_SESSION(sessionId)),

  getSessionMessages: (sessionId: string) =>
    apiClient.get<ApiResponse<ChatMessage[]>>(API_ROUTES.USER.CHAT_SESSION_MESSAGES(sessionId)),

  streamMessage: (sessionId: string, message: string): Promise<Response> =>
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}${API_ROUTES.USER.CHAT_MESSAGE}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message }),
      }
    ),
};