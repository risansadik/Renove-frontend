import { NavLink } from "react-router-dom";
import {  Sparkles, LogOut } from "lucide-react";
import type { NavigationSidebarProps } from "../types/user-layout.types";
import { IdentityBlock } from "./Identity-block";

export const NavigationSidebar = ({
  sidebarOpen,
  setSidebarOpen,
  setLogoutModalOpen,
  user,
  navItems,
}: NavigationSidebarProps) => {
  return (
    <aside className={`fixed top-0 left-0 h-full w-64 flex flex-col z-30 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
      style={{ background: "var(--bg-subtle)", borderRight: "1px solid var(--border-default)" }}>

      {/* Logo Segment */}
      <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}>
            <Sparkles size={15} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg" style={{ color: "var(--fg-primary)" }}>reNove</span>
        </div>
      </div>

      {/* User Status Profile Segment */}
      <IdentityBlock user={user} />

      {/* Primary Navigation Node */}
      <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard"}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive ? "nav-active" : "nav-idle"
              }`
            }
            style={({ isActive }) => isActive ? {
              background: "var(--accent-glow)",
              color: "var(--accent-primary)",
              border: "1px solid var(--border-accent)",
            } : {
              color: "var(--nav-fg)",
              border: "1px solid transparent",
            }}
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>


      <div className="p-3 flex flex-col gap-1.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
        <button 
          onClick={() => setLogoutModalOpen(true)}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm transition-all duration-150"
          style={{ color: "var(--fg-muted)" }}
          onMouseEnter={e => {
            e.currentTarget.style.color = "#ef4444";
            e.currentTarget.style.background = "rgba(239,68,68,0.08)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = "var(--fg-muted)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
    </aside>
  );
};