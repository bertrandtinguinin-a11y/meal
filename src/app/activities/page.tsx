"use client";

import { useState, useEffect } from "react";

interface Activity {
  id: string;
  nom: string;
  emoji: string;
  prevu: number;
  realise: number;
  categorie: string;
  responsable: string;
  statut: "en_cours" | "termine" | "retard" | "non_debute";
  mois_cible: number;
}

const STATUTS: Record<string, { label: string; color: string }> = {
  en_cours: { label: "En cours", color: "var(--warn)" },
  termine: { label: "Terminé", color: "var(--ok)" },
  retard: { label: "En retard", color: "var(--alert)" },
  non_debute: { label: "Non débuté", color: "var(--muet-2)" },
};

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activities")
      .then((r) => r.json())
      .then((d) => setActivities(d.activities || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getPct = (v: number, p: number) => Math.min(Math.round((v / p) * 100), 100);
  const getColor = (pct: number) =>
    pct >= 100 ? "var(--ok)" : pct >= 75 ? "var(--warn)" : "var(--alert)";

  const total = activities.length;
  const termines = activities.filter((a) => a.statut === "termine").length;
  const enRetard = activities.filter((a) => a.statut === "retard").length;

  if (loading) {
    return (
      <div style={{ textAlign: "center", paddingTop: 40, color: "var(--muet)" }}>
        Chargement...
      </div>
    );
  }

  return (
    <div>
      <div className="section-header">
        <div>
          <span className="eyebrow">Suivi terrain</span>
          <h2>Activités vs PTA</h2>
        </div>
        <span className="period-badge tnum">Juin 2026</span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 12 }}>
        {[
          { label: "Total", value: total, color: "var(--ivoire)" },
          { label: "Terminés", value: termines, color: "var(--ok)" },
          { label: "Retard", value: enRetard, color: "var(--alert)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center", padding: "10px 8px" }}>
            <div className="kpi-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9.5, color: "var(--muet)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="card" style={{ padding: "8px 13px" }}>
        <div className="chip-row">
          {Object.entries(STATUTS).map(([key, s]) => {
            const count = activities.filter((a) => a.statut === key).length;
            return (
              <span key={key} className="chip selected" style={{ fontSize: 10 }}>
                {s.label} ({count})
              </span>
            );
          })}
        </div>
      </div>

      {/* Activités */}
      {activities.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 30, color: "var(--muet)" }}>
          Aucune activité pour le moment
        </div>
      ) : (
        <div className="card" style={{ padding: "4px 13px" }}>
          {activities.map((act) => {
            const pct = getPct(act.realise, act.prevu);
            const color = getColor(pct);
            const s = STATUTS[act.statut] || STATUTS.en_cours;

            return (
              <div key={act.id} className="activity-item">
                <div className="activity-icon">{act.emoji}</div>
                <div className="activity-info">
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <b>{act.nom}</b>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 20,
                      background: s.color + "18", color: s.color,
                    }}>
                      {s.label}
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muet)", marginTop: 2 }}>
                    {act.responsable} · Cible : {act.prevu} {act.categorie.toLowerCase()}
                  </div>
                  <div className="activity-bar" style={{ marginTop: 4 }}>
                    <i style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
                <span className="activity-pct" style={{ color }}>
                  {act.realise}/{act.prevu}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="info-note">
        PTA = Plan de Travail Annuel. Les activités sont mises à jour chaque semaine par les chefs d'équipe.
      </div>
    </div>
  );
}
