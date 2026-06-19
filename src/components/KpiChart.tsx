"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";

interface KPI {
  id: string;
  nom: string;
  valeur: number;
  objectif: number;
  unite: string;
  categorie: string;
  tendance: string;
}

export default function KpiChart({
  kpi,
  data,
  dark,
}: {
  kpi: KPI;
  data: number[];
  dark: boolean;
}) {
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  const chartData = data.map((v, i) => ({
    mois: months[i] || `M${i + 1}`,
    valeur: v,
    objectif: kpi.objectif,
  }));

  const lastVal = data[data.length - 1] || 0;
  const prevVal = data.length >= 2 ? data[data.length - 2] : 0;
  const diff = lastVal - prevVal;
  const variation = prevVal > 0 ? ((diff / prevVal) * 100) : 0;
  const isUp = diff >= 0;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--card)] p-4 hover:shadow-md transition-all duration-200">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[var(--foreground)]">{kpi.nom}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-lg font-extrabold text-[var(--foreground)]">
              {lastVal.toLocaleString("fr-FR")}
            </span>
            <span className="text-[11px] text-[var(--muted-foreground)]">{kpi.unite}</span>
            {variation !== 0 && (
              <span
                className={`text-xs font-semibold ${isUp ? "text-green-600" : "text-red-600"}`}
              >
                {isUp ? "↑" : "↓"} {Math.abs(variation).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted-foreground)] bg-[var(--muted)] px-2.5 py-1 rounded-full">
          Évolution
        </span>
      </div>

      {/* Graphique */}
      {data.length === 0 ? (
        <div className="flex items-center justify-center h-[180px] text-sm text-[var(--muted-foreground)]">
          Aucune donnée
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#15803d" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#15803d" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#166534" : "#e5e7eb"} vertical={false} />
            <XAxis
              dataKey="mois"
              stroke={dark ? "#9ca3af" : "#9ca3af"}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke={dark ? "#9ca3af" : "#9ca3af"}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              axisLine={false}
              tickLine={false}
              width={45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? "#0f3d1e" : "#ffffff",
                border: `1px solid ${dark ? "#166534" : "#e5e7eb"}`,
                borderRadius: "10px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                color: dark ? "#f0fdf4" : "#052e16",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              labelStyle={{ fontWeight: 600, marginBottom: 4 }}
            />
            <Area
              type="monotone"
              dataKey="valeur"
              stroke="#15803d"
              strokeWidth={2.5}
              fill={`url(#grad-${kpi.id})`}
              dot={{ fill: "#15803d", r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#15803d", stroke: "#fff", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="objectif"
              stroke={dark ? "#6b7280" : "#d1d5db"}
              strokeWidth={1.5}
              strokeDasharray="6 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
