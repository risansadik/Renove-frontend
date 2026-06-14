import { Outlet } from "react-router-dom";
import { useAdminLayout } from "../hooks/use-admin-layout.ts";
import { AdminSidebar } from "../components/Admin-sidebar.tsx";
import { AdminHeader } from "../components/Admin-header.tsx";
import { ConfirmationModal } from "../../../../components/common/Confirmation-modal.tsx";

export const AdminLayout = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    handleLogout,
  } = useAdminLayout();

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
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Extracted Admin Sidebar */}
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setLogoutModalOpen={setLogoutModalOpen}
      />

      {/* Main Structural Layout Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Extracted Header Controls */}
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};