import { useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/auth";

export default function AuthPage() {
  const { setAccessToken } = useAuth();

  // ➕ forgot ham qo‘shdik
  const [mode, setMode] = useState<"login" | "register" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async () => {
    try {
      const url = mode === "login" ? "/auth/login" : "/auth/register";

      const res = await api.post(url, { email, password });

      setAccessToken(res.data.accessToken);

      alert("Muvaffaqiyatli!");
    } catch (err: any) {
      console.log(err);
      alert(err?.response?.data?.message || "Xatolik yuz berdi");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-sm space-y-4">

        {/* Title */}
        <h1 className="text-2xl font-bold text-center">
          {mode === "login" && "Login"}
          {mode === "register" && "Ro‘yxatdan o‘tish"}
          {mode === "forgot" && "Parolni tiklash"}
        </h1>

        {/* -------- LOGIN / REGISTER FORM -------- */}
        {(mode === "login" || mode === "register") && (
          <>
            <input
              className="w-full px-3 py-2 rounded bg-gray-700"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full px-3 py-2 rounded bg-gray-700"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={submit}
              className="w-full py-2 bg-blue-600 rounded"
            >
              Tasdiqlash
            </button>

            {/* Switch login/register */}
            <p
              className="text-sm text-center text-blue-400 cursor-pointer"
              onClick={() =>
                setMode(mode === "login" ? "register" : "login")
              }
            >
              {mode === "login"
                ? "Akkaunting yo‘qmi? Ro‘yxatdan o‘tish"
                : "Akkaunt bormi? Login"}
            </p>

            {/* Forgot password link */}
            {mode === "login" && (
              <p
                className="text-sm text-center text-yellow-400 cursor-pointer"
                onClick={() => setMode("forgot")}
              >
                Parolni unutdingizmi?
              </p>
            )}
          </>
        )}

        {/* -------- FORGOT PASSWORD -------- */}
        {mode === "forgot" && (
          <>
            <p className="text-center text-gray-300">
              Emailingizni kiriting — sizga parolni tiklash havolasi yuboriladi
            </p>

            <input
              className="w-full px-3 py-2 rounded bg-gray-700"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={async () => {
                try {
                  await api.post("/auth/forgot-password", { email });
                  alert("Reset link emailingizga yuborildi");
                  setMode("login");
                } catch (err: any) {
                  alert(err?.response?.data?.message || "Xatolik yuz berdi");
                }
              }}
              className="w-full py-2 bg-yellow-600 rounded"
            >
              Reset link yuborish
            </button>

            <p
              className="text-sm text-center text-blue-400 cursor-pointer"
              onClick={() => setMode("login")}
            >
              Login sahifasiga qaytish
            </p>
          </>
        )}
      </div>
    </div>
  );
}