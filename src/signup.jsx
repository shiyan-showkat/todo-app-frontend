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

  // SIGNUP
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

  // OTP VERIFY
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
        setSuccess("OTP Verified ✅");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      setError("OTP verification failed");
    }

    setLoading(false);
  };

  // OTP INPUT
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
    <div className="min-h-screen flex items-center justify-center relative bg-[#0e0e0e] text-white overflow-x-hidden">
      {/* BACKGROUND */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(153,247,255,0.05) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400 blur-[120px] opacity-30 rounded-full" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-300 blur-[120px] opacity-30 rounded-full" />

      {/* MAIN */}
      <div className="relative z-10 w-full max-w-md px-6 -mt-10">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-black tracking-tighter text-cyan-300 uppercase drop-shadow-[0_0_12px_rgba(0,242,255,0.6)]">
            NEON ZENITH
          </h1>
          <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mt-2">
            Neural Access Protocol v2.4
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-cyan-400/10 p-8 rounded-lg flex flex-col gap-5 shadow-[0_0_15px_rgba(153,247,255,0.2)]">
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {success && <p className="text-green-400 text-sm">{success}</p>}

          {/* SIGNUP */}
          {step === "signup" && (
            <>
              <h2 className="text-xl font-semibold">Create Identity</h2>
              <p className="text-gray-400 text-xs">
                Initialize your neural credentials.
              </p>

              <input
                type="email"
                placeholder="user@zenith.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-md py-3 px-3 text-sm focus:border-cyan-400 outline-none"
              />

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-gray-700 rounded-md py-3 px-3 text-sm focus:border-cyan-400 outline-none"
              />

              <button
                onClick={handleSignup}
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-400 to-cyan-600 py-3 text-black font-bold uppercase hover:scale-[1.02] active:scale-[0.98] transition"
              >
                {loading ? "Sending..." : "Initialize Signup"}
              </button>
            </>
          )}

          {/* OTP */}
          {step === "otp" && (
            <>
              <h2 className="text-xl font-semibold">MFA Challenge</h2>
              <p className="text-gray-400 text-xs">
                Enter the 4-digit pulse sent to your device.
              </p>

              <div className="flex justify-between gap-3 py-3">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    value={val}
                    maxLength={1}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    className="w-14 h-16 text-center text-xl font-bold bg-black border border-gray-700 rounded-md text-cyan-300 focus:border-cyan-400 outline-none"
                  />
                ))}
              </div>

              <button
                onClick={handleOtp}
                disabled={loading}
                className="w-full border border-cyan-400 text-cyan-300 py-3 uppercase hover:bg-cyan-400/10 transition"
              >
                {loading ? "Verifying..." : "Verify Identity"}
              </button>

              <button className="text-[10px] text-gray-400 uppercase hover:text-cyan-300 transition">
                Resend Neural Pulse
              </button>
            </>
          )}

          {/* LOGIN */}
          <div className="border-t border-gray-800 pt-3 text-center">
            <p className="text-xs text-gray-400">
              Already have credentials?
              <span
                onClick={() => navigate("/login")}
                className="text-cyan-300 ml-1 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>
          </div>
        </div>

        {/* SMALL INFO CARDS */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="bg-white/5 border border-cyan-400/10 p-3 rounded-lg flex gap-2">
            <div className="w-7 h-7 bg-cyan-400/20 flex items-center justify-center rounded-full">
              🛡️
            </div>
            <div>
              <p className="text-[8px] uppercase text-gray-400">Encrypted</p>
              <p className="text-[9px]">AES-256</p>
            </div>
          </div>

          <div className="bg-white/5 border border-cyan-400/10 p-3 rounded-lg flex gap-2">
            <div className="w-7 h-7 bg-cyan-400/20 flex items-center justify-center rounded-full">
              ⚡
            </div>
            <div>
              <p className="text-[8px] uppercase text-gray-400">Latency</p>
              <p className="text-[9px]">0.4ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
