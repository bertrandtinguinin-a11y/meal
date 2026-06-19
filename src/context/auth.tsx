"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  email: string;
  nom: string;
  role: "admin" | "collecteur" | "superviseur";
}

interface AuthContext {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthCtx = createContext<AuthContext>({
  user: null,
  login: async () => false,
  logout: () => {},
  loading: true,
});

const USERS: Record<string, { password: string; nom: string; role: User["role"] }> = {
  "admin@meal.app": { password: "admin123", nom: "Admin MEAL", role: "admin" },
  "collecte@meal.app": { password: "collecte123", nom: "Agent Terrain", role: "collecteur" },
  "superviseur@meal.app": { password: "super123", nom: "Superviseur", role: "superviseur" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("meal_user");
    if (saved) try { setUser(JSON.parse(saved)); } catch {}
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    const found = USERS[email.toLowerCase()];
    if (!found || found.password !== password) return false;
    const u: User = { email: email.toLowerCase(), nom: found.nom, role: found.role };
    setUser(u);
    localStorage.setItem("meal_user", JSON.stringify(u));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("meal_user");
  };

  return <AuthCtx.Provider value={{ user, login, logout, loading }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
