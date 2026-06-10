// src/features/user/components/AiCompanion.tsx

import { useEffect, useRef, useState, useCallback } from "react";
import { Send, Loader2, Plus, Trash2, MessageSquare, Bot } from "lucide-react";
import { chatApiService, type ChatMessage, type ChatSession } from "../../../services/api/chat.service.ts";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export const AiCompanion = () => {
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
            content:
              "Hey! I'm Nova, your recovery companion. I'm here whenever you need to talk. How are you feeling today?",
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
            // malformed chunk — skip
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
  }, [activeSessionId, searchParams, handleSendText,
    setSearchParams,]);

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

  return (
    <div
      className="flex rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        height: "calc(100vh - 180px)",
        width: "100%",
      }}
    >
      {/* Sessions Sidebar */}
      <div
        className="w-60 shrink-0 flex flex-col"
        style={{ borderRight: "1px solid var(--border-default)" }}
      >
        {/* New Chat button */}
        <div className="p-3" style={{ borderBottom: "1px solid var(--border-default)" }}>
          <button
            onClick={handleNewSession}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: "var(--accent-primary)",
              color: "white",
            }}
          >
            <Plus size={15} /> New Chat
          </button>
        </div>

        {/* Session list */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {loadingSessions ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <Loader2 size={20} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-xs text-center py-6" style={{ color: "var(--fg-muted)" }}>
              No conversations yet
            </p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="group flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
                style={{
                  background:
                    activeSessionId === session.id
                      ? "var(--accent-glow)"
                      : "transparent",
                  border:
                    activeSessionId === session.id
                      ? "1px solid var(--border-accent)"
                      : "1px solid transparent",
                }}
                onClick={() => loadSession(session.id)}
              >
                <MessageSquare
                  size={13}
                  style={{
                    color:
                      activeSessionId === session.id
                        ? "var(--accent-primary)"
                        : "var(--fg-muted)",
                    flexShrink: 0,
                  }}
                />
                <span
                  className="flex-1 text-xs truncate"
                  style={{
                    color:
                      activeSessionId === session.id
                        ? "var(--accent-primary)"
                        : "var(--fg-secondary)",
                  }}
                >
                  {session.title}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--fg-muted)" }}
                >
                  {deletingId === session.id ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div
          className="flex items-center gap-3 px-4 py-3 shrink-0"
          style={{ borderBottom: "1px solid var(--border-default)" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-primary)" }}
          >
            <Bot size={16} color="white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--fg-default)" }}>
              Nova
            </p>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
              {streaming ? "Typing…" : "Your recovery companion"}
            </p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {loadingMessages ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
            </div>
          ) : activeSessionId === null && sessions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-16">
              <Bot size={36} style={{ color: "var(--fg-muted)" }} />
              <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                Start a new chat to talk to Nova
              </p>
              <button
                onClick={handleNewSession}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                style={{ background: "var(--accent-primary)", color: "white" }}
              >
                <Plus size={14} /> New Chat
              </button>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed"
                  style={
                    msg.role === "user"
                      ? { background: "var(--accent-primary)", color: "white", borderBottomRightRadius: "4px" }
                      : { background: "var(--bg-elevated)", color: "var(--fg-default)", borderBottomLeftRadius: "4px" }
                  }
                >
                  {msg.content || <span className="opacity-50 animate-pulse">●●●</span>}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div
          className="px-4 py-3 flex items-end gap-2 shrink-0"
          style={{ borderTop: "1px solid var(--border-default)" }}
        >
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Nova…"
            disabled={streaming}
            className="flex-1 resize-none rounded-xl px-3 py-2 text-sm outline-none"
            style={{
              background: "var(--bg-base)",
              color: "var(--fg-default)",
              border: "1px solid var(--border-default)",
              maxHeight: "120px",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-opacity"
            style={{
              background: "var(--accent-primary)",
              opacity: !input.trim() || streaming ? 0.5 : 1,
            }}
          >
            {streaming ? (
              <Loader2 size={16} color="white" className="animate-spin" />
            ) : (
              <Send size={16} color="white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};