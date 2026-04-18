import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/v1/todos`, {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          navigate("/todos");
        } else {
          navigate("/login");
        }
      } catch (err) {
        navigate("/login");
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="text-white flex justify-center items-center h-screen">
      Loading...
    </div>
  );
}

export default Home;
