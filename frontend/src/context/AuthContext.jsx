import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const token = localStorage.getItem("moodboard_token");
    if (!token) { setLoading(false); return; }
    try {
      const data = await api("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("moodboard_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function login(email, password) {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    });
    localStorage.setItem("moodboard_token", data.token);
    setUser(data.user);
  }

  async function register(name, email, password) {
    const data = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password })
    });
    localStorage.setItem("moodboard_token", data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("moodboard_token");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, refresh }}>
    {children}
  </AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
