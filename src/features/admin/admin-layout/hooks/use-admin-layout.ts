import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../../../../store/use-auth-store.ts";
import { adminService } from "../../../../services/api/auth.service.ts";

export const useAdminLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await adminService.logout().catch(() => {});
      logout();
      toast.success("Logged out");
      navigate("/admin/login");
    } catch {
      // Gracefully handle unhandled connection exceptions
    }
  };

  return {
    sidebarOpen,
    setSidebarOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    handleLogout,
  };
};