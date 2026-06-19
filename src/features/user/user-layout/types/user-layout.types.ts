import { 
  LayoutDashboard, Brain, CalendarDays, BarChart3, 
  Heart, Wallet, Settings, Flag, 
  type LucideIcon,
  MessageCircle
} from "lucide-react";

export interface IdentityBlockProps {
  user: {
    name?: string;
  } | null;
}

export interface NavItem {
  to: string;
  icon: LucideIcon;
  label: string;
}

export interface NavigationSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  setLogoutModalOpen: (open: boolean) => void;
  user: { name?: string } | null;
  navItems: NavItem[];
}

export interface LayoutTopbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { to: "/dashboard/progress", icon: BarChart3, label: "Progress" },
  { to: "/dashboard/ai-companion", icon: Brain, label: "AI Companion" },
  { to: "/dashboard/therapists", icon: Heart, label: "Therapists" },
  { to: "/dashboard/sessions", icon: CalendarDays, label: "Sessions" },
  { to: "/dashboard/messages", icon: MessageCircle, label: "Messages" },
  { to: "/dashboard/wallet", icon: Wallet, label: "Wallet" },
  { to: "/dashboard/reports", icon: Flag, label: "Reports" },
  { to: "/dashboard/profile", icon: Settings, label: "Settings" },
];


