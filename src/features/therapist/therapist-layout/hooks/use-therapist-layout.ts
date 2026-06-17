import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore, selectAuthTherapist } from "../../../../store/use-auth-store.ts";
import { therapistAuthService } from "../../../../services/api/auth.service.ts";

export const useTherapistLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const therapist = useAuthStore(selectAuthTherapist);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await therapistAuthService.logout();
    } catch {
      /* silent */
    }
    logout();
    toast.success("Signed out successfully");
    navigate("/therapist/login", { replace: true });
  };

  return {
    therapist,
    sidebarOpen,
    setSidebarOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    handleLogout,
  };
};