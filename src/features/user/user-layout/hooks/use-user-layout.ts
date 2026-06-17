import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { selectAuthUser, useAuthStore } from "../../../../store/use-auth-store";
import { userAuthService } from "../../../../services/api/auth.service";

export const useUserLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore(selectAuthUser);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try { 
      await userAuthService.logout(); 
    } catch { 
      /* silent telemetry failure safety fallback */ 
    }
    logout();
    toast.success("Signed out successfully");
    navigate("/user/login", { replace: true });
  };

  return {
    user,
    sidebarOpen,
    setSidebarOpen,
    logoutModalOpen,
    setLogoutModalOpen,
    handleLogout,
  };
};