"use client";

import { useState, useRef } from "react";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ ok: number; err: number; messages: string[] } | null>(null);
  const [mode, setMode] = useState<"collectes" | "indicateurs" | "collecteurs">("collectes");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    const ext = f.name.split(".").pop()?.toLowerCase();

    if (ext === "json") {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const arr = Array.isArray(data) ? data : [data];
          setPreview(arr.slice(0, 5));
        } catch { setPreview([{ error: "JSON invalide" }]); }
      };
      reader.readAsText(f);
    } else if (ext === "csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lignes = text.split("\n").filter(Boolean);
        if (lignes.length < 2) { setPreview([{ error: "Fichier vide" }]); return; }
        const entetes = lignes[0].split(",").map((h) => h.trim().replace(/^"/, "").replace(/"$/, ""));
        const data = lignes.slice(1).map((l) => {
          const vals = l.split(",").map((v) => v.trim().replace(/^"/, "").replace(/"$/, ""));
          const obj: Record<string, any> = {};
          entetes.forEach((h, i) => { obj[h] = vals[i] || ""; });
          return obj;
        });
        setPreview(data.slice(0, 5));
      };
      reader.readAsText(f);
    } else {
      setPreview([{ error: "Format non supporté. Utilise CSV ou JSON." }]);
    }
  };

  const importer = async () => {
    if (!preview || preview.length === 0 || preview[0].error) return;
    setImporting(true);
    setResult(null);

    try {
      if (mode === "collectes") {
        // Format attendu: collecteur_id, indicateur_id, localite, donnees (JSON string), date
        const items = preview.concat(file ? [] : []); // placeholder
        const text = await file?.text() || "[]";
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : [data];

        let ok = 0, err = 0;
        const messages: string[] = [];
        for (const item of arr) {
          try {
            const res = await fetch("/api/collectes", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                collecteur_id: item.collecteur_id || item.collecteurId || "",
                indicateur_id: item.indicateur_id || item.indicateurId || "",
                localite: item.localite || item.localite || "",
                donnees: typeof item.donnees === "string" ? JSON.parse(item.donnees) : (item.donnees || {}),
                note_terrain: item.note || item.note_terrain || "",
              }),
            });
            if (res.ok) ok++; else { err++; messages.push(`Erreur ligne ${ok + err}: ${await res.text()}`); }
          } catch (e: any) { err++; messages.push(`Exception: ${e.message}`); }
        }
        setResult({ ok, err, messages });
      } else if (mode === "indicateurs") {
        const text = await file?.text() || "[]";
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : [data];
        let ok = 0, err = 0;
        const messages: string[] = [];
        for (const item of arr) {
          try {
            const res = await fetch("/api/indicateurs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                code: item.code, nom: item.nom,
                unite: item.unite || "", categorie: item.categorie || "",
                objectif: Number(item.objectif || 0),
                icone: item.icone || "📊",
              }),
            });
            if (res.ok) ok++; else { err++; messages.push(`Erreur: ${await res.text()}`); }
          } catch (e: any) { err++; messages.push(`Exception: ${e.message}`); }
        }
        setResult({ ok, err, messages });
      } else if (mode === "collecteurs") {
        const text = await file?.text() || "[]";
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : [data];
        let ok = 0, err = 0;
        const messages: string[] = [];
        for (const item of arr) {
          try {
            const res = await fetch("/api/collecteurs", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ nom: item.nom, zone: item.zone || "", role: item.role || "agent_terrain" }),
            });
            if (res.ok) ok++; else { err++; messages.push(`Erreur: ${await res.text()}`); }
          } catch (e: any) { err++; messages.push(`Exception: ${e.message}`); }
        }
        setResult({ ok, err, messages });
      }
    } catch (e: any) {
      setResult({ ok: 0, err: 1, messages: [`Erreur: ${e.message}`] });
    }
    setImporting(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>📥 Import de données</h2>
          <p className="page-subtitle">
            Importe des collectes, indicateurs ou collecteurs depuis un fichier CSV ou JSON
          </p>
        </div>
      </div>

      {/* Sélecteur de mode */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "collectes", label: "📋 Collectes", desc: "collecteur_id,indicateur_id,localite,donnees,note" },
          { id: "indicateurs", label: "📊 Indicateurs", desc: "code,nom,unite,categorie,objectif" },
          { id: "collecteurs", label: "👤 Collecteurs", desc: "nom,zone,role" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id as any); setFile(null); setPreview(null); setResult(null); }}
            className={`card ${mode === m.id ? "active-mode" : ""}`}
            style={{
              flex: 1, cursor: "pointer", textAlign: "center", padding: "10px 8px",
              borderColor: mode === m.id ? "var(--feuille)" : "var(--bord)",
              background: mode === m.id ? "color-mix(in srgb, var(--carte) 96%, var(--feuille))" : "var(--carte)",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: mode === m.id ? 700 : 500, color: mode === m.id ? "var(--feuille)" : "var(--ivoire)" }}>
              {m.label}
            </div>
            <div style={{ fontSize: 9, color: "var(--muet)", marginTop: 2 }}>{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Zone de dépôt */}
      <div
        className="card"
        style={{
          borderStyle: "dashed", borderWidth: 2, textAlign: "center", padding: "24px 16px",
          cursor: "pointer",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        {!file ? (
          <>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📂</div>
            <p style={{ fontSize: 14, color: "var(--muet)" }}>
              Clique ou dépose un fichier <b>CSV</b> ou <b>JSON</b> ici
            </p>
            <p style={{ fontSize: 11, color: "var(--muet-2)", marginTop: 6 }}>
              {mode === "collectes" ? "Format: collecteur_id, indicateur_id, localite, donnees (JSON), note" :
               mode === "indicateurs" ? "Format: code, nom, unite, categorie, objectif" :
               "Format: nom, zone, role"}
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: 28, marginBottom: 6 }}>📄</div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--feuille)" }}>{file.name}</p>
            <p style={{ fontSize: 11, color: "var(--muet)" }}>
              {(file.size / 1024).toFixed(1)} Ko
            </p>
            <button
              className="btn btn-sm"
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setResult(null); }}
              style={{ marginTop: 4 }}
            >
              Changer de fichier
            </button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.json"
          style={{ display: "none" }}
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Aperçu */}
      {preview && preview.length > 0 && !preview[0].error && (
        <div className="card" style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>
            Aperçu ({preview.length} ligne{preview.length > 1 ? "s" : ""})
          </p>
          <div style={{ overflowX: "auto", fontSize: 11 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {Object.keys(preview[0]).map((h) => (
                    <th key={h} style={{ padding: "4px 8px", borderBottom: "1px solid var(--bord)", textAlign: "left", color: "var(--muet)", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((l, i) => (
                  <tr key={i}>
                    {Object.values(l).map((v: any, j) => (
                      <td key={j} style={{ padding: "4px 8px", borderBottom: "1px solid var(--bord)", color: "var(--ivoire)" }}>
                        {typeof v === "object" ? JSON.stringify(v).slice(0, 40) : String(v).slice(0, 40)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="btn btn-primary"
            onClick={importer}
            disabled={importing}
            style={{ marginTop: 12, width: "100%" }}
          >
            {importing ? "⏳ Import en cours..." : `📤 Importer ${preview.length} enregistrement${preview.length > 1 ? "s" : ""}`}
          </button>
        </div>
      )}

      {preview?.[0]?.error && (
        <div className="card" style={{ marginTop: 12, borderColor: "#dc2626", background: "rgba(220,38,38,0.06)" }}>
          <p style={{ color: "#dc2626", fontSize: 13 }}>{preview[0].error}</p>
        </div>
      )}

      {/* Résultat */}
      {result && (
        <div className="card" style={{
          marginTop: 12,
          borderColor: result.err === 0 ? "var(--feuille)" : "var(--rose)",
          background: result.err === 0 ? "rgba(111,168,107,0.06)" : "rgba(220,38,38,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24 }}>{result.err === 0 ? "✅" : "⚠️"}</span>
            <div>
              <p style={{ fontWeight: 600, color: "var(--ivoire)" }}>
                {result.ok} importé{result.ok > 1 ? "s" : ""} · {result.err} erreur{result.err > 1 ? "s" : ""}
              </p>
              {result.messages.length > 0 && (
                <div style={{ fontSize: 11, color: "#dc2626", marginTop: 4 }}>
                  {result.messages.slice(0, 3).map((m, i) => <p key={i}>{m}</p>)}
                  {result.messages.length > 3 && <p>...et {result.messages.length - 3} autres</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Exemples de fichiers */}
      <div className="card" style={{ marginTop: 16, background: "color-mix(in srgb, var(--carte) 98%, var(--mil))" }}>
        <p style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>📖 Exemples de fichiers</p>
        <div style={{ fontSize: 11, color: "var(--muet)", lineHeight: 1.7, fontFamily: "monospace" }}>
          {mode === "collectes" && (
            <pre style={{ background: "var(--fond)", padding: 8, borderRadius: 6, overflowX: "auto" }}>
{`[
  {"collecteur_id":"UUID","indicateur_id":"UUID","localite":"NKP-01","donnees":{"total":45},"note":"OK"}
]`}</pre>
          )}
          {mode === "indicateurs" && (
            <pre style={{ background: "var(--fond)", padding: 8, borderRadius: 6, overflowX: "auto" }}>
{`[
  {"code":"P-1","nom":"Taux de scolarisation","unite":"%","categorie":"Produit","objectif":95}
]`}</pre>
          )}
          {mode === "collecteurs" && (
            <pre style={{ background: "var(--fond)", padding: 8, borderRadius: 6, overflowX: "auto" }}>
{`[
  {"nom":"Boukari A.","zone":"Zone A","role":"agent_terrain"}
]`}</pre>
          )}
        </div>
      </div>

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
        .card {
          background: var(--carte);
          border: 1px solid var(--bord);
          border-radius: 10px;
          padding: 14px;
        }
        .active-mode {
          border-width: 2px;
        }
        .btn {
          border: 1px solid var(--bord);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
          background: var(--carte);
          color: var(--ivoire);
        }
        .btn-primary {
          background: var(--feuille);
          border-color: var(--feuille);
          color: #fff;
          font-weight: 600;
        }
        .btn-primary:hover { opacity: 0.9; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-sm { padding: 6px 10px; font-size: 11px; }
      `}</style>
    </div>
  );
}
