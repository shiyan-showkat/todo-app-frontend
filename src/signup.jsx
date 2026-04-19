import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [step, setStep] = useState("signup");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // SIGNUP
  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const res = await fetch(`${API}/api/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) setError(data.message);
    else setStep("otp");

    setLoading(false);
  };

  // VERIFY OTP
  const handleOtp = async () => {
    setLoading(true);

    const res = await fetch(`${API}/api/v1/verifyotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();

    if (!res.ok) setError(data.message);
    else navigate("/login");

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-[400px] p-8 bg-white/10 rounded-2xl border border-yellow-400/20">
        <h1 className="text-3xl text-yellow-400 text-center font-bold">
          Signup 🚀
        </h1>

        {error && <p className="text-red-400 text-center mt-3">{error}</p>}

        {/* STEP 1 */}
        {step === "signup" && (
          <>
            <input
              className="w-full mt-5 p-3 bg-black/40 text-white rounded hover:ring-2 hover:ring-yellow-400"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="w-full mt-3 p-3 bg-black/40 text-white rounded hover:ring-2 hover:ring-yellow-400"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              onClick={handleSignup}
              className="w-full mt-5 p-3 bg-yellow-400 text-black rounded cursor-pointer hover:scale-105 transition"
            >
              {loading ? "Sending OTP..." : "Signup"}
            </button>
          </>
        )}

        {/* STEP 2 - OTP */}
        {step === "otp" && (
          <>
            <input
              className="w-full mt-5 p-3 bg-black/40 text-white rounded text-center tracking-widest"
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleOtp}
              className="w-full mt-5 p-3 bg-green-400 text-black rounded cursor-pointer hover:scale-105 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        <p
          onClick={() => navigate("/login")}
          className="text-center text-yellow-400 mt-4 cursor-pointer hover:underline"
        >
          Already have account? Login
        </p>
      </div>
    </div>
  );
}
