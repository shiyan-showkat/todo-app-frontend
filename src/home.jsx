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
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black overflow-hidden flex items-center justify-center relative">
        {/* FLOATING ORBS */}
        <div className="absolute w-[500px] h-[500px] bg-cyan-400/10 blur-[120px] rounded-full top-[-100px] left-[-100px] animate-pulse" />
        <div className="absolute w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full bottom-[-120px] right-[-100px] animate-pulse" />

        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="text-center z-10">
          {/* LOGO */}
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.05em] bg-gradient-to-r from-cyan-300 via-white to-cyan-400 bg-clip-text text-transparent animate-pulse">
            SHIYAN
          </h1>

          {/* LINE */}
          <div className="mt-4 flex justify-center">
            <div className="w-20 h-[2px] bg-cyan-400 rounded-full animate-pulse"></div>
          </div>

          {/* TEXT */}
          <p className="mt-6 text-xs tracking-[0.4em] text-gray-500 uppercase">
            Authenticating Session
          </p>

          {/* DOT LOADER */}
          <div className="flex justify-center mt-8 gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
          </div>

          {/* BOTTOM META */}
          <div className="absolute bottom-6 left-6 text-left hidden md:block">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Protocol
            </p>
            <p className="text-xs text-cyan-300 font-bold">ENCRYPTED_SSL_256</p>
          </div>

          <div className="absolute bottom-6 right-6 text-right hidden md:block">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">
              Region
            </p>
            <p className="text-xs text-cyan-300 font-bold">NEURAL_HUB_EAST</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default Home;
