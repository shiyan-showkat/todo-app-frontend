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

  const handleSignup = async () => {
    if (!email || !password) return setError("All fields required");

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

      if (!res.ok) setError(data.message);
      else {
        setSuccess("OTP sent 📩");
        setStep("otp");
      }
    } catch {
      setError("Signup failed");
    }

    setLoading(false);
  };

  const handleOtp = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 4) return setError("Enter full OTP");

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

      if (!res.ok) setError(data.message);
      else {
        setSuccess("Verified ✅");
        setTimeout(() => navigate("/login"), 1000);
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
    <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] relative overflow-hidden text-white">
      {/* Glow Orbs (same as login) */}
      <div className="absolute w-[600px] h-[600px] bg-cyan-400 blur-[120px] opacity-20 top-[-200px] left-[-100px] rounded-full" />
      <div className="absolute w-[500px] h-[500px] bg-cyan-300 blur-[120px] opacity-20 bottom-[-150px] right-[-50px] rounded-full" />

      {/* CARD */}
      <div className="w-full max-w-[440px] z-10">
        <div className="bg-[#262625]/40 backdrop-blur-2xl border border-cyan-400/10 p-10 rounded-lg shadow-2xl">
          {/* HEADER */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold bg-gradient-to-b from-white to-cyan-300 bg-clip-text text-transparent">
              Initialize
            </h1>
            <p className="text-gray-400 text-xs uppercase tracking-widest mt-2">
              Create Secure Identity
            </p>
          </div>

          {/* ERROR / SUCCESS */}
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}
          {success && (
            <p className="text-green-400 text-center mb-4">{success}</p>
          )}

          {/* ================= SIGNUP ================= */}
          {step === "signup" && (
            <div className="space-y-6">
              {/* EMAIL */}
              <div>
                <label className="text-[10px] uppercase text-gray-400">
                  Identity
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    🔐
                  </span>
                  <input
                    className="w-full pl-12 pr-4 py-3 bg-black border border-gray-700 rounded text-sm outline-none focus:border-cyan-400"
                    placeholder="USER_ID"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-[10px] uppercase text-gray-400">
                  Encryption Key
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2">
                    🔒
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-12 pr-12 py-3 bg-black border border-gray-700 rounded text-sm outline-none focus:border-cyan-400"
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? "🙈" : "👁"}
                  </span>
                </div>
              </div>

              {/* BUTTON */}
              <button
                onClick={handleSignup}
                className="w-full border-2 border-cyan-400 text-cyan-300 py-4 text-xs font-bold tracking-widest hover:bg-cyan-400/10 transition cursor-pointer"
              >
                {loading ? "Loading..." : "Create Account"}
              </button>
            </div>
          )}

          {/* ================= OTP ================= */}
          {step === "otp" && (
            <div className="space-y-6 text-center">
              <p className="text-gray-400 text-sm">Enter OTP</p>

              <div className="flex justify-between gap-2">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={val}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    className="w-14 h-14 text-center text-xl bg-black border border-gray-700 rounded text-cyan-300 focus:border-cyan-400 outline-none"
                  />
                ))}
              </div>

              <button
                onClick={handleOtp}
                className="w-full border border-cyan-400 text-cyan-300 py-3 font-bold cursor-pointer hover:bg-cyan-400/10 transition"
              >
                {loading ? "..." : "Verify OTP"}
              </button>
            </div>
          )}

          {/* FOOTER */}
          <div className="mt-8 text-center text-xs text-gray-400">
            Already have account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-cyan-300 cursor-pointer hover:underline"
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
