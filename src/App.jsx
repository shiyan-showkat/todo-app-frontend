import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./signup.jsx";
import Login from "./login.jsx";
import Todos from "./todo.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/todos" element={<Todos />}></Route>
    </Routes>
  );
}

export default App;
