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

  const colorClass =
    ratio >= 100 ? "bg-green-500" : ratio >= 75 ? "bg-yellow-500" : "bg-red-500";

  const statusIcon =
    kpi.tendance === "haussière" ? "📈" : kpi.tendance === "baissière" ? "📉" : "➡️";

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wide">
            {kpi.categorie}
          </span>
          <h3 className="font-semibold mt-0.5">{kpi.nom}</h3>
        </div>
        <span className="text-lg">{statusIcon}</span>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold">
          {kpi.valeur.toLocaleString("fr-FR")}
        </span>
        <span className="text-sm text-[var(--muted-foreground)]">
          / {kpi.objectif.toLocaleString("fr-FR")} {kpi.unite}
        </span>
      </div>

      <div className="w-full h-2.5 rounded-full bg-[var(--muted)] mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between mt-2 text-sm">
        <span className={ratio >= 100 ? "text-green-600" : ratio >= 75 ? "text-yellow-600" : "text-red-600"}>
          {ratio.toFixed(1)}% atteint
        </span>
        <span className="text-[var(--muted-foreground)]">
          {kpi.tendance === "haussière" ? "En hausse" : kpi.tendance === "baissière" ? "En baisse" : "Stable"}
        </span>
      </div>
    </div>
  );
}
