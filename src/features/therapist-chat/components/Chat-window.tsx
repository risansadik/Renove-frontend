import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Loader2, Lock, Send, ArrowLeft } from "lucide-react";
import { isToday, isYesterday, format } from "date-fns";
import type { ChatWindowProps } from "../types/therapist-chat.types";
import { ChatMessageBubble } from "./Chat-message-bubble";

export const ChatWindow = ({
  thread,
  messages,
  messagesLoading,
  sending,
  myId,
  otherPartyName,
  onSend,
  onBack, 
}: ChatWindowProps & { onBack?: () => void }) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!messagesLoading && messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesLoading]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending || !thread.isActive) return;
    setInput("");
    await onSend(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  const getDateDividerLabel = (dateString?: Date | string): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "MMMM d, yyyy");
  };

  const initials = otherPartyName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 md:px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border-default)" }}
      >
        {/* Back button — only on mobile */}
        {onBack && (
          <button
            onClick={onBack}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-colors"
            style={{ color: "var(--accent-primary)" }}
            aria-label="Back to conversations"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "var(--accent-glow)", color: "var(--accent-primary)" }}
        >
          {initials}
        </div>

        {/* Name + status */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate" style={{ color: "var(--fg-primary)" }}>
            {otherPartyName}
          </p>
          <p className="text-[11px]" style={{ color: thread.isActive ? "#4a6b52" : "var(--fg-muted)" }}>
            {thread.isActive ? "Chat active" : "Chat window closed · Book a new session to reopen"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-5 py-4 flex flex-col gap-3">
        {messagesLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-primary)" }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <p className="text-sm font-medium" style={{ color: "var(--fg-primary)" }}>
              No messages yet
            </p>
            <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
              {thread.isActive ? "Send a message to start the conversation." : "This chat window has closed."}
            </p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const currentMsgDateStr = msg.createdAt ? new Date(msg.createdAt).toDateString() : "";
            const prevMsg = index > 0 ? messages[index - 1] : null;
            const prevMsgDateStr = prevMsg?.createdAt ? new Date(prevMsg.createdAt).toDateString() : "";
            const showDateDivider = currentMsgDateStr !== prevMsgDateStr;

            return (
              <div key={msg.id || index} className="flex flex-col gap-3 w-full">
                {showDateDivider && (
                  <div className="flex items-center justify-center my-4 w-full relative">
                    <div
                      className="absolute left-0 right-0 h-px"
                      style={{ background: "var(--border-default)", zIndex: 1 }}
                    />
                    <span
                      className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider relative select-none"
                      style={{
                        background: "var(--bg-subtle)",
                        color: "var(--fg-muted)",
                        border: "1px solid var(--border-default)",
                        zIndex: 2,
                      }}
                    >
                      {getDateDividerLabel(msg.createdAt)}
                    </span>
                  </div>
                )}
                <ChatMessageBubble
                  message={msg}
                  isMine={msg.senderId === myId}
                />
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 md:px-5 py-4 shrink-0"
        style={{ borderTop: "1px solid var(--border-default)" }}
      >
        {thread.isActive ? (
          <div
            className="flex items-end gap-3 px-4 py-3 rounded-2xl"
            style={{ background: "var(--bg-subtle)", border: "1px solid var(--border-default)" }}
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm outline-none leading-relaxed"
              style={{ color: "var(--fg-primary)", maxHeight: "120px" }}
            />
            <button
              onClick={() => void handleSend()}
              disabled={!input.trim() || sending}
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all"
              style={
                input.trim() && !sending
                  ? { background: "var(--accent-primary)", color: "#fff" }
                  : {
                      background: "var(--bg-base)",
                      color: "var(--fg-muted)",
                      border: "1px solid var(--border-default)",
                    }
              }
            >
              {sending ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </button>
          </div>
        ) : (
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm"
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-default)",
              color: "var(--fg-muted)",
            }}
          >
            <Lock size={14} />
            Chat window closed. Complete another session with this{" "}
            {thread.userId && typeof thread.userId === "object" ? "therapist" : "client"} to reopen.
          </div>
        )}
      </div>
    </div>
  );
};