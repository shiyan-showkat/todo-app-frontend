import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Signup from "./signup.jsx";
import Login from "./login.jsx";
import Todos from "./todo.jsx";

const API = "https://todo-app-backend-gfh3.onrender.com";

/* 🔥 HOME REDIRECT COMPONENT */
function HomeRedirect() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });

        setAuth(res.ok);
      } catch {
        setAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return (
      <div className="text-white flex justify-center items-center h-screen">
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

/* 🔥 MAIN APP */
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
