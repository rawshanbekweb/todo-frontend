import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { accessToken } = useAuth();

  if (!accessToken) return <Navigate to="/" replace />;

  return <>{children}</>;
}