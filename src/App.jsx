import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Signup from "./signup.jsx";
import Login from "./login.jsx";
import Todos from "./todo.jsx";

const API = "https://todo-app-backend-gfh3.onrender.com";

/* 🔥 MAIN APP */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={<Todos />} />
    </Routes>
  );
}

export default App;
