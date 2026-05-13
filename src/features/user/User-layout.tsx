import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore, selectAuthUser } from "../../store/use-auth-store.js";
import { userAuthService } from "../../services/api/auth.service.js";
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
    <div className="flex h-screen overflow-hidden" style={{ background: "#0d0b14" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 flex flex-col z-30 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto`}
        style={{
          background: "rgba(13, 11, 20, 0.98)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div className="p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6b4c7a, #b89bbe)" }}
            >
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg" style={{ color: "#e8e6f0" }}>
              reNove
            </span>
            <span
              className="ml-auto text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{
                color: "#b89bbe",
                background: "rgba(107,76,122,0.2)",
                border: "1px solid rgba(184,155,190,0.2)",
              }}
            >
              Beta
            </span>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #6b4c7a40, #b89bbe40)", border: "1px solid rgba(184,155,190,0.3)", color: "#b89bbe" }}
            >
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#e8e6f0" }}>
                {user?.name ?? "User"}
              </p>
              <p className="text-xs truncate" style={{ color: "rgba(232,230,240,0.4)" }}>
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
                `dark-nav-link${isActive ? " active" : ""}`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Emergency & Logout */}
        <div className="p-4 flex flex-col gap-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <a
            href="tel:iCall"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
            style={{
              color: "#f87171",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.15)",
            }}
          >
            <PhoneCall size={14} />
            Emergency Help
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm transition-all"
            style={{ color: "rgba(232,230,240,0.4)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,230,240,0.85)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(232,230,240,0.4)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-14 flex items-center px-6 gap-4 sticky top-0 z-10"
          style={{
            background: "rgba(13,11,20,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <button
            type="button"
            aria-label="Open navigation"
            className="lg:hidden"
            style={{ color: "rgba(232,230,240,0.5)" }}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div
              className="text-xs font-mono px-3 py-1 rounded-full"
              style={{
                color: "#4a6b52",
                background: "rgba(74,107,82,0.15)",
                border: "1px solid rgba(74,107,82,0.25)",
              }}
            >
              🔥 Day 24
            </div>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            className="lg:hidden"
            style={{ color: "rgba(232,230,240,0.5)" }}
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
