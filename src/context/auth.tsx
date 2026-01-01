import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ✔️ sahifa yangilanganda token yo‘qolib ketmasin
  useEffect(() => {
    const saved = localStorage.getItem("accessToken");
    if (saved) setAccessToken(saved);
  }, []);

  // ✔️ token o‘zgarsa localStorage ga yozamiz / o‘chiramiz
  useEffect(() => {
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    else localStorage.removeItem("accessToken");
  }, [accessToken]);

  // 🚪 logout funksiyasi
 const logout = async () => {
  await api.post("/auth/logout");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  setAccessToken(null);
};

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside provider");
  return ctx;
};