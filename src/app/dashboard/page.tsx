"use client";

import { useState, useMemo } from "react";
import AiAssistant from "@/components/AiAssistant";

interface KPI {
  id: string;
  nom: string;
  valeur: number;
  objectif: number;
  unite: string;
  categorie: string;
  tendance: "haussière" | "stable" | "baissière";
}

const KPIS_PAR_DEFAUT: KPI[] = [
  { id: "1", nom: "Agriculteurs formés", valeur: 420, objectif: 3000, unite: "personnes", categorie: "Produit", tendance: "haussière" },
  { id: "2", nom: "Ménages sécurité alim.", valeur: 36, objectif: 70, unite: "%", categorie: "Réalisation", tendance: "haussière" },
  { id: "3", nom: "Kits semences distribués", valeur: 620, objectif: 3000, unite: "kits", categorie: "Produit", tendance: "haussière" },
  { id: "4", nom: "Dont femmes formées", valeur: 165, objectif: 1500, unite: "personnes", categorie: "Genre", tendance: "stable" },
  { id: "5", nom: "Séances IEC nutrition", valeur: 36, objectif: 36, unite: "séances", categorie: "Réalisation", tendance: "haussière" },
  { id: "6", nom: "Rapports mensuels", valeur: 3, objectif: 3, unite: "rapports", categorie: "Suivi", tendance: "stable" },
];

const HISTORIQUE: Record<string, number[]> = {
  "1": [140, 200, 260, 320, 370, 420],
  "2": [18, 22, 26, 30, 33, 36],
  "3": [200, 320, 400, 480, 550, 620],
  "4": [50, 75, 95, 120, 140, 165],
  "5": [12, 18, 24, 28, 32, 36],
  "6": [1, 2, 2, 3, 3, 3],
};

const MOIS = ["Janv.", "Févr.", "Mars", "Avril", "Mai", "Juin"];

