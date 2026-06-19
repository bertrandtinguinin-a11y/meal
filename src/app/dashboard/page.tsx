"use client";

import { useState, useEffect } from "react";
import KpiCard from "@/components/KpiCard";
import KpiChart from "@/components/KpiChart";
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
  { id: "1", nom: "Chiffre d'Affaires", valeur: 1850000, objectif: 2000000, unite: "FCFA", categorie: "Finance", tendance: "haussière" },
  { id: "2", nom: "Marge Bénéficiaire", valeur: 22, objectif: 25, unite: "%", categorie: "Finance", tendance: "stable" },
  { id: "3", nom: "Production Journalière", valeur: 340, objectif: 400, unite: "unités", categorie: "Production", tendance: "baissière" },
  { id: "4", nom: "Taux d'Occupation", valeur: 78, objectif: 85, unite: "%", categorie: "RH", tendance: "haussière" },
  { id: "5", nom: "Nouveaux Clients", valeur: 12, objectif: 15, unite: "clients", categorie: "Commercial", tendance: "stable" },
  { id: "6", nom: "Dépenses Mensuelles", valeur: 890000, objectif: 800000, unite: "FCFA", categorie: "Finance", tendance: "haussière" },
];

const HISTORIQUE: Record<string, number[]> = {
  "1": [1650000, 1700000, 1720000, 1800000, 1820000, 1850000],
  "2": [20, 21, 21, 22, 22, 22],
  "3": [380, 390, 370, 360, 350, 340],
  "4": [72, 74, 75, 76, 77, 78],
  "5": [10, 11, 10, 12, 11, 12],
  "6": [750000, 770000, 800000, 820000, 850000, 890000],
};

export default function Dashboard() {
  const [kpis] = useState<KPI[]>(KPIS_PAR_DEFAUT);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-lg text-[var(--muted-foreground)] animate-pulse">Chargement...</div>
      </div>
    );
  }

  // Stats globales
  const total = kpis.length;
  const ok = kpis.filter((k) => (k.valeur / k.objectif) >= 1).length;
  const warning = kpis.filter((k) => (k.valeur / k.objectif) >= 0.75 && (k.valeur / k.objectif) < 1).length;
  const critical = kpis.filter((k) => (k.valeur / k.objectif) < 0.75).length;
  const tauxCompletion = total > 0 ? Math.round(((ok + warning * 0.5) / total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* ── En-tête ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Tableau de Bord</h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            Suivi des indicateurs clés de performance • {new Date().toLocaleDateString("fr-FR")}
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-[var(--muted-foreground)]">Taux global</span>
          <span className="text-lg font-bold text-[var(--primary)]">{tauxCompletion}%</span>
        </div>
      </div>

      {/* ── Cartes Résumé ── */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard label="KPIs suivis" value={total} icon="📊" color="var(--primary)" />
        <MetricCard label="Atteints" value={ok} icon="✅" color="#22c55e" />
        <MetricCard label="Vigilance" value={warning} icon="⚡" color="#eab308" />
        <MetricCard label="Critiques" value={critical} icon="🔴" color="#ef4444" />
      </div>

      {/* ── Grille KPIs ── */}
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
          Indicateurs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </section>

      {/* ── Graphiques ── */}
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
          Évolution
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {kpis.slice(0, 4).map((kpi) => (
            <KpiChart key={kpi.id} kpi={kpi} data={HISTORIQUE[kpi.id] || []} dark={dark} />
          ))}
        </div>
      </section>

      {/* ── Assistant IA ── */}
      <section>
        <h2 className="text-base font-bold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
          Analyse Intelligente
        </h2>
        <AiAssistant kpis={kpis} historique={HISTORIQUE} />
      </section>
    </div>
  );
}

// ─── Petit composant métrique ──────────────────────────────────────────────────

function MetricCard({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--card)] p-4 sm:p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm text-[var(--muted-foreground)] font-medium">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-3xl font-extrabold tracking-tight" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
