import { Routes, Route } from "react-router-dom";
import VerifyEmailPage from "./pages/Auth/VerifyEmailPage";
import AuthPage from "./pages/Auth/AuthPage";
import TodoApp from "./pages/App/TodoApp";
import { useAuth } from "./context/auth";
import ResetPasswordPage from "./pages/Auth/ResetPasswordPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProfilePage from "./pages/Profile/ProfilePage";

export default function App() {
  const { accessToken } = useAuth();

  return (
    <Routes>

      {/* Email tasdiqlash */}
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Login / Register */}
      <Route
        path="/"
        element={accessToken ? <TodoApp /> : <AuthPage />}
      />

      {/* Parolni tiklash */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* 🔐 Protected sahifalar */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <TodoApp />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}