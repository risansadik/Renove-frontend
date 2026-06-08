import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore, selectAuthUser } from "../../store/use-auth-store.ts";
import { userAuthService } from "../../services/api/auth.service.ts";
import { ConfirmationModal } from "../../components/common/Confirmation-modal.tsx";
import {
  LayoutDashboard, Brain, CalendarDays, BarChart3, Heart,
  LogOut, Menu, X, Sparkles, PhoneCall, Flame, Wallet, Settings
} from "lucide-react";
import { ThemeToggle } from "../../components/common/ThemeToggle.tsx";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/dashboard/progress", icon: BarChart3, label: "Progress" },
  { to: "/dashboard/ai-companion", icon: Brain, label: "AI Companion" },
  { to: "/dashboard/therapists", icon: Heart, label: "Therapists" },
  { to: "/dashboard/sessions", icon: CalendarDays, label: "Sessions" },
  { to: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  { to: "/dashboard/profile", icon: Settings, label: "Settings" },
];

export const UserLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore(selectAuthUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try { await userAuthService.logout(); } catch { /* silent */ }
    logout();
    toast.success("Signed out successfully");
    navigate("/user/login", { replace: true });
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        isDestructive
      />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 flex flex-col z-30 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ background: "var(--bg-subtle)", borderRight: "1px solid var(--border-default)" }}>

        {/* Logo */}
        <div className="p-6" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: "var(--fg-primary)" }}>reNove</span>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{ background: "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))" }}>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--fg-primary)" }}>{user?.name ?? "User"}</p>
              <p className="text-xs truncate" style={{ color: "var(--fg-muted)" }}>Recovery Journey</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive ? "nav-active" : "nav-idle"}`
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

        {/* Bottom actions */}
        <div className="p-3 flex flex-col gap-1.5" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <a href="tel:iCall"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
            <PhoneCall size={14} /> Emergency Help
          </a>
          <button onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm transition-all duration-150"
            style={{ color: "var(--fg-muted)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 flex items-center px-6 gap-4 sticky top-0 z-10"
          style={{ background: "var(--bg-glass)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border-subtle)" }}>
          <button type="button" aria-label="Open navigation" onClick={() => setSidebarOpen(true)}
            className="lg:hidden" style={{ color: "var(--fg-muted)" }}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono"
              style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", border: "1px solid rgba(249,115,22,0.25)" }}>
              <Flame size={12} className="streak-flame-flicker" /> Streak Active
            </div>
          </div>
          <button type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}
            className="lg:hidden" style={{ color: "var(--fg-muted)" }}>
            <X size={20} className={sidebarOpen ? "block" : "hidden"} />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
