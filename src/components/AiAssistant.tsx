"use client";

import { useState, useMemo } from "react";

interface KPI {
  id: string;
  nom: string;
  valeur: number;
  objectif: number;
  unite: string;
  categorie: string;
  tendance: "haussière" | "stable" | "baissière";
}

type TabMode = "rapport" | "chat";

// ─── Petits composants internes ───────────────────────────────────────────────

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ backgroundColor: color + "20", color }}
    >
      {children}
    </span>
  );
}

function KpiRow({ label, valeur, objectif, unite, tendance }: {
  label: string; valeur: number; objectif: number; unite: string; tendance: string;
}) {
  const ratio = (valeur / objectif) * 100;
  const progress = Math.min(ratio, 100);
  const color = ratio >= 100 ? "#22c55e" : ratio >= 75 ? "#eab308" : "#ef4444";
  const arrow = tendance === "haussière" ? "↑" : tendance === "baissière" ? "↓" : "→";

  return (
    <div className="flex items-center gap-4 py-2.5 border-b border-[var(--border)] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[var(--foreground)] truncate">{label}</span>
          <span className="text-xs text-[var(--muted-foreground)] ml-2" style={{ color }}>{arrow}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-[var(--muted)] overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: color }} />
          </div>
          <span className="text-xs font-semibold whitespace-nowrap" style={{ color }}>
            {valeur.toLocaleString("fr-FR")}/{objectif.toLocaleString("fr-FR")} {unite}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function AiAssistant({
  kpis,
  historique,
}: {
  kpis: KPI[];
  historique: Record<string, number[]>;
}) {
  const [activeTab, setActiveTab] = useState<TabMode>("rapport");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // ═══════════════════════════════════════════════════════════
  //  ANALYSE INTELLIGENTE (mémoire vive, calculée côté client)
  // ═══════════════════════════════════════════════════════════

  const analyse = useMemo(() => {
    const ok = kpis.filter((k) => (k.valeur / k.objectif) >= 1);
    const warning = kpis.filter((k) => (k.valeur / k.objectif) >= 0.75 && (k.valeur / k.objectif) < 1);
    const critical = kpis.filter((k) => (k.valeur / k.objectif) < 0.75);

    const details = kpis.map((kpi) => {
      const ratio = (kpi.valeur / kpi.objectif) * 100;
      const hist = historique[kpi.id] || [];
      let variation = 0;
      if (hist.length >= 2) {
        variation = ((hist[hist.length - 1] - hist[hist.length - 2]) / (hist[hist.length - 2] || 1)) * 100;
      }

      let statut: "atteint" | "vigilance" | "critique";
      let statutLabel: string;
      if (ratio >= 100) { statut = "atteint"; statutLabel = "Atteint"; }
      else if (ratio >= 75) { statut = "vigilance"; statutLabel = "Vigilance"; }
      else { statut = "critique"; statutLabel = "Critique"; }

      return { ...kpi, ratio, variation, statut, statutLabel };
    });

    // Recommandations
    const recommandations: { texte: string; priorite: "haute" | "moyenne" | "basse"; icone: string }[] = [];

    kpis.forEach((kpi) => {
      const ratio = (kpi.valeur / kpi.objectif) * 100;
      const hist = historique[kpi.id] || [];

      if (ratio < 75) {
        recommandations.push({
          priorite: "haute",
          icone: "🔴",
          texte: `**${kpi.nom}** atteint seulement ${ratio.toFixed(0)}% de l'objectif. Déclencher un plan d'urgence, revoir les ressources allouées ou ajuster l'objectif.`,
        });
      } else if (ratio < 100) {
        const restant = kpi.objectif - kpi.valeur;
        const tend = hist.length >= 2 ? hist[hist.length - 1] - hist[hist.length - 2] : 0;
        if (tend > 0) {
          const jours = Math.ceil(restant / tend);
          recommandations.push({
            priorite: "moyenne",
            icone: "💡",
            texte: `**${kpi.nom}** : bonne dynamique (+${tend.toLocaleString("fr-FR")}/mois). Objectif atteignable dans ~${jours} jours au rythme actuel. Maintenir l'effort.`,
          });
        } else {
          recommandations.push({
            priorite: "moyenne",
            icone: "⚡",
            texte: `**${kpi.nom}** : ${restant.toLocaleString("fr-FR")} ${kpi.unite} restants. Accélérer les actions ou réviser la stratégie.`,
          });
        }
      } else {
        const dep = ((kpi.valeur / kpi.objectif - 1) * 100).toFixed(0);
        recommandations.push({
          priorite: "basse",
          icone: "🎯",
          texte: `**${kpi.nom}** : objectif dépassé de ${dep}%. Capitaliser sur les facteurs de succès et documenter les bonnes pratiques.`,
        });
      }
    });

    // Prévisions (régression linéaire simple)
    const previsions = kpis
      .filter((k) => (historique[k.id]?.length || 0) >= 3)
      .map((kpi) => {
        const hist = historique[kpi.id]!;
        const n = hist.length;
        const xMoy = (n - 1) / 2;
        const yMoy = hist.reduce((a, b) => a + b, 0) / n;
        let num = 0, den = 0;
        for (let i = 0; i < n; i++) {
          num += (i - xMoy) * (hist[i] - yMoy);
          den += (i - xMoy) * (i - xMoy);
        }
        const pente = den !== 0 ? num / den : 0;
        const predit = yMoy + pente * 1;
        const delta = ((predit - hist[n - 1]) / (hist[n - 1] || 1)) * 100;

        return {
          nom: kpi.nom,
          actuel: hist[n - 1],
          prevision: Math.round(predit),
          delta,
          unite: kpi.unite,
        };
      });

    return { ok, warning, critical, details, recommandations, previsions };
  }, [kpis, historique]);

  // ═══════════════════════════════════════════════════════════
  //  CHAT IA
  // ═══════════════════════════════════════════════════════════

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const question = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    const prompt = `Tu es un assistant expert en analyse de KPIs pour l'application MEAL (Monitoring & Evaluation with AI Logic).

Voici les KPIs actuels :
${kpis.map((k) => `- ${k.nom} : ${k.valeur}/${k.objectif} ${k.unite} (${((k.valeur/k.objectif)*100).toFixed(0)}%, tendance ${k.tendance})`).join("\n")}

Question de l'utilisateur : ${question}

Réponds en français, de façon concise et actionable.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: "assistant", content: data.reponse }]);
    } catch {
      // Fallback local
      const input = question.toLowerCase();
      let rep = "";
      if (input.includes("résumé") || input.includes("synthèse")) {
        const { ok, warning, critical } = analyse;
        rep = `**Rapport MEAL — Résumé exécutif**\n\n• ${kpis.length} KPIs suivis\n• ${ok.length} atteints (✅) — ${warning.length} en vigilance (⚠️) — ${critical.length} critiques (🔴)\n\n` +
          analyse.details.map((d) =>
            `• ${d.nom} : ${d.valeur.toLocaleString("fr-FR")}/${d.objectif.toLocaleString("fr-FR")} ${d.unite} (${d.ratio.toFixed(0)}%)`
          ).join("\n");
      } else if (input.includes("prévision") || input.includes("prédiction")) {
        rep = "**Prévisions (mois prochain) — Régression linéaire**\n\n" +
          analyse.previsions.map((p) =>
            `• ${p.nom} : ${p.actuel.toLocaleString("fr-FR")} ${p.unite} → ${p.prevision.toLocaleString("fr-FR")} ${p.unite} (${p.delta > 0 ? "+" : ""}${p.delta.toFixed(1)}%)`
          ).join("\n");
      } else if (input.includes("recommandation") || input.includes("conseil")) {
        rep = "**Recommandations**\n\n" +
          analyse.recommandations.map((r) => `• ${r.icone} [${r.priorite.toUpperCase()}] ${r.texte}`).join("\n\n");
      } else {
        rep = `Voici l'analyse de vos ${kpis.length} KPIs.\n\n` +
          `• ${analyse.ok.length} atteints, ${analyse.warning.length} en vigilance, ${analyse.critical.length} critiques\n\n` +
          `Posez une question précise pour obtenir :\n` +
          `• Un résumé détaillé\n` +
          `• Les prévisions\n` +
          `• Les recommandations\n` +
          `• L'analyse d'un KPI spécifique`;
      }
      setChatMessages((prev) => [...prev, { role: "assistant", content: rep }]);
    } finally {
      setLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  //  RENDU
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* ── Onglets ── */}
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab("rapport")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === "rapport"
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
          }`}
        >
          📄 Rapport MEAL
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
            activeTab === "chat"
              ? "bg-[var(--primary)] text-white shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]"
          }`}
        >
          💬 Assistant
        </button>
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/*  RAPPORT */}
      {/* ═══════════════════════════════════════════════ */}
      {activeTab === "rapport" && (
        <div className="divide-y divide-[var(--border)]">
          {/* ── En-tête du rapport ── */}
          <div className="p-6 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--foreground)]">Rapport de Performance</h2>
                <p className="text-sm text-[var(--muted-foreground)] mt-1">
                  Généré le {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
              <span className="text-xs text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1.5 rounded-full font-medium">
                MEAL • v1.0
              </span>
            </div>

            {/* Cartes statistiques */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "KPIs", value: kpis.length, color: "var(--primary)" },
                { label: "Atteints", value: analyse.ok.length, color: "#22c55e" },
                { label: "Vigilance", value: analyse.warning.length, color: "#eab308" },
                { label: "Critiques", value: analyse.critical.length, color: "#ef4444" },
              ].map((s) => (
                <div key={s.label} className="rounded-lg border border-[var(--border)] p-3 text-center bg-[var(--muted)]/40">
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Détail des KPIs ── */}
          <div className="p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
              Indicateurs
            </h3>
            {analyse.details.map((d) => (
              <KpiRow key={d.id} label={d.nom} valeur={d.valeur} objectif={d.objectif} unite={d.unite} tendance={d.tendance} />
            ))}
          </div>

          {/* ── Recommandations ── */}
          {analyse.recommandations.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                Recommandations
              </h3>
              <div className="space-y-3">
                {analyse.recommandations.map((r, i) => {
                  const color =
                    r.priorite === "haute" ? "#ef4444" :
                    r.priorite === "moyenne" ? "#eab308" : "#22c55e";
                  return (
                    <div key={i} className="flex gap-3 rounded-lg border border-[var(--border)] p-3.5 bg-[var(--muted)]/30">
                      <span className="text-lg flex-shrink-0 mt-0.5">{r.icone}</span>
                      <div className="min-w-0">
                        <Badge color={color}>{r.priorite === "haute" ? "Haute" : r.priorite === "moyenne" ? "Moyenne" : "Basse"}</Badge>
                        <p className="text-sm mt-1.5 text-[var(--foreground)] leading-relaxed">
                          {/* eslint-disable-next-line react/no-danger */}
                          <span dangerouslySetInnerHTML={{
                            __html: r.texte.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                          }} />
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Prévisions ── */}
          {analyse.previsions.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-4">
                Prévisions • Mois prochain
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {analyse.previsions.map((p, i) => {
                  const color = p.delta > 0 ? "#22c55e" : p.delta < 0 ? "#ef4444" : "#6b7280";
                  return (
                    <div key={i} className="rounded-lg border border-[var(--border)] p-3.5 bg-[var(--muted)]/30">
                      <div className="text-sm font-medium mb-1.5">{p.nom}</div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-lg font-bold">{p.prevision.toLocaleString("fr-FR")}</span>
                        <span className="text-xs text-[var(--muted-foreground)]">{p.unite}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs" style={{ color }}>
                          {p.delta > 0 ? "↑" : p.delta < 0 ? "↓" : "→"} {p.delta > 0 ? "+" : ""}{p.delta.toFixed(1)}%
                        </span>
                        <span className="text-xs text-[var(--muted-foreground)]">
                          vs {p.actuel.toLocaleString("fr-FR")} actuel
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════ */}
      {/*  CHAT */}
      {/* ═══════════════════════════════════════════════ */}
      {activeTab === "chat" && (
        <div className="flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-4 space-y-3 max-h-[420px] overflow-y-auto">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mb-3">
                  <span className="text-2xl">🧠</span>
                </div>
                <p className="text-sm font-medium text-[var(--foreground)]">Assistant MEAL</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 max-w-xs">
                  Posez une question sur vos indicateurs de performance. Je peux analyser, prévoir et recommander.
                </p>
                {/* Suggestions rapides */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {["Résumé exécutif", "Prévisions", "Recommandations", "Analyser le CA"].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setChatInput(s);
                        handleChatDirect(s);
                      }}
                      className="px-3 py-1.5 text-xs rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">🧠</span>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-[var(--primary)] text-white rounded-tr-sm"
                        : "bg-[var(--muted)] text-[var(--foreground)] rounded-tl-sm"
                    }`}
                  >
                    {/* eslint-disable-next-line react/no-danger */}
                    <span dangerouslySetInnerHTML={{
                      __html: msg.content.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
                    }} />
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                      <span className="text-sm text-white font-bold">M</span>
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🧠</span>
                </div>
                <div className="bg-[var(--muted)] rounded-xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[var(--muted-foreground)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-[var(--border)] p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Posez votre question sur les KPIs..."
                className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder:text-[var(--muted-foreground)]"
                disabled={loading}
              />
              <button
                onClick={handleChat}
                disabled={loading || !chatInput.trim()}
                className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                {loading ? "..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Petite fonction utilitaire pour le clic sur suggestion (évite double appel)
  function handleChatDirect(msg: string) {
    setChatMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    const prompt = `Tu es un assistant expert en analyse de KPIs pour l'application MEAL (Monitoring & Evaluation with AI Logic).

Voici les KPIs actuels :
${kpis.map((k) => `- ${k.nom} : ${k.valeur}/${k.objectif} ${k.unite} (${((k.valeur/k.objectif)*100).toFixed(0)}%, tendance ${k.tendance})`).join("\n")}

Question de l'utilisateur : ${msg}

Réponds en français, de façon concise et actionable.`;

    fetch("/api/ai", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.ok ? res.json() : Promise.reject())
      .then((data) => {
        setChatMessages((prev) => [...prev, { role: "assistant", content: data.reponse }]);
      })
      .catch(() => {
        const input = msg.toLowerCase();
        let rep = "";
        if (input.includes("résumé")) {
          rep = `**Résumé exécutif**\n\n${analyse.ok.length} atteints, ${analyse.warning.length} en vigilance, ${analyse.critical.length} critiques sur ${kpis.length} KPIs.`;
        } else if (input.includes("prévision")) {
          rep = "**Prévisions**\n\n" + analyse.previsions.map((p) => `• ${p.nom} : ${p.prevision.toLocaleString("fr-FR")} ${p.unite}`).join("\n");
        } else if (input.includes("recommandation")) {
          rep = "**Recommandations**\n\n" + analyse.recommandations.slice(0, 3).map((r) => `• ${r.icone} ${r.texte}`).join("\n\n");
        } else {
          rep = `Analyse de vos ${kpis.length} KPIs en cours...`;
        }
        setChatMessages((prev) => [...prev, { role: "assistant", content: rep }]);
      })
      .finally(() => setLoading(false));
  }
}
