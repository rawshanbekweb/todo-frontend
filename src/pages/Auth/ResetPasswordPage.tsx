import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      alert("Parol muvaffaqiyatli yangilandi!");
      navigate("/"); // login sahifaga qaytaramiz
    } catch (err: any) {
      alert(err?.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-center">
          🔑 Yangi parol o‘rnatish
        </h1>

        <input
          className="w-full px-3 py-2 rounded bg-gray-700"
          placeholder="Yangi parol"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submit}
          className="w-full py-2 bg-green-600 rounded"
        >
          Saqlash
        </button>
      </div>
    </div>
  );
}