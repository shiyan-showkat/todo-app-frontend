import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState("email");

  // 🔥 BUTTON LOADING STATES (IMPORTANT)
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ================= LOGIN =================
  async function handleLogin() {
    setError("");
    setMessage("");
    setLoginLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
        setTimeout(() => navigate("/todos"), 500);
      }
    } catch {
      setError("Login failed");
    }

    setLoginLoading(false);
  }

  // ================= OTP =================
  async function sendOtp() {
    setError("");
    setMessage("");
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
        setMessage(data.message);
        setStep("otp");
      }
    } catch {
      setError("Failed OTP");
    }

    setOtpLoading(false);
  }

  // ================= VERIFY OTP =================
  async function verifyOtp() {
    setError("");
    setMessage("");
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
        setMessage(data.message);
        setStep("reset");
      }
    } catch {
      setError("OTP failed");
    }

    setVerifyLoading(false);
  }

  // ================= RESET =================
  async function resetPassword() {
    setError("");
    setMessage("");
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
        setMessage(data.message);
        setShowForgot(false);
      }
    } catch {
      setError("Reset failed");
    }

    setResetLoading(false);
  }

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div className="w-[420px] p-8 rounded-2xl bg-white/10 border border-yellow-400/20">
        <h1 className="text-3xl text-center text-yellow-400 font-bold">
          Login
        </h1>

        {error && <p className="text-red-400 text-center mt-3">{error}</p>}
        {message && (
          <p className="text-green-400 text-center mt-3">{message}</p>
        )}

        {/* INPUTS */}
        <div className="mt-6 space-y-4">
          <input
            className="w-full p-3 rounded bg-black/60"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-3 rounded bg-black/60"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 cursor-pointer"
            >
              👁️
            </span>
          </div>
        </div>

        {/* 🔥 LOGIN BUTTON WITH LOADER */}
        <button
          onClick={handleLogin}
          disabled={loginLoading}
          className="w-full mt-6 p-3 rounded bg-yellow-400 text-black font-bold flex justify-center items-center gap-2"
        >
          {loginLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </button>

        <p
          onClick={() => setShowForgot(true)}
          className="text-center mt-4 text-yellow-400 cursor-pointer"
        >
          Forgot Password?
        </p>
      </motion.div>

      {/* ================= FORGOT MODAL ================= */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/90">
            <div className="w-[360px] p-6 bg-white/10 rounded-xl border border-yellow-400/20">
              <h2 className="text-yellow-400 text-center">Reset Password</h2>

              {step === "email" && (
                <>
                  <input
                    className="w-full mt-4 p-2 bg-black/60 rounded"
                    placeholder="Email"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />

                  <button
                    onClick={sendOtp}
                    disabled={otpLoading}
                    className="w-full mt-4 p-2 bg-yellow-400 text-black flex justify-center items-center gap-2"
                  >
                    {otpLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input
                    className="w-full mt-4 p-2 bg-black/60 rounded"
                    placeholder="OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button
                    onClick={verifyOtp}
                    disabled={verifyLoading}
                    className="w-full mt-4 p-2 bg-green-400 text-black flex justify-center items-center gap-2"
                  >
                    {verifyLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </>
              )}

              {step === "reset" && (
                <>
                  <input
                    className="w-full mt-4 p-2 bg-black/60 rounded"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button
                    onClick={resetPassword}
                    disabled={resetLoading}
                    className="w-full mt-4 p-2 bg-blue-400 text-black flex justify-center items-center gap-2"
                  >
                    {resetLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </>
              )}

              <button
                onClick={() => setShowForgot(false)}
                className="w-full mt-4 text-gray-300"
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
