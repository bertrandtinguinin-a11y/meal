import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="mb-8">
        <span className="text-7xl">📊</span>
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
        MEAL
      </h1>
      <p className="text-xl text-[var(--muted-foreground)] mb-2">
        <strong>M</strong>onitoring & <strong>E</strong>valuation with{" "}
        <strong>A</strong>I <strong>L</strong>ogic
      </p>
      <p className="text-[var(--muted-foreground)] mb-12 max-w-md">
        Suivez vos KPIs en temps réel, analysez les tendances avec l&apos;IA,
        et prenez des décisions éclairées.
      </p>

      <div className="grid gap-6 sm:grid-cols-3 mb-12 max-w-2xl">
        {[
          { emoji: "🎯", title: "KPIs Temps Réel", desc: "Visualisez vos indicateurs clés en direct" },
          { emoji: "🧠", title: "IA Intégrée", desc: "Analyse prédictive et recommandations intelligentes" },
          { emoji: "📱", title: "PWA Mobile", desc: "Installez l'app sur votre téléphone en 2 clics" },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
            <div className="text-3xl mb-3">{f.emoji}</div>
            <h3 className="font-semibold mb-1">{f.title}</h3>
            <p className="text-sm text-[var(--muted-foreground)]">{f.desc}</p>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="rounded-xl bg-[var(--primary)] px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-[var(--primary-dark)] transition-all active:scale-95"
      >
        Accéder au Dashboard →
      </Link>

      <div className="mt-16 text-xs text-[var(--muted-foreground)]">
        Propulsé par Next.js · Supabase · Vercel AI SDK
      </div>
    </div>
  );
}
