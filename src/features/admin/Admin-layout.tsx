import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/use-auth-store.js";
import { adminService } from "../../services/api/auth.service.js";
import {
  LayoutDashboard, Users, UserCog, DollarSign, Settings,
  LogOut, Menu, X, Shield, FileCheck,
  Sparkles,
  ShieldCheck
} from "lucide-react";
import { ConfirmationModal } from "../../components/common/Confirmation-modal.js";
import { ThemeToggle } from "../../components/common/ThemeToggle.js";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/therapists", icon: UserCog, label: "Therapists" },
  { to: "/admin/reviews", icon: FileCheck, label: "Profile Reviews" },
  { to: "/admin/finance", icon: DollarSign, label: "Finance" },
  { to: "/admin/profile", icon: Settings, label: "Admin Profile" },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try { await adminService.logout(); } catch { /* proceed */ }
    logout();
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-base)" }}>
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of the Admin portal?"
        confirmText="Sign Out"
        isDestructive
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 flex flex-col z-30 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ background: "var(--bg-subtle)", borderRight: "1px solid var(--border-default)" }}>

        <div className="p-5" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}>
              <Sparkles size={15} className="text-white" />
            </div>
            <span className="font-display font-bold" style={{ color: "var(--fg-primary)" }}>reNove</span>
            <span className="ml-auto text-[9px] font-mono px-2 py-0.5 rounded-full"
              style={{ color: "var(--accent-primary)", background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={({ isActive }) => isActive ? {
                background: "var(--accent-glow)",
                color: "var(--accent-primary)",
                border: "1px solid var(--border-accent)",
              } : {
                color: "var(--nav-fg)",
                border: "1px solid transparent",
              }}>
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <button onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm transition-all duration-150"
            style={{ color: "var(--fg-muted)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.08)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--fg-muted)"; (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 flex items-center px-6 gap-4 sticky top-0 z-10"
          style={{ background: "var(--bg-glass)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border-subtle)" }}>
          <button type="button" aria-label="Open admin navigation" onClick={() => setSidebarOpen(true)}
            className="lg:hidden" style={{ color: "var(--fg-muted)" }}>
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <ThemeToggle />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: "var(--accent-glow)", border: "1px solid var(--border-accent)" }}>
                <ShieldCheck size={13} style={{ color: "var(--accent-primary)" }} />
              </div>
              <span className="text-xs font-mono" style={{ color: "var(--fg-muted)" }}>admin</span>
            </div>
          </div>
          <button type="button" aria-label="Close admin navigation" onClick={() => setSidebarOpen(false)}
            className="lg:hidden" style={{ color: "var(--fg-muted)" }}>
            <X size={20} className={sidebarOpen ? "block" : "hidden"} />
          </button>
        </header>

        <main className="flex-1 p-6 overflow-auto"><Outlet /></main>
      </div>
    </div>
  );
};
