import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { clearCredentials } from "../../store/slices/authSlice";
import AdminUsers from "./AdminUsers";
import AdminPosts from "./AdminPosts";
import AdminComments from "./AdminComments";

type Tab = "users" | "posts" | "comments";

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("users");
    const dispatch = useAppDispatch(); //update the applications global state
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(clearCredentials());
        navigate("/login");
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
            {/* navbar */}
            <div
                style={{
                    background: "white",
                    padding: "16px 32px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
            >
                <h1>Admin Panel</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>

            <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
                {/* Sidebar */}
                <div
                    style={{
                        width: "200px",
                        background: "white",
                        borderRight: "1px solid #e5e7eb",
                        padding: "24px 0",
                    }}
                >
                    {(["users", "posts", "comments"] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                display: "block",
                                width: "100%",
                                padding: "12px 24px",
                                textAlign: "left",
                                border: "none",
                                cursor: "pointer",
                                background:
                                    activeTab === tab
                                        ? "#eff6ff"
                                        : "transparent",
                                color:
                                    activeTab === tab ? "#2563eb" : "#374151",
                                fontWeight: activeTab === tab ? 600 : 400,
                                textTransform: "capitalize",
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* content */}
                <div style={{ flex: 1, padding: "32px" }}>
                    {activeTab === "users" && <AdminUsers />}
                    {activeTab === "posts" && <AdminPosts />}
                    {activeTab === "comments" && <AdminComments />}
                </div>
            </div>
        </div>
    );
}
