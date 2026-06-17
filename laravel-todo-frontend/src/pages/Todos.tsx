import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import type { Todo } from "../types";

export default function Todos() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const editTodo = async (id: number) => {
        if (!editTitle.trim()) return;
        await api.put(`/todos/${id}`, { title: editTitle });
        setEditingId(null);
        setEditTitle("");
        fetchTodos();
    };

    const fetchTodos = async () => {
        const res = await api.get("/todos");
        setTodos(res.data.data);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const createTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        await api.post("/todos", { title });
        setTitle("");
        fetchTodos();
    };

    const toggleTodo = async (todo: Todo) => {
        await api.put(`/todos/${todo.id}`, { completed: !todo.completed });
        fetchTodos();
    };

    const deleteTodo = async (id: number) => {
        await api.delete(`/todos/${id}`);
        fetchTodos();
    };

    const handleLogout = async () => {
        await api.post("/logout");
        logout();
        navigate("/login");
    };

    const pending = todos.filter((t) => !t.completed);
    const completed = todos.filter((t) => t.completed);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                padding: "24px",
            }}
        >
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                {/* Header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px",
                    }}
                >
                    <h2 style={{ fontSize: "22px", fontWeight: 600 }}>
                        My Todos
                    </h2>
                    <button
                        onClick={handleLogout}
                        style={{
                            background: "#ef4444",
                            fontSize: "14px",
                            padding: "6px 14px",
                        }}
                    >
                        Logout
                    </button>
                </div>

                {/* Add todo form */}
                <form
                    onSubmit={createTodo}
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "32px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Add a new todo..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <button type="submit" style={{ whiteSpace: "nowrap" }}>
                        Add
                    </button>
                </form>

                {/* Two column layout */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "24px",
                    }}
                >
                    {/* Not Completed */}
                    <div>
                        <h3
                            style={{
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#555",
                                marginBottom: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Pending ({pending.length})
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            {pending.length === 0 && (
                                <p
                                    style={{
                                        color: "#999",
                                        fontSize: "14px",
                                        padding: "16px",
                                        background: "white",
                                        borderRadius: "8px",
                                        textAlign: "center",
                                    }}
                                >
                                    No pending todos
                                </p>
                            )}
                            {pending.map((todo) => (
                                <div
                                    key={todo.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "white",
                                        padding: "14px 16px",
                                        borderRadius: "8px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                        borderLeft: "3px solid #f59e0b",
                                    }}
                                >
                                    {editingId === todo.id ? (
                                        <form onSubmit={(e) => { e.preventDefault(); editTodo(todo.id); }} style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) =>
                                                    setEditTitle(e.target.value)
                                                }
                                                autoFocus
                                            />
                                            <div style={{ display: "flex", gap: "8px" }}>
                                                <button type="submit">Save</button>
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(null)}
                                                    style={{ background: "#9ca3af" }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <span
                                            onClick={() => toggleTodo(todo)}
                                            style={{
                                                cursor: "pointer",
                                                flex: 1,
                                            }}
                                            title="Click to toggle"
                                        >
                                            {todo.title}
                                        </span>
                                    )}
                                    <button
                                        onClick={() => {
                                            setEditingId(todo.id);
                                            setEditTitle(todo.title);
                                        }}
                                        style={{
                                            background: "#6366f1",
                                            fontSize: "12px",
                                            padding: "4px 10px",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        style={{
                                            background: "#ef4444",
                                            fontSize: "12px",
                                            padding: "4px 10px",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Completed */}
                    <div>
                        <h3
                            style={{
                                fontSize: "15px",
                                fontWeight: 600,
                                color: "#555",
                                marginBottom: "12px",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Completed ({completed.length})
                        </h3>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                            }}
                        >
                            {completed.length === 0 && (
                                <p
                                    style={{
                                        color: "#999",
                                        fontSize: "14px",
                                        padding: "16px",
                                        background: "white",
                                        borderRadius: "8px",
                                        textAlign: "center",
                                    }}
                                >
                                    No completed todos
                                </p>
                            )}
                            {completed.map((todo) => (
                                <div
                                    key={todo.id}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        background: "white",
                                        padding: "14px 16px",
                                        borderRadius: "8px",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                        borderLeft: "3px solid #22c55e",
                                    }}
                                >
                                    <span
                                        onClick={() => toggleTodo(todo)}
                                        style={{
                                            cursor: "pointer",
                                            flex: 1,
                                            color: "#999",
                                            textDecoration: "line-through",
                                        }}
                                        title="Click to mark as pending"
                                    >
                                        {todo.title}
                                    </span>
                                    <button
                                        onClick={() => deleteTodo(todo.id)}
                                        style={{
                                            background: "#ef4444",
                                            fontSize: "12px",
                                            padding: "4px 10px",
                                            marginLeft: "10px",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
