import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  // login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState("email");

  // forgot
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // loading
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ================= AUTO LOGIN =================
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

  // ================= FORGOT FLOW =================

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
    setError("");
    setMessage("");
    setOtpLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/forgotPasswordOtp`, {
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
    setError("");
    setMessage("");
    setVerifyLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/verifyForgotOtp`, {
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
    setError("");
    setMessage("");
    setResetLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/resetPassword`, {
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
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* BG */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-400 blur-[200px] opacity-20 top-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500 blur-[200px] opacity-20 bottom-[-200px]" />

      {/* LOGIN */}
      <motion.div className="w-[420px] p-10 rounded-3xl bg-white/10 backdrop-blur-3xl border border-yellow-400/20">
        <h1 className="text-4xl text-center text-yellow-400 font-bold">
          Login 🔐
        </h1>

        {error && <p className="text-red-400 text-center mt-3">{error}</p>}
        {message && (
          <p className="text-green-400 text-center mt-3">{message}</p>
        )}

        <input
          className="w-full mt-6 p-3 bg-black/40 text-white rounded"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full mt-3 p-3 bg-black/40 text-white rounded"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-5 cursor-pointer"
          >
            👁️
          </span>
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-5 p-3 bg-yellow-400 text-black font-bold rounded"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p
          onClick={openForgot}
          className="text-center text-yellow-400 mt-3 cursor-pointer"
        >
          Forgot Password?
        </p>
      </motion.div>

      {/* MODAL */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/90">
            <div className="w-[350px] p-6 bg-white/10 rounded-xl border border-yellow-400/20">
              {step === "email" && (
                <>
                  <input
                    placeholder="Email"
                    className="w-full p-2 bg-black/60 text-white"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <button
                    onClick={sendOtp}
                    className="w-full mt-3 bg-yellow-400 p-2"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input
                    placeholder="OTP"
                    className="w-full p-2 bg-black/60 text-white"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={verifyOtp}
                    className="w-full mt-3 bg-green-400 p-2"
                  >
                    {verifyLoading ? "Checking..." : "Verify"}
                  </button>
                </>
              )}

              {step === "reset" && (
                <>
                  <input
                    placeholder="New Password"
                    className="w-full p-2 bg-black/60 text-white"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    onClick={resetPassword}
                    className="w-full mt-3 bg-blue-400 p-2"
                  >
                    {resetLoading ? "Updating..." : "Reset"}
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
      </AnimatePresence>
    </div>
  );
}
