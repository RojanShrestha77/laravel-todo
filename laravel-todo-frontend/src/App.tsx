import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import { selectToken } from "./store/slices/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";

function App() {
    const token = useAppSelector(selectToken);

    return (
        <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;
