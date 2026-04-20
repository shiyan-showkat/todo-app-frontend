import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState("email");

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // AUTH CHECK
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

          if (!refresh.ok) return navigate("/login");

          res = await fetch(`${API}/api/v1/me`, {
            credentials: "include",
          });
        }

        if (res.ok) navigate("/todos");
      } catch {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Welcome back 🚀");
        setTimeout(() => navigate("/todos"), 700);
      }
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  };

  const openForgot = () => {
    setShowForgot(true);
    setStep("email");
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setError("");
    setMessage("");
  };

  const sendOtp = async () => {
    setOtpLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/v1/forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("OTP sent 📩");
        setStep("otp");
      }
    } catch {
      setError("OTP failed");
    }

    setOtpLoading(false);
  };

  const verifyOtp = async () => {
    setVerifyLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/verify-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Verified ✅");
        setStep("reset");
      }
    } catch {
      setError("OTP error");
    }

    setVerifyLoading(false);
  };

  const resetPassword = async () => {
    setResetLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Password updated 🔥");
        setTimeout(() => setShowForgot(false), 800);
      }
    } catch {
      setError("Reset failed");
    }

    setResetLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] relative overflow-hidden text-white">
      {/* glow */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-400 blur-[120px] opacity-20 top-[-200px] left-[-100px] rounded-full" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-300 blur-[120px] opacity-20 bottom-[-150px] right-[-50px] rounded-full" />

      {/* CARD */}
      <div className="w-full max-w-[440px] z-10">
        <div className="bg-[#262625]/40 backdrop-blur-2xl border border-cyan-400/10 p-10 rounded-xl shadow-2xl">
          {/* TITLE */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-b from-white to-cyan-300 bg-clip-text text-transparent">
              Initialize
            </h1>
            <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest">
              Secure Login Access
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="text-[10px] uppercase text-gray-400">
                Identity
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  🔐
                </span>

                <input
                  className="w-full pl-12 p-3 bg-black border border-gray-700 rounded text-sm outline-none focus:border-cyan-400"
                  placeholder="Enter your email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-[10px] uppercase text-gray-400">
                Password
              </label>

              <div className="relative mt-2">
                <span className="absolute left-4 top-1/2 -translate-y-1/2">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-12 pr-12 p-3 bg-black border border-gray-700 rounded text-sm outline-none focus:border-cyan-400"
                  placeholder="Enter password"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 cursor-pointer"
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <button className="w-full border-2 border-cyan-400 text-cyan-300 py-4 text-xs font-bold tracking-widest hover:bg-cyan-400/10 transition cursor-pointer">
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* LINKS */}
          <div className="text-center mt-8 text-xs">
            <p
              onClick={openForgot}
              className="text-cyan-300 cursor-pointer hover:underline"
            >
              Forgot Password?
            </p>

            <p className="text-gray-400 mt-3">
              New here?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-cyan-300 cursor-pointer hover:underline"
              >
                Create Account
              </span>
            </p>
          </div>

          {/* MESSAGES */}
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
          {message && (
            <p className="text-green-400 text-center mt-4">{message}</p>
          )}
        </div>
      </div>

      {/* FORGOT MODAL (same logic unchanged) */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
            <div className="bg-[#262625] p-6 w-[350px] rounded-lg border border-cyan-400/20">
              {step === "email" && (
                <>
                  <input
                    placeholder="Email"
                    className="w-full p-2 bg-black text-white"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <button
                    onClick={sendOtp}
                    className="w-full mt-3 bg-cyan-400 p-2 cursor-pointer"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input
                    placeholder="OTP"
                    className="w-full p-2 bg-black text-white"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={verifyOtp}
                    className="w-full mt-3 bg-green-400 p-2 cursor-pointer"
                  >
                    {verifyLoading ? "Checking..." : "Verify"}
                  </button>
                </>
              )}

              {step === "reset" && (
                <>
                  <input
                    placeholder="New Password"
                    className="w-full p-2 bg-black text-white"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    onClick={resetPassword}
                    className="w-full mt-3 bg-blue-400 p-2 cursor-pointer"
                  >
                    {resetLoading ? "Updating..." : "Reset"}
                  </button>
                </>
              )}

              <button
                onClick={() => setShowForgot(false)}
                className="w-full mt-4 text-gray-300 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
