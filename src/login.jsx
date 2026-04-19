import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Login() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState(""); // 🔥 changed
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          const refresh = await fetch(`${API}/api/v1/newrefreshtoken`, {
            method: "POST",
            credentials: "include",
          });

          if (!refresh.ok) {
            navigate("/login");
            return;
          }

          res = await fetch(`${API}/api/v1/me`, {
            credentials: "include",
          });
        }

        if (res.ok) navigate("/todos");
      } catch {}
    };

    checkAuth();
  }, []);

  const handleLogin = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/v1/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier, // 🔥 email OR phone
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) setError(data.message);
      else {
        setMessage("Login success 🚀");
        setTimeout(() => navigate("/todos"), 600);
      }
    } catch {
      setError("Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-[400px] p-8 bg-white/10 rounded-xl">
        <h1 className="text-3xl text-yellow-400 text-center">Login 🔐</h1>

        <input
          placeholder="Email or Phone"
          className="w-full p-3 mt-6 bg-black/40"
          onChange={(e) => setIdentifier(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mt-3 bg-black/40"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full mt-5 p-3 bg-yellow-400 text-black"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
