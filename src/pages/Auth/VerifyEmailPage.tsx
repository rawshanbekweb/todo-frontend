import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/api";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        await api.get(`/auth/verify-email?token=${token}`);
        setStatus("success");

        // 2 soniyadan keyin login sahifasiga
        setTimeout(() => navigate("/"), 2000);
      } catch (err) {
        setStatus("error");
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full text-center">

        {status === "loading" && (
          <p className="text-lg">⏳ Email tasdiqlanmoqda...</p>
        )}

        {status === "success" && (
          <>
            <h2 className="text-2xl font-bold text-green-400">
              ✅ Email muvaffaqiyatli tasdiqlandi!
            </h2>
            <p className="mt-2 text-gray-300">
              2 soniya ichida login sahifasiga yo‘naltirilasiz...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h2 className="text-2xl font-bold text-red-400">
              ❌ Token noto‘g‘ri yoki muddati o‘tgan
            </h2>
            <p className="mt-2 text-gray-300">
              Ro‘yxatdan qayta o‘tib ko‘ring.
            </p>
          </>
        )}
      </div>
    </div>
  );
}