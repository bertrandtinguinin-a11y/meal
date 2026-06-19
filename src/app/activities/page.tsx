"use client";

import { useState, useEffect } from "react";

interface Activity {
  id: string;
  type: string;
  titre: string;
  description: string;
  date: string;
  responsable: string;
  statut: string;
}

const STATUTS: Record<string, { label: string; color: string; icon: string }> = {
  termine: { label: "Terminé", color: "var(--ok)", icon: "✅" },
  en_cours: { label: "En cours", color: "var(--warn)", icon: "🔄" },
  planifie: { label: "Planifié", color: "var(--muet-2)", icon: "📅" },
  suspendu: { label: "Suspendu", color: "var(--alert)", icon: "⏸️" },
};

const TYPE_ICONS: Record<string, string> = {
  collecte: "📋",
  formation: "🎓",
  distribution: "📦",
  sante: "🏥",
  marecharge: "🐟",
  agro: "🌾",
};

const MOIS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/activities");
      const data = await res.json();
      setActivities(Array.isArray(data) ? data : []);
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  const supprimer = async (id: string, titre: string) => {
    if (!window.confirm(`🗑️ Supprimer l'activité "${titre}" ?`)) return;
    try {
      const res = await fetch(`/api/activities?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("❌ Erreur lors de la suppression");
    }
  };

  const total = activities.length;
  const termines = activities.filter((a) => a.statut === "termine").length;
  const enCours = activities.filter((a) => a.statut === "en_cours").length;

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
          <h2>Activités &amp; PTA</h2>
        </div>
        <span className="period-badge tnum">Juin 2026</span>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 9, marginBottom: 12 }}>
        {[
          { label: "Total", value: total, color: "var(--ivoire)" },
          { label: "Terminés", value: termines, color: "var(--ok)" },
          { label: "En cours", value: enCours, color: "var(--warn)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: "center", padding: "10px 8px" }}>
            <div className="kpi-value" style={{ fontSize: 22, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9.5, color: "var(--muet)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activités */}
      {activities.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 30, color: "var(--muet)" }}>
          Aucune activité pour le moment
        </div>
      ) : (
        activities.map((act) => {
          const s = STATUTS[act.statut] || STATUTS.planifie;
          const icon = TYPE_ICONS[act.type] || "📌";
          const mois = act.date ? MOIS[parseInt(act.date.slice(5, 7)) - 1] || "" : "";

          return (
            <div key={act.id} className="card" style={{ marginBottom: 8, padding: "10px 13px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ fontSize: 24, lineHeight: 1 }}>{icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <b style={{ fontSize: 13 }}>{act.titre}</b>
                    <span style={{
                      fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20,
                      background: s.color + "18", color: s.color,
                    }}>
                      {s.icon} {s.label}
                    </span>
                    {mois && <span className="tnum" style={{ fontSize: 10, color: "var(--muet-2)" }}>{mois}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muet)", marginTop: 3 }}>
                    {act.responsable} · {act.description}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--muet-2)", marginTop: 2 }}>
                    📅 {act.date?.slice(0, 10) || "—"}
                  </div>
                </div>
                <button
                  className="action-btn delete-btn"
                  onClick={() => supprimer(act.id, act.titre)}
                  title="Supprimer"
                  style={{
                    background: "none", border: "1px solid var(--bord)", borderRadius: 6,
                    padding: "4px 8px", cursor: "pointer", fontSize: 14, flexShrink: 0,
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })
      )}

      <style jsx>{`
        .delete-btn:hover {
          border-color: #e74c3c !important;
          background: rgba(231, 76, 60, 0.08) !important;
        }
      `}</style>
    </div>
  );
}
