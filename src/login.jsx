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

  // ✅ AUTO REDIRECT IF ALREADY LOGGED IN
  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          const refreshRes = await fetch(`${API}/api/v1/newrefreshtoken`, {
            method: "POST",
            credentials: "include",
          });

          if (!refreshRes.ok) return;

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

        // 🔥 small delay for UX
        setTimeout(() => {
          navigate("/todos");
        }, 500);
      }
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  }

  // ================= SEND OTP =================
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

  // ================= VERIFY OTP =================
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

  // ================= RESET PASSWORD =================
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
      {/* UI SAME AS YOURS (unchanged) */}
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

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full mt-7 p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold flex justify-center gap-2"
        >
          {loading ? "Logging..." : "Login"}
        </button>

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don’t have an account?{" "}
          <span
            className="text-yellow-400 cursor-pointer"
            onClick={() => navigate("/signup")}
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

      {/* Forgot Modal same as yours (unchanged) */}
      <AnimatePresence>
        {showForgot && (
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black z-50">
            <motion.div className="w-[360px] p-6 rounded-2xl bg-white/10 border border-yellow-400/30">
              <h2 className="text-yellow-400 text-center text-xl font-bold">
                Reset Password
              </h2>

              {error && <p className="text-red-400 mt-3">{error}</p>}
              {message && <p className="text-green-400 mt-3">{message}</p>}

              {step === "email" && (
                <>
                  <input
                    className="w-full mt-6 p-3 rounded-xl bg-black/60 text-white"
                    placeholder="Enter email"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <button
                    onClick={sendOtp}
                    className="w-full mt-5 p-3 bg-yellow-400 rounded-xl"
                  >
                    Send OTP
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input
                    className="w-full mt-6 p-3 rounded-xl bg-black/60 text-white"
                    placeholder="Enter OTP"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button
                    onClick={verifyOtp}
                    className="w-full mt-5 p-3 bg-green-400 rounded-xl"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              {step === "reset" && (
                <>
                  <input
                    className="w-full mt-6 p-3 rounded-xl bg-black/60 text-white"
                    placeholder="New Password"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    onClick={resetPassword}
                    className="w-full mt-5 p-3 bg-blue-400 rounded-xl"
                  >
                    Reset Password
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
