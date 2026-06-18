export type TherapistChatSenderRole = "user" | "therapist";

export interface ChatThreadDTO {
  id: string;
  userId: string | { id: string; name: string; email: string };
  therapistId: string | { id: string; name: string };
  expiresAt: string;
  lastBookingId: string;
  isActive: boolean;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChatMessageDTO {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: TherapistChatSenderRole;
  content: string;
  isRead: boolean;
  createdAt?: string;
}

export interface GetThreadsResponse {
  success: boolean;
  data: ChatThreadDTO[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetMessagesResponse {
  success: boolean;
  data: ChatMessageDTO[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SendMessageResponse {
  success: boolean;
  data: ChatMessageDTO;
}

export const THERAPIST_CHAT_EVENTS = {
  JOIN: "therapist-chat:join",
  LEAVE: "therapist-chat:leave",
  MESSAGE: "therapist-chat:message",
  READ: "therapist-chat:read",
  THREAD_UPDATED: "therapist-chat:thread-updated",
} as const;

export interface UseTherapistChatReturn {
  threads: ChatThreadDTO[];
  threadsLoading: boolean;
  selectedThread: ChatThreadDTO | null;
  messages: ChatMessageDTO[];
  messagesLoading: boolean;
  sending: boolean;
  selectThread: (thread: ChatThreadDTO) => void;
  sendMessage: (content: string) => Promise<void>;
  getOtherPartyName: (thread: ChatThreadDTO) => string;
}

export interface ChatWindowProps {
  thread: ChatThreadDTO;
  messages: ChatMessageDTO[];
  messagesLoading: boolean;
  sending: boolean;
  myId: string;
  otherPartyName: string;
  onSend: (content: string) => Promise<void>;
}

export interface ChatThreadListProps {
    threads: ChatThreadDTO[];
    selectedThreadId: string | undefined;
    onSelect: (thread: ChatThreadDTO) => void;
    getOtherPartyName: (thread: ChatThreadDTO) => string;
}

export interface ChatMessageBubbleProps {
  message: ChatMessageDTO;
  isMine: boolean;
}