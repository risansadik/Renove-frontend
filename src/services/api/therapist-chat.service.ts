import type { GetMessagesResponse, GetThreadsResponse, SendMessageResponse } from "../../features/therapist-chat/types/therapist-chat.types";
import apiClient from "../../services/api/client";

const therapistChatService = {
  getThreads: async (page = 1, limit = 20): Promise<GetThreadsResponse> => {
    const response = await apiClient.get<GetThreadsResponse>(
      `/api/therapist-chat/threads?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getMessages: async (threadId: string, page = 1, limit = 50): Promise<GetMessagesResponse> => {
    const response = await apiClient.get<GetMessagesResponse>(
      `/api/therapist-chat/threads/${threadId}/messages?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  sendMessage: async (threadId: string, content: string): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>(
      `/api/therapist-chat/threads/${threadId}/messages`,
      { content }
    );
    return response.data;
  },

  markAsRead: async (threadId: string): Promise<void> => {
    await apiClient.patch(`/api/therapist-chat/threads/${threadId}/read`);
  },
};

export default therapistChatService;