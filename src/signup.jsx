import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("signup");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSignup() {
    setError("");
    setMessage("");

    if (!password || (!email && !phone)) {
      return setError("Email or phone required");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage(data.message);
        setStep("otp");
      }
    } catch {
      setError("Signup failed");
    }

    setLoading(false);
  }

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  async function handleVerifyOtp() {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      return setError("Enter full OTP");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/verifyotp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: finalOtp }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Account Verified ✅");

        setTimeout(() => {
          navigate("/todos");
        }, 800);
      }
    } catch {
      setError("OTP failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* glow background */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-400 blur-[200px] opacity-20 top-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500 blur-[200px] opacity-20 bottom-[-200px]" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-[420px] p-10 rounded-3xl bg-white/10 backdrop-blur-3xl border border-yellow-400/20 shadow-2xl"
      >
        <h1 className="text-4xl text-center font-bold text-yellow-400">
          Create Account 🚀
        </h1>

        <p className="text-center text-gray-400 text-sm mt-1">
          Join the platform
        </p>

        {error && (
          <p className="text-red-400 text-center mt-4 text-sm">{error}</p>
        )}

        {message && (
          <p className="text-green-400 text-center mt-4 text-sm">{message}</p>
        )}

        {/* SIGNUP FORM */}
        {step === "signup" && (
          <>
            <div className="mt-8 space-y-5">
              <input
                placeholder="Email (optional)"
                className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                placeholder="Phone (optional)"
                className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-amber-400 outline-none"
                onChange={(e) => setPhone(e.target.value)}
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 outline-none"
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

            {/* BUTTON */}
            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-8 p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-gray-400 mt-5 text-sm">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-yellow-400 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </>
        )}

        {/* OTP SCREEN */}
        {step === "otp" && (
          <>
            <p className="text-center text-gray-300 mt-6">Enter 6-digit OTP</p>

            <div className="flex justify-between mt-6">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-12 h-12 text-center text-xl bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full mt-8 p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold flex justify-center items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
