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

  // ✅ AUTH CHECK ON LOAD
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
            return;
          }

          res = await fetch(`${API}/api/v1/me`, {
            credentials: "include",
          });
        }

        if (res.ok) {
          navigate("/todos");
        }
      } catch {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  // ✅ LOGIN
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
        setTimeout(() => navigate("/todos"), 600);
      }
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  };

  // ✅ OPEN FORGOT MODAL (FIXED)
  const openForgot = () => {
    setShowForgot(true);
    setStep("email");
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setError("");
    setMessage("");
  };

  // ✅ SEND OTP
  const sendOtp = async () => {
    setOtpLoading(true);
    setError("");
    setMessage("");

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

  // ✅ VERIFY OTP
  const verifyOtp = async () => {
    setVerifyLoading(true);
    setError("");
    setMessage("");

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

  // ✅ RESET PASSWORD
  const resetPassword = async () => {
    setResetLoading(true);
    setError("");
    setMessage("");

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
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white relative">
      <div className="w-full max-w-[440px] z-10">
        <div className="bg-[#262625]/40 backdrop-blur-2xl border border-cyan-400/10 p-10 rounded-lg">
          {/* HEADER */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-cyan-300">Login</h1>
            <p className="text-gray-400 text-xs mt-2">Secure Access</p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <input
              placeholder="Email"
              className="w-full p-3 bg-black border border-gray-700 rounded"
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full p-3 bg-black border border-gray-700 rounded"
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 cursor-pointer"
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>

            <button className="w-full border border-cyan-400 text-cyan-300 py-3">
              {loading ? "Loading..." : "Login"}
            </button>
          </form>

          {/* LINKS */}
          <div className="text-center mt-6">
            <p
              onClick={openForgot}
              className="text-cyan-300 text-xs cursor-pointer"
            >
              Forgot Password?
            </p>

            <p className="text-gray-400 text-xs mt-3">
              New user?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-cyan-300 cursor-pointer"
              >
                Signup
              </span>
            </p>
          </div>

          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
          {message && (
            <p className="text-green-400 text-center mt-4">{message}</p>
          )}
        </div>
      </div>

      {/* FORGOT MODAL */}
      <AnimatePresence>
        {showForgot && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/90">
            <div className="bg-[#262625] p-6 w-[350px] rounded">
              {step === "email" && (
                <>
                  <input
                    placeholder="Email"
                    className="w-full p-2 bg-black"
                    onChange={(e) => setForgotEmail(e.target.value)}
                  />
                  <button
                    onClick={sendOtp}
                    className="w-full mt-3 bg-cyan-400 p-2"
                  >
                    {otpLoading ? "Sending..." : "Send OTP"}
                  </button>
                </>
              )}

              {step === "otp" && (
                <>
                  <input
                    placeholder="OTP"
                    className="w-full p-2 bg-black"
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
                    className="w-full p-2 bg-black"
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
