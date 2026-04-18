import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const api = "http://localhost:7777";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
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

    if (!email || !password) {
      return setError("All fields required");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage(data.message);
        // navigate("/todos");
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

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Account Verified ✅");

        setTimeout(() => {
          navigate("/todos");
        }, 1200);
      }
    } catch {
      setError("OTP failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* YELLOW GLOW BACKGROUND */}
      <div className="absolute w-[700px] h-[700px] bg-yellow-400 blur-[200px] opacity-20 top-[-200px]" />
      <div className="absolute w-[600px] h-[600px] bg-amber-500 blur-[200px] opacity-20 bottom-[-200px]" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-[420px] p-10 rounded-3xl bg-white/10 backdrop-blur-3xl border border-yellow-400/20 shadow-2xl"
      >
        <h1 className="text-4xl text-center font-extrabold text-yellow-400">
          Create Account 🚀
        </h1>

        {/* MESSAGE */}
        {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        {message && (
          <p className="text-green-400 text-center mt-4">{message}</p>
        )}

        {step === "signup" && (
          <>
            <div className="mt-8 space-y-6">
              {/* EMAIL */}
              <div className="relative">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                />
                <label className="absolute left-4 -top-2 text-sm text-yellow-300 bg-black px-1">
                  Email
                </label>
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-amber-400 outline-none"
                />

                <label className="absolute left-4 -top-2 text-sm text-amber-300 bg-black px-1">
                  Password
                </label>

                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 cursor-pointer text-gray-300"
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>

            {/* BUTTON */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-8 p-4 rounded-xl bg-gradient-to-r cursor-pointer from-yellow-400 to-amber-500 text-black font-bold flex justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full cursor-pointer animate-spin"></div>
                  Creating...
                </>
              ) : (
                "Create Account"
              )}
            </motion.button>

            {/* LOGIN TEXT */}
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

        {step === "otp" && (
          <>
            <p className="text-center text-gray-300 mt-6">Enter 6-digit OTP</p>

            <div className="flex justify-between mt-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl rounded-lg bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-yellow-400 outline-none"
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full mt-8 p-4 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold flex justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}
