"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ConnexionPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Veuillez remplir tous les champs"); return; }
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) router.push("/dashboard");
    else setError("Email ou mot de passe incorrect");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f0fdf4] via-white to-[#f8fafc] dark:from-[#020617] dark:via-[#0f172a] dark:to-[#020617]">
      <div className="m-auto w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#15803d] to-[#166534] shadow-lg shadow-green-200 dark:shadow-green-900/30">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenue</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Connectez-vous pour accéder à votre espace
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@meal.app"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 outline-none transition-colors"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 pr-10 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-[#15803d] focus:ring-2 focus:ring-[#15803d]/20 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#15803d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <Link href="#" className="text-[#15803d] hover:underline">Mot de passe oublié ?</Link>
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Pas de compte ?{" "}
            <Link href="#" className="text-[#15803d] hover:underline font-medium">Créer un compte</Link>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 text-center">COMPTES DE DÉMONSTRATION</p>
          <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
            <p>admin@meal.app / <span className="font-mono">admin123</span></p>
            <p>collecte@meal.app / <span className="font-mono">collecte123</span></p>
            <p>superviseur@meal.app / <span className="font-mono">super123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
