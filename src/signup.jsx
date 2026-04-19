import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Signup() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else navigate("/login");
    } catch {
      setError("Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative overflow-hidden">
      {/* glow */}
      <div className="absolute w-[600px] h-[600px] bg-yellow-400 blur-[200px] opacity-20 top-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-amber-500 blur-[200px] opacity-20 bottom-[-200px]" />

      {/* CARD */}
      <div className="w-[400px] p-10 rounded-3xl bg-white/10 backdrop-blur-3xl border border-yellow-400/20 shadow-2xl">
        <h1 className="text-4xl text-center font-bold text-yellow-400">
          Create Account 🚀
        </h1>

        {error && (
          <p className="text-red-400 text-center mt-4 text-sm">{error}</p>
        )}

        <div className="mt-8 space-y-5">
          <input
            placeholder="Email"
            className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-transparent border border-white/20 rounded-xl text-white focus:ring-2 focus:ring-yellow-400 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

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
            "Signup"
          )}
        </button>

        <p className="text-center text-gray-400 mt-5 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-yellow-400 cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
