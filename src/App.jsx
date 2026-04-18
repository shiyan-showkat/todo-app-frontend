import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Signup from "./signup.jsx";
import Login from "./login.jsx";
import Todos from "./todo.jsx";

const API = "https://todo-app-backend-gfh3.onrender.com";

/* 🔥 HOME REDIRECT */
function HomeRedirect() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/v1/gettodos`, {
          credentials: "include",
        });

        setAuth(res.ok);
      } catch (err) {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return auth ? (
    <Navigate to="/todos" replace />
  ) : (
    <Navigate to="/signup" replace />
  );
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
