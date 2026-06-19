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

const HISTORIQUE = {
  "1": [1650000, 1700000, 1720000, 1800000, 1820000, 1850000],
  "2": [20, 21, 21, 22, 22, 22],
  "3": [380, 390, 370, 360, 350, 340],
  "4": [72, 74, 75, 76, 77, 78],
  "5": [10, 11, 10, 12, 11, 12],
  "6": [750000, 770000, 800000, 820000, 850000, 890000],
};

export default function Dashboard() {
  const [kpis, setKpis] = useState<KPI[]>(KPIS_PAR_DEFAUT);
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
        <div className="text-2xl animate-pulse">Chargement...</div>
      </div>
    );
  }

  const stats = {
    total: kpis.length,
    ok: kpis.filter((k) => (k.valeur / k.objectif) >= 1).length,
    warning: kpis.filter((k) => (k.valeur / k.objectif) >= 0.75 && (k.valeur / k.objectif) < 1).length,
    critical: kpis.filter((k) => (k.valeur / k.objectif) < 0.75).length,
  };

  return (
    <div>
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-[var(--muted-foreground)] mt-1">
          Suivi des indicateurs clés de performance
        </p>
      </div>

      {/* Cartes Résumé */}
      <div className="grid gap-4 mb-8 grid-cols-2 sm:grid-cols-4">
        <SummaryCard label="KPIs" value={stats.total} color="var(--primary)" />
        <SummaryCard label="✅ Atteints" value={stats.ok} color="#22c55e" />
        <SummaryCard label="⚠️ En cours" value={stats.warning} color="#eab308" />
        <SummaryCard label="🔴 Critique" value={stats.critical} color="#ef4444" />
      </div>

      {/* Grille KPIs */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Indicateurs</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>

      {/* Graphiques */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Évolution</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {kpis.slice(0, 4).map((kpi) => (
            <KpiChart
              key={kpi.id}
              kpi={kpi}
              data={HISTORIQUE[kpi.id as keyof typeof HISTORIQUE] || []}
              dark={dark}
            />
          ))}
        </div>
      </div>

      {/* Assistant IA */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🧠 Assistant IA</h2>
        <AiAssistant kpis={kpis} historique={HISTORIQUE} />
      </div>
    </div>
  );
}

function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 text-center"
      style={{ borderLeftColor: color, borderLeftWidth: 4 }}
    >
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-sm text-[var(--muted-foreground)]">{label}</div>
    </div>
  );
}
