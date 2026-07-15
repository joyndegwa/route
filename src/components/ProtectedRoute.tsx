import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../utils/constants";
import type { UserRole } from "../types/user";

interface ProtectedRouteProps {
  children: ReactNode;
  /** When provided, only these roles may view the route. */
  roles?: UserRole[];
}

export default function ProtectedRoute({
  children,
  roles,
}: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-slate-300">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />;
  }

  if (roles && role && !roles.includes(role)) {
    return <Navigate to={ROUTES.dashboard} replace />;
  }

  return <>{children}</>;
}
