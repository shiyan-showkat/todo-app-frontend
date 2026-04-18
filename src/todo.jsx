import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Todos() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 FETCH TODOS (with refresh handling)
  const fetchTodos = async () => {
    try {
      setLoading(true);

      let res = await fetch(`${API}/api/v1/gettodos`, {
        credentials: "include",
      });

      // 🔴 token expired → try refresh
      if (res.status === 401) {
        const refreshRes = await fetch(`${API}/api/v1/newrefreshtoken`, {
          method: "POST",
          credentials: "include",
        });

        // ❌ refresh failed → login
        if (!refreshRes.ok) {
          navigate("/login");
          return;
        }

        // retry todos
        res = await fetch(`${API}/api/v1/gettodos`, {
          credentials: "include",
        });
      }

      const data = await res.json();
      setTodos(data.gettodos || []);
    } catch (err) {
      console.log(err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ➕ ADD / UPDATE TODO
  const handleAdd = async () => {
    if (!text.trim()) return;

    setLoading(true);

    const url = editId
      ? `${API}/api/v1/updatetodos/${editId}`
      : `${API}/api/v1/todos`;

    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ text }),
    });

    setText("");
    setEditId(null);
    fetchTodos();
    setLoading(false);
  };

  // 🗑 DELETE TODO
  const handleDelete = async (id) => {
    setLoading(true);

    await fetch(`${API}/api/v1/deletetodos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchTodos();
    setLoading(false);
  };

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await fetch(`${API}/api/v1/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen relative bg-black text-white overflow-hidden">
      {/* BACKGROUND TEXT */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-[120px] md:text-[180px] font-extrabold tracking-widest text-white/5 select-none">
          SHIYAN
        </h1>
      </div>

      {/* NAVBAR */}
      <div className="relative z-10 flex justify-between items-center px-6 py-4 border-b border-white/10 backdrop-blur bg-black/40">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400">
          ⚡ SHIYAN
        </h1>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 text-sm cursor-pointer transition"
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="relative z-10 flex justify-center mt-10 px-4">
        <div className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-xl shadow-2xl">
          <h2 className="text-center text-lg mb-6 text-gray-300 font-semibold">
            Your Tasks 🚀
          </h2>

          {/* INPUT */}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="flex-1 p-3 rounded-xl bg-black/60 border border-white/10 outline-none focus:border-pink-500 cursor-text transition"
              placeholder="Write your task..."
            />

            <button
              onClick={handleAdd}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 text-black font-bold cursor-pointer hover:scale-105 transition"
            >
              {editId ? "Update ✨" : "Add ➕"}
            </button>
          </div>

          {/* LOADING */}
          {loading && (
            <p className="text-center mt-4 text-gray-400 animate-pulse">
              Loading...
            </p>
          )}

          {/* LIST */}
          <div className="mt-6 space-y-3">
            {todos.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                <span className="text-gray-200">{t.text}</span>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setText(t.text);
                      setEditId(t._id);
                    }}
                    className="px-3 py-1 text-xs rounded-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 cursor-pointer"
                  >
                    Edit ✏️
                  </button>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="px-3 py-1 text-xs rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 cursor-pointer"
                  >
                    Delete 🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EMPTY */}
          {!loading && todos.length === 0 && (
            <p className="text-center mt-6 text-gray-500">No tasks yet 🚀</p>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div className="relative z-10 text-center mt-10 mb-6 text-gray-400 text-sm">
        Built with ❤️ by <span className="text-pink-400 font-bold">Shiyan</span>{" "}
        • MERN Developer
      </div>
    </div>
  );
}
