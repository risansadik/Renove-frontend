import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore, selectAuthTherapist } from "../../store/use-auth-store.js";
import { therapistAuthService } from "../../services/api/auth.service.js";
import {
  LayoutDashboard, CalendarDays, Users, MessageCircle, Settings, LogOut, Menu, X, Stethoscope,
} from "lucide-react";
import { ConfirmationModal } from "../../components/common/Confirmation-modal.js";

const navItems = [
  { to: "/therapist/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/therapist/sessions", icon: CalendarDays, label: "Sessions" },
  { to: "/therapist/clients", icon: Users, label: "Clients" },
  { to: "/therapist/messages", icon: MessageCircle, label: "Messages" },
  { to: "/therapist/settings", icon: Settings, label: "Settings" },
];

export const TherapistLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const therapist = useAuthStore(selectAuthTherapist);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await therapistAuthService.logout();
    } catch {
      // silent
    } finally {
      logout();
      toast.success("Signed out successfully");
      navigate("/therapist/login", { replace: true });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#fdfaf6" }}>
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your Therapist account?"
        confirmText="Sign Out"
        isDestructive={true}
      />
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-surface-50 flex flex-col z-30 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto`}
        style={{ borderRight: "1px solid rgba(196,168,208,0.2)" }}
      >
        <div className="p-6" style={{ borderBottom: "1px solid rgba(196,168,208,0.15)" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">r</span>
            </div>
            <span className="font-display font-bold text-brand-900">reNove</span>
            <span className="ml-auto text-[10px] text-brand-600 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full font-mono">
              Therapist
            </span>
          </div>
        </div>

        <div className="px-4 py-4" style={{ borderBottom: "1px solid rgba(196,168,208,0.1)" }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 font-bold text-sm">
              {therapist?.name?.charAt(0).toUpperCase() ?? "T"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-brand-900 truncate">{therapist?.name ?? "Therapist"}</p>
              <p className="text-xs text-brand-900/40 truncate">{therapist?.specialization?.[0] ?? "Specialist"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/therapist/dashboard"}
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

        <div className="p-4" style={{ borderTop: "1px solid rgba(196,168,208,0.15)" }}>
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-brand-900/60 hover:text-red-600 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
            <div className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <Stethoscope size={13} className="text-brand-600" />
            </div>
            <span className="text-brand-900/50 text-xs font-mono">therapist portal</span>
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

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
