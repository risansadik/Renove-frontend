import { Menu, X, Stethoscope } from "lucide-react";
import { ThemeToggle } from "../../../../components/common/ThemeToggle.tsx";
import type { MainHeaderProps } from "../types/therapist-layout.types.ts";
import { NotificationPanel } from "./Notification-panel.tsx";
import { useNotifications } from "../hooks/use-notification.ts";
import { InstallPromptButton } from "../../../../components/common/Install-prompt-button.tsx";

export const MainHeader = ({ sidebarOpen, onMenuClick }: MainHeaderProps) => {
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
        onClick={onMenuClick}
        className="lg:hidden"
        style={{ color: "var(--fg-muted)" }}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <InstallPromptButton/>
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

        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{
              background: "var(--accent-glow-secondary)",
              border: "1px solid rgba(74,107,82,0.3)",
            }}
          >
            <Stethoscope size={13} style={{ color: "var(--accent-secondary)" }} />
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
            therapist portal
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close navigation"
        onClick={onMenuClick}
        className="lg:hidden"
        style={{ color: "var(--fg-muted)" }}
      >
        <X size={20} className={sidebarOpen ? "block" : "hidden"} />
      </button>
    </header>
  );
};