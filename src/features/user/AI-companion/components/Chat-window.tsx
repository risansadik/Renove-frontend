import { Bot, Plus, Loader2, Send, ArrowLeft } from "lucide-react";
import type { ChatWindowProps } from "../types/AI-companion.types";

export const ChatWindow = ({
  messages,
  sessions,
  activeSessionId,
  input,
  setInput,
  loadingMessages,
  streaming,
  bottomRef,
  onNewSession,
  onSend,
  onKeyDown,
  onBack,
}: ChatWindowProps & { onBack?: () => void }) => (
  <div className="flex-1 flex flex-col min-w-0 h-full">
    {/* Header */}
    <div
      className="flex items-center gap-3 px-4 py-3 shrink-0"
      style={{ borderBottom: "1px solid var(--border-default)" }}
    >
      {/* Back button — mobile only */}
      {onBack && (
        <button
          onClick={onBack}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
          style={{ color: "var(--accent-primary)" }}
          aria-label="Back to conversations"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{ background: "var(--accent-primary)" }}
      >
        <Bot size={16} color="white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold" style={{ color: "var(--fg-default)" }}>Nova</p>
        <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
          {streaming ? "Typing…" : "Your recovery companion"}
        </p>
      </div>
      <span className="flex items-center gap-1.5 text-xs font-mono shrink-0" style={{ color: "var(--fg-muted)" }}>
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
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>Start a new chat to talk to Nova</p>
          <button
            onClick={onNewSession}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--accent-primary)", color: "white" }}
          >
            <Plus size={14} /> New Chat
          </button>
        </div>
      ) : (
        messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className="max-w-[80%] md:max-w-[75%] px-4 py-2 rounded-2xl text-sm leading-relaxed"
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
        onKeyDown={onKeyDown}
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
        onClick={onSend}
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
);