import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        let res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        if (res.status === 401) {
          const refreshRes = await fetch(`${API}/api/v1/newrefreshtoken`, {
            method: "POST",
            credentials: "include",
          });

          if (!refreshRes.ok) {
            navigate("/login");
            return;
          }

          res = await fetch(`${API}/api/v1/me`, {
            credentials: "include",
          });
        }

        if (res.ok) {
          navigate("/todos");
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔥 SEXY LOADER
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        {/* LOGO TEXT */}
        <h1 className="text-4xl font-bold tracking-wide bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent">
          Shiyan
        </h1>

        {/* SUBTLE LINE ANIMATION */}
        <div className="mt-2 w-16 h-[2px] bg-yellow-400 rounded-full animate-pulse"></div>

        {/* LOADING TEXT */}
        <p className="mt-6 text-xs text-gray-400 tracking-widest">LOADING...</p>
      </div>
    );
  }

  return null;
}

export default Home;
