import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="mb-6">
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: "linear-gradient(150deg, var(--mil), var(--feuille))",
          display: "grid", placeItems: "center", margin: "0 auto",
        }}>
          <span style={{ fontSize: 40, fontWeight: 800, color: "var(--terre)" }}>M</span>
        </div>
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-3" style={{ color: "var(--ivoire)" }}>
        MEAL
      </h1>
      <p className="text-lg mb-2" style={{ color: "var(--muet)" }}>
        <b style={{ color: "var(--mil)" }}>M</b>onitoring &{" "}
        <b style={{ color: "var(--mil)" }}>E</b>valuation with{" "}
        <b style={{ color: "var(--mil)" }}>A</b>I{" "}
        <b style={{ color: "var(--mil)" }}>L</b>ogic
      </p>
      <p className="mb-10 max-w-md" style={{ color: "var(--muet)" }}>
        Suivez vos KPIs en temps réel, analysez les tendances avec l&apos;IA,
        et prenez des décisions éclairées.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-10 max-w-2xl" style={{ width: "100%" }}>
        {[
          { emoji: "🎯", title: "KPIs Temps Réel", desc: "Visualisez vos indicateurs clés" },
          { emoji: "🧠", title: "IA Intégrée", desc: "Analyses prédictives et recommandations" },
          { emoji: "📱", title: "PWA Mobile", desc: "Installez sur mobile en 2 clics" },
        ].map((f) => (
          <div key={f.title} className="card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{f.emoji}</div>
            <h3 style={{ fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{f.title}</h3>
            <p style={{ fontSize: 11, color: "var(--muet)" }}>{f.desc}</p>
          </div>
        ))}
      </div>

      <Link
        href="/dashboard"
        className="save-btn"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 32px", height: 46, fontSize: 14, textDecoration: "none", width: "auto", minWidth: 220 }}
      >
        Accéder au Dashboard →
      </Link>

      <div style={{ marginTop: 40, fontSize: 10, color: "var(--muet-2)" }}>
        Éco-conçu · SVG natif · Zéro librairie lourde · 🌿 Sobriété activable
      </div>
    </div>
  );
}
