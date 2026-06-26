import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/slices/authSlice";

export default function Login() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post("/login", form);
            dispatch(
                setCredentials({ user: res.data.user, token: res.data.token }),
            );
            const role = res.data.user.role;
            navigate(role === "admin" ? "/admin" : "/");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials");
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
                    Welcome back
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
                        Login
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
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}
