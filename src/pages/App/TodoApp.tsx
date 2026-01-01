import { useEffect, useState } from "react";
import api from "../../api/api";
import { useAuth } from "../../context/auth";
import { useNavigate } from "react-router-dom";

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  deadline?: string;
  description?: string;
}

export default function TodoApp() {
  const { logout } = useAuth();
  
  const navigate = useNavigate()
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [filter, setFilter] =
    useState<"all" | "active" | "completed">("all");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const [editingDescription, setEditingDescription] = useState("");
  const [editingDeadline, setEditingDeadline] = useState<string>("");

  // ----------------- LOAD TODOS -----------------
  const getTodos = async () => {
    const res = await api.get("/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  // ----------------- ADD TODO -----------------
  const addTodo = async () => {
    if (!title.trim()) return;

    const res = await api.post("/todos", {
      title,
      deadline: deadline || null,
      description,
    });

    setTodos([res.data, ...todos]);
    setTitle("");
    setDeadline("");
    setDescription("");
  };

  // ----------------- DELETE -----------------
  const deleteTodo = async (id: string) => {
    await api.delete(`/todos/${id}`);
    setTodos(todos.filter((t) => t._id !== id));
  };

  // ----------------- TOGGLE COMPLETE -----------------
  const toggleTodo = async (id: string, completed: boolean) => {
    const res = await api.patch(`/todos/${id}`, { completed });
    setTodos(todos.map((t) => (t._id === id ? res.data : t)));
  };

  // ----------------- ENABLE EDIT MODE -----------------
  const startEdit = (todo: Todo) => {
    setEditingId(todo._id);
    setEditingTitle(todo.title);
    setEditingDescription(todo.description || "");
    setEditingDeadline(todo.deadline || "");
  };

  // ----------------- SAVE EDIT -----------------
  const saveEdit = async (id: string) => {
    if (!editingTitle.trim()) return;

    const res = await api.patch(`/todos/${id}`, {
      title: editingTitle,
      description: editingDescription,
      deadline: editingDeadline || null,
    });

    setTodos(todos.map((t) => (t._id === id ? res.data : t)));

    setEditingId(null);
    setEditingTitle("");
    setEditingDescription("");
    setEditingDeadline("");
  };

  // ----------------- FILTER -----------------
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex justify-center p-6">
      <div className="w-full max-w-3xl space-y-4">

        <h1 className="text-4xl font-extrabold text-center mb-2">
          📝 Todo App
        </h1>

        <button onClick={() => navigate("/profile")} className="px-4 py-2 bg-gray-700 rounded-xl hover:bg-gray-600">Profile</button>

        {/* INPUT FORM */}
        <div className="bg-gray-800/60 rounded-2xl p-5 space-y-3">

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-700"
            placeholder="Vazifa nomi..."
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-700"
            placeholder="Tavsif..."
          />

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-gray-900 border border-gray-700"
          /><button
            onClick={addTodo}
            className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
          >
            Qo‘shish
          </button>
        </div>

        {/* FILTER */}
        <div className="flex gap-2 justify-center">
          <button onClick={() => setFilter("all")}>Barchasi</button>
          <button onClick={() => setFilter("active")}>Aktiv</button>
          <button onClick={() => setFilter("completed")}>Bajarilgan</button>
        </div>

        {/* LIST */}
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">

          {filteredTodos.map((todo) => {
            const expired =
              todo.deadline &&
              new Date(todo.deadline) < new Date();

            return (
              <div
                key={todo._id}
                className="bg-gray-900 rounded-xl p-4 space-y-2"
              >
                <div className="flex justify-between">

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() =>
                        toggleTodo(todo._id, !todo.completed)
                      }
                    />

                    {editingId === todo._id ? (
                      <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="bg-transparent border-b"
                      />
                    ) : (
                      <span
                        onDoubleClick={() => startEdit(todo)}
                        className={`${todo.completed ? "line-through text-gray-500" : ""}`}
                      >
                        {todo.title}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3">
                    {expired && (
                      <span className="text-red-400 text-sm">Deadline o‘tgan</span>
                    )}

                    {editingId === todo._id ? (
                      <button onClick={() => saveEdit(todo._id)}>💾</button>
                    ) : (
                      <button onClick={() => startEdit(todo)}>✏️</button>
                    )}

                    <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
                  </div>
                </div>

                {editingId === todo._id ? (
                  <>
                    <textarea
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      className="w-full bg-gray-800 rounded-xl p-2"
                    />

                    <input
                      type="date"
                      value={editingDeadline}
                      onChange={(e) => setEditingDeadline(e.target.value)}
                      className="w-full bg-gray-800 rounded-xl p-2"
                    />
                  </>
                ) : (
                  <>
                    {todo.description && (
                      <p className="text-gray-400 text-sm">{todo.description}</p>
                    )}

                    {todo.deadline && (
                      <p className="text-gray-500 text-xs">⌛ {todo.deadline}</p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-end">
          <button onClick={logout} className="px-4 py-2 bg-red-600 rounded-xl">
            Chiqish
          </button>
        </div>
      </div>
    </div>
  );
}