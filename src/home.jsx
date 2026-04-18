import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        if (res.ok) {
          navigate("/todos");
        } else {
          navigate("/login");
        }
      } catch {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

export default Home;
