import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    
    // load user on mount / when token chages
    useEffect(() => {
        async function loadUser() {
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
          const res = await fetch(`${API}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
          });

          if (!res.ok) throw new Error("Invalid token");

          const data = await res.json();
          setUser(data.user || data);
        } catch (err) {
            console.error("Auth load error:", err);
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    loadUser();
    }, [token]);

    // Login
    const login = async (email, password) => {
        const res = await fetch(`${API}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || data.error || "Login failed");
        }

        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);

        return data;
    };

    // Register
    const register = async (name, email, password) => {
        const res = await fetch(`${API}/auth/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || data.error || "Registration failed");
        }

        // Optional: auto-login after register
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);

        return data;
    };

    // Logout
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
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