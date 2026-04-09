import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

type Role = "admin" | "tower_lead" | "supervisor" | "employee";

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-slate-500">Checking access...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "employee") return <Navigate to="/dashboard" replace />;
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
}
