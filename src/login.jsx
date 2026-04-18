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

  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin() {
    setError("");
    setMessage("");

    if (!email || !password) {
      return setError("All fields required");
    }

    setLoading(true);

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
        navigate("/todos");
      }
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  }

  async function sendOtp() {
    setError("");
    setMessage("");

    if (!forgotEmail) return setError("Enter email");

    setForgotLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
        setStep("otp");
      }
    } catch {
      setError("Failed to send OTP");
    }

    setForgotLoading(false);
  }

  async function verifyOtp() {
    setError("");
    setMessage("");

    if (!otp) return setError("Enter OTP");

    setForgotLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/verify-forgot-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
        setStep("reset");
      }
    } catch {
      setError("OTP verification failed");
    }

    setForgotLoading(false);
  }

  async function resetPassword() {
    setError("");
    setMessage("");

    if (!newPassword) return setError("Enter new password");

    setForgotLoading(true);

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

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);

        setTimeout(() => {
          setShowForgot(false);
        }, 1200);

        setStep("email");
        setForgotEmail("");
        setOtp("");
        setNewPassword("");
      }
    } catch {
      setError("Reset failed");
    }

    setForgotLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-400 blur-[180px] opacity-20 top-[-150px] left-[-150px]" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500 blur-[200px] opacity-20 bottom-[-150px] right-[-150px]" />

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-[420px] p-10 rounded-3xl bg-white/10 backdrop-blur-2xl border border-yellow-400/20 shadow-2xl"
      >
        <h1 className="text-4xl text-center font-extrabold text-yellow-400">
          Login 🔐
        </h1>

        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {message && (
          <p className="text-green-400 text-center mt-4">{message}</p>
        )}

        <div className="mt-8 space-y-4">
          <input
            className="w-full p-4 rounded-xl bg-black/60 text-white border border-white/10"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full p-4 rounded-xl bg-black/60 text-white border border-white/10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 cursor-pointer"
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>

        {/* LOGIN BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-7 p-4 rounded-xl bg-gradient-to-r cursor-pointer from-yellow-400 to-amber-500 text-black font-bold flex justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Logging...
            </>
          ) : (
            "Login"
          )}
        </button>
        {/* SIGNUP LINK */}
        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-yellow-400 cursor-pointer hover:underline"
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </span>
        </p>

        <p
          onClick={() => setShowForgot(true)}
          className="text-center text-yellow-400 mt-5 cursor-pointer"
        >
          Forgot Password?
        </p>
      </motion.div>

      {/* ================= FORGOT MODAL ================= */}
      <AnimatePresence>
        {showForgot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-[360px] p-6 rounded-2xl bg-white/10 border border-yellow-400/30"
            >
              <h2 className="text-yellow-400 text-center text-xl font-bold">
                Reset Password
              </h2>

              {error && <p className="text-red-400 mt-3">{error}</p>}
              {message && <p className="text-green-400 mt-3">{message}</p>}

              {/* EMAIL */}
              {step === "email" && (
                <>
                  <input
                    className="w-full mt-6 p-3 rounded-xl bg-black/60 text-white"
                    placeholder="Enter email"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />

                  <button
                    onClick={sendOtp}
                    disabled={forgotLoading}
                    className="w-full mt-5 p-3 bg-yellow-400 rounded-xl flex justify-center gap-2"
                  >
                    {forgotLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </>
              )}

              {/* OTP */}
              {step === "otp" && (
                <>
                  <input
                    className="w-full mt-6 p-3 rounded-xl bg-black/60 text-white"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />

                  <button
                    onClick={verifyOtp}
                    disabled={forgotLoading}
                    className="w-full mt-5 p-3 bg-green-400 rounded-xl"
                  >
                    {forgotLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                </>
              )}

              {/* RESET */}
              {step === "reset" && (
                <>
                  <input
                    className="w-full mt-6 p-3 rounded-xl bg-black/60 text-white"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button
                    onClick={resetPassword}
                    disabled={forgotLoading}
                    className="w-full mt-5 p-3 bg-blue-400 rounded-xl"
                  >
                    {forgotLoading ? "Resetting..." : "Reset Password"}
                  </button>
                </>
              )}

              <button
                onClick={() => setShowForgot(false)}
                className="w-full mt-4 text-gray-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
