"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
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
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
  const chartData = data.map((v, i) => ({
    mois: months[i] || `M${i + 1}`,
    valeur: v,
    objectif: kpi.objectif,
  }));

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
      <h3 className="font-semibold text-sm mb-3">{kpi.nom}</h3>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-[var(--muted-foreground)] text-sm">
          Aucune donnée disponible
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={dark ? "#166534" : "#dcfce7"} />
            <XAxis
              dataKey="mois"
              stroke={dark ? "#9ca3af" : "#6b7280"}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              stroke={dark ? "#9ca3af" : "#6b7280"}
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
              width={50}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: dark ? "#0f3d1e" : "#ffffff",
                border: `1px solid ${dark ? "#166534" : "#dcfce7"}`,
                borderRadius: "8px",
                color: dark ? "#f0fdf4" : "#052e16",
                fontSize: "13px",
              }}
            />
            <Line
              type="monotone"
              dataKey="valeur"
              stroke="#15803d"
              strokeWidth={2}
              dot={{ fill: "#15803d", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="objectif"
              stroke={dark ? "#6b7280" : "#9ca3af"}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
