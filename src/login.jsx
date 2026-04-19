import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // 🔥 forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState("email");
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

          if (!refresh.ok) return;

          res = await fetch(`${API}/api/v1/me`, {
            credentials: "include",
          });
        }

        if (res.ok) navigate("/todos");
      } catch {}
    };

    checkAuth();
  }, []);

  // ================= LOGIN =================
  const handleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Login success 🚀");
        setTimeout(() => navigate("/todos"), 700);
      }
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  };

  // ================= FORGOT PASSWORD =================

  const sendOtp = async () => {
    setError("");

    const res = await fetch(`${API}/api/v1/forgot-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier }),
    });

    const data = await res.json();

    if (!res.ok) setError(data.message);
    else {
      setMessage("OTP sent 📩");
      setStep("otp");
    }
  };

  const verifyOtp = async () => {
    const res = await fetch(`${API}/api/v1/verify-forgot-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: identifier, otp }),
    });

    const data = await res.json();

    if (!res.ok) setError(data.message);
    else {
      setMessage("Verified ✅");
      setStep("reset");
    }
  };

  const resetPassword = async () => {
    const res = await fetch(`${API}/api/v1/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: identifier,
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) setError(data.message);
    else {
      setMessage("Password updated 🔥");
      setTimeout(() => setShowForgot(false), 800);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* glow */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-400 blur-[200px] opacity-20 top-[-200px]" />

      {/* CARD */}
      <div className="w-[400px] p-10 rounded-2xl bg-white/10 backdrop-blur-xl border border-yellow-400/20">
        <h1 className="text-4xl text-yellow-400 text-center">
          Welcome Back 🔐
        </h1>

        {/* inputs */}
        <input
          placeholder="Email or Phone"
          className="w-full p-4 mt-6 bg-black/40 text-white"
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 mt-3 bg-black/40 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* login */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-5 p-3 bg-yellow-400 text-black flex justify-center items-center gap-2"
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

        {/* signup */}
        <p className="text-center text-gray-400 mt-4 text-sm">
          Don’t have account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-yellow-400 cursor-pointer"
          >
            Signup
          </span>
        </p>

        {/* forgot */}
        <p
          onClick={() => setShowForgot(true)}
          className="text-center text-yellow-400 mt-2 cursor-pointer text-sm"
        >
          Forgot Password?
        </p>
      </div>

      {/* FORGOT MODAL */}
      {showForgot && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center">
          <div className="w-[350px] p-6 bg-white/10 rounded-xl">
            <h2 className="text-yellow-400 text-center">Reset Password</h2>

            {step === "email" && (
              <>
                <button
                  onClick={sendOtp}
                  className="w-full mt-4 p-2 bg-yellow-400"
                >
                  Send OTP
                </button>
              </>
            )}

            {step === "otp" && (
              <>
                <input
                  className="w-full mt-4 p-2"
                  placeholder="OTP"
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button
                  onClick={verifyOtp}
                  className="w-full mt-3 bg-green-400 p-2"
                >
                  Verify
                </button>
              </>
            )}

            {step === "reset" && (
              <>
                <input
                  className="w-full mt-4 p-2"
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  onClick={resetPassword}
                  className="w-full mt-3 bg-blue-400 p-2"
                >
                  Reset
                </button>
              </>
            )}

            <button
              onClick={() => setShowForgot(false)}
              className="w-full mt-3 text-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
