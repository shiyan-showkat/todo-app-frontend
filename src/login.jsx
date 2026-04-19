import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  // inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState("email");

  // forgot flow
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // loaders
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ================= AUTO LOGIN CHECK =================
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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Welcome back 🚀");
        setTimeout(() => navigate("/todos"), 600);
      }
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  };

  // ================= OTP =================
  const sendOtp = async () => {
    setOtpLoading(true);

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
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Password updated 🔥");
        setTimeout(() => setShowForgot(false), 700);
      }
    } catch {
      setError("Reset failed");
    }

    setResetLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* glow like signup */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-400 blur-[200px] opacity-20 top-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500 blur-[200px] opacity-20 bottom-[-200px]" />

      {/* LOGIN CARD (SIGNUP STYLE MATCH) */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-[420px] p-10 rounded-3xl bg-white/10 backdrop-blur-3xl border border-yellow-400/20 shadow-2xl"
      >
        <h1 className="text-4xl text-center font-extrabold text-yellow-400">
          Welcome Back 🔐
        </h1>

        <p className="text-center text-gray-400 text-sm mt-1">
          Login to continue
        </p>

        {/* messages */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {message && (
          <p className="text-green-400 text-center mt-4">{message}</p>
        )}

        {/* inputs */}
        <div className="mt-8 space-y-6">
          {/* EMAIL */}
          <input
            className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-amber-400 outline-none"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 cursor-pointer text-gray-300"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* LOGIN BUTTON (SAME AS SIGNUP STYLE) */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-8 p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </motion.button>

        {/* SIGNUP TEXT (SMALL LIKE REAL APPS) */}
        <p className="text-center text-gray-400 mt-5 text-sm">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-yellow-400 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>

        {/* FORGOT */}
        <p
          onClick={() => setShowForgot(true)}
          className="text-center text-yellow-400 mt-3 cursor-pointer text-sm"
        >
          Forgot Password?
        </p>
      </motion.div>

      {/* FORGOT MODAL (UNCHANGED FLOW) */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/90">
            <div className="w-[360px] p-6 bg-white/10 rounded-xl border border-yellow-400/20">
              <h2 className="text-yellow-400 text-center font-bold">
                Reset Password
              </h2>

              {step === "email" && (
                <>
                  <input
                    className="w-full mt-4 p-2 bg-black/60 rounded text-white"
                    placeholder="Email"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />

                  <button
                    onClick={sendOtp}
                    className="w-full mt-4 p-2 bg-yellow-400 text-black"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input
                    className="w-full mt-4 p-2 bg-black/60 rounded text-white"
                    placeholder="OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button
                    onClick={verifyOtp}
                    className="w-full mt-4 p-2 bg-green-400 text-black"
                  >
                    {verifyLoading ? "Checking..." : "Verify"}
                  </button>
                </>
              )}

              {step === "reset" && (
                <>
                  <input
                    className="w-full mt-4 p-2 bg-black/60 rounded text-white"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button
                    onClick={resetPassword}
                    className="w-full mt-4 p-2 bg-blue-400 text-black"
                  >
                    {resetLoading ? "Updating..." : "Reset"}
                  </button>
                </>
              )}

              <button
                onClick={() => setShowForgot(false)}
                className="w-full mt-4 text-gray-300 text-sm"
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