export default function Dashboard() {
  const [kpis] = useState<KPI[]>(KPIS_PAR_DEFAUT);
  const [selectedChart, setSelectedChart] = useState<string>("1");

  const stats = useMemo(() => ({
    total: kpis.length,
    ok: kpis.filter((k) => (k.valeur / k.objectif) >= 1).length,
    warning: kpis.filter((k) => (k.valeur / k.objectif) >= 0.75 && (k.valeur / k.objectif) < 1).length,
    critical: kpis.filter((k) => (k.valeur / k.objectif) < 0.75).length,
  }), [kpis]);

  const getStatus = (kpi: KPI): { label: string; css: string } => {
    const ratio = kpi.valeur / kpi.objectif;
    if (ratio >= 1) return { label: "En bonne voie", css: "ok" };
    if (ratio >= 0.75) return { label: "À surveiller", css: "warn" };
    return { label: "Alerte", css: "alert" };
  };

  const getPct = (v: number, o: number) => Math.round((v / o) * 100);
  const getCode = (nom: string) => nom.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const selectedKpi = kpis.find((k) => k.id === selectedChart) || kpis[0];
  const selectedHist = HISTORIQUE[selectedChart] || [];
  const selectedObjectif = selectedKpi.objectif;

  // Préparation données pour le graphique cumulé
  const cibleTrajectoire = selectedHist.map((_, i) =>
    Math.round(selectedObjectif * ((i + 1) / selectedHist.length))
  );

  return (
    <div>
      {/* Section Header */}
      <div className="section-header">
        <div>
          <span className="eyebrow">Tableau de bord</span>
          <h2>Vue d'ensemble</h2>
        </div>
        <span className="period-badge tnum">T1 · 2026</span>
      </div>

      {/* Grille KPIs */}
      <div className="kpi-grid">
        {kpis.map((kpi) => {
          const status = getStatus(kpi);
          const pct = getPct(kpi.valeur, kpi.objectif);
          const trend = kpi.tendance === "haussière" ? "up" : kpi.tendance === "baissière" ? "dn" : "flat";
          const trendLabel = kpi.tendance === "haussière" ? "↗" : kpi.tendance === "baissière" ? "↘" : "→";

          return (
            <div
              key={kpi.id}
              className="kpi-card"
              style={{
                "--c": status.css === "ok" ? "var(--ok)" : status.css === "warn" ? "var(--warn)" : "var(--alert)",
                cursor: "pointer",
                borderColor: selectedChart === kpi.id ? "var(--mil)" : undefined,
              } as React.CSSProperties}
              onClick={() => setSelectedChart(kpi.id)}
            >
              <div className="kpi-code">{getCode(kpi.nom)} · {kpi.categorie}</div>
              <div className="kpi-name">{kpi.nom}</div>
              <div className="kpi-value">
                {kpi.valeur.toLocaleString("fr-FR")}
                <span className="kpi-target">/{kpi.objectif.toLocaleString("fr-FR")}</span>
              </div>
              <div className="kpi-footer">
                <span className={`kpi-pill ${status.css}`}>
                  {status.css === "ok" ? "🟢" : status.css === "warn" ? "🟡" : "🔴"} {pct}%
                </span>
                <span className={`kpi-trend ${trend}`}>{trendLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Barre d'alerte */}
      <div className="alert-bar">
        <span className="alert-icon">⚠</span>
        <div className="alert-text">
          <b>Alerte genre :</b> 39% de femmes parmi les formés (cible 50%). Action : <span className="action-link">sessions exclusivement féminines</span>
        </div>
      </div>

      {/* Graphique natif SVG */}
      <div className="card meal-chart">
        <h3>
          {selectedKpi.nom} — cumul
          <span className="kpi-trend up">↗</span>
        </h3>
        <div className="card-subtitle">Cumul réalisé vs trajectoire cible · {MOIS[0]} → {MOIS[MOIS.length - 1]}</div>
        
        <svg viewBox="0 0 320 142" role="img" aria-label={`Graphique cumulé de ${selectedKpi.nom}`}>
          {/* Grille */}
          <g stroke="var(--ligne)" strokeWidth="1">
            <line x1="8" y1="16" x2="312" y2="16" />
            <line x1="8" y1="49" x2="312" y2="49" />
            <line x1="8" y1="82" x2="312" y2="82" />
            <line x1="8" y1="116" x2="312" y2="116" />
          </g>
          {/* Trajectoire cible (pointillé) */}
          <polyline
            points={cibleTrajectoire.map((v, i) => {
              const x = 30 + (i / (cibleTrajectoire.length - 1)) * 260;
              const y = 116 - (v / (selectedObjectif * 1.1)) * 90;
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="var(--mil)"
            strokeWidth="2"
            strokeDasharray="5 4"
            strokeLinecap="round"
          />
          {/* Aire réalisée */}
          <path
            d={
              (() => {
                const pts = selectedHist.map((v, i) => {
                  const x = 30 + (i / (selectedHist.length - 1)) * 260;
                  const y = 116 - (v / (selectedObjectif * 1.1)) * 90;
                  return `${x},${y}`;
                });
                return `M${pts[0]} L${pts.slice(1).join(" ")} L${pts[pts.length - 1].split(",")[0]},116 L30,116 Z`;
              })()
            }
            fill="rgba(111,168,107,0.16)"
          />
          {/* Ligne réalisée */}
          <polyline
            points={selectedHist.map((v, i) => {
              const x = 30 + (i / (selectedHist.length - 1)) * 260;
              const y = 116 - (v / (selectedObjectif * 1.1)) * 90;
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            stroke="var(--feuille)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Points */}
          {selectedHist.map((v, i) => {
            const x = 30 + (i / (selectedHist.length - 1)) * 260;
            const y = 116 - (v / (selectedObjectif * 1.1)) * 90;
            return <circle key={i} cx={x} cy={y} r="3.2" fill="var(--feuille)" />;
          })}
          {/* Valeurs */}
          {selectedHist.map((v, i) => {
            if (i % 2 !== 0 && i < selectedHist.length - 1) return null;
            const x = 30 + (i / (selectedHist.length - 1)) * 260;
            const y = 116 - (v / (selectedObjectif * 1.1)) * 90;
            return (
              <text key={i} x={x} y={y - 8} fill="var(--ivoire)" fontSize="9.5" fontWeight="700" textAnchor="middle">
                {v}
              </text>
            );
          })}
          {/* Axe X */}
          {MOIS.map((m, i) => {
            const x = 30 + (i / (MOIS.length - 1)) * 260;
            return (
              <text key={i} x={x} y="132" fill="var(--muet)" fontSize="9" textAnchor="middle">
                {m}
              </text>
            );
          })}
        </svg>

        <div className="chart-legend">
          <span><i className="legend-swatch" style={{ background: "var(--feuille)" }} /> Réalisé</span>
          <span><i className="legend-dash" /> Trajectoire cible</span>
        </div>
      </div>

      {/* Désagrégation H/F pour le KPI "femmes formées" */}
      <div className="card meal-chart">
        <h3>
          Désagrégation par sexe
          <span style={{ fontSize: 10, color: "var(--muet)", fontWeight: 500 }}>
            {KPIS_PAR_DEFAUT[0].valeur} formés
          </span>
        </h3>
        <div className="card-subtitle">Cible femmes : 50% — écart à combler</div>
        
        <svg viewBox="0 0 320 96" role="img" aria-label="Répartition hommes-femmes des formés">
          {/* Hommes */}
          <text x="2" y="22" fill="var(--muet)" fontSize="10" fontWeight="600">Hommes</text>
          <rect x="74" y="13" width="222" height="16" rx="5" fill="var(--ligne)" />
          <rect x="74" y="13" width="184" height="16" rx="5" fill="var(--eau)" />
          <text x="262" y="25" fill="var(--ivoire)" fontSize="10" fontWeight="700" textAnchor="end">
            {KPIS_PAR_DEFAUT[0].valeur - KPIS_PAR_DEFAUT[3].valeur} · 61%
          </text>
          {/* Femmes */}
          <text x="2" y="58" fill="var(--muet)" fontSize="10" fontWeight="600">Femmes</text>
          <rect x="74" y="49" width="222" height="16" rx="5" fill="var(--ligne)" />
          <rect x="74" y="49" width="119" height="16" rx="5" fill="var(--alert)" />
          <text x="200" y="61" fill="var(--ivoire)" fontSize="10" fontWeight="700" textAnchor="end">
            {KPIS_PAR_DEFAUT[3].valeur} · {getPct(KPIS_PAR_DEFAUT[3].valeur, KPIS_PAR_DEFAUT[0].valeur)}%
          </text>
          {/* Ligne cible */}
          <line x1="185" y1="44" x2="185" y2="70" stroke="var(--mil)" strokeWidth="2" strokeDasharray="4 3" />
          <text x="185" y="84" fill="var(--mil)" fontSize="9" fontWeight="700" textAnchor="middle">cible 50%</text>
        </svg>
      </div>

      {/* Liste activités */}
      <div className="card" style={{ padding: "6px 13px" }}>
        <h3 style={{ marginBottom: 4 }}>Activités vs PTA</h3>
        {[
          { icon: "🎓", label: "Sessions formation (30 prév.)", pct: 70, color: "var(--warn)" },
          { icon: "🌱", label: "Kits semences (750 prév.)", pct: 83, color: "var(--ok)" },
          { icon: "📏", label: "Rounds dépistage MUAC (3)", pct: 67, color: "var(--warn)" },
          { icon: "📣", label: "Séances IEC nutrition (36)", pct: 100, color: "var(--ok)" },
          { icon: "🛵", label: "Missions supervision (8)", pct: 75, color: "var(--warn)" },
        ].map((act, i) => (
          <div key={i} className="activity-item">
            <div className="activity-icon">{act.icon}</div>
            <div className="activity-info">
              <b>{act.label}</b>
              <div className="activity-bar">
                <i style={{ width: `${act.pct}%`, background: act.color }} />
              </div>
            </div>
            <span className="activity-pct" style={{ color: act.color }}>{act.pct}%</span>
          </div>
        ))}
      </div>

      <div className="info-note">
        Tous les graphiques sont des SVG natifs — aucune librairie externe chargée. Ce choix réduit le poids, la batterie et l'empreinte réseau (principe de sobriété).
      </div>

      {/* Assistant IA */}
      <div style={{ marginTop: 16, marginBottom: 8 }}>
        <span className="eyebrow" style={{ marginBottom: 4 }}>Intelligence Artificielle</span>
        <h2 style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Assistant IA</h2>
        <AiAssistant kpis={kpis} historique={HISTORIQUE} />
      </div>
    </div>
  );
}
