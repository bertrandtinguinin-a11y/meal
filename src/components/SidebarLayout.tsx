"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useTheme } from "@/context/theme";
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  BarChart3,
  FileText,
  Shield,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/collecte", label: "Collecte", icon: ClipboardList },
  { href: "/validation", label: "Validation", icon: CheckCircle },
  { href: "/analyse", label: "Analyse", icon: BarChart3 },
  { href: "/synthese", label: "Synthèse", icon: FileText },
  { href: "/securite", label: "Sécurité", icon: Shield },
  { href: "/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/parametres", label: "Réglages", icon: Settings },
];

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout, loading } = useAuth();
  const { isDark, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!loading && !user && !redirected &&
        pathname !== "/" && pathname !== "/connexion") {
      setRedirected(true);
      window.location.href = "/connexion";
    }
  }, [loading, user, pathname, redirected]);

  if (pathname === "/" || pathname === "/connexion") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#020617]">
        <div className="animate-spin h-8 w-8 border-2 border-[#15803d] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#020617]">
        <div className="animate-spin h-8 w-8 border-2 border-[#15803d] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#020617]">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#15803d] text-lg font-bold text-white">
              M
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">MEAL-Pro</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/");
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[#15803d]/10 text-[#15803d] dark:bg-[#15803d]/20 dark:text-green-400"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-gray-200 dark:border-gray-800 p-4">
          {user && (
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-900 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#15803d] text-xs font-bold text-white">
                {user.nom.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user.nom}</p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={toggle}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={logout}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
            >
              <LogOut size={16} />
              <span>Quitter</span>
            </button>
          </div>
        </div>
      </aside>

      <main className="flex flex-1 flex-col min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-lg px-4 lg:hidden">
          <button onClick={() => setMobileOpen(true)} className="text-gray-600 dark:text-gray-300">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#15803d] text-xs font-bold text-white">M</div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">MEAL-Pro</span>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
