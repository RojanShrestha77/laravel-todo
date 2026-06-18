import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "./store/hooks";
import { selectToken } from "./store/slices/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";

function App() {
    const token = useAppSelector(selectToken);

    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/todos"
                element={token ? <Todos /> : <Navigate to="/login" />}
            />
            <Route
                path="*"
                element={<Navigate to={token ? "/todos" : "/login"} />}
            />
        </Routes>
    );
}

export default App;
