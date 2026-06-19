import Link from "next/link";

const features = [
  {
    icon: "📝",
    title: "Collecte terrain",
    desc: "Les agents saisissent les données depuis le terrain avec un formulaire adapté à chaque indicateur.",
  },
  {
    icon: "✅",
    title: "Validation & feedback",
    desc: "Le superviseur valide ou demande des corrections avec un message direct au collecteur.",
  },
  {
    icon: "🎨",
    title: "Analyse personnalisable",
    desc: "Construisez vos propres vues : choisissez indicateurs, types de graphiques et disposition.",
  },
  {
    icon: "📱",
    title: "Application mobile PWA",
    desc: "Installez MEAL-Pro sur votre téléphone comme une app native. Fonctionne hors-ligne.",
  },
  {
    icon: "📊",
    title: "KPIs dynamiques",
    desc: "Tableaux de bord automatiques qui se mettent à jour dès qu'une collecte est validée.",
  },
  {
    icon: "♻️",
    title: "Éco-conçu",
    desc: "Graphiques SVG natifs, mode sobriété, empreinte réduite. Pas de librairies lourdes.",
  },
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center py-16 sm:py-24">
        <div className="w-16 h-16 rounded-2xl bg-[var(--primary)] flex items-center justify-center mb-6 shadow-lg shadow-[var(--primary)]/20">
          <span className="text-white text-3xl font-bold">M</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--foreground)] mb-4">
          MEAL-Pro
        </h1>
        <p className="text-lg sm:text-xl text-[var(--muted-foreground)] max-w-xl mb-2">
          <strong className="text-[var(--foreground)]">M</strong>onitoring &{" "}
          <strong className="text-[var(--foreground)]">E</strong>valuation &{" "}
          <strong className="text-[var(--foreground)]">A</strong>nalysis with{" "}
          <strong className="text-[var(--foreground)]">L</strong>ogic
        </p>
        <p className="text-sm text-[var(--muted-foreground)] mb-10 max-w-md">
          Collecte terrain, validation, analyse personnalisée. <br />Tout-en-un, zéro papier.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/connexion"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[var(--primary)]/25 hover:bg-[var(--primary-dark)] transition-all active:scale-[0.98]"
          >
            Se connecter
            <span className="text-lg">→</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--card)] px-6 py-3.5 text-base font-semibold text-[var(--foreground)] hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            Accès direct
            <span className="text-lg">→</span>
          </Link>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section className="py-12 sm:py-16">
        <h2 className="text-center text-sm font-bold uppercase tracking-widest text-[var(--muted-foreground)] mb-8">
          Fonctionnalités
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--card)] p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-bold text-[var(--foreground)] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 text-center text-xs text-[var(--muted-foreground)] border-t border-[var(--border)]">
        MEAL-Pro • Monitoring &amp; Evaluation Analysis • Next.js + Supabase
      </footer>
    </div>
  );
}
