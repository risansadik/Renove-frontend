import { useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, Calendar, X } from "lucide-react";
import type { Notification, NotificationType } from "../../../../domain/model";

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
        <>
          {/*
            On mobile: fixed full-width panel pinned to top of screen below the header.
            On sm+: absolute dropdown anchored to bell, 360px wide.
            This prevents the panel from ever being clipped or partially off-screen.
          */}

          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 sm:hidden"
            style={{ zIndex: 40 }}
            onClick={onClose}
          />

          <div
            className="
              fixed left-3 right-3 top-16
              sm:absolute sm:left-auto sm:right-0 sm:top-auto sm:mt-2
              sm:w-90
              rounded-2xl overflow-hidden
            "
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.32), 0 4px 16px rgba(0,0,0,0.18)",
              zIndex: 50,
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 shrink-0"
              style={{
                borderBottom: "1px solid var(--border-default)",
                background: "var(--bg-subtle)",
              }}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm" style={{ color: "var(--fg-primary)" }}>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: "var(--accent-glow-secondary)",
                      color: "var(--accent-secondary)",
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
                    className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors"
                    style={{
                      color: "var(--accent-secondary)",
                      background: "var(--accent-glow-secondary)",
                    }}
                  >
                    <CheckCheck size={13} />
                    All read
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex items-center justify-center w-7 h-7 rounded-lg"
                  style={{
                    color: "var(--fg-muted)",
                    background: "var(--border-subtle)",
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: "420px",
                background: "var(--bg-subtle)",
              }}
            >
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
                        background: n.isRead ? "var(--bg-subtle)" : "var(--bg-base)",
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                      onClick={() => !n.isRead && onMarkAsRead(n.id)}
                    >
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 mt-0.5"
                        style={{
                          background: "var(--accent-glow-secondary)",
                          color: "var(--accent-secondary, #4a6b52)",
                        }}
                      >
                        {iconForType(n.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold"
                          style={{ color: "var(--fg-primary)" }}
                        >
                          {n.title}
                        </p>
                        <p
                          className="text-xs mt-0.5 leading-relaxed"
                          style={{ color: "var(--fg-secondary)" }}
                        >
                          {n.message}
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--fg-muted)" }}>
                          {formatRelativeTime(n.createdAt)}
                        </p>
                      </div>

                      {/* Unread dot / check */}
                      <div className="shrink-0 mt-1">
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
        </>
      )}
    </div>
  );
};