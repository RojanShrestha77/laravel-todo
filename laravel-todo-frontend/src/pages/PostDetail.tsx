import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import CommentSection from "../components/CommentSection";
import type { Post } from "../types";

export default function PostDetail() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [post, setPost] = useState<Post | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get(`/posts/${slug}`)
            .then((res) => setPost(res.data.data))
            .catch(() => setError("Post not found"));
    }, [slug]);

    if (error)
        return (
            <div>
                <p style={{ color: "#ef4444", marginBottom: "16px" }}>
                    {error}
                </p>
                <button onClick={() => navigate("/")}>Back to Blog</button>
            </div>
        );

    if (!post)
        return (
            <div
                style={{ textAlign: "center", padding: "60px", color: "#999" }}
            >
                Loading...
            </div>
        );

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                padding: "24px",
            }}
        >
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {/* back button */}
                <button
                    onClick={() => navigate("/")}
                    style={{
                        background: "none",
                        border: "1px solid #ddd",
                        padding: "6px 14px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        marginBottom: "24px",
                        color: "#555",
                        fontSize: "14px",
                    }}
                >
                    ← Back to Blog
                </button>

                {/* post card */}
                <div
                    style={{
                        background: "white",
                        padding: "32px",
                        borderRadius: "10px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        borderLeft: "4px solid #6366f1",
                    }}
                >
                    <h1
                        style={{
                            fontSize: "28px",
                            fontWeight: 700,
                            marginBottom: "8px",
                        }}
                    >
                        {post.title}
                    </h1>

                    <p
                        style={{
                            fontSize: "13px",
                            color: "#999",
                            marginBottom: "24px",
                        }}
                    >
                        By {post.author} . {post.created_at}
                    </p>

                    <p
                        style={{
                            fontSize: "16px",
                            color: "#444",
                            lineHeight: "1.8",
                        }}
                    >
                        {post.body}
                    </p>

                    <CommentSection post={post} />
                </div>
            </div>
        </div>
    );
}
