import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Signup from "./signup.jsx";
import Login from "./login.jsx";
import Todos from "./todo.jsx";

const API = "https://todo-app-backend-gfh3.onrender.com";

/* 🔥 HOME REDIRECT */
function HomeRedirect() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/v1/gettodos`, {
          credentials: "include",
        });

        if (res.ok) {
          navigate("/todos");
        } else {
          navigate("/signup");
        }
      } catch (err) {
        navigate("/signup");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return null;
}

/* 🔥 APP */
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={<Todos />} />
    </Routes>
  );
}

export default App;
