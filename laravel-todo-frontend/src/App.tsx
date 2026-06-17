import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Todos from "./pages/Todos";

function App() {
    const { token } = useAuth();

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
