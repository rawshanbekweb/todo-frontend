import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  createdAt: string;
  verified: boolean;
}

export default function ProfilePage() {
  const { logout } = useAuth();

  const navigate = useNavigate()

  const [user, setUser] = useState<User | null>(null);

  const load = async () => {
    const res = await api.get("/auth/profile");
    setUser(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!user) return <p className="text-white">Yuklanmoqda...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex justify-center pt-20">

      <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-md space-y-4">

        <h1 className="text-2xl font-bold text-center">👤 Profile</h1>

        <div className="space-y-2">
          <p><b>Email:</b> {user.email}</p>

          <p>
            <b>Holat:</b>{" "}
            {user.verified ? (
              <span className="text-green-400">Tasdiqlangan ✔</span>
            ) : (
              <span className="text-yellow-400">Tasdiqlanmagan ❌</span>
            )}
          </p>

          <p>
            <b>Ro‘yxatdan o‘tgan:</b>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
        </div>

        <button
          onClick={logout}
          className="w-full mt-3 py-2 bg-red-600 rounded-xl"
        >
          Logout
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600"
        >
          🔙 Back to todos
        </button>

      </div>
    </div>
  );
}