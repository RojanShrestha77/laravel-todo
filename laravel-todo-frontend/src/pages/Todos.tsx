import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Todo } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    selectTodos,
} from "../store/slices/todoSlice";
import { clearCredentials } from "../store/slices/authSlice";

export default function Todos() {
    const dispatch = useAppDispatch();
    const todos = useAppSelector(selectTodos);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");

    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        dispatch(createTodo(title));
        setTitle("");
    };

    const handleToggle = (todo: Todo) => {
        dispatch(updateTodo({ ...todo, completed: !todo.completed }));
    };

    const handleEdit = (id: number) => {
        if (!editTitle.trim()) return;
        const todo = todos.find((t) => t.id === id);
        if (!todo) return;
        dispatch(updateTodo({ ...todo, title: editTitle }));
        setEditingId(null);
        setEditTitle("");
    };

    const handleDelete = (id: number) => {
        dispatch(deleteTodo(id));
    };

    const handleLogout = async () => {
        await api.post("/logout");
        dispatch(clearCredentials());
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
                    onSubmit={handleCreate}
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
                    {/* Pending */}
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
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                handleEdit(todo.id);
                                            }}
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "8px",
                                                flex: 1,
                                            }}
                                        >
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) =>
                                                    setEditTitle(e.target.value)
                                                }
                                                autoFocus
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                }}
                                            >
                                                <button type="submit">
                                                    Save
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditingId(null)
                                                    }
                                                    style={{
                                                        background: "#9ca3af",
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    ) : (
                                        <span
                                            onClick={() => handleToggle(todo)}
                                            style={{
                                                cursor: "pointer",
                                                flex: 1,
                                            }}
                                            title="Click to mark as completed"
                                        >
                                            {todo.title}
                                        </span>
                                    )}
                                    {editingId !== todo.id && (
                                        <>
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
                                                onClick={() =>
                                                    handleDelete(todo.id)
                                                }
                                                style={{
                                                    background: "#ef4444",
                                                    fontSize: "12px",
                                                    padding: "4px 10px",
                                                    marginLeft: "10px",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
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
                                        onClick={() => handleToggle(todo)}
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
                                        onClick={() => handleDelete(todo.id)}
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
