import { Outlet } from "react-router-dom";
import { useUserLayout } from "../hooks/use-user-layout";
import { ConfirmationModal } from "../../../../components/common/Confirmation-modal";
import { NavigationSidebar } from "../components/Navigation-sidebar";
import { navItems } from "../types/user-layout.types";
import { LayoutTopbar } from "../components/Layout-topbar";

export const UserLayout = () => {
  const {
    user,
    sidebarOpen,
    setSidebarOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    handleLogout,
  } = useUserLayout();

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      {/* Destructive Sign-out Guardrails */}
      <ConfirmationModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out of your account?"
        confirmText="Sign Out"
        isDestructive
      />

      {/* Global Responsive Mobile Backdrop Overlays */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)} 
        />
      )}

      {/* Left Application Control Deck */}
      <NavigationSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setLogoutModalOpen={setLogoutModalOpen}
        user={user}
        navItems={navItems}
      />

      {/* Structural Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Dynamic Context Header */}
        <LayoutTopbar
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />

        {/* Dynamic Nested Route Delivery View */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};