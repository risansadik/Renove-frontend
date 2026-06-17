import { Plus, Loader2, MessageSquare, Trash2 } from "lucide-react";
import type { ChatSidebarProps } from "../types/AI-companion.types";

export const ChatSidebar = ({
  sessions,
  activeSessionId,
  loadingSessions,
  deletingId,
  onNewSession,
  onSelectSession,
  onDeleteSession,
}: ChatSidebarProps) => (
  <div className="w-60 shrink-0 flex flex-col" style={{ borderRight: "1px solid var(--border-default)" }}>
    <div className="p-3" style={{ borderBottom: "1px solid var(--border-default)" }}>
      <button
        onClick={onNewSession}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all"
        style={{ background: "var(--accent-primary)", color: "white" }}
      >
        <Plus size={15} /> New Chat
      </button>
    </div>

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
              background: activeSessionId === session.id ? "var(--accent-glow)" : "transparent",
              border: activeSessionId === session.id ? "1px solid var(--border-accent)" : "1px solid transparent",
            }}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageSquare
              size={13}
              style={{
                color: activeSessionId === session.id ? "var(--accent-primary)" : "var(--fg-muted)",
                flexShrink: 0,
              }}
            />
            <span
              className="flex-1 text-xs truncate"
              style={{ color: activeSessionId === session.id ? "var(--accent-primary)" : "var(--fg-secondary)" }}
            >
              {session.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
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
);