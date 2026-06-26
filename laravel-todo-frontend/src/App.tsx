import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import { selectToken, selectUser } from "./store/slices/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import PostDetail from "./pages/PostDetail";

function App() {
    const token = useAppSelector(selectToken);
    const user = useAppSelector(selectUser);

    return (
        <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/posts/:slug" element={<PostDetail/>}/>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/admin"
                element={
                    token && user?.role === "admin" ? (
                        <AdminDashboard />
                    ) : (
                        <Navigate to="/login" />
                    )
                }
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
