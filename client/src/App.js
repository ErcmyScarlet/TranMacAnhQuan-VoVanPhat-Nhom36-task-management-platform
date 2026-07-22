import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CommentPage from "./pages/CommentPage";
import UploadPage from "./pages/UploadPage";


function App() {
    const [token, setToken] = useState(localStorage.getItem("token"));

    useEffect(() => {
        const syncAuth = () => setToken(localStorage.getItem("token"));
        window.addEventListener("storage", syncAuth);
        window.addEventListener("auth:changed", syncAuth);
        return () => {
            window.removeEventListener("storage", syncAuth);
            window.removeEventListener("auth:changed", syncAuth);
        };
    }, []);

    const handleAuthChange = () => {
        setToken(localStorage.getItem("token"));
    };

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={token ? <Navigate to="/dashboard" /> : <Login onAuthChange={handleAuthChange} />}
                />
                <Route
                    path="/register"
                    element={<Register onAuthChange={handleAuthChange} />}
                />
                <Route
                    path="/dashboard"
                    element={token ? <Dashboard onLogout={handleAuthChange} /> : <Navigate to="/" />}
                />
                <Route
                    path="/upload"
                    element={token ? <UploadPage /> : <Navigate to="/" />}
                />
                <Route
                    path="/comments/:projectId?"
                    element={token ? <CommentPage /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;