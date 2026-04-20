import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("signup");
  const [otp, setOtp] = useState(["", "", "", ""]); // ✅ 4 digit

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
        setSuccess("OTP Verified ✅ Redirecting...");
        setTimeout(() => navigate("/login"), 1200);
      }
    } catch {
      setError("OTP verification failed");
    }

    setLoading(false);
  };

  // OTP INPUT
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      // ✅ 3 (last index of 4 digits)
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* BACKGROUND GLOW */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-300 blur-[200px] opacity-30 top-[-200px] pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] bg-yellow-500 blur-[200px] opacity-25 bottom-[-200px] pointer-events-none" />

      {/* CARD */}
      <div className="relative z-10 w-[420px] p-10 rounded-3xl bg-white/10 border border-yellow-300/30 backdrop-blur-3xl">
        <h1 className="text-3xl text-center text-yellow-300 font-bold">
          Signup 🚀
        </h1>

        {error && (
          <p className="text-red-400 text-center mt-3 text-sm">{error}</p>
        )}

        {success && (
          <p className="text-green-400 text-center mt-3 text-sm">{success}</p>
        )}

        {/* SIGNUP STEP */}
        {step === "signup" && (
          <>
            <input
              placeholder="Email"
              className="w-full mt-6 p-3 bg-black/40 text-white rounded hover:ring-2 hover:ring-yellow-300 transition"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mt-3 p-3 bg-black/40 text-white rounded hover:ring-2 hover:ring-yellow-300 transition"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full mt-6 p-3 bg-yellow-300 text-black font-bold rounded flex justify-center items-center gap-2 cursor-pointer hover:scale-[1.02] transition"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Sending OTP...
                </>
              ) : (
                "Signup"
              )}
            </button>
          </>
        )}

        {/* OTP STEP */}
        {step === "otp" && (
          <>
            <p className="text-center text-gray-300 mt-5">
              Enter OTP sent to email
            </p>

            <div className="flex justify-between mt-6 gap-2">
              {otp.map((val, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  className="
                    w-12 h-12 text-center text-xl font-bold
                    bg-yellow-300/20 text-yellow-200
                    border border-yellow-300
                    rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-yellow-300
                    hover:bg-yellow-300/40 transition
                  "
                />
              ))}
            </div>

            <button
              onClick={handleOtp}
              disabled={loading}
              className="w-full mt-6 p-3 bg-green-400 text-black font-bold rounded flex justify-center items-center gap-2 cursor-pointer hover:scale-[1.02] transition"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </button>
          </>
        )}

        {/* LOGIN LINK */}
        <p className="text-center text-sm text-gray-400 mt-5">
          Already have account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-300 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
