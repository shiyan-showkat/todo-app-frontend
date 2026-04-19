import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  // inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // forgot password
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState("email");

  // loaders
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // messages
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ================= AUTO AUTH CHECK =================
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

        if (res.ok) {
          navigate("/todos");
        }
      } catch {}
    };

    checkAuth();
  }, [navigate]);

  // ================= LOGIN =================
  const handleLogin = async () => {
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
        setMessage("Login Success 🚀");

        setTimeout(() => {
          navigate("/todos");
        }, 600);
      }
    } catch {
      setError("Login failed");
    }

    setLoginLoading(false);
  };

  // ================= FORGOT FLOW =================
  const sendOtp = async () => {
    setError("");
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
    setError("");
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
        setMessage("OTP verified ✅");
        setStep("reset");
      }
    } catch {
      setError("OTP error");
    }

    setVerifyLoading(false);
  };

  const resetPassword = async () => {
    setError("");
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
        setTimeout(() => setShowForgot(false), 1000);
      }
    } catch {
      setError("Reset failed");
    }

    setResetLoading(false);
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div className="w-[420px] p-8 rounded-2xl bg-white/10 border border-yellow-400/20">
        <h1 className="text-3xl text-center text-yellow-400 font-bold">
          Login
        </h1>

        {error && <p className="text-red-400 text-center mt-2">{error}</p>}
        {message && (
          <p className="text-green-400 text-center mt-2">{message}</p>
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

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loginLoading}
          className="w-full mt-6 p-3 rounded bg-yellow-400 text-black font-bold flex justify-center items-center gap-2"
        >
          {loginLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Logging...
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
              <h2 className="text-center text-yellow-400">Reset Password</h2>

              {/* STEP 1 */}
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
                    className="w-full mt-4 p-2 bg-yellow-400 text-black flex justify-center gap-2"
                  >
                    {otpLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </>
              )}

              {/* STEP 2 */}
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
                    className="w-full mt-4 p-2 bg-green-400 text-black flex justify-center gap-2"
                  >
                    {verifyLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    ) : (
                      "Verify OTP"
                    )}
                  </button>
                </>
              )}

              {/* STEP 3 */}
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
                    className="w-full mt-4 p-2 bg-blue-400 text-black flex justify-center gap-2"
                  >
                    {resetLoading ? (
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
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
