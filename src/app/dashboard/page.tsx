"use client";

import { useState, useEffect } from "react";

interface KPI {
  id: string;
  nom: string;
  valeur: number;
  objectif: number;
  unite: string;
  icone: string;
  evolution: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/kpis")
      .then(r => r.json())
      .then(data => {
        setKpis(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg animate-pulse" style={{ color: "var(--muet)" }}>Chargement...</div>
      </div>
    );
  }

  // État vide
  if (kpis.length === 0) {
    return (
      <div className="analyse-page">
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 40, marginBottom: 8 }}>📊</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Bienvenue sur MEAL-Pro</h2>
          <p style={{ fontSize: 13, color: "var(--muet)", maxWidth: 320, margin: "0 auto", lineHeight: 1.5 }}>
            Ton tableau de bord s&apos;affichera ici dès que les premières collectes seront validées.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            <a href="/collecte" className="btn btn-primary">📝 Nouvelle collecte</a>
            <a href="/validation" className="btn">✅ Valider</a>
            <a href="/analyse" className="btn">🎨 Analyse</a>
          </div>
        </div>
      </div>
    );
  }

  const total = kpis.length;
  const ok = kpis.filter(k => k.objectif > 0 && k.valeur / k.objectif >= 1).length;
  const warning = kpis.filter(k => k.objectif > 0 && k.valeur / k.objectif >= 0.75 && k.valeur / k.objectif < 1).length;
  const critical = kpis.filter(k => k.objectif > 0 && k.valeur / k.objectif < 0.75).length;
  const taux = total > 0 ? Math.round(((ok + warning * 0.5) / total) * 100) : 0;

  return (
    <div className="analyse-page">
      <div className="card" style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>📊 Tableau de bord</h2>
          <span style={{ fontSize: 22, fontWeight: 700, color: "var(--feuille)" }}>{taux}%</span>
        </div>
        <p style={{ fontSize: 12, color: "var(--muet)", marginTop: 2 }}>
          {new Date().toLocaleDateString("fr-FR")} · {total} indicateur{total > 1 ? "s" : ""}
        </p>
      </div>

      {/* Cartes résumé */}
      <div className="validation-stats" style={{ marginBottom: 10 }}>
        <div className="stat-box"><span className="stat-num">{total}</span><span className="stat-label">Suivis</span></div>
        <div className="stat-box"><span className="stat-num" style={{ color: "#16a34a" }}>{ok}</span><span className="stat-label">Atteints</span></div>
        <div className="stat-box"><span className="stat-num" style={{ color: "#ca8a04" }}>{warning}</span><span className="stat-label">Vigilance</span></div>
        <div className="stat-box"><span className="stat-num" style={{ color: "#dc2626" }}>{critical}</span><span className="stat-label">Critiques</span></div>
      </div>

      {/* KPIs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {kpis.map(kpi => {
          const pct = kpi.objectif > 0 ? Math.min((kpi.valeur / kpi.objectif) * 100, 100) : 0;
          const color = pct >= 100 ? "#16a34a" : pct >= 75 ? "#ca8a04" : "#dc2626";
          return (
            <div key={kpi.id} className="card" style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  {kpi.icone || "📊"} {kpi.nom}
                </span>
                <span style={{ fontSize: 15, fontWeight: 700, color }}>
                  {kpi.valeur.toLocaleString()} {kpi.unite}
                </span>
              </div>
              <div className="jauge-track" style={{ marginTop: 6 }}>
                <div className="jauge-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muet)", marginTop: 2 }}>
                <span>Objectif : {kpi.objectif.toLocaleString()} {kpi.unite}</span>
                <span>{Math.round(pct)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
