import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "https://todo-app-backend-gfh3.onrender.com";

export default function Todos() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async (id) => {
    setLoading(true);

    await fetch(`${API}/api/v1/deletetodos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    fetchTodos();
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch(`${API}/api/v1/logout`, {
      method: "POST",
      credentials: "include",
    });

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 py-8 flex justify-center">
      <div className="w-full max-w-3xl">
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            LUMINA <span className="text-cyan-400">Todos</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Your productivity hub is live ⚡
          </p>

          <button
            onClick={handleLogout}
            className="mt-4 text-sm text-red-400 hover:text-red-300 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* INPUT */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your task..."
            className="flex-1 p-4 bg-[#1a1a1a] border border-white/10 rounded-xl outline-none focus:border-cyan-400 transition cursor-text"
          />

          <button
            onClick={handleAdd}
            className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 py-3 font-bold rounded-xl cursor-pointer hover:scale-105 active:scale-95 transition"
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-400 text-center mb-4">Loading...</p>
        )}

        {/* TODOS */}
        <div className="grid gap-4 sm:grid-cols-2">
          {todos.map((t) => (
            <div
              key={t._id}
              className="bg-[#1a1a1a] border border-white/5 p-5 rounded-xl hover:border-cyan-400/40 transition group"
            >
              <p className="text-white text-lg break-words">{t.text}</p>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  onClick={() => {
                    setText(t.text);
                    setEditId(t._id);
                  }}
                  className="text-cyan-400 hover:text-cyan-300 text-sm cursor-pointer transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-400 hover:text-red-300 text-sm cursor-pointer transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && todos.length === 0 && (
          <p className="text-gray-500 mt-8 text-center">
            No tasks yet — start building 🚀
          </p>
        )}
      </div>
    </div>
  );
}
