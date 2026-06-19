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

export default function AiAssistant({
  kpis,
  historique,
}: {
  kpis: KPI[];
  historique: Record<string, number[]>;
}) {
  const [activeTab, setActiveTab] = useState<"analyse" | "chat">("analyse");
  const [chatInput, setChatInput] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // === Analyse intelligente côté client ===

  const analyseGlobale = useMemo(() => {
    const ok = kpis.filter((k) => (k.valeur / k.objectif) >= 1);
    const warning = kpis.filter((k) => (k.valeur / k.objectif) >= 0.75 && (k.valeur / k.objectif) < 1);
    const critical = kpis.filter((k) => (k.valeur / k.objectif) < 0.75);

    const points: string[] = [];
    const recommandations: string[] = [];

    // Analyse globale
    points.push(`**Résumé** : ${kpis.length} KPIs suivis — ${ok.length} ✅, ${warning.length} ⚠️, ${critical.length} 🔴`);

    // Analyse par KPI
    kpis.forEach((kpi) => {
      const ratio = (kpi.valeur / kpi.objectif) * 100;
      const hist = historique[kpi.id] || [];
      let tendance = "";

      if (hist.length >= 2) {
        const diff = hist[hist.length - 1] - hist[hist.length - 2];
        const pctChange = ((diff / (hist[hist.length - 2] || 1)) * 100).toFixed(1);
        tendance = ` (${diff > 0 ? "+" : ""}${pctChange}% sur le dernier mois)`;
      }

      const emoji = ratio >= 100 ? "✅" : ratio >= 75 ? "⚠️" : "🔴";
      points.push(`- ${emoji} **${kpi.nom}** : ${kpi.valeur.toLocaleString("fr-FR")}/${kpi.objectif.toLocaleString("fr-FR")} ${kpi.unite} (${ratio.toFixed(0)}%)${tendance}`);
    });

    // Recommandations intelligentes
    kpis.forEach((kpi) => {
      const ratio = (kpi.valeur / kpi.objectif) * 100;
      const hist = historique[kpi.id] || [];

      if (ratio < 75) {
        recommandations.push(`🔴 **${kpi.nom}** : Situation critique (${ratio.toFixed(0)}%). Vérifier les causes, revoir l'objectif ou déclencher un plan d'urgence.`);
      } else if (ratio < 100) {
        const restant = kpi.objectif - kpi.valeur;
        const tend = hist.length >= 2 ? hist[hist.length - 1] - hist[hist.length - 2] : 0;
        if (tend > 0) {
          const joursEstimes = Math.ceil(restant / tend);
          recommandations.push(`💡 **${kpi.nom}** : Bonne dynamique (+${tend}/mois). Objectif atteignable dans ~${joursEstimes} jours si le rythme se maintient.`);
        } else {
          recommandations.push(`💡 **${kpi.nom}** : ${restant.toLocaleString("fr-FR")} ${kpi.unite} restants. Accélérer le rythme.`);
        }
      } else {
        const depassement = ((kpi.valeur / kpi.objectif - 1) * 100).toFixed(0);
        recommandations.push(`🎉 **${kpi.nom}** : Objectif dépassé de ${depassement}%. Félicitations ! Analyser les facteurs de succès.`);
      }
    });

    // Prédiction simple (régression linéaire)
    const predictionKpis = kpis.filter((k) => (historique[k.id]?.length || 0) >= 3);
    const previsions: string[] = [];

    predictionKpis.forEach((kpi) => {
      const hist = historique[kpi.id] || [];
      const n = hist.length;
      const xMean = (n - 1) / 2;
      const yMean = hist.reduce((a, b) => a + b, 0) / n;
      let num = 0, den = 0;
      for (let i = 0; i < n; i++) {
        num += (i - xMean) * (hist[i] - yMean);
        den += (i - xMean) * (i - xMean);
      }
      const slope = den !== 0 ? num / den : 0;
      const prediction = yMean + slope * 1;
      const pctChangeSlope = ((prediction - hist[n - 1]) / (hist[n - 1] || 1)) * 100;
      const signe = pctChangeSlope >= 0 ? "+" : "";
      previsions.push(`- 📈 **${kpi.nom}** : prévision ~${Math.round(prediction).toLocaleString("fr-FR")} ${kpi.unite} (${signe}${pctChangeSlope.toFixed(1)}%)`);
    });

    return { resume: points.join("\n"), recommandations, previsions };
  }, [kpis, historique]);

  // === Chat IA ===

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    setChatResponse("");

    const prompt = `Tu es un assistant expert en analyse de KPIs pour l'application MEAL (Monitoring & Evaluation with AI Logic).
      
Voici les KPIs actuels :
${kpis.map((k) => `- ${k.nom} : ${k.valeur}/${k.objectif} ${k.unite} (${((k.valeur/k.objectif)*100).toFixed(0)}%, tendance ${k.tendance})`).join("\n")}

Question de l'utilisateur : ${chatInput}

Réponds en français, de façon concise et actionable.`;

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error("Erreur API");

      const data = await res.json();
      setChatResponse(data.reponse || "Désolé, je n'ai pas pu trainer votre demande.");
    } catch {
      // Fallback : analyse locale
      const inputLower = chatInput.toLowerCase();
      let rep = "";

      if (inputLower.includes("résumé") || inputLower.includes("synthèse")) {
        rep = analyseGlobale.resume;
      } else if (inputLower.includes("prévision") || inputLower.includes("prédiction")) {
        rep = "**Prévisions (régression linéaire) :**\n" + analyseGlobale.previsions.join("\n");
      } else if (inputLower.includes("recommandation") || inputLower.includes("conseil") || inputLower.includes("action")) {
        rep = "**Recommandations :**\n" + analyseGlobale.recommandations.join("\n");
      } else {
        rep = `Voici l'analyse de vos ${kpis.length} KPIs :\n\n${analyseGlobale.resume}\n\nPour des réponses plus précises, je peux vous donner :\n- Les prévisions\n- Les recommandations\n- Le détail d'un KPI spécifique`;
      }
      setChatResponse(rep);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
      {/* Onglets */}
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab("analyse")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "analyse"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          📋 Analyse Automatique
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === "chat"
              ? "bg-[var(--primary)] text-white"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          }`}
        >
          💬 Assistant Conversationnel
        </button>
      </div>

      <div className="p-4">
        {activeTab === "analyse" ? (
          <div className="space-y-4">
            {/* Résumé */}
            <div className="prose prose-sm max-w-none">
              {analyseGlobale.resume.split("\n").map((line, i) => (
                <p key={i} className="mb-1">{line}</p>
              ))}
            </div>

            {/* Recommandations */}
            {analyseGlobale.recommandations.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">💡 Recommandations</h4>
                <ul className="space-y-2">
                  {analyseGlobale.recommandations.map((r, i) => (
                    <li key={i} className="text-sm bg-[var(--muted)] p-3 rounded-lg">{r}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Prévisions */}
            {analyseGlobale.previsions.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">📈 Prévisions (mois prochain)</h4>
                <div className="text-sm space-y-1">
                  {analyseGlobale.previsions.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Zone de chat */}
            <div className="min-h-[200px] mb-4">
              {chatResponse ? (
                <div className="bg-[var(--muted)] p-4 rounded-lg text-sm whitespace-pre-line">
                  {chatResponse}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-[var(--muted-foreground)] text-sm">
                  Posez une question sur vos KPIs
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                "Donne un résumé",
                "Quelles sont mes prévisions ?",
                "Que dois-je améliorer ?",
                "Analyse le CA",
              ].map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setChatInput(s);
                    setChatResponse("");
                  }}
                  className="px-3 py-1.5 text-xs rounded-full border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChat()}
                placeholder="Posez votre question..."
                className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                disabled={loading}
              />
              <button
                onClick={handleChat}
                disabled={loading || !chatInput.trim()}
                className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-dark)] transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Envoyer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
