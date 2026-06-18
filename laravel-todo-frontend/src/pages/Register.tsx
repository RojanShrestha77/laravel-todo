import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";

export default function Register() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/register", form);
            dispatch(
                setCredentials({ user: res.data.user, token: res.data.token }),
            );
            navigate("/todos");
        } catch (err: any) {
            setError(err.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <div
                style={{
                    background: "white",
                    padding: "32px",
                    borderRadius: "10px",
                    width: "100%",
                    maxWidth: "400px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
            >
                <h2
                    style={{
                        marginBottom: "24px",
                        fontSize: "22px",
                        fontWeight: 600,
                    }}
                >
                    Create an account
                </h2>

                {error && (
                    <p
                        style={{
                            color: "#ef4444",
                            marginBottom: "16px",
                            fontSize: "14px",
                        }}
                    >
                        {error}
                    </p>
                )}

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Name"
                        value={form.name}
                        onChange={(e) =>
                            setForm({ ...form, name: e.target.value })
                        }
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />
                    <button type="submit" style={{ marginTop: "4px" }}>
                        Register
                    </button>
                </form>

                <p
                    style={{
                        marginTop: "16px",
                        fontSize: "14px",
                        textAlign: "center",
                        color: "#666",
                    }}
                >
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}
