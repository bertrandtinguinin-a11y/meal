"use client";

import { useEffect, useState } from "react";

interface Indicateur {
  id: string; code: string; nom: string; categorie: string;
  type_chart: string; unite: string; icone: string;
}

export default function CollectePage() {
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
  const [collecteurs, setCollecteurs] = useState<any[]>([]);
  const [collecteurId, setCollecteurId] = useState("");
  const [indicateurId, setIndicateurId] = useState("");
  const [localite, setLocalite] = useState("");
  const [donnees, setDonnees] = useState("{}");
  const [note, setNote] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    fetch("/api/indicateurs").then(r => r.json()).then(setIndicateurs);
    fetch("/api/collecteurs").then(r => r.json()).then(setCollecteurs);
  }, []);

  // Quand un indicateur est sélectionné, pré-remplir un template JSON
  useEffect(() => {
    if (!indicateurId) { setTemplate(null); return; }
    const ind = indicateurs.find(i => i.id === indicateurId);
    if (!ind) return;

    const sugg: Record<string, string | number | null> = { total: null };
    if (ind.code === "P-1" || ind.code === "P-1F" || ind.code === "G-1") {
      sugg.hommes = null; sugg.femmes = null; sugg.total = null;
    } else if (ind.code === "P-4" || ind.code === "P-5") {
      sugg.kits_distribues = null; sugg.type_semence = "";
    } else if (ind.code === "P-7") {
      sugg.nouvelles_cpn = null; sugg.total_suivies = null;
    } else if (ind.code === "P-8") {
      sugg.enfants_depistes = null; sugg.masculins = null; sugg.feminins = null;
    } else if (ind.code === "P-9") {
      sugg.seances = null; sugg.participants_h = null; sugg.participants_f = null;
    } else if (ind.code === "R-1") {
      sugg.menages_enquete = null; sugg.menages_securises = null; sugg.hfias_moyen = null;
    }
    setTemplate(sugg);
    setDonnees(JSON.stringify(sugg, null, 2));
    setJsonError("");
  }, [indicateurId, indicateurs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setJsonError("");

    // Valider JSON
    let donneesParsed;
    try {
      donneesParsed = JSON.parse(donnees);
    } catch {
      setJsonError("JSON invalide. Vérifie le format.");
      return;
    }

    if (!collecteurId || !indicateurId || !localite) {
      setJsonError("Remplis tous les champs obligatoires.");
      return;
    }

    const ind = indicateurs.find(i => i.id === indicateurId);
    const coll = collecteurs.find(c => c.id === collecteurId);

    setSubmitting(true);
    try {
      const res = await fetch("/api/collectes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collecteur_id: collecteurId,
          collecteur_nom: coll?.nom || "",
          indicateur_id: indicateurId,
          indicateur_nom: ind?.nom || "",
          indicateur_code: ind?.code || "",
          localite,
          zone: coll?.zone || "",
          donnees: donneesParsed,
          note_terrain: note,
        }),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      setSuccess(`✅ Données envoyées ! En attente de validation par le superviseur.`);
      // Reset form
      setIndicateurId(""); setDonnees("{}"); setNote(""); setTemplate(null);
    } catch {
      setJsonError("Erreur d'envoi. Vérifie ta connexion.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="collecte-page">
      {/* En-tête */}
      <div className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          📝 Nouvelle Collecte
        </h2>
        <p style={{ fontSize: 12, color: "var(--muet)", marginTop: 4 }}>
            Remplis le formulaire pour envoyer les données terrain
          </p>
        </div>

      {success && (
        <div className="card" style={{ borderLeft: "4px solid var(--feuille)", marginBottom: 12 }}>
          <p style={{ color: "var(--feuille)", fontWeight: 600 }}>{success}</p>
          <button className="btn" style={{ marginTop: 8 }} onClick={() => setSuccess("")}>
            Nouvelle collecte
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="collecte-form">
        {/* Section: Qui ? */}
        <div className="card">
          <h3 className="section-title">👤 Qui collecte ?</h3>
          <div className="form-grid">
            <label className="field">
              <span>Collecteur *</span>
              <select value={collecteurId} onChange={e => setCollecteurId(e.target.value)} required>
                <option value="">Sélectionne ton nom</option>
                {collecteurs.filter(c => c.role !== "superviseur").map(c => (
                  <option key={c.id} value={c.id}>{c.nom} — {c.zone}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Localité *</span>
              <input
                type="text" value={localite} onChange={e => setLocalite(e.target.value)}
                placeholder="Ex: NKP-01, Village Boko"
                required
              />
            </label>
          </div>
        </div>

        {/* Section: Quoi ? */}
        <div className="card">
          <h3 className="section-title">📊 Quel indicateur ?</h3>
          <label className="field">
            <span>Indicateur *</span>
            <select value={indicateurId} onChange={e => setIndicateurId(e.target.value)} required>
              <option value="">Choisis un indicateur</option>
              {indicateurs.map(i => (
                <option key={i.id} value={i.id}>
                  {i.icone} {i.code} — {i.nom} ({i.unite})
                </option>
              ))}
            </select>
          </label>

          {template && (
            <div className="field" style={{ marginTop: 12 }}>
              <span>Valeurs (JSON) *</span>
              {(() => {
                // Afficher les champs simplifiés
                const keys = Object.keys(template);
                return (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                    {keys.map(k => (
                      <label key={k} className="field-row">
                        <span style={{ fontSize: 12, fontWeight: 500, minWidth: 120 }}>{k} :</span>
                        <input
                          type={typeof template[k] === "number" ? "number" : "text"}
                          placeholder={typeof template[k] === "number" ? "0" : "..."}
                          onChange={e => {
                            const val = e.target.type === "number" ? (e.target.value ? Number(e.target.value) : null) : e.target.value;
                            const newData = { ...JSON.parse(donnees), [k]: val };
                            setDonnees(JSON.stringify(newData, null, 2));
                          }}
                          style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)" }}
                        />
                      </label>
                    ))}
                    <details style={{ marginTop: 8 }}>
                      <summary style={{ fontSize: 11, color: "var(--muet)", cursor: "pointer" }}>Éditer le JSON brut</summary>
                      <textarea
                        value={donnees}
                        onChange={e => setDonnees(e.target.value)}
                        rows={6}
                        style={{ width: "100%", marginTop: 6, padding: 8, borderRadius: 6, border: "1px solid var(--bord)", fontFamily: "monospace", fontSize: 12, background: "var(--fond)", color: "var(--texte)" }}
                      />
                    </details>
                    {jsonError && <p style={{ color: "var(--alert)", fontSize: 12 }}>{jsonError}</p>}
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Section: Note terrain */}
        <div className="card">
          <h3 className="section-title">💬 Note terrain</h3>
          <label className="field">
            <span>Commentaire (optionnel)</span>
            <textarea
              value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ex: Bonne participation, 2 absents justifiés..."
              rows={3}
            />
          </label>
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "⏳ Envoi en cours..." : "📤 Envoyer les données"}
        </button>
      </form>
    </div>
  );
}
