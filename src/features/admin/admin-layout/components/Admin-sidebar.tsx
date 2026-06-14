import { NavLink } from "react-router-dom";
import { Sparkles, LogOut } from "lucide-react";
import { ADMIN_NAV_ITEMS, type AdminSidebarProps } from "../types/admin-layout.types";

export const AdminSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  setLogoutModalOpen,
}: AdminSidebarProps) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-full w-60 flex flex-col z-30 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      style={{
        background: "var(--bg-subtle)",
        borderRight: "1px solid var(--border-default)",
      }}
    >
      <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}
          >
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-display font-bold" style={{ color: "var(--fg-primary)" }}>
            reNove
          </span>
          <span
            className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded-full"
            style={{
              color: "var(--accent-primary)",
              background: "var(--accent-glow)",
              border: "1px solid var(--border-accent)",
            }}
          >
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 p-3 flex flex-col gap-1">
        {ADMIN_NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
            style={({ isActive }) =>
              isActive
                ? {
                    background: "var(--accent-glow)",
                    color: "var(--accent-primary)",
                    border: "1px solid var(--border-accent)",
                  }
                : {
                    color: "var(--nav-fg)",
                    border: "1px solid transparent",
                  }
            }
          >
            <Icon size={16} /> {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <button
          onClick={() => setLogoutModalOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm transition-all duration-150"
          style={{ color: "var(--fg-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#ef4444";
            (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
};