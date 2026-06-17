import { NavLink } from "react-router-dom";
import { navItems, type NavigationMenuProps } from "../types/therapist-layout.types";

export const NavigationMenu = ({ onItemClick }: NavigationMenuProps) => (
  <nav className="flex-1 p-3 flex flex-col gap-1">
    {navItems.map(({ to, icon: Icon, label }) => (
      <NavLink key={to} to={to} end={to === "/therapist/dashboard"}
        onClick={onItemClick}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        style={({ isActive }) => isActive ? {
          background: "var(--accent-glow-secondary)",
          color: "var(--accent-secondary)",
          border: "1px solid rgba(74,107,82,0.3)",
        } : {
          color: "var(--nav-fg)",
          border: "1px solid transparent",
        }}>
        <Icon size={16} /> {label}
      </NavLink>
    ))}
  </nav>
);