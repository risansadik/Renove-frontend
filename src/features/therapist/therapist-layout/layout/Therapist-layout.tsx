import { Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { ConfirmationModal } from "../../../../components/common/Confirmation-modal.tsx";
import { useTherapistLayout } from "../hooks/use-therapist-layout";
import { SidebarProfileCard } from "../components/Sidebar-profile-card.tsx";
import { NavigationMenu } from "../components/Navigation-menu.tsx";
import { MainHeader } from "../components/Main-header.tsx";
import { SidebarBrand } from "../components/Sidebar-brand.tsx";

export const TherapistLayout = () => {
  const {
    therapist,
    sidebarOpen,
    setSidebarOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    handleLogout,
  } = useTherapistLayout();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your Therapist account?"
        confirmText="Sign Out"
        isDestructive
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar View Container */}
      <aside className={`fixed top-0 left-0 h-full w-60 flex flex-col z-30 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ background: "var(--bg-subtle)", borderRight: "1px solid var(--border-default)" }}>

        <SidebarBrand />
        <SidebarProfileCard name={therapist?.name} specialization={therapist?.specialization} />
        <NavigationMenu onItemClick={() => setSidebarOpen(false)} />

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

      {/* Primary Display Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MainHeader sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};