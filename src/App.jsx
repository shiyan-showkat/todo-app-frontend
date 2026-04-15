import { useEffect, useState } from "react";

function App() {
  const [text, setText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const API = "https://todo-app-backend-gfh3.onrender.com";

  const getTodos = async () => {
    setLoading(true);
    const res = await fetch(`${API}/api/v1/gettodos`);
    const data = await res.json();
    setTodos(data.gettodos);
    setLoading(false);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const send = async () => {
    if (!text.trim()) return;

    setLoading(true);

    if (editId) {
      await fetch(`${API}/api/v1/updatetodos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      setEditId(null);
    } else {
      await fetch(`${API}/api/v1/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
    }

    setText("");
    getTodos();
  };

  const deleteTodo = async (id) => {
    setLoading(true);

    await fetch(`${API}/api/v1/deletetodos/${id}`, {
      method: "DELETE",
    });

    getTodos();
  };

  const handleEdit = (todo) => {
    setText(todo.text);
    setEditId(todo._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-900 via-black to-blue-900 flex items-center justify-center">
      <div className="w-[420px] p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
        <h2 className="text-3xl text-center font-bold text-white mb-6">
          ⚡ Todo App
        </h2>

        {/* INPUT */}
        <div className="flex mb-6">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type something..."
            className="flex-1 p-3 rounded-l-xl bg-transparent border border-white/30 text-white outline-none placeholder-gray-300"
          />

          <button
            onClick={send}
            disabled={!text.trim()}
            className={`px-5 rounded-r-xl font-semibold transition cursor-pointer ${
              editId
                ? "bg-yellow-400 hover:bg-yellow-500"
                : "bg-green-500 hover:bg-green-600"
            } disabled:opacity-50`}
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-gray-300 mb-3">Loading...</p>
        )}

        {/* EMPTY */}
        {!loading && todos.length === 0 && (
          <p className="text-center text-gray-400">No todos yet 😴</p>
        )}

        {/* LIST */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className="flex justify-between items-center p-3 rounded-xl bg-white/10 border border-white/20 hover:scale-[1.02] transition"
            >
              <span className="text-white">{todo.text}</span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(todo)}
                  className="px-2 py-1 rounded bg-yellow-400 hover:bg-yellow-500 text-sm"
                >
                  ✏️
                </button>

                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="px-2 py-1 rounded bg-red-500 hover:bg-red-600 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
