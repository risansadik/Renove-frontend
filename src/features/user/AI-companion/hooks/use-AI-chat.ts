import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { chatApiService, type ChatMessage, type ChatSession } from "../../../../services/api/chat.service.ts";

export const useAiChat = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    setLoadingMessages(true);
    try {
      const res = await chatApiService.getSessionMessages(sessionId);
      const msgs = res.data.data ?? [];
      if (msgs.length === 0) {
        setMessages([
          {
            role: "assistant",
            content: "Hey! I'm Nova, your recovery companion. I'm here whenever you need to talk. How are you feeling today?",
          },
        ]);
      } else {
        setMessages(msgs);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    chatApiService
      .getSessions()
      .then(async (res) => {
        const list = res.data.data ?? [];
        setSessions(list);
        if (list.length > 0) {
          await loadSession(list[0].id);
        }
      })
      .catch(() => toast.error("Couldn't load conversations"))
      .finally(() => setLoadingSessions(false));
  }, []);

  const handleSendText = useCallback(async (text: string) => {
    if (!text.trim() || streaming) return;

    let sessionId = activeSessionId;
    if (!sessionId) {
      try {
        const res = await chatApiService.createSession();
        const session = res.data.data!;
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(session.id);
        sessionId = session.id;
      } catch {
        toast.error("Couldn't start a new chat");
        return;
      }
    }

    const isFirstMessage = messages.filter((m) => m.role === "user").length === 0;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await chatApiService.streamMessage(sessionId, text);
      if (!response.body) throw new Error("No stream body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const parsed = JSON.parse(line.slice(6));
            if (parsed.token) {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + parsed.token,
                };
                return updated;
              });
            }
          } catch {
            // skip malformed chunks
          }
        }
      }

      if (isFirstMessage) {
        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId
              ? { ...s, title: text.slice(0, 40) + (text.length > 40 ? "…" : "") }
              : s
          )
        );
      }
    } catch {
      toast.error("Nova is unavailable right now. Try again shortly.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  }, [streaming, activeSessionId, messages]);

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    if (!prompt || !activeSessionId) return;
    setSearchParams({});
    setInput(prompt);
    setTimeout(() => handleSendText(prompt), 100);
  }, [activeSessionId, searchParams, handleSendText, setSearchParams]);

  const handleNewSession = async () => {
    try {
      const res = await chatApiService.createSession();
      const session = res.data.data!;
      setSessions((prev) => [session, ...prev]);
      await loadSession(session.id);
    } catch {
      toast.error("Couldn't create new chat");
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    setDeletingId(sessionId);
    try {
      await chatApiService.deleteSession(sessionId);
      const remaining = sessions.filter((s) => s.id !== sessionId);
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        if (remaining.length > 0) {
          await loadSession(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setMessages([]);
        }
      }
    } catch {
      toast.error("Couldn't delete conversation");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    handleSendText(input);
  }, [input, handleSendText]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return {
    sessions,
    activeSessionId,
    messages,
    input,
    setInput,
    loadingSessions,
    loadingMessages,
    streaming,
    deletingId,
    bottomRef,
    loadSession,
    handleNewSession,
    handleDeleteSession,
    handleSend,
    handleKeyDown,
  };
};