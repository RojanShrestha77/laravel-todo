import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearCredentials, selectToken } from "../store/slices/authSlice";
import {
    createPost,
    deletePost,
    fetchPosts,
    selectPosts,
    updatePost,
} from "../store/slices/postSlice";
import { useEffect, useState } from "react";
import api from "../api/axios";
import CommentSection from "../components/CommentSection";

export default function Posts() {
    const dispatch = useAppDispatch();
    const posts = useAppSelector(selectPosts);
    const token = useAppSelector(selectToken);
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editBody, setEditBody] = useState("");

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !body.trim()) return;
        dispatch(createPost({ title, body }));
        setTitle("");
        setBody("");
    };

    const handleEdit = (id: number) => {
        if (!editTitle.trim()) return;
        dispatch(
            updatePost({ id, data: { title: editTitle, body: editBody } }),
        );
        setEditingId(null);
    };
    const handleDelete = (id: number) => dispatch(deletePost(id));

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch {
            //token already invalid, ignore
        }
        (dispatch(clearCredentials()), navigate("/login"));
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f5f5f5",
                padding: "24px",
            }}
        >
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {/* header */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "32px",
                    }}
                >
                    <h1 style={{ fontSize: "28px", fontWeight: 700 }}>Blog</h1>
                    {token && (
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
                    )}
                </div>

                {/* create form only shown when logged in */}
                {token && (
                    <form
                        onSubmit={handleCreate}
                        style={{
                            background: "white",
                            padding: "20px",
                            borderRadius: "10px",
                            marginBottom: "32px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                        }}
                    >
                        <h3 style={{ fontWeight: 600, fontSize: "16px" }}>
                            New Post
                        </h3>
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="Write your post..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={4}
                            style={{
                                padding: "10px",
                                borderRadius: "6px",
                                border: "1px solid #ddd",
                                resize: "vertical",
                                fontFamily: "inherit",
                                fontSize: "14px",
                            }}
                        />
                        <button
                            type="submit"
                            style={{ alignSelf: "flex-start" }}
                        >
                            Publish
                        </button>
                    </form>
                )}

                {/* posts list */}
                <div>
                    {posts.length === 0 && (
                        <p
                            style={{
                                color: "#999",
                                textAlign: "center",
                                padding: "40px",
                            }}
                        >
                            No posts
                        </p>
                    )}
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            style={{
                                background: "white",
                                padding: "20px 24px",
                                borderRadius: "10px",
                                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                                borderLeft: "4px solid #6366f1",
                            }}
                        >
                            {editingId === post.id ? (
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        handleEdit(post.id);
                                    }}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "10px",
                                    }}
                                >
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) =>
                                            setEditTitle(e.target.value)
                                        }
                                    />
                                    <textarea
                                        value={editBody}
                                        onChange={(e) =>
                                            setEditBody(e.target.value)
                                        }
                                    />
                                    <div>
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
                                <>
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                        }}
                                    >
                                        <h2
                                            style={{
                                                fontSize: "18px",
                                                fontWeight: 600,
                                                marginBottom: "6px",
                                            }}
                                        >
                                            {post.title}
                                        </h2>
                                        {token && (
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setEditingId(post.id);
                                                        setEditTitle(
                                                            post.title,
                                                        );
                                                        setEditBody(post.body);
                                                    }}
                                                    style={{
                                                        background: "#6366f1",
                                                        fontSize: "12px",
                                                        padding: "4px 10px",
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(post.id)
                                                    }
                                                    style={{
                                                        background: "#ef4444",
                                                        fontSize: "12px",
                                                        padding: "4px 10px",
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <p
                                        style={{
                                            fontSize: "13px",
                                            color: "#999",
                                            marginBottom: "12px",
                                        }}
                                    >
                                        By {post.author} . {post.created_at}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: "15px",
                                            color: "#444",
                                            lineHeight: "1.6",
                                        }}
                                    >
                                        {post.body}
                                    </p>
                                    <CommentSection post={post} />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
