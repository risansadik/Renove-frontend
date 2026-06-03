import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import {
  selectAuthRole,
  selectIsAuthenticated,
  useAuthStore,
} from "../../store/use-auth-store.ts";
import type { AuthRole } from "../../domain/model/index.ts";

interface ProtectedRouteProps {
  children: ReactNode;
  role: AuthRole | AuthRole[];
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, role, redirectTo }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userRole = useAuthStore(selectAuthRole);
  const allowedRoles = Array.isArray(role) ? role : [role];
  const fallbackRole = allowedRoles[0];

  if (!isAuthenticated || !userRole || !allowedRoles.includes(userRole)) {
    const fallbacks: Record<AuthRole, string> = {
      user: "/user/login",
      therapist: "/therapist/login",
      admin: "/admin/login",
    };
    return <Navigate to={redirectTo ?? fallbacks[fallbackRole]} replace />;
  }

  return <>{children}</>;
};

interface GuestRouteProps {
  children: ReactNode;
  role: AuthRole | AuthRole[];
  redirectTo?: string;
}

export const GuestRoute = ({ children, role, redirectTo }: GuestRouteProps) => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const userRole = useAuthStore(selectAuthRole);
  const blockedRoles = Array.isArray(role) ? role : [role];

  if (isAuthenticated && userRole && blockedRoles.includes(userRole)) {
    const dashboards: Record<AuthRole, string> = {
      user: "/dashboard",
      therapist: "/therapist/dashboard",
      admin: "/admin/dashboard",
    };
    return <Navigate to={redirectTo ?? dashboards[userRole]} replace />;
  }

  return <>{children}</>;
};
