import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("signup");
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
        setSuccess("OTP sent to email 📩");
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
        setSuccess("OTP Verified ✅ Redirecting...");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      setError("OTP verification failed");
    }

    setLoading(false);
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
      {/* BACKGROUND ORBS */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-purple-400/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-200px] right-[-100px] w-[500px] h-[500px] bg-cyan-400/10 blur-[120px] rounded-full"></div>

      {/* CARD */}
      <div className="relative z-10 w-[420px] p-10 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          {step === "signup" ? "Join Us 🚀" : "Verification 🔐"}
        </h1>

        {error && <p className="text-red-400 text-center">{error}</p>}
        {success && <p className="text-green-400 text-center">{success}</p>}

        {/* SIGNUP */}
        {step === "signup" && (
          <>
            <input
              placeholder="Email"
              className="w-full mt-5 p-4 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mt-4 p-4 rounded-xl bg-black/40 border border-white/10 focus:ring-2 focus:ring-cyan-400 outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-6 p-4 rounded-full bg-gradient-to-r from-purple-500 to-purple-700 font-bold hover:scale-[1.02] transition"
            >
              {loading ? "Sending..." : "Signup"}
            </button>
          </>
        )}

        {/* OTP */}
        {step === "otp" && (
          <>
            <p className="text-center text-gray-400 mb-4">
              Enter OTP sent to email
            </p>

            <div className="flex justify-between gap-2">
              {otp.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="w-12 h-12 text-center text-xl font-bold rounded-lg bg-black/40 border border-cyan-400/30 text-cyan-300"
                />
              ))}
            </div>

            <button
              onClick={handleOtp}
              disabled={loading}
              className="w-full mt-6 p-4 rounded-full border border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* LOGIN */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-cyan-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
