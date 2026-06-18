import { LayoutDashboard, CalendarDays, Clock, MessageCircle, Wallet, User, Flag } from "lucide-react";

export interface TherapistProfileProps {
  name?: string;
  specialization?: string[];
}

export const navItems = [
  { to: "/therapist/dashboard", icon: LayoutDashboard, label: "Overview" },
  { to: "/therapist/sessions", icon: CalendarDays, label: "Sessions" },
  { to: "/therapist/availability", icon: Clock, label: "Availability" },
  { to: "/therapist/messages", icon: MessageCircle, label: "Messages" },
  { to: "/therapist/wallet", icon: Wallet, label: "Wallet" },
  { to: "/therapist/reports", icon: Flag, label: "Reports" },
  { to: "/therapist/profile", icon: User, label: "Profile" },
];

export interface NavigationMenuProps {
  onItemClick: () => void;
}

export interface MainHeaderProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
}
