import { useState, useEffect, useCallback, useRef } from "react";
import therapistChatService from "../../../services/api/therapist-chat.service";
import { type ChatThreadDTO, type ChatMessageDTO, type UseTherapistChatReturn, THERAPIST_CHAT_EVENTS } from "../types/therapist-chat.types";
import { selectAuthSession, useAuthStore } from "../../../store/use-auth-store";
import { socketService } from "../../../services/socket";

export const useTherapistChat = (): UseTherapistChatReturn => {
  const session = useAuthStore(selectAuthSession);
  const role = session?.role === "therapist" ? "therapist" : "user";

  const [threads, setThreads] = useState<ChatThreadDTO[]>([]);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [selectedThread, setSelectedThread] = useState<ChatThreadDTO | null>(null);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const selectedThreadIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setThreadsLoading(true);
      try {
        const res = await therapistChatService.getThreads();
        if (!cancelled) setThreads(res.data);
      } finally {
        if (!cancelled) setThreadsLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
  socketService.connect();
  const socket = socketService.getSocket();

  socket.on(
    THERAPIST_CHAT_EVENTS.MESSAGE,
    (payload: ChatMessageDTO) => {
      const isCurrentThread = payload.threadId === selectedThreadIdRef.current;

      if (isCurrentThread) {
        setMessages((prev) => [...prev, payload]);
      }

      setThreads((prev) => {
        const idx = prev.findIndex((t) => t.id === payload.threadId);
        if (idx === -1) return prev;
        
        const targetThread = prev[idx];
        const updated = { 
          ...targetThread, 
          updatedAt: payload.createdAt,
          unreadCount: isCurrentThread ? 0 : (targetThread.unreadCount ?? 0) + 1
        };
        
        const rest = prev.filter((_, i) => i !== idx);
        return [updated, ...rest];
      });
    }
  );

  socket.on(
    THERAPIST_CHAT_EVENTS.THREAD_UPDATED,
    (payload: { threadId: string; expiresAt: string }) => {
      setThreads((prev) =>
        prev.map((t) =>
          t.id === payload.threadId
            ? { ...t, expiresAt: payload.expiresAt, isActive: new Date(payload.expiresAt) > new Date() }
            : t
        )
      );
      if (selectedThread?.id === payload.threadId) {
        setSelectedThread((prev) =>
          prev
            ? { ...prev, expiresAt: payload.expiresAt, isActive: new Date(payload.expiresAt) > new Date() }
            : prev
        );
      }
    }
  );

  return () => {
    socket.off(THERAPIST_CHAT_EVENTS.MESSAGE);
    socket.off(THERAPIST_CHAT_EVENTS.THREAD_UPDATED);
  };
}, [selectedThread?.id]);
  const selectThread = useCallback(
  async (thread: ChatThreadDTO) => {
    if (selectedThreadIdRef.current) {
      socketService.getSocket().emit(THERAPIST_CHAT_EVENTS.LEAVE, selectedThreadIdRef.current);
    }

    setSelectedThread(thread);
    selectedThreadIdRef.current = thread.id;
    setMessages([]);
    setMessagesLoading(true);

    setThreads((prev) =>
      prev.map((t) => (t.id === thread.id ? { ...t, unreadCount: 0 } : t))
    );

    socketService.getSocket().emit(THERAPIST_CHAT_EVENTS.JOIN, thread.id);

    try {
      const res = await therapistChatService.getMessages(thread.id);
      setMessages(res.data);
      
      await therapistChatService.markAsRead(thread.id);
      socketService.getSocket().emit(THERAPIST_CHAT_EVENTS.READ, {
        threadId: thread.id,
        readerRole: role,
      });
    } finally {
      setMessagesLoading(false);
    }
  },
  [role]
);
  useEffect(() => {
    return () => {
      if (selectedThreadIdRef.current) {
        socketService.getSocket().emit(THERAPIST_CHAT_EVENTS.LEAVE, selectedThreadIdRef.current);
      }
    };
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedThread || !content.trim()) return;
      setSending(true);
      try {
        const res = await therapistChatService.sendMessage(selectedThread.id, content.trim());
        const newMessage = res.data;
        setMessages((prev) => [...prev, newMessage]);
        socketService.getSocket().emit(THERAPIST_CHAT_EVENTS.MESSAGE, newMessage);
        setThreads((prev) => {
          const idx = prev.findIndex((t) => t.id === selectedThread.id);
          if (idx === -1) return prev;
          const updated = { ...prev[idx], updatedAt: newMessage.createdAt };
          const rest = prev.filter((_, i) => i !== idx);
          return [updated, ...rest];
        });
      } finally {
        setSending(false);
      }
    },
    [selectedThread]
  );

  const getOtherPartyName = useCallback(
    (thread: ChatThreadDTO): string => {
      if (role === "therapist") {
        return typeof thread.userId === "object"
          ? thread.userId.name
          : `Client #${(thread.userId as string).slice(-4)}`;
      }
      return typeof thread.therapistId === "object"
        ? thread.therapistId.name
        : `Therapist #${(thread.therapistId as string).slice(-4)}`;
    },
    [role]
  );

  return {
    threads,
    threadsLoading,
    selectedThread,
    messages,
    messagesLoading,
    sending,
    selectThread,
    sendMessage,
    getOtherPartyName,
  };
};