"use client";

import { useEffect, useState } from "react";

interface Collecte {
  id: string; collecteur_nom: string; indicateur_nom: string; indicateur_code: string;
  localite: string; zone: string; date_collecte: string; statut: string;
  donnees: Record<string, any>; note_terrain: string; created_at: string;
}

interface Correction {
  id: string; collecte_id: string; message: string; champs_corriges: string[];
  faite_par: string; repondu: boolean; created_at: string;
}

export default function ValidationPage() {
  const [collectes, setCollectes] = useState<Collecte[]>([]);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState("en_attente");
  const [feedbackText, setFeedbackText] = useState("");
  const [activeCollecte, setActiveCollecte] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, corrRes] = await Promise.all([
        fetch("/api/collectes"),
        fetch("/api/validation"),
      ]);
      setCollectes(await cRes.json());
      setCorrections(await corrRes.json());
    } catch (e) {
      console.error("Erreur chargement", e);
    }
    setLoading(false);
  };

  const getCol = (id: string) => collectes.find(c => c.id === id);

  const handleValider = async (id: string) => {
    setActionMsg("");
    try {
      const res = await fetch("/api/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "valider", collecte_id: id, faite_par: "Superviseur" }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`✅ Collecte validée — indicateur mis à jour`);
        setActiveCollecte(null);
        loadData();
      }
    } catch {
      setActionMsg("Erreur lors de la validation");
    }
  };

  const handleRejeter = async (id: string) => {
    if (!feedbackText.trim()) {
      setActionMsg("⚠️ Écris un message de correction pour le collecteur");
      return;
    }
    try {
      const collecte = getCol(id);
      const res = await fetch("/api/validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "rejeter", collecte_id: id,
          message: feedbackText,
          champs_corriges: Object.keys(collecte?.donnees || {}),
          faite_par: "Superviseur",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`🔴 Collecte rejetée — feedback envoyé au terrain`);
        setFeedbackText("");
        setActiveCollecte(null);
        loadData();
      }
    } catch {
      setActionMsg("Erreur lors du rejet");
    }
  };

  const filtered = collectes.filter(c => {
    if (filtre === "tout") return true;
    return c.statut === filtre;
  });

  const stats = {
    en_attente: collectes.filter(c => c.statut === "en_attente").length,
    valide: collectes.filter(c => c.statut === "valide").length,
    rejete: collectes.filter(c => c.statut === "rejete").length,
    corrige: collectes.filter(c => c.statut === "corrige").length,
  };

  return (
    <div className="validation-page">
      {/* En-tête */}
      <div className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          ✅ Validation des Collectes
        </h2>
        <p style={{ fontSize: 12, color: "var(--muet)", marginTop: 4 }}>
          Approuve ou corrige les données envoyées par le terrain
        </p>
      </div>

      {actionMsg && (
        <div className="card" style={{ borderLeft: "4px solid var(--eau)", marginBottom: 12, padding: 10 }}>
          <p style={{ fontSize: 13 }}>{actionMsg}</p>
        </div>
      )}

      {/* Stats */}
      <div className="validation-stats">
        <div className="stat-box" onClick={() => setFiltre("en_attente")} style={{ borderLeft: "4px solid var(--mil)", cursor: "pointer" }}>
          <span className="stat-num">{stats.en_attente}</span>
          <span className="stat-label">En attente</span>
        </div>
        <div className="stat-box" onClick={() => setFiltre("valide")} style={{ borderLeft: "4px solid var(--feuille)", cursor: "pointer" }}>
          <span className="stat-num">{stats.valide}</span>
          <span className="stat-label">Validées</span>
        </div>
        <div className="stat-box" onClick={() => setFiltre("rejete")} style={{ borderLeft: "4px solid var(--alert)", cursor: "pointer" }}>
          <span className="stat-num">{stats.rejete}</span>
          <span className="stat-label">Rejetées</span>
        </div>
        <div className="stat-box" onClick={() => setFiltre("corrige")} style={{ borderLeft: "4px solid var(--eau)", cursor: "pointer" }}>
          <span className="stat-num">{stats.corrige}</span>
          <span className="stat-label">Corrigées</span>
        </div>
      </div>

      {/* Filtres */}
      <div className="filter-tabs" style={{ display: "flex", gap: 6, margin: "12px 0", flexWrap: "wrap" }}>
        {["en_attente", "valide", "rejete", "corrige", "tout"].map(f => (
          <button key={f} onClick={() => setFiltre(f)}
            className={`btn btn-sm ${filtre === f ? "btn-active" : ""}`}>
            {f === "en_attente" && "🟡 "}{f === "valide" && "✅ "}{f === "rejete" && "🔴 "}
            {f === "corrige" && "🔄 "}{f === "tout" && "📋 "}
            {f.charAt(0).toUpperCase() + f.slice(1).replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Liste des collectes */}
      {loading ? (
        <p style={{ textAlign: "center", color: "var(--muet)", padding: 40 }}>Chargement...</p>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 32 }}>📭</p>
          <p style={{ color: "var(--muet)", marginTop: 8 }}>Aucune collecte dans cet état</p>
        </div>
      ) : (
        <div className="collecte-list">
          {filtered.map(c => (
            <div key={c.id} className={`card collecte-item ${c.statut}`}
              onClick={() => setActiveCollecte(activeCollecte === c.id ? null : c.id)}>
              <div className="collecte-header">
                <div className="collecte-meta">
                  <span className={`status-badge ${c.statut}`}>
                    {c.statut === "en_attente" && "🟡 En attente"}
                    {c.statut === "valide" && "✅ Validée"}
                    {c.statut === "rejete" && "🔴 Rejetée"}
                    {c.statut === "corrige" && "🔄 Corrigée"}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muet)" }}>
                    {c.date_collecte}
                  </span>
                </div>
                <h3 style={{ fontSize: 15, marginTop: 4 }}>
                  {c.indicateur_code} — {c.indicateur_nom}
                </h3>
                <div style={{ fontSize: 12, color: "var(--muet-2)", display: "flex", gap: 12, marginTop: 2 }}>
                  <span>👤 {c.collecteur_nom}</span>
                  <span>📍 {c.localite} ({c.zone})</span>
                </div>
              </div>

              {/* Détail déroulant */}
              {activeCollecte === c.id && (
                <div className="collecte-detail" style={{ marginTop: 12, borderTop: "1px solid var(--bord)", paddingTop: 12 }}>
                  <h4 style={{ fontSize: 13, marginBottom: 6 }}>📦 Données soumises :</h4>
                  <div className="donnees-grid">
                    {Object.entries(c.donnees).map(([k, v]) => (
                      <div key={k} className="donnee-chip">
                        <span className="donnee-key">{k}</span>
                        <span className="donnee-val">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                  {c.note_terrain && (
                    <p style={{ fontSize: 12, marginTop: 8, color: "var(--muet-2)", fontStyle: "italic" }}>
                      💬 {c.note_terrain}
                    </p>
                  )}

                  {/* Feedback / Corrections */}
                  {corrections.filter(crr => crr.collecte_id === c.id).map(crr => (
                    <div key={crr.id} className="correction-item" style={{
                      marginTop: 8, padding: 8, borderRadius: 6,
                      background: crr.repondu ? "rgba(111,168,107,0.08)" : "rgba(203,161,78,0.08)",
                      borderLeft: `3px solid ${crr.repondu ? "var(--feuille)" : "var(--mil)"}`,
                    }}>
                      <p style={{ fontSize: 12, fontWeight: 600 }}>📝 Correction demandée par {crr.faite_par}</p>
                      <p style={{ fontSize: 12, marginTop: 2 }}>{crr.message}</p>
                      {crr.champs_corriges.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                          {crr.champs_corriges.map((ch: string) => (
                            <span key={ch} className="donnee-chip" style={{ background: "rgba(203,161,78,0.15)", padding: "2px 8px", borderRadius: 10, fontSize: 11 }}>
                              🔧 {ch}
                            </span>
                          ))}
                        </div>
                      )}
                      <span style={{ fontSize: 11, color: "var(--muet)", marginTop: 4, display: "block" }}>
                        {crr.repondu ? "✅ Lu et traité" : "⏳ En attente de réponse"}
                      </span>
                    </div>
                  ))}

                  {/* Actions */}
                  {c.statut === "en_attente" && (
                    <div className="validation-actions" style={{ marginTop: 12 }}>
                      <button className="btn btn-success" onClick={(e) => { e.stopPropagation(); handleValider(c.id); }}>
                        ✅ Approuver
                      </button>
                      <button className="btn btn-danger" onClick={(e) => { e.stopPropagation(); setFeedbackText(""); setActiveCollecte(c.id + "-feedback"); }}>
                        🔴 Demander correction
                      </button>
                    </div>
                  )}

                  {activeCollecte === c.id + "-feedback" && (
                    <div style={{ marginTop: 8 }}>
                      <textarea
                        value={feedbackText}
                        onChange={e => setFeedbackText(e.target.value)}
                        placeholder="Explique ce qui doit être corrigé..."
                        rows={3}
                        style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid var(--bord)", fontSize: 12, background: "var(--fond)", color: "var(--texte)" }}
                      />
                      <button className="btn btn-danger" style={{ marginTop: 6 }} onClick={() => { setActiveCollecte(c.id); handleRejeter(c.id); }}>
                        🔴 Envoyer la correction
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
