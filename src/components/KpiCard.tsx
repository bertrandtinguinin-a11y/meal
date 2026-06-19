"use client";

interface KPI {
  id: string;
  nom: string;
  valeur: number;
  objectif: number;
  unite: string;
  categorie: string;
  tendance: "haussière" | "stable" | "baissière";
}

export default function KpiCard({ kpi }: { kpi: KPI }) {
  const ratio = (kpi.valeur / kpi.objectif) * 100;
  const progress = Math.min(ratio, 100);

  const couleurBarre =
    ratio >= 100 ? "#22c55e" : ratio >= 75 ? "#eab308" : "#ef4444";
  const bgBarre =
    ratio >= 100 ? "rgba(34,197,94,0.12)" : ratio >= 75 ? "rgba(234,179,8,0.12)" : "rgba(239,68,68,0.12)";

  const statut =
    ratio >= 100 ? "Atteint" : ratio >= 75 ? "Vigilance" : "Critique";
  const statutColor =
    ratio >= 100 ? "#22c55e" : ratio >= 75 ? "#eab308" : "#ef4444";

  const fleche =
    kpi.tendance === "haussière" ? "↑" : kpi.tendance === "baissière" ? "↓" : "→";
  const tendanceColor =
    kpi.tendance === "haussière" ? "#22c55e" : kpi.tendance === "baissière" ? "#ef4444" : "#6b7280";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--card)] p-5 hover:shadow-md transition-all duration-200">
      {/* En-tête */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            {kpi.categorie}
          </span>
          <h3 className="text-sm font-bold mt-1 text-[var(--foreground)] truncate">{kpi.nom}</h3>
        </div>
        <span
          className="text-[10px] font-semibold uppercase px-2 py-1 rounded-full whitespace-nowrap ml-2"
          style={{ backgroundColor: statutColor + "18", color: statutColor }}
        >
          {statut}
        </span>
      </div>

      {/* Valeur */}
      <div className="flex items-baseline gap-1.5 mb-1">
        <span className="text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
          {kpi.valeur.toLocaleString("fr-FR")}
        </span>
        <span className="text-sm font-medium text-[var(--muted-foreground)]">
          / {kpi.objectif.toLocaleString("fr-FR")} {kpi.unite}
        </span>
      </div>

      {/* Barre */}
      <div className="mt-4 mb-3">
        <div
          className="w-full h-2 rounded-full overflow-hidden"
          style={{ backgroundColor: bgBarre }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%`, backgroundColor: couleurBarre }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs font-semibold" style={{ color: statutColor }}>
            {ratio.toFixed(1)}%
          </span>
          <span className="text-xs flex items-center gap-1" style={{ color: tendanceColor }}>
            {fleche}
            <span>
              {kpi.tendance === "haussière" ? "Hausse" : kpi.tendance === "baissière" ? "Baisse" : "Stable"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
