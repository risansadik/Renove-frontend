import {
  LayoutDashboard,
  Users,
  UserCog,
  DollarSign,
  Settings,
  FileCheck,
  Flag,
} from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/therapists", icon: UserCog, label: "Therapists" },
  { to: "/admin/reviews", icon: FileCheck, label: "Profile Reviews" },
  { to: "/admin/finance", icon: DollarSign, label: "Finance" },
  { to: "/admin/reports", icon: Flag, label: "Reports" },
  { to: "/admin/profile", icon: Settings, label: "Admin Profile" },
];

export interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setLogoutModalOpen: (open: boolean) => void;
}

export interface AdminHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

