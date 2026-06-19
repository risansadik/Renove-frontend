import { Menu, X, Flame } from "lucide-react";
import type { LayoutTopbarProps } from "../types/user-layout.types.ts";
import { ThemeToggle } from "../../../../components/common/ThemeToggle.tsx";
import { NotificationPanel } from "./Notification-panel.tsx";
import { useNotifications } from "../hooks/use-notification.ts";

export const LayoutTopbar = ({ sidebarOpen, setSidebarOpen }: LayoutTopbarProps) => {
  const {
    notifications,
    unreadCount,
    isOpen,
    isLoading,
    togglePanel,
    closePanel,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  return (
    <header
      className="h-14 flex items-center px-6 gap-4 sticky top-0 z-10"
      style={{
        background: "var(--bg-glass)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <button
        type="button"
        aria-label="Open navigation"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden"
        style={{ color: "var(--fg-muted)" }}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <ThemeToggle />

        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          isOpen={isOpen}
          isLoading={isLoading}
          onToggle={togglePanel}
          onClose={closePanel}
          onMarkAsRead={markAsRead}
          onMarkAllAsRead={markAllAsRead}
        />

        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
          style={{
            background: "rgba(249,115,22,0.1)",
            color: "#f97316",
            border: "1px solid rgba(249,115,22,0.25)",
          }}
        >
          <Flame size={12} className="streak-flame-flicker" /> Streak Active
        </div>
      </div>

      <button
        type="button"
        aria-label="Close navigation"
        onClick={() => setSidebarOpen(false)}
        className="lg:hidden"
        style={{ color: "var(--fg-muted)" }}
      >
        <X size={20} className={sidebarOpen ? "block" : "hidden"} />
      </button>
    </header>
  );
};