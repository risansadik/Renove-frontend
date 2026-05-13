import { useState } from "react";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../store/use-auth-store.js";
import { adminService } from "../../services/api/auth.service.js";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { ConfirmationModal } from "../../components/common/Confirmation-modal.js";

const navItems = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/therapists", icon: Stethoscope, label: "Therapists" },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await adminService.logout();
    } catch {
      // proceed regardless
    }
    logout();
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-surface flex">
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of the Admin portal?"
        confirmText="Sign Out"
        isDestructive={true}
      />
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-60 bg-surface-50 border-r border-brand-900/10 flex flex-col z-30
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="p-6 border-b border-brand-900/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">r</span>
            </div>
            <span className="font-display font-bold text-brand-900">reNove</span>
            <span className="ml-auto text-[10px] text-brand-600 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-full font-mono">
              Admin
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
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

        <div className="p-4 border-t border-brand-900/10">
          <button
            onClick={() => setLogoutModalOpen(true)}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm text-brand-900/60 hover:text-red-600 hover:bg-red-500/10 transition-all duration-150"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-surface-50/80 backdrop-blur border-b border-brand-900/10 flex items-center px-6 gap-4 sticky top-0 z-10">
          <button
            type="button"
            aria-label="Open admin navigation"
            className="text-brand-900/60 hover:text-brand-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-7 h-7 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
              <ShieldCheck size={13} className="text-brand-600" />
            </div>
            <span className="text-brand-900/50 text-xs font-mono">admin</span>
          </div>
          <button
            type="button"
            aria-label="Close admin navigation"
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
