import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore, selectAuthUser } from "../../store/use-auth-store.js";
import { userAuthService } from "../../services/api/auth.service.js";
import { ConfirmationModal } from "../../components/common/Confirmation-modal.js";
import {
  LayoutDashboard,
  Brain,
  CalendarDays,
  BarChart3,
  Heart,
  LogOut,
  Menu,
  X,
  Sparkles,
  PhoneCall,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/dashboard/progress", icon: BarChart3, label: "Progress" },
  { to: "/dashboard/ai-companion", icon: Brain, label: "AI Companion" },
  { to: "/dashboard/therapists", icon: Heart, label: "Therapists" },
  { to: "/dashboard/sessions", icon: CalendarDays, label: "Sessions" },
];

export const UserLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore(selectAuthUser);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await userAuthService.logout();
    } catch {
      // session may already be expired — continue silently
    } finally {
      logout();
      toast.success("Signed out successfully");
      navigate("/user/login", { replace: true });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface" style={{ background: "#fdfaf6" }}>
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        isDestructive={true}
      />
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-surface-50 flex flex-col z-30 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto`}
        style={{ borderRight: "1px solid rgba(196,168,208,0.2)" }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: "1px solid rgba(196,168,208,0.15)" }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-500">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-brand-900">
              reNove
            </span>
            <span className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full text-brand-600 bg-brand-500/10 border border-brand-500/20">
              Beta
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(196,168,208,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-brand-900 truncate">
                {user?.name ?? "User"}
              </p>
              <p className="text-xs text-brand-900/40 truncate">
                Recovery Journey
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-brand-500/15 text-brand-700 border border-brand-500/20"
                    : "text-brand-900/60 hover:text-brand-900 hover:bg-brand-900/5"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Emergency & Logout */}
        <div className="p-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(196,168,208,0.15)" }}>
          <a
            href="tel:iCall"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-red-600 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
          >
            <PhoneCall size={14} />
            Emergency Help
          </a>
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-brand-900/60 hover:text-red-600 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-surface-50/80 backdrop-blur border-b border-brand-900/10 flex items-center px-6 gap-4 sticky top-0 z-10">
          <button
            type="button"
            aria-label="Open navigation"
            className="text-brand-900/60 hover:text-brand-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="text-xs font-mono px-3 py-1 rounded-full text-sage-600 bg-sage-500/10 border border-sage-500/20">
              🔥 Day 24
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="text-brand-900/60 hover:text-brand-900 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
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
