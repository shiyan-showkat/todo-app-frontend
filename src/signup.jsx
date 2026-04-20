import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

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
        setSuccess("OTP sent 📩");
        setStep("otp");
      }
    } catch {
      setError("Signup failed");
    }

    setLoading(false);
  };

  const handleOtp = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    const finalOtp = otp.join("");

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
        setSuccess("Verified ✅");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      setError("OTP failed");
    }

    setLoading(false);
  };

  const handleOtpChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);

    if (val && i < 3) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] relative overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(153,247,255,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400 blur-[120px] opacity-30 rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-300 blur-[120px] opacity-30 rounded-full" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-sm p-8 bg-white/5 backdrop-blur-xl border border-cyan-400/10 rounded-xl shadow-[0_0_25px_rgba(0,255,255,0.15)]">
        {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
        {success && <p className="text-green-400 text-xs mb-2">{success}</p>}

        {/* SIGNUP */}
        {step === "signup" && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border border-gray-700 px-4 py-3 rounded-md text-sm text-white focus:border-cyan-400 outline-none"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border border-gray-700 px-4 py-3 rounded-md text-sm text-white focus:border-cyan-400 outline-none"
            />

            <button
              onClick={handleSignup}
              disabled={loading}
              className="mt-2 py-3 rounded-md bg-gradient-to-r from-cyan-400 to-cyan-600 text-black font-bold tracking-wide 
              shadow-[0_0_20px_rgba(0,255,255,0.4)]
              hover:shadow-[0_0_30px_rgba(0,255,255,0.7)]
              hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              {loading ? "..." : "Continue"}
            </button>
          </div>
        )}

        {/* OTP */}
        {step === "otp" && (
          <div className="flex flex-col gap-5">
            <div className="flex justify-between gap-2">
              {otp.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  value={val}
                  maxLength={1}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-12 h-14 text-center text-xl font-bold bg-black border border-gray-700 rounded-md text-cyan-300 focus:border-cyan-400 outline-none"
                />
              ))}
            </div>

            <button
              onClick={handleOtp}
              disabled={loading}
              className="py-3 rounded-md border border-cyan-400 text-cyan-300 font-bold tracking-wide
              shadow-[0_0_15px_rgba(0,255,255,0.2)]
              hover:bg-cyan-400/10 hover:shadow-[0_0_25px_rgba(0,255,255,0.5)]
              hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              {loading ? "..." : "Verify"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
