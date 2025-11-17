import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Props {
  allowedRoles?: ("CLIENT" | "ADMIN" | "SUPERADMIN")[];
}

export default function RequireAuth({ allowedRoles }: Props) {
  const { user } = useAuth();

  // Si no hay usuario → redirigir al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si hay roles permitidos pero el usuario no pertenece a ellos
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
