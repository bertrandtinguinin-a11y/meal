"use client";

import { useEffect, useState } from "react";

interface Indicateur { id: string; code: string; nom: string; categorie: string; type_chart: string; unite: string; icone: string; objectif: number; baseline: number; }

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

  // États pour créer rapidement des données de base
  const [showNewInd, setShowNewInd] = useState(false);
  const [showNewColl, setShowNewColl] = useState(false);
  const [newIndCode, setNewIndCode] = useState("");
  const [newIndNom, setNewIndNom] = useState("");
  const [newIndUnite, setNewIndUnite] = useState("");
  const [newIndObj, setNewIndObj] = useState("100");
  const [newCollNom, setNewCollNom] = useState("");
  const [newCollZone, setNewCollZone] = useState("");

  const load = () => {
    fetch("/api/indicateurs").then(r => r.json()).then(setIndicateurs);
    fetch("/api/collecteurs").then(r => r.json()).then(setCollecteurs);
  };

  useEffect(load, []);

  const selectedInd = indicateurs.find(i => i.id === indicateurId);

  // Générer template JSON selon l'indicateur sélectionné
  const getTemplate = (ind: Indicateur): Record<string, any> => {
    const tpl: Record<string, any> = { total: null };
    const code = ind.code?.toLowerCase() || "";
    if (code.includes("femme") || code.includes("genre") || code.includes("f-")) {
      tpl.hommes = null; tpl.femmes = null; tpl.total = null;
    } else if (code.includes("kit") || code.includes("distrib")) {
      tpl.quantite = null; tpl.type = "";
    } else if (code.includes("cpn") || code.includes("sante")) {
      tpl.nouvelles = null; tpl.total_suivies = null;
    } else if (code.includes("seance") || code.includes("iec") || code.includes("formation")) {
      tpl.seances = null; tpl.participants_h = null; tpl.participants_f = null;
    } else if (code.includes("menage") || code.includes("securite")) {
      tpl.menages_enquete = null; tpl.securises = null;
    }
    return tpl;
  };

  useEffect(() => {
    if (!indicateurId || !selectedInd) { setDonnees("{}"); return; }
    setDonnees(JSON.stringify(getTemplate(selectedInd), null, 2));
  }, [indicateurId]);

  const validerJson = (v: string) => {
    setDonnees(v);
    try { JSON.parse(v); setJsonError(""); }
    catch { setJsonError("JSON invalide — vérifie la syntaxe"); }
  };

  const soumettre = async () => {
    if (!collecteurId || !indicateurId || !localite) return;

    let parsed;
    try { parsed = JSON.parse(donnees); }
    catch { setJsonError("JSON invalide"); return; }

    const collecteur = collecteurs.find(c => c.id === collecteurId);
    setSubmitting(true);
    try {
      await fetch("/api/collectes", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collecteur_id: collecteurId, collecteur_nom: collecteur?.nom || "",
          indicateur_id: indicateurId, indicateur_nom: selectedInd?.nom || "",
          indicateur_code: selectedInd?.code || "",
          localite, donnees: parsed, note_terrain: note,
        }),
      });
      setSuccess("✅ Collecte envoyée !");
      setCollecteurId(""); setIndicateurId(""); setLocalite(""); setDonnees("{}"); setNote("");
      setTimeout(() => setSuccess(""), 3000);
    } catch { setJsonError("Erreur réseau"); }
    setSubmitting(false);
  };

  // Création rapide indicateur
  const createIndicateur = async () => {
    await fetch("/api/indicateurs", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newIndCode, nom: newIndNom, unite: newIndUnite, objectif: Number(newIndObj), icone: "📊" }) });
    setShowNewInd(false); setNewIndCode(""); setNewIndNom(""); setNewIndUnite(""); setNewIndObj("100");
    load();
  };

  const createCollecteur = async () => {
    await fetch("/api/collecteurs", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom: newCollNom, zone: newCollZone }) });
    setShowNewColl(false); setNewCollNom(""); setNewCollZone("");
    load();
  };

  return (
    <div className="collecte-page">
      <div className="card" style={{ marginBottom: 10 }}>
        <h2 style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 6 }}>📝 Nouvelle collecte terrain</h2>
        <p style={{ fontSize: 12, color: "var(--muet)", marginTop: 2 }}>Soumets une donnée depuis le terrain</p>
      </div>

      {success && (
        <div className="card" style={{ marginBottom: 8, borderColor: "#16a34a", textAlign: "center", background: "rgba(22,163,74,0.08)" }}>
          <span style={{ color: "#16a34a", fontWeight: 600 }}>{success}</span>
        </div>
      )}

      {/* Créer rapidement un collecteur si vide */}
      {collecteurs.length === 0 && !showNewColl && (
        <div className="card" style={{ marginBottom: 8, borderStyle: "dashed", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--muet)" }}>
            👤 Aucun collecteur enregistré
          </p>
          <button onClick={() => setShowNewColl(true)} className="btn btn-sm btn-primary" style={{ marginTop: 6 }}>
            + Ajouter un collecteur
          </button>
        </div>
      )}
      {showNewColl && (
        <div className="card" style={{ marginBottom: 8, borderColor: "var(--mil)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>👤 Nouveau collecteur</p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <input value={newCollNom} onChange={e => setNewCollNom(e.target.value)} placeholder="Nom complet" style={{ flex: 2, minWidth: 120, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }} />
            <input value={newCollZone} onChange={e => setNewCollZone(e.target.value)} placeholder="Zone (ex: Zone A)" style={{ flex: 1, minWidth: 100, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }} />
            <button onClick={createCollecteur} className="btn btn-sm btn-primary" disabled={!newCollNom}>✅ Créer</button>
            <button onClick={() => setShowNewColl(false)} className="btn btn-sm">Annuler</button>
          </div>
        </div>
      )}

      {/* Créer rapidement un indicateur si vide */}
      {indicateurs.length === 0 && !showNewInd && (
        <div className="card" style={{ marginBottom: 8, borderStyle: "dashed", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "var(--muet)" }}>
            📊 Aucun indicateur défini
          </p>
          <button onClick={() => setShowNewInd(true)} className="btn btn-sm btn-primary" style={{ marginTop: 6 }}>
            + Créer un indicateur
          </button>
        </div>
      )}
      {showNewInd && (
        <div className="card" style={{ marginBottom: 8, borderColor: "var(--mil)" }}>
          <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>📊 Nouvel indicateur</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={newIndCode} onChange={e => setNewIndCode(e.target.value)} placeholder="Code (ex: P-1)" style={{ width: 80, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }} />
              <input value={newIndNom} onChange={e => setNewIndNom(e.target.value)} placeholder="Nom de l'indicateur" style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input value={newIndUnite} onChange={e => setNewIndUnite(e.target.value)} placeholder="Unité (ex: nombre, %)" style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }} />
              <input value={newIndObj} onChange={e => setNewIndObj(e.target.value)} placeholder="Objectif" type="number" style={{ width: 100, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }} />
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={createIndicateur} className="btn btn-sm btn-primary" disabled={!newIndCode || !newIndNom}>✅ Créer</button>
              <button onClick={() => setShowNewInd(false)} className="btn btn-sm">Annuler</button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire principal */}
      <div className="card">
        <div className="collecte-form">
          <div className="form-grid">
            <div className="field">
              <span>👤 Collecteur</span>
              <select value={collecteurId} onChange={e => setCollecteurId(e.target.value)}>
                <option value="">— Choisir —</option>
                {collecteurs.map(c => (
                  <option key={c.id} value={c.id}>{c.nom} {c.zone ? `(${c.zone})` : ""}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <span>📍 Localité</span>
              <input value={localite} onChange={e => setLocalite(e.target.value)} placeholder="Ex: NKP-01" />
            </div>
          </div>
          <div className="field">
            <span>📊 Indicateur</span>
            <select value={indicateurId} onChange={e => setIndicateurId(e.target.value)}>
              <option value="">— Choisir —</option>
              {indicateurs.map(i => (
                <option key={i.id} value={i.id}>{i.icone} {i.code} — {i.nom} ({i.unite})</option>
              ))}
            </select>
          </div>
          <div className="field">
            <span>📋 Données (JSON)</span>
            <textarea value={donnees} onChange={e => validerJson(e.target.value)} rows={4} style={{ fontFamily: "monospace", fontSize: 12 }} />
            {jsonError && <span style={{ fontSize: 11, color: "#dc2626" }}>{jsonError}</span>}
            {selectedInd && !jsonError && <span style={{ fontSize: 11, color: "var(--muet)" }}>Template auto pour {selectedInd.nom}</span>}
          </div>
          <div className="field">
            <span>📝 Note terrain (optionnelle)</span>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Observation..."
              style={{ resize: "none" }} />
          </div>
          <button onClick={soumettre} className="btn btn-primary" disabled={submitting || !collecteurId || !indicateurId || !localite || !!jsonError} style={{ marginTop: 4 }}>
            {submitting ? "⏳ Envoi..." : "📤 Envoyer la collecte"}
          </button>
        </div>
      </div>
    </div>
  );
}
