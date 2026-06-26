import { useEffect, useState } from "react";
import { getPosts, deletePost } from "../../api/admin";
import { useNavigate } from "react-router-dom";

interface AdminPost {
    id: number;
    title: string;
    slug: string;
    author: string;
    created_at: string;
}

export default function AdminPosts() {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<AdminPost[]>([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getPosts()
            .then((res) => setPosts(res.data))
            .catch(() => setError("Failed to load posts"));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this post?")) return;
        try {
            await deletePost(id);
            setPosts(posts.filter((p) => p.id !== id));
        } catch {
            alert("Failed to delete post");
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
                Posts
            </h2>
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                        <th style={th}>ID</th>
                        <th style={th}>Title</th>
                        <th style={th}>Author</th>
                        <th style={th}>Date</th>
                        <th style={th}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {posts.map((p) => (
                        <tr
                            key={p.id}
                            style={{ borderBottom: "1px solid #e5e7eb" }}
                        >
                            <td style={td}>{p.id}</td>
                            <td
                                style={{
                                    ...td,
                                    cursor: "pointer",
                                    color: "#6366f1",
                                }}
                                onClick={() => navigate(`/posts/${p.slug}`)}
                            >
                                {p.title}
                            </td>
                            <td style={td}>{p.author}</td>
                            <td style={td}>{p.created_at}</td>
                            <td style={td}>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    style={deleteBtn}
                                >
                                    Delete
                                </button>
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
