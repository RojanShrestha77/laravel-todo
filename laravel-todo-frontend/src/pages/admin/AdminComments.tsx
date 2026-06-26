import { useEffect, useState } from "react";
import { getComments, deleteComment } from "../../api/admin";


interface AdminComment {
    id: number;
    body: string;
    author: string;
    post_title: string;
    is_private: boolean;
    created_at: string;

}

export default function AdminComments() {
    const [comments, setComments] = useState<AdminComment[]>([]);
    const [error, setError] = useState("");
    
    useEffect(() => {
        getComments().then(res => setComments(res.data))
        .catch(() => setError("Failed to load comments"));
    }, []);

    const handleDelete = async (id: number) => {
        if(!confirm("Delete the comment")) return;
        try {
            await deleteComment(id);
            setComments(comments.filter(c => c.id !== id));

        } catch {
            alert("Failed to delete");
        }
    };

    return (
        <div>
            <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "16px" }}>Comments</h2>
            {error && <p style={{ color: "#ef4444" }}>{error}</p>}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ background: "#f3f4f6" }}>
                        <th style={th}>ID</th>
                        <th style={th}>Body</th>
                        <th style={th}>Author</th>
                        <th style={th}>Post</th>
                        <th style={th}>Private</th>
                        <th style={th}>Date</th>
                        <th style={th}>Action</th>
                    </tr>

                </thead>
                <tbody>
                    {comments.map(c => (
                        <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                            <td style={td}>{c.id}</td>
                            <td style={td}>{c.body}</td>
                            <td style={td}>{c.author}</td>
                            <td style={td}>{c.post_title}</td>
                            <td style={td}>{c.is_private? "Yes": "No"}</td>
                            <td style={td}>{c.created_at}</td>
                            <td style={td}>
                                <button onClick={() => handleDelete(c.id)} style={deleteBtn}>
                                    Delete
                                </button>

                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
            
        </div>
    )
}

const th:React.CSSProperties = { padding: "10px 12px", textAlign: "left", fontWeight: 600};
const td: React.CSSProperties = {padding: "10px 12px"}
const deleteBtn: React.CSSProperties = {
    background: "#ef4444", color: "white", border: "none",
    padding: "4px 12px", borderRadius: "4px", cursor: "pointer",

};