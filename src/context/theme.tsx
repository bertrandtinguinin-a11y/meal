"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface ThemeContext {
  isDark: boolean;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeContext>({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("meal_dark");
    if (saved) {
      setIsDark(saved === "true");
      document.documentElement.classList.toggle("dark", saved === "true");
    }
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("meal_dark", String(next));
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  if (!mounted) return <>{children}</>;

  return <ThemeCtx.Provider value={{ isDark, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
