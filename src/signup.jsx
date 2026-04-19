import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // 🔥 added
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
        body: JSON.stringify({ email, phone, password }), // 🔥 updated
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
      } else {
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

      if (!res.ok) {
        setError(data.message);
      } else {
        setMessage("Account Verified ✅");

        setTimeout(() => {
          navigate("/todos");
        }, 1000);
      }
    } catch {
      setError("OTP failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div className="w-[400px] p-8 rounded-2xl bg-white/10">
        <h1 className="text-3xl text-yellow-400 text-center">Signup 🚀</h1>

        {step === "signup" && (
          <>
            <input
              placeholder="Email (optional)"
              className="w-full p-3 mt-6 bg-black/40"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Phone (optional)"
              className="w-full p-3 mt-3 bg-black/40"
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 mt-3 bg-black/40"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleSignup}
              className="w-full mt-5 p-3 bg-yellow-400 text-black"
            >
              {loading ? "Loading..." : "Signup"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <p className="text-center mt-5">Enter OTP</p>

            <div className="flex gap-2 justify-center mt-4">
              {otp.map((d, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-10 h-10 text-center bg-black/40"
                />
              ))}
            </div>

            <button
              onClick={handleVerifyOtp}
              className="w-full mt-5 p-3 bg-green-400 text-black"
            >
              Verify OTP
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
