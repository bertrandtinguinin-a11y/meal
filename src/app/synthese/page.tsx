"use client";

import { useEffect, useState, useCallback } from "react";

interface Collecte {
  id: string;
  collecteur_nom: string;
  indicateur_nom: string;
  indicateur_code: string;
  localite: string;
  zone: string;
  date_collecte: string;
  statut: string;
  donnees: Record<string, any>;
}

const ITEMS_PAR_PAGE = 20;

const STATUTS = [
  { value: "", label: "Tous" },
  { value: "en_attente", label: "En attente" },
  { value: "valide", label: "Validé" },
  { value: "rejete", label: "Rejeté" },
  { value: "correction", label: "Correction" },
];

export default function SynthesePage() {
  const [collectes, setCollectes] = useState<Collecte[]>([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("");
  const [page, setPage] = useState(1);

  const [tri, setTri] = useState({ colonne: "date_collecte", sens: "desc" as "asc" | "desc" });

  // Chargement des données
  const charger = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "500" });
      if (filtreStatut) params.set("statut", filtreStatut);
      const res = await fetch(`/api/collectes?${params}`);
      const data = await res.json();
      setCollectes(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Erreur chargement collectes:", e);
      setCollectes([]);
    } finally {
      setLoading(false);
    }
  }, [filtreStatut]);

  useEffect(() => { charger(); }, [charger]);

  // Filtrage local + tri
  const filtrer = collectes
    .filter((c) => {
      if (!recherche) return true;
      const q = recherche.toLowerCase();
      return (
        c.collecteur_nom?.toLowerCase().includes(q) ||
        c.indicateur_nom?.toLowerCase().includes(q) ||
        c.indicateur_code?.toLowerCase().includes(q) ||
        c.localite?.toLowerCase().includes(q) ||
        c.zone?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const va = (a as any)[tri.colonne] || "";
      const vb = (b as any)[tri.colonne] || "";
      return tri.sens === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  const total = filtrer.length;
  const pages = Math.max(1, Math.ceil(total / ITEMS_PAR_PAGE));
  const debut = (page - 1) * ITEMS_PAR_PAGE;
  const visibles = filtrer.slice(debut, debut + ITEMS_PAR_PAGE);

  // Reset page quand le filtre change
  useEffect(() => { setPage(1); }, [recherche, filtreStatut]);

  // Tri
  const changerTri = (colonne: string) => {
    setTri((prev) => ({
      colonne,
      sens: prev.colonne === colonne && prev.sens === "asc" ? "desc" : "asc",
    }));
  };

  const afficherStatut = (s: string) => {
    const map: Record<string, { label: string; color: string }> = {
      en_attente: { label: "En attente", color: "var(--jaune)" },
      valide: { label: "Validé", color: "var(--feuille)" },
      rejete: { label: "Rejeté", color: "var(--rose)" },
      correction: { label: "Correction", color: "var(--orange)" },
    };
    const st = map[s] || { label: s, color: "var(--muet)" };
    return <span style={{ color: st.color, fontWeight: 600, fontSize: 11 }}>{st.label}</span>;
  };

  // Numéros de page à afficher (compact)
  const pagesNumeros = () => {
    const maxVisibles = 7;
    const nums: (number | "...")[] = [];
    if (pages <= maxVisibles) {
      for (let i = 1; i <= pages; i++) nums.push(i);
    } else {
      nums.push(1);
      if (page > 3) nums.push("...");
      for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
      if (page < pages - 2) nums.push("...");
      nums.push(pages);
    }
    return nums;
  };

  // Stats
  const stats = {
    total: collectes.length,
    valides: collectes.filter((c) => c.statut === "valide").length,
    enAttente: collectes.filter((c) => c.statut === "en_attente").length,
    rejetes: collectes.filter((c) => c.statut === "rejete").length,
  };

  return (
    <div>
      {/* En-tête */}
      <div className="page-header">
        <div>
          <h2>Synthèse &amp; Rapports</h2>
          <p className="page-subtitle">
            {stats.total > 0
              ? `${stats.total} enregistrements · ${stats.valides} validés · ${stats.enAttente} en attente`
              : "Consultez et filtrez l'ensemble des collectes terrain"}
          </p>
        </div>
      </div>

      {/* Cartes stats */}
      <div className="stats-row" style={{ marginBottom: 16 }}>
        <div className="stat-mini">
          <span className="stat-mini-val">{stats.total}</span>
          <span className="stat-mini-lbl">Total</span>
        </div>
        <div className="stat-mini" style={{ borderLeft: "3px solid var(--feuille)" }}>
          <span className="stat-mini-val" style={{ color: "var(--feuille)" }}>{stats.valides}</span>
          <span className="stat-mini-lbl">Validés</span>
        </div>
        <div className="stat-mini" style={{ borderLeft: "3px solid var(--jaune)" }}>
          <span className="stat-mini-val" style={{ color: "var(--jaune)" }}>{stats.enAttente}</span>
          <span className="stat-mini-lbl">En attente</span>
        </div>
        <div className="stat-mini" style={{ borderLeft: "3px solid var(--rose)" }}>
          <span className="stat-mini-val" style={{ color: "var(--rose)" }}>{stats.rejetes}</span>
          <span className="stat-mini-lbl">Rejetés</span>
        </div>
      </div>

      {/* Barre de recherche + Filtres */}
      <div className="search-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Rechercher par collecteur, indicateur, localité..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          {recherche && (
            <button className="search-clear" onClick={() => setRecherche("")}>✕</button>
          )}
        </div>
        <select
          className="filter-select"
          value={filtreStatut}
          onChange={(e) => setFiltreStatut(e.target.value)}
        >
          {STATUTS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Chargement des données...</p>
        </div>
      ) : visibles.length === 0 ? (
        <div className="empty-state">
          <span style={{ fontSize: 32, marginBottom: 8 }}>📋</span>
          <p>Aucune collecte trouvée</p>
          {(recherche || filtreStatut) && (
            <p style={{ fontSize: 12, color: "var(--muet)", marginTop: 4 }}>
              Essayez de modifier vos filtres
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => changerTri("date_collecte")} className="sortable">
                    Date {tri.colonne === "date_collecte" && (tri.sens === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => changerTri("collecteur_nom")} className="sortable">
                    Collecteur {tri.colonne === "collecteur_nom" && (tri.sens === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => changerTri("indicateur_code")} className="sortable">
                    Indicateur {tri.colonne === "indicateur_code" && (tri.sens === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => changerTri("localite")} className="sortable">
                    Localité {tri.colonne === "localite" && (tri.sens === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => changerTri("zone")} className="sortable">
                    Zone {tri.colonne === "zone" && (tri.sens === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Valeur</th>
                  <th onClick={() => changerTri("statut")} className="sortable">
                    Statut {tri.colonne === "statut" && (tri.sens === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((c) => (
                  <tr key={c.id}>
                    <td className="cell-date">
                      {new Date(c.date_collecte).toLocaleDateString("fr-FR", {
                        day: "2-digit", month: "short",
                      })}
                    </td>
                    <td className="cell-name">{c.collecteur_nom}</td>
                    <td>
                      <span className="badge-code">{c.indicateur_code}</span>
                      <span className="cell-sub">{c.indicateur_nom}</span>
                    </td>
                    <td>{c.localite}</td>
                    <td>{c.zone}</td>
                    <td className="cell-val">
                      {Object.values(c.donnees || {})
                        .filter((v) => typeof v === "number")
                        .slice(0, 2)
                        .join(" / ")}
                    </td>
                    <td>{afficherStatut(c.statut)}</td>
                    <td>
                      <button
                        className="action-btn"
                        onClick={() => {/* Vue détail à venir */}}
                        title="Voir le détail"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination-bar">
            <span className="pagination-info">
              {total} enregistrement{total !== 1 ? "s" : ""}
              {total > ITEMS_PAR_PAGE && ` · Page ${page}/${pages}`}
            </span>
            <div className="pagination-btns">
              <button
                className="page-btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                ‹
              </button>
              {pagesNumeros().map((n, i) =>
                n === "..." ? (
                  <span key={`e${i}`} className="page-dots">…</span>
                ) : (
                  <button
                    key={n}
                    className={`page-btn ${page === n ? "active" : ""}`}
                    onClick={() => setPage(n as number)}
                  >
                    {n}
                  </button>
                )
              )}
              <button
                className="page-btn"
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        .page-header {
          margin-bottom: 16px;
        }
        .page-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: var(--ivoire);
          margin: 0;
        }
        .page-subtitle {
          font-size: 12px;
          color: var(--muet);
          margin: 4px 0 0 0;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }
        .stat-mini {
          background: var(--carte);
          border-radius: 8px;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-left: 3px solid var(--muet-2);
        }
        .stat-mini-val {
          font-size: 20px;
          font-weight: 700;
          color: var(--ivoire);
          font-variant-numeric: tabular-nums;
        }
        .stat-mini-lbl {
          font-size: 10px;
          color: var(--muet);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .search-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }
        .search-input-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          background: var(--carte);
          border: 1px solid var(--bord);
          border-radius: 8px;
          padding: 0 10px;
          transition: border-color 0.2s;
        }
        .search-input-wrap:focus-within {
          border-color: var(--feuille);
        }
        .search-icon {
          font-size: 14px;
          color: var(--muet-2);
          margin-right: 8px;
        }
        .search-input {
          flex: 1;
          background: none;
          border: none;
          padding: 10px 0;
          color: var(--ivoire);
          font-size: 13px;
          outline: none;
        }
        .search-input::placeholder {
          color: var(--muet-2);
        }
        .search-clear {
          background: none;
          border: none;
          color: var(--muet-2);
          cursor: pointer;
          font-size: 12px;
          padding: 4px;
        }
        .filter-select {
          background: var(--carte);
          border: 1px solid var(--bord);
          border-radius: 8px;
          color: var(--ivoire);
          padding: 10px 12px;
          font-size: 12px;
          cursor: pointer;
          outline: none;
          min-width: 120px;
        }

        .table-container {
          background: var(--carte);
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid var(--bord);
        }
        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .data-table th {
          text-align: left;
          padding: 10px 12px;
          font-weight: 600;
          color: var(--muet);
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--bord);
          background: color-mix(in srgb, var(--carte) 98%, var(--feuille));
          white-space: nowrap;
        }
        .data-table th.sortable {
          cursor: pointer;
          user-select: none;
          transition: color 0.15s;
        }
        .data-table th.sortable:hover {
          color: var(--feuille);
        }
        .data-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--bord);
          color: var(--ivoire);
          vertical-align: middle;
        }
        .data-table tr:last-child td {
          border-bottom: none;
        }
        .data-table tr:hover td {
          background: color-mix(in srgb, var(--carte) 97%, var(--feuille));
        }
        .cell-date {
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
          color: var(--muet) !important;
        }
        .cell-name {
          font-weight: 500;
        }
        .cell-sub {
          display: block;
          font-size: 10px;
          color: var(--muet);
          margin-top: 2px;
        }
        .cell-val {
          font-variant-numeric: tabular-nums;
          font-weight: 500;
        }
        .badge-code {
          display: inline-block;
          background: color-mix(in srgb, var(--carte) 90%, var(--feuille));
          color: var(--feuille);
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          font-family: monospace;
        }
        .action-btn {
          background: none;
          border: 1px solid var(--bord);
          border-radius: 6px;
          padding: 4px 8px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.15s;
        }
        .action-btn:hover {
          border-color: var(--feuille);
          background: color-mix(in srgb, var(--carte) 95%, var(--feuille));
        }

        .pagination-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 12px;
          padding: 8px 4px;
        }
        .pagination-info {
          font-size: 11px;
          color: var(--muet);
        }
        .pagination-btns {
          display: flex;
          gap: 3px;
          align-items: center;
        }
        .page-btn {
          background: var(--carte);
          border: 1px solid var(--bord);
          border-radius: 6px;
          padding: 6px 10px;
          color: var(--ivoire);
          font-size: 12px;
          cursor: pointer;
          min-width: 32px;
          text-align: center;
          transition: all 0.15s;
        }
        .page-btn:hover:not(:disabled):not(.active) {
          border-color: var(--feuille);
        }
        .page-btn.active {
          background: var(--feuille);
          border-color: var(--feuille);
          color: #fff;
          font-weight: 600;
        }
        .page-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .page-dots {
          color: var(--muet-2);
          padding: 0 4px;
          font-size: 12px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 16px;
          color: var(--muet);
          gap: 12px;
        }
        .spinner {
          width: 28px;
          height: 28px;
          border: 3px solid var(--bord);
          border-top-color: var(--feuille);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 16px;
          color: var(--muet);
        }
      `}</style>
    </div>
  );
}
