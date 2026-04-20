import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Todos() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= AUTH =================
  const checkAuth = async () => {
    try {
      let res = await fetch(`${API}/api/v1/me`, {
        credentials: "include",
      });

      if (res.status === 401) {
        const refresh = await fetch(`${API}/api/v1/newrefreshtoken`, {
          method: "POST",
          credentials: "include",
        });

        if (!refresh.ok) {
          navigate("/login");
          return false;
        }

        res = await fetch(`${API}/api/v1/me`, {
          credentials: "include",
        });
      }

      if (!res.ok) {
        navigate("/login");
        return false;
      }

      return true;
    } catch {
      navigate("/login");
      return false;
    }
  };

  // ================= FETCH TODOS =================
  const fetchTodos = async () => {
    try {
      setLoading(true);

      let res = await fetch(`${API}/api/v1/gettodos`, {
        credentials: "include",
      });

      if (res.status === 401) {
        const refreshRes = await fetch(`${API}/api/v1/newrefreshtoken`, {
          method: "POST",
          credentials: "include",
        });

        if (!refreshRes.ok) {
          navigate("/login");
          return;
        }

        res = await fetch(`${API}/api/v1/gettodos`, {
          credentials: "include",
        });
      }

      const data = await res.json();
      setTodos(data.gettodos || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const ok = await checkAuth();
      if (ok) fetchTodos();
    };
    init();
  }, []);

  // ================= ADD / UPDATE =================
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

  // ================= DELETE =================
  const handleDelete = async (id) => {
    setLoading(true);

    await fetch(`${API}/api/v1/deletetodos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchTodos();
    setLoading(false);
  };

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await fetch(`${API}/api/v1/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-black border-r border-white/5 flex flex-col pt-10">
        <div className="px-6 mb-10">
          <h2 className="text-lg font-bold">Workspace</h2>
          <p className="text-xs text-gray-500">Precision Mode</p>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="px-6 py-3 bg-cyan-500/10 text-cyan-400">
            Dashboard
          </div>
          <div className="px-6 py-3 text-gray-400">Tasks</div>
          <div className="px-6 py-3 text-gray-400">Notes</div>
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10">
        {/* HERO */}
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold">
            Welcome back, <span className="text-cyan-400">Shiyan</span>
          </h1>
          <p className="text-gray-400 mt-3">
            Your high-precision productivity hub is ready 🚀
          </p>
        </div>

        {/* INPUT BAR */}
        <div className="flex gap-3 mb-8">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your task..."
            className="flex-1 p-4 bg-[#1a1a1a] border border-white/10 rounded outline-none"
          />

          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 font-bold rounded"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* LOADING */}
        {loading && <p className="text-gray-400">Loading...</p>}

        {/* TASKS GRID (NEW LUMINA STYLE) */}
        <div className="grid md:grid-cols-2 gap-5">
          {todos.map((t) => (
            <div
              key={t._id}
              className="bg-[#1a1a1a] border border-white/5 p-5 rounded-xl hover:border-cyan-400/30 transition"
            >
              <p className="text-white text-lg">{t.text}</p>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setText(t.text);
                    setEditId(t._id);
                  }}
                  className="text-cyan-400 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-400 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && todos.length === 0 && (
          <p className="text-gray-500 mt-6">No tasks yet</p>
        )}
      </main>
    </div>
  );
}
