import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { accessToken } = useAuth();

  // token bo‘lmasa -> login sahifaga qaytariladi
  if (!accessToken) {
    return <Navigate to="/" replace />;
  }

  return children;
}