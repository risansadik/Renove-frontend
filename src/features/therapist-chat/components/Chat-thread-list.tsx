import { MessageCircle, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { ChatThreadListProps } from "../types/therapist-chat.types";

export const ChatThreadList = ({
    threads,
    selectedThreadId,
    onSelect,
    getOtherPartyName,
}: ChatThreadListProps) => {
    if (threads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 p-8 text-center">
                <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--accent-glow)" }}
                >
                    <MessageCircle size={24} style={{ color: "var(--accent-primary)" }} />
                </div>
                <p className="text-sm font-medium" style={{ color: "var(--fg-primary)" }}>
                    No conversations yet
                </p>
                <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
                    Chats open after a completed session.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 p-2 overflow-y-auto h-full">
            {threads.map((thread) => {
                const isSelected = thread.id === selectedThreadId;
                const name = getOtherPartyName(thread);
                const initials = name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2);

                return (
                    <button
                        key={thread.id}
                        onClick={() => onSelect(thread)}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-left w-full transition-all duration-150 active:scale-[0.98]"
                        style={
                            isSelected
                                ? {
                                    background: "var(--accent-glow)",
                                    border: "1px solid var(--border-accent)",
                                }
                                : {
                                    border: "1px solid transparent",
                                }
                        }
                        onMouseEnter={(e) => {
                            if (!isSelected) {
                                e.currentTarget.style.background = "var(--bg-subtle)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isSelected) {
                                e.currentTarget.style.background = "transparent";
                            }
                        }}
                    >
                        {/* Avatar */}
                        <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold"
                            style={
                                isSelected
                                    ? { background: "var(--accent-primary)", color: "#fff" }
                                    : {
                                        background: "var(--bg-base)",
                                        color: "var(--fg-muted)",
                                        border: "1px solid var(--border-default)",
                                    }
                            }
                        >
                            {initials}
                        </div>

                        {/* Name + status */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p
                                    className="text-sm font-semibold truncate"
                                    style={{ color: isSelected ? "var(--accent-primary)" : "var(--fg-primary)" }}
                                >
                                    {name}
                                </p>
                            </div>
                            <div className="flex items-center justify-between gap-1 mt-0.5">
                                <div className="flex items-center gap-1 min-w-0 flex-1">
                                    {!thread.isActive && (
                                        <Lock size={10} style={{ color: "var(--fg-muted)" }} />
                                    )}
                                    <p
                                        className="text-[11px] truncate"
                                        style={{ color: "var(--fg-muted)" }}
                                    >
                                        {thread.isActive
                                            ? `Active · expires ${formatDistanceToNow(new Date(thread.expiresAt), { addSuffix: true })}`
                                            : "Chat window closed"}
                                    </p>
                                </div>

                                {/* Unread badge */}
                                {thread.unreadCount ? thread.unreadCount > 0 && (
                                    <span
                                        className="flex items-center justify-center text-[10px] font-bold px-1.5 min-w-4.5 h-4.5 rounded-full shrink-0 animate-in zoom-in-50 duration-200"
                                        style={{
                                            background: "var(--accent-primary, #25d366)",
                                            color: "#fff",
                                        }}
                                    >
                                        {thread.unreadCount}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};