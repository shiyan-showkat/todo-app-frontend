import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const API = "https://todo-app-backend-gfh3.onrender.com";
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        let res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        // 🔁 ACCESS TOKEN EXPIRED → TRY REFRESH
        if (res.status === 401) {
          const refreshRes = await fetch(`${API}/api/v1/newrefreshtoken`, {
            method: "POST",
            credentials: "include",
          });

          if (!refreshRes.ok) {
            if (isMounted) navigate("/login");
            return;
          }

          // 🔁 retry /me after refresh
          res = await fetch(`${API}/api/v1/me`, {
            credentials: "include",
          });
        }

        if (isMounted) {
          if (res.ok) {
            navigate("/todos");
          } else {
            navigate("/login");
          }
        }
      } catch (err) {
        if (isMounted) navigate("/login");
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [navigate, API]);

  return (
    <div className="h-screen flex items-center justify-center text-white">
      Checking authentication...
    </div>
  );
}

export default Home;
