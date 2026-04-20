import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Signup() {
  const navigate = useNavigate();

  const [step, setStep] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ================= SIGNUP =================
  const handleSignup = async () => {
    if (!email || !password) {
      return setError("All fields required");
    }

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

  // ================= OTP =================
  const handleOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) {
      return setError("Enter full OTP");
    }

    setLoading(true);
    setError("");
    setSuccess("");

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
    <div className="min-h-screen flex items-center justify-center relative bg-[#0e0e0e] text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(153,247,255,0.05)_1px,transparent_0)] bg-[size:40px_40px]" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400 blur-[120px] opacity-30 rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-300 blur-[120px] opacity-30 rounded-full" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-[#262625]/40 backdrop-blur-xl border border-cyan-400/10 rounded-xl p-10 flex flex-col gap-8 shadow-[0_0_20px_rgba(0,255,255,0.15)]">
          {/* Messages */}
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          {/* ================= SIGNUP ================= */}
          {step === "signup" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-semibold">Create Identity</h2>
                <p className="text-gray-400 text-sm">
                  Initialize your secure credentials.
                </p>
              </div>

              {/* Email */}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black border border-gray-700 px-4 py-3 rounded-md text-sm focus:border-cyan-400 outline-none"
              />

              {/* Password with Eye */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-gray-700 px-4 py-3 pr-10 rounded-md text-sm focus:border-cyan-400 outline-none"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? "🙈" : "👁"}
                </span>
              </div>

              {/* Button */}
              <button
                onClick={handleSignup}
                disabled={loading}
                className="py-4 rounded-xl bg-gradient-to-r from-cyan-300 to-cyan-500 text-black font-bold tracking-widest cursor-pointer
                shadow-[0_0_25px_rgba(0,255,255,0.4)]
                hover:scale-[1.03] active:scale-[0.97] transition-all"
              >
                {loading ? "..." : "Create Account"}
              </button>
            </div>
          )}

          {/* ================= OTP ================= */}
          {step === "otp" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-semibold text-center">Enter OTP</h2>

              <div className="flex justify-between gap-2">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={val}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    className="w-14 h-14 text-center text-xl font-bold bg-black border border-gray-700 rounded-md text-cyan-300 focus:border-cyan-400 outline-none"
                  />
                ))}
              </div>

              <button
                onClick={handleOtp}
                disabled={loading}
                className="py-3 rounded-md border border-cyan-400 text-cyan-300 font-bold cursor-pointer
                hover:bg-cyan-400/10 transition-all"
              >
                {loading ? "..." : "Verify"}
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="text-center border-t border-gray-700 pt-6 text-sm text-gray-400">
            Already have credentials?
            <span
              onClick={() => navigate("/login")}
              className="text-cyan-300 ml-2 cursor-pointer hover:underline"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
