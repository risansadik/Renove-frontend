import { Menu, X, ShieldCheck } from "lucide-react";
import { ThemeToggle } from "../../../../components/common/ThemeToggle.tsx";
import type { AdminHeaderProps } from "../types/admin-layout.types.ts";
import { InstallPromptButton } from "../../../../components/common/Install-prompt-button.tsx";

export const AdminHeader = ({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) => {
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
        aria-label="Open admin navigation"
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden"
        style={{ color: "var(--fg-muted)" }}
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <InstallPromptButton/>
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}
          >
            <ShieldCheck size={13} style={{ color: "var(--accent-primary)" }} />
          </div>
          <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>
            admin
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Close admin navigation"
        onClick={() => setSidebarOpen(false)}
        className="lg:hidden"
        style={{ color: "var(--fg-muted)" }}
      >
        <X size={20} className={sidebarOpen ? "block" : "hidden"} />
      </button>
    </header>
  );
};