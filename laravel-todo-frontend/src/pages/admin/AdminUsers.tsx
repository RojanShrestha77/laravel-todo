import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "../../api/admin";

interface AdminUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getUsers()
            .then((res) => setUsers(res.data))
            .catch(() => setError("Failed to load Users"));
    }, []); //useEffect() => means get the data when the components load or when the page loads
    // [] = this means run this effect only once when the comnponent mounts(loads).

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this user?")) return;
        try {
            await deleteUser(id);
            setUsers(users.filter((u) => u.id !== id));
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete");
        }
    };

    return (
        <div>
            <h2
                style={{
                    fontSize: "20px",
                    fontWeight: 600,
                    marginBottom: "16px",
                }}
            >
                Users
            </h2>
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                        <th style={th}>ID</th>
                        <th style={th}>Name</th>
                        <th style={th}>Email</th>
                        <th style={th}>Role</th>
                        <th style={th}>Joined</th>
                        <th style={th}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr
                            key={u.id}
                            style={{ borderBottom: "1px solid #e5e7eb" }}
                        >
                            <td style={td}>{u.id}</td>
                            <td style={td}>{u.name}</td>
                            <td style={td}>{u.email}</td>
                            <td style={td}>{u.role}</td>
                            <td style={td}>{u.created_at}</td>
                            <td style={td}>
                                {u.role !== "admin" && (
                                    <button
                                        onClick={() => handleDelete(u.id)}
                                        style={deleteBtn}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const th: React.CSSProperties = {
    padding: "10px 12px",
    textAlign: "left",
    fontWeight: 600,
};
const td: React.CSSProperties = { padding: "10px 12px" };
const deleteBtn: React.CSSProperties = {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "4px 12px",
    borderRadius: "4px",
    cursor: "pointer",
};
