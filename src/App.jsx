import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./signup.jsx";
import Login from "./login.jsx";
import Todos from "./todo.jsx";
import Home from "./home.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate element={<Home />} />} />

      {/* AUTH ROUTES */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* PROTECTED PAGE */}
      <Route path="/todos" element={<Todos />} />
    </Routes>
  );
}

export default App;
