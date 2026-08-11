import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CommentPage from "./pages/CommentPage";
import UploadPage from "./pages/UploadPage";
import Profile from "./pages/Profile";
import NoteList from "./pages/NoteList";
import NoteCreate from "./pages/NoteCreate";
import NoteDetail from "./pages/NoteDetail";

function AppRoutes() {
    const { token } = useAuth();

    return (
        <Routes>
            <Route
                path="/"
                element={token ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
                path="/register"
                element={<Register />}
            />
            <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route
                path="/profile"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
            />
            <Route
                path="/upload"
                element={<ProtectedRoute><UploadPage /></ProtectedRoute>}
            />
            <Route
                path="/comments/:projectId?"
                element={<ProtectedRoute><CommentPage /></ProtectedRoute>}
            />
            {/* Note routes - Người 1 */}
            <Route
                path="/notes"
                element={<ProtectedRoute><NoteList /></ProtectedRoute>}
            />
            <Route
                path="/notes/create"
                element={<ProtectedRoute><NoteCreate /></ProtectedRoute>}
            />
            <Route
                path="/notes/:id"
                element={<ProtectedRoute><NoteDetail /></ProtectedRoute>}
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;