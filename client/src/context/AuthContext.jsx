import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        const syncAuth = () => {
            setToken(localStorage.getItem("token"));
            const stored = localStorage.getItem("user");
            setUser(stored ? JSON.parse(stored) : null);
        };

        window.addEventListener("storage", syncAuth);
        window.addEventListener("auth:changed", syncAuth);
        return () => {
            window.removeEventListener("storage", syncAuth);
            window.removeEventListener("auth:changed", syncAuth);
        };
    }, []);

    const loginUser = (tokenValue, userData) => {
        localStorage.setItem("token", tokenValue);
        localStorage.setItem("user", JSON.stringify(userData || {}));
        setToken(tokenValue);
        setUser(userData);
        window.dispatchEvent(new Event("auth:changed"));
    };

    const logoutUser = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
        window.dispatchEvent(new Event("auth:changed"));
    };

    return (
        <AuthContext.Provider value={{ token, user, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
