import { useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, Calendar, X } from "lucide-react";
import type { Notification,NotificationType } from "../../../../domain/model";


interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  isLoading: boolean;
  onToggle: () => void;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const iconForType = (_type: NotificationType) => <Calendar size={14} />;

const formatRelativeTime = (isoDate: string): string => {
  const diff = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export const NotificationPanel = ({
  notifications,
  unreadCount,
  isOpen,
  isLoading,
  onToggle,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Notifications"
        className="relative flex items-center justify-center w-9 h-9 rounded-full transition-colors"
        style={{
          background: isOpen ? "var(--bg-subtle)" : "transparent",
          color: "var(--fg-muted)",
          border: "1px solid transparent",
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 flex items-center justify-center rounded-full text-white font-bold"
            style={{
              fontSize: "10px",
              minWidth: "16px",
              height: "16px",
              padding: "0 4px",
              background: "var(--accent-secondary, #4a6b52)",
              lineHeight: 1,
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 rounded-xl shadow-xl overflow-hidden"
          style={{
            width: "360px",
            background: "var(--bg-card)",
            border: "1px solid var(--border-subtle)",
            zIndex: 50,
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm" style={{ color: "var(--fg-base)" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: "rgba(74,107,82,0.12)",
                    color: "var(--accent-secondary, #4a6b52)",
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors"
                  style={{ color: "var(--fg-muted)" }}
                  title="Mark all as read"
                >
                  <CheckCheck size={13} />
                  All read
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center w-6 h-6 rounded-md"
                style={{ color: "var(--fg-muted)" }}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div
                  className="w-5 h-5 rounded-full border-2 animate-spin"
                  style={{
                    borderColor: "var(--accent-secondary, #4a6b52)",
                    borderTopColor: "transparent",
                  }}
                />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2">
                <Bell size={28} style={{ color: "var(--fg-muted)", opacity: 0.4 }} />
                <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
                  No notifications yet
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      background: n.isRead ? "transparent" : "rgba(74,107,82,0.05)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                    onClick={() => !n.isRead && onMarkAsRead(n.id)}
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 mt-0.5"
                      style={{
                        background: "rgba(74,107,82,0.1)",
                        color: "var(--accent-secondary, #4a6b52)",
                      }}
                    >
                      {iconForType(n.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--fg-base)" }}>
                        {n.title}
                      </p>
                      <p
                        className="text-xs mt-0.5 leading-relaxed"
                        style={{ color: "var(--fg-muted)" }}
                      >
                        {n.message}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: "var(--fg-muted)", opacity: 0.7 }}
                      >
                        {formatRelativeTime(n.createdAt)}
                      </p>
                    </div>

                    <div className="flex-shrink-0 mt-1">
                      {n.isRead ? (
                        <Check size={13} style={{ color: "var(--fg-muted)", opacity: 0.4 }} />
                      ) : (
                        <span
                          className="block w-2 h-2 rounded-full"
                          style={{ background: "var(--accent-secondary, #4a6b52)" }}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};