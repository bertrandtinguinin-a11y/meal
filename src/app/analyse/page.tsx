"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ─────────────────────────────────────────────────────
interface Indicateur {
  id: string; code: string; nom: string; categorie: string;
  type_chart: string; unite: string; objectif: number; baseline: number;
  icone: string;
  historique?: any[]; valeur_courante?: number;
  desagregation?: string[];
}

interface VueConfig {
  indicateur_id: string; type_chart: string; taille: string; periode: number;
}

interface Vue {
  id: string; nom: string; description: string; est_defaut: boolean;
  config: VueConfig[]; created_at: string;
}

const TYPE_CHARTS = [
  { id: "barre", label: "📊 Barres", desc: "Comparaison verticale" },
  { id: "ligne", label: "📈 Ligne", desc: "Évolution dans le temps" },
  { id: "jauge", label: "🎯 Jauge", desc: "% vs objectif" },
  { id: "tableau", label: "📋 Tableau", desc: "Valeurs brutes" },
  { id: "camembert", label: "🥧 Camembert", desc: "Répartition" },
  { id: "carte", label: "🗺️ Carte", desc: "Par localité" },
];

// ─── Composants de rendu ───────────────────────────────────────

function BarreChart({ ind, periode }: { ind: Indicateur; periode: number }) {
  const h = (ind.historique || []).slice(-periode);
  if (h.length === 0) {
    return <div><div className="chart-header"><span>{ind.icone} <b>{ind.nom}</b></span></div><p style={{ fontSize: 11, color: "var(--muet)", textAlign: "center", padding: 12 }}>En attente de données...</p></div>;
  }
  const max = Math.max(...h.map((d: any) => Math.max(d.valeur || 0, d.objectif || 1)), 1);

  return (
    <div>
      <div className="chart-header">
        <span>{ind.icone} <b>{ind.nom}</b></span>
        <span style={{ color: "var(--muet)", fontSize: 11 }}>
          {ind.valeur_courante} / {ind.objectif} {ind.unite}
        </span>
      </div>
      <div className="bar-chart">
        {h.map((d: any, i: number) => {
          const pct = (d.valeur / max) * 100;
          const objPct = (d.objectif / max) * 100;
          return (
            <div key={i} className="bar-item">
              <span className="bar-label">{d.mois}</span>
              <div className="bar-track">
                <div className="bar-fill" style={{ height: `${pct}%`, background: pct >= 80 ? "var(--feuille)" : pct >= 50 ? "var(--mil)" : "var(--alert)" }} />
                {d.objectif > 0 && <div className="bar-target" style={{ height: `${objPct}%` }} />}
              </div>
              <span className="bar-value">{d.valeur}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LigneChart({ ind, periode }: { ind: Indicateur; periode: number }) {
  const h = (ind.historique || []).slice(-periode);
  if (h.length === 0) {
    return <div><div className="chart-header"><span>{ind.icone} <b>{ind.nom}</b></span></div><p style={{ fontSize: 11, color: "var(--muet)", textAlign: "center", padding: 12 }}>En attente de données...</p></div>;
  }
  const max = Math.max(...h.map((d: any) => Math.max(d.valeur || 0, d.objectif || 1)), 1) * 1.2;
  const w = 280; const stepX = w / (h.length - 1 || 1);

  const points = h.map((d: any, i: number) => ({
    x: i * stepX, y: 80 - ((d.valeur || 0) / max) * 70,
  }));
  const objY = 80 - ((h[0]?.objectif || 1) / max) * 70;

  return (
    <div>
      <div className="chart-header">
        <span>{ind.icone} <b>{ind.nom}</b></span>
        <span style={{ color: "var(--muet)", fontSize: 11 }}>
          {ind.valeur_courante} {ind.unite}
        </span>
      </div>
      <svg viewBox={`0 0 ${w} 90`} style={{ width: "100%", maxHeight: 90 }}>
        {/* Ligne objectif */}
        <line x1={0} y1={objY} x2={w} y2={objY} stroke="var(--mil)" strokeWidth={1} strokeDasharray="4,3" opacity={0.6} />
        {/* Courbe */}
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(" ")}
          fill="none" stroke="var(--feuille)" strokeWidth={2} strokeLinecap="round"
        />
        {/* Points */}
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.5} fill="var(--feuille)" stroke="var(--fond)" strokeWidth={1.5} />
        ))}
        {/* Labels mois */}
        {h.map((d: any, i: number) => (
          <text key={i} x={i * stepX} y={86} textAnchor="middle" fontSize={8} fill="var(--muet)">{d.mois}</text>
        ))}
      </svg>
    </div>
  );
}

function JaugeChart({ ind }: { ind: Indicateur }) {
  const val = ind.valeur_courante || 0;
  const pct = ind.objectif > 0 ? Math.min((val / ind.objectif) * 100, 100) : 0;
  const color = pct >= 80 ? "var(--feuille)" : pct >= 50 ? "var(--mil)" : "var(--alert)";

  return (
    <div>
      <div className="chart-header">
        <span>{ind.icone} <b>{ind.nom}</b></span>
        <span style={{ color, fontWeight: 700 }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div className="jauge-track">
        <div className="jauge-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muet)", marginTop: 2 }}>
            <span>{ind.baseline || 0} (base)</span>
            <span>{ind.objectif || 0} (cible)</span>
          </div>
    </div>
  );
}

function TableauIndicateur({ ind }: { ind: Indicateur }) {
  const val = ind.valeur_courante || 0;
  const pct = ind.objectif > 0 ? Math.round((val / ind.objectif) * 100) : 0;
  const color = pct >= 80 ? "var(--feuille)" : pct >= 50 ? "var(--mil)" : "var(--alert)";

  return (
    <table className="indicateur-table">
      <tbody>
        <tr><td className="t-label">Code</td><td className="t-code">{ind.code}</td></tr>
        <tr><td className="t-label">Indicateur</td><td><b>{ind.nom}</b></td></tr>
        <tr><td className="t-label">Catégorie</td><td>{ind.categorie}</td></tr>
        <tr><td className="t-label">Baseline</td><td>{ind.baseline || 0} {ind.unite}</td></tr>
        <tr><td className="t-label">Actuel</td><td style={{ color, fontWeight: 700 }}>{val} {ind.unite}</td></tr>
        <tr><td className="t-label">Objectif</td><td>{ind.objectif} {ind.unite}</td></tr>
        <tr><td className="t-label">Réalisé</td><td><span className="jauge-track" style={{ display: "inline-block", width: 80, verticalAlign: "middle", marginRight: 6 }}>
          <span className="jauge-fill" style={{ width: `${pct}%`, background: color }} />
        </span> {pct}%</td></tr>
      </tbody>
    </table>
  );
}

function CamembertChart({ ind }: { ind: Indicateur }) {
  const val = ind.valeur_courante || 0;
  const pct = ind.objectif > 0 ? Math.min((val / ind.objectif) * 100, 100) : 0;
  const reste = 100 - pct;
  const r = 35; const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div>
      <div className="chart-header">
        <span>{ind.icone} <b>{ind.nom}</b></span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 4 }}>
        <svg width={80} height={80} viewBox="0 0 80 80">
          <circle cx={40} cy={40} r={r} fill="none" stroke="var(--bord)" strokeWidth={8} />
          <circle cx={40} cy={40} r={r} fill="none" stroke={pct >= 80 ? "var(--feuille)" : pct >= 50 ? "var(--mil)" : "var(--alert)"}
            strokeWidth={8} strokeDasharray={circ} strokeDashoffset={offset}
            transform="rotate(-90 40 40)" strokeLinecap="round" />
          <text x={40} y={40} textAnchor="middle" dy={4} fontSize={14} fontWeight={700} fill="var(--texte)">
            {Math.round(pct)}%
          </text>
        </svg>
        <div>
          <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: pct >= 80 ? "var(--feuille)" : pct >= 50 ? "var(--mil)" : "var(--alert)", display: "inline-block" }} />
            Atteint : {val} {ind.unite}
          </div>
          <div style={{ fontSize: 12, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--bord)", display: "inline-block" }} />
            Restant : {((ind.objectif || 0) - val).toFixed(1)} {ind.unite}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ────────────────────────────────────────────

export default function AnalysePage() {
  const [indicateurs, setIndicateurs] = useState<Indicateur[]>([]);
  const [vues, setVues] = useState<Vue[]>([]);
  const [activeVue, setActiveVue] = useState<string>("");
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingVue, setEditingVue] = useState<Vue | null>(null);
  const [editConfig, setEditConfig] = useState<VueConfig[]>([]);
  const [newVueName, setNewVueName] = useState("");
  const [newVueDesc, setNewVueDesc] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/indicateurs").then(r => r.json()),
      fetch("/api/vues").then(r => r.json()),
    ]).then(([inds, v]) => {
      setIndicateurs(inds);
      setVues(v);
      const def = v.find((vv: Vue) => vv.est_defaut);
      if (def) setActiveVue(def.id);
      else if (v.length > 0) setActiveVue(v[0].id);
    });
  }, []);

  const activeVueData = vues.find(v => v.id === activeVue);

  const getInd = useCallback((id: string) => indicateurs.find(i => i.id === id), [indicateurs]);

  const renderBlock = (cfg: VueConfig) => {
    const ind = getInd(cfg.indicateur_id);
    if (!ind) return null;

    const ChartComponent = cfg.type_chart === "barre" ? BarreChart :
      cfg.type_chart === "ligne" ? LigneChart :
      cfg.type_chart === "jauge" ? JaugeChart :
      cfg.type_chart === "tableau" ? TableauIndicateur :
      cfg.type_chart === "camembert" ? CamembertChart : BarreChart;

    return (
      <div key={cfg.indicateur_id + cfg.type_chart} className={`card chart-block ${cfg.taille === "demi" ? "chart-demi" : "chart-pleine"}`}>
        <ChartComponent ind={ind} periode={cfg.periode || 6} />
      </div>
    );
  };

  const renderTable = (cfg: VueConfig) => {
    const ind = getInd(cfg.indicateur_id);
    if (!ind) return null;
    return (
      <div key={cfg.indicateur_id + "-table"} className="card" style={{ overflow: "auto" }}>
        <div className="chart-header">
          <span>{ind.icone} <b>{ind.nom}</b></span>
        </div>
        <TableauIndicateur ind={ind} />
      </div>
    );
  };

  // Builder: add/remove blocks
  const addBlock = () => {
    setEditConfig([...editConfig, { indicateur_id: indicateurs[0]?.id || "", type_chart: "barre", taille: "pleine", periode: 6 }]);
  };

  const updateBlock = (index: number, field: keyof VueConfig, value: string | number) => {
    const newCfg = [...editConfig];
    (newCfg[index] as any)[field] = value;
    setEditConfig(newCfg);
  };

  const removeBlock = (index: number) => {
    setEditConfig(editConfig.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editConfig.length) return;
    const newCfg = [...editConfig];
    [newCfg[index], newCfg[newIndex]] = [newCfg[newIndex], newCfg[index]];
    setEditConfig(newCfg);
  };

  const saveVue = async () => {
    if (!newVueName.trim()) return;
    const newVue = {
      nom: newVueName, description: newVueDesc, config: editConfig,
      est_defaut: vues.length === 0,
    };
    const res = await fetch("/api/vues", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newVue),
    });
    const saved = await res.json();
    setVues([...vues, saved]);
    setActiveVue(saved.id);
    setShowBuilder(false);
    setNewVueName(""); setNewVueDesc(""); setEditConfig([]);
  };

  const startEdit = (vue: Vue) => {
    setEditingVue(vue);
    setEditConfig(vue.config);
    setNewVueName(vue.nom);
    setNewVueDesc(vue.description);
    setShowBuilder(true);
  };

  return (
    <div className="analyse-page">
      {/* En-tête */}
      <div className="card" style={{ marginBottom: 12 }}>
        <h2 style={{ fontSize: 18, display: "flex", alignItems: "center", gap: 8 }}>
          🎨 Analyse personnalisée
        </h2>
        <p style={{ fontSize: 12, color: "var(--muet)", marginTop: 4 }}>
          Choisis comment présenter tes tableaux et graphiques
        </p>
      </div>

      {/* Sélecteur de vues */}
      <div className="vue-selector" style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {vues.map(v => (
          <button key={v.id} onClick={() => setActiveVue(v.id)}
            className={`btn btn-sm ${activeVue === v.id ? "btn-active" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {v.est_defaut && "⭐"} {v.nom}
            <span style={{ fontSize: 10, opacity: 0.6, cursor: "pointer" }} onClick={(e) => { e.stopPropagation(); startEdit(v); }}>
              ✏️
            </span>
          </button>
        ))}
        <button onClick={() => { setEditingVue(null); setEditConfig([]); setNewVueName(""); setNewVueDesc(""); setShowBuilder(true); }}
          className="btn btn-sm btn-add">
          + Nouvelle vue
        </button>
      </div>

      {/* Builder (créer/éditer une vue) */}
      {showBuilder && (
        <div className="card" style={{ marginBottom: 12, border: "2px solid var(--mil)" }}>
          <h3 style={{ fontSize: 15, marginBottom: 8 }}>
            {editingVue ? `✏️ Modifier : ${editingVue.nom}` : "🆕 Créer une nouvelle vue"}
          </h3>

          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input type="text" value={newVueName} onChange={e => setNewVueName(e.target.value)}
              placeholder="Nom de la vue (ex: Dashboard Genre)"
              style={{ flex: 1, minWidth: 180, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }}
            />
            <input type="text" value={newVueDesc} onChange={e => setNewVueDesc(e.target.value)}
              placeholder="Description (optionnelle)"
              style={{ flex: 1, minWidth: 180, padding: "6px 10px", borderRadius: 6, border: "1px solid var(--bord)", background: "var(--fond)", color: "var(--texte)", fontSize: 13 }}
            />
          </div>

          <p style={{ fontSize: 12, color: "var(--muet)", marginBottom: 8 }}>
            Ajoute des blocs (indicateur + type de graphique) à ta vue :
          </p>

          {indicateurs.length === 0 && (
            <div style={{ padding: 12, textAlign: "center", background: "rgba(111,168,107,0.06)", borderRadius: 6, marginBottom: 8 }}>
              <p style={{ fontSize: 13, color: "var(--muet)" }}>📊 Aucun indicateur pour l&apos;instant</p>
              <p style={{ fontSize: 11, color: "var(--muet)", marginTop: 4 }}>Crée d&apos;abord des indicateurs depuis la page Collecte, puis reviens construire ta vue.</p>
              <a href="/collecte" className="btn btn-sm btn-primary" style={{ marginTop: 8 }}>➡️ Aller à Collecte</a>
            </div>
          )}

          {editConfig.map((cfg, i) => {
            const ind = getInd(cfg.indicateur_id);
            return (
              <div key={i} className="builder-block" style={{
                display: "flex", gap: 6, alignItems: "center", marginBottom: 6,
                padding: 8, borderRadius: 6, background: "rgba(111,168,107,0.06)", flexWrap: "wrap",
              }}>
                <button onClick={() => moveBlock(i, "up")} className="btn-icon" title="Monter">⬆️</button>
                <button onClick={() => moveBlock(i, "down")} className="btn-icon" title="Descendre">⬇️</button>

                <select value={cfg.indicateur_id} onChange={e => updateBlock(i, "indicateur_id", e.target.value)}
                  style={{ flex: 2, minWidth: 140, padding: 4, borderRadius: 4, fontSize: 12, background: "var(--fond)", color: "var(--texte)", border: "1px solid var(--bord)" }}>
                  {indicateurs.map(ind => (
                    <option key={ind.id} value={ind.id}>{ind.icone} {ind.code} — {ind.nom}</option>
                  ))}
                </select>

                <select value={cfg.type_chart} onChange={e => updateBlock(i, "type_chart", e.target.value)}
                  style={{ flex: 1, minWidth: 100, padding: 4, borderRadius: 4, fontSize: 12, background: "var(--fond)", color: "var(--texte)", border: "1px solid var(--bord)" }}>
                  {TYPE_CHARTS.map(tc => (
                    <option key={tc.id} value={tc.id}>{tc.label}</option>
                  ))}
                </select>

                <select value={cfg.taille} onChange={e => updateBlock(i, "taille", e.target.value)}
                  style={{ width: 80, padding: 4, borderRadius: 4, fontSize: 12, background: "var(--fond)", color: "var(--texte)", border: "1px solid var(--bord)" }}>
                  <option value="pleine">Pleine</option>
                  <option value="demi">Demi</option>
                </select>

                <input type="number" value={cfg.periode} onChange={e => updateBlock(i, "periode", parseInt(e.target.value) || 6)}
                  min={1} max={24} style={{ width: 50, padding: 4, borderRadius: 4, fontSize: 12, background: "var(--fond)", color: "var(--texte)", border: "1px solid var(--bord)" }}
                  title="Mois"
                />

                <button onClick={() => removeBlock(i)} className="btn-icon" title="Supprimer" style={{ color: "var(--alert)" }}>🗑️</button>

                {/* Preview en miniature */}
                <span style={{ fontSize: 10, color: "var(--muet)", width: "100%", marginTop: 2 }}>
                  {ind?.icone} {ind?.nom} → <b>{TYPE_CHARTS.find(t => t.id === cfg.type_chart)?.label}</b> · {cfg.taille} · {cfg.periode} mois
                </span>
              </div>
            );
          })}

          <button onClick={addBlock} className="btn btn-sm btn-add" style={{ marginTop: 4 }}>
            + Ajouter un bloc
          </button>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button onClick={saveVue} className="btn btn-primary" disabled={!newVueName.trim() || editConfig.length === 0}>
              💾 Enregistrer la vue
            </button>
            <button onClick={() => setShowBuilder(false)} className="btn">Annuler</button>
          </div>
        </div>
      )}

      {/* Rendu de la vue active */}
      {activeVueData ? (
        <div className="analyse-canvas">
          {activeVueData.description && (
            <p style={{ fontSize: 12, color: "var(--muet)", marginBottom: 8 }}>
              {activeVueData.description}
            </p>
          )}

          {/* Disposition en grille */}
          <div className="charts-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 8,
          }}>
            {activeVueData.config.map((cfg) => {
              const ind = getInd(cfg.indicateur_id);
              if (!ind) return null;

              const renderBlockFn = () => {
                switch (cfg.type_chart) {
                  case "barre": return <BarreChart ind={ind} periode={cfg.periode || 6} />;
                  case "ligne": return <LigneChart ind={ind} periode={cfg.periode || 6} />;
                  case "jauge": return <JaugeChart ind={ind} />;
                  case "tableau": return <TableauIndicateur ind={ind} />;
                  case "camembert": return <CamembertChart ind={ind} />;
                  default: return <BarreChart ind={ind} periode={cfg.periode || 6} />;
                }
              };

              return (
                <div key={cfg.indicateur_id + cfg.type_chart + cfg.taille}
                  className={`card ${cfg.taille === "demi" ? "" : ""}`}
                  style={cfg.taille === "demi" ? { gridColumn: "span 1" } : {}}>
                  {renderBlockFn()}
                </div>
              );
            })}
          </div>

          {/* Vue Tableau récapitulatif automatique */}
          <div className="card" style={{ marginTop: 12 }}>
            <h3 style={{ fontSize: 14, marginBottom: 8 }}>📋 Tableau récapitulatif</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="recap-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Indicateur</th>
                    <th>Catégorie</th>
                    <th>Baseline</th>
                    <th>Actuel</th>
                    <th>Cible</th>
                    <th>Réalisé</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {activeVueData.config.map(cfg => {
                    const ind = getInd(cfg.indicateur_id);
                    if (!ind) return null;
                    const pct = ind.objectif > 0 ? Math.round(((ind.valeur_courante || 0) / ind.objectif) * 100) : 0;
                    const color = pct >= 80 ? "var(--feuille)" : pct >= 50 ? "var(--mil)" : "var(--alert)";
                    return (
                      <tr key={cfg.indicateur_id}>
                        <td className="t-code">{ind.code}</td>
                        <td>{ind.nom}</td>
                        <td style={{ fontSize: 11 }}>{ind.categorie}</td>
                        <td>{ind.baseline || 0}</td>
                        <td style={{ fontWeight: 600 }}>{ind.valeur_courante || 0}</td>
                        <td>{ind.objectif || 0}</td>
                        <td>
                          <span className="jauge-track" style={{ width: 60, display: "inline-block", verticalAlign: "middle", marginRight: 4 }}>
                            <span className="jauge-fill" style={{ width: `${pct}%`, background: color }} />
                          </span>
                          {pct}%
                        </td>
                        <td>
                          <span style={{
                            display: "inline-block", width: 8, height: 8, borderRadius: "50%",
                            background: pct >= 80 ? "var(--feuille)" : pct >= 50 ? "var(--mil)" : "var(--alert)",
                          }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Légende des types */}
          <div className="card" style={{ marginTop: 8 }}>
            <details>
              <summary style={{ fontSize: 12, color: "var(--muet)", cursor: "pointer" }}>
                ℹ️ Types de graphiques disponibles
              </summary>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                {TYPE_CHARTS.map(tc => (
                  <span key={tc.id} className="donnee-chip" style={{ fontSize: 11 }}>
                    {tc.label} — {tc.desc}
                  </span>
                ))}
              </div>
            </details>
          </div>
        </div>
      ) : (
        <div className="card" style={{ textAlign: "center", padding: 40 }}>
          <p style={{ fontSize: 32 }}>🎨</p>
          <p style={{ color: "var(--muet)", marginTop: 8 }}>
            Crée ta première vue d&apos;analyse personnalisée !
          </p>
          <button onClick={() => { setShowBuilder(true); setEditingVue(null); setEditConfig([]); setNewVueName(""); }}
            className="btn btn-primary" style={{ marginTop: 12 }}>
            + Créer une vue
          </button>
        </div>
      )}

      {/* Info éco */}
      <p style={{ fontSize: 10, color: "var(--muet)", textAlign: "center", marginTop: 16 }}>
        🌿 Graphiques SVG natifs · {indicateurs.length} indicateurs chargés · zéro librairie externe
      </p>
    </div>
  );
}
