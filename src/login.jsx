import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState("email");
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          const refresh = await fetch(`${API}/api/v1/newrefreshtoken`, {
            method: "POST",
            credentials: "include",
          });

          if (!refresh.ok) {
            navigate("/login");
          }

          res = await fetch(`${API}/api/v1/me`, {
            credentials: "include",
          });
        } else {
          navigate("/todos");
        }

        if (res.ok) navigate("/todos");
      } catch {}
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else navigate("/todos");
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* glow */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-400 blur-[200px] opacity-20 top-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500 blur-[200px] opacity-20 bottom-[-200px]" />

      {/* CARD */}
      <div className="relative z-10 w-[400px] p-10 rounded-3xl bg-white/10 border border-yellow-400/20 backdrop-blur-3xl">
        <h1 className="text-3xl text-center text-yellow-400 font-bold">
          Login 🔐
        </h1>

        {error && (
          <p className="text-red-400 text-center mt-3 text-sm">{error}</p>
        )}

        {/* EMAIL */}
        <input
          placeholder="Email"
          className="w-full mt-6 p-3 bg-black/40 text-white rounded-xl
          border border-white/10
          hover:border-yellow-400
          focus:outline-none focus:ring-2 focus:ring-yellow-400
          transition duration-200"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full mt-3 p-3 bg-black/40 text-white rounded-xl
            border border-white/10
            hover:border-yellow-400
            focus:outline-none focus:ring-2 focus:ring-yellow-400
            transition duration-200"
            onChange={(e) => setPassword(e.target.value)}
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-6 cursor-pointer text-gray-300 hover:text-yellow-400"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-5 p-3 bg-yellow-400 text-black font-bold flex justify-center items-center gap-2 rounded-xl
          cursor-pointer hover:bg-yellow-300 transition"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        {/* LINKS */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don’t have account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>

        <p
          onClick={() => setShowForgot(true)}
          className="text-center text-yellow-400 text-sm mt-2 cursor-pointer"
        >
          Forgot Password?
        </p>
      </div>
    </div>
  );
}
