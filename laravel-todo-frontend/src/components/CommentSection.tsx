import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
    fetchComments,
    createComment,
    deleteComment,
    selectComments,
} from "../store/slices/commentSlice";
import { selectToken, selectUser } from "../store/slices/authSlice";
import type { Post } from "../types";

interface Props {
    post: Post;
}

export default function CommentSection({ post }: Props) {
    const dispatch = useAppDispatch();
    const comments = useAppSelector(selectComments(post.id));
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);
    const [body, setBody] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);

    useEffect(() => {
        dispatch(fetchComments(post.id));
    }, [post.id, dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!body.trim()) return;
        dispatch(
            createComment({ postId: post.id, body, is_private: isPrivate }),
        );
        setBody("");
        setIsPrivate(false);
    };

    const isPostAuthor = user?.name === post.author;

    return (
        <div
            style={{
                marginTop: "16px",
                borderTop: "1px solid #eee",
                paddingTop: "16px",
            }}
        >
            <h4
                style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#666",
                    marginBottom: "12px",
                }}
            >
                Comments ({comments.length})
            </h4>

            {/* comment list */}
            <div>
                {comments.map((comment) => (
                    <div
                        key={comment.id}
                        style={{
                            padding: "10px 12px",
                            borderRadius: "6px",
                            fontSize: "13px",
                            background: comment.is_private
                                ? "#fef9c3"
                                : "#f9fafb",
                            border: comment.is_private
                                ? "1px solid #fde68a"
                                : "1px solid #e5e7eb",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span>
                                {comment.author}
                                {comment.is_private && (
                                    <span
                                        style={{
                                            marginLeft: "6px",
                                            fontSize: "11px",
                                            color: "#d97706",
                                            background: "#fef3c7",
                                            padding: "1px 6px",
                                            borderRadius: "4px",
                                        }}
                                    >
                                        Private
                                    </span>
                                )}
                            </span>
                            <div
                                style={{
                                    display: "flex",
                                    gap: "6px",
                                    alignItems: "center",
                                }}
                            >
                                <span
                                    style={{ color: "#aaa", fontSize: "11px" }}
                                >
                                    {comment.created_at}
                                </span>
                                {(isPostAuthor ||
                                    user?.name === comment.author) && (
                                    <button
                                        onClick={() =>
                                            dispatch(
                                                deleteComment({
                                                    postId: post.id,
                                                    commentId: comment.id,
                                                }),
                                            )
                                        }
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: "#ef4444",
                                            cursor: "pointer",
                                            fontSize: "12px",
                                            padding: "0",
                                        }}
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        </div>
                        <p style={{ margin: "4px 0 0 ", color: "#444" }}>
                            {comment.body}
                        </p>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p style={{ color: "#aaa", fontSize: "13px" }}>
                        No Comments yet.
                    </p>
                )}
            </div>

            {/* add comment form - only if logged in */}
            {token && (
                <form
                    onSubmit={handleSubmit}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <textarea
                        placeholder="Write a comment..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={2}
                        style={{
                            padding: "8px",
                            borderRadius: "6px",
                            border: "1px solid #ddd",
                            fontSize: "13px",
                            fontFamily: "inheirt",
                            resize: "vertical",
                        }}
                    />
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "13px",
                                color: "#555",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                cursor: "pointer",
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={isPrivate}
                                onChange={(e) => setIsPrivate(e.target.checked)}
                            />
                            Private (only visible to post author)
                        </label>
                        <button
                            type="submit"
                            style={{ fontSize: "13px", padding: "5px 14px" }}
                        >
                            Post
                        </button>
                    </div>
                </form>
            )}
            {!token && (
                <p style={{ fontSize: "13px", color: "#aaa" }}>
                    Log in to comment
                </p>
            )}
        </div>
    );
}
