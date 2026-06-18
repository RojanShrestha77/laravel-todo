import { useEffect, useState } from "react";
import api from "../api/axios";
import type { Category } from "../types";

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [name, setName] = useState("");
    const [color, setColor] = useState("#6366f1");

    const fetchCategories = async () => {
        const res = await api.get("/categories");
        setCategories(res.data);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const createCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await api.post("/categories", { name, color });
        setName("");
        fetchCategories();
    };

    const deleteCategory = async (id: number) => {
        await api.delete(`/categories/${id}`);
        fetchCategories();
    };

    return (
        <div>
            <h3>Categories</h3>
            <form onSubmit={createCategory} style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{ width: "40px", padding: "2px", cursor: "pointer" }}
                />
                <button type="submit">Add</button>
            </form>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {categories.map((cat) => (
                    <div key={cat.id} style={{ display: "flex", alignItems: "center", gap: "6px", background: "white", padding: "6px 12px", borderRadius: "20px", border: `2px solid ${cat.color}` }}>
                        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color, display: "inline-block" }} />
                        <span>{cat.name}</span>
                        <span onClick={() => deleteCategory(cat.id)} style={{ cursor: "pointer", color: "#ef4444", fontWeight: "bold", marginLeft: "4px" }}>×</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
