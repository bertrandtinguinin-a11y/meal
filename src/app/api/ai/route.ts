import { NextResponse } from "next/server";

/**
 * API Route pour les requêtes IA
 * 
 * Stratégie : essaie Gemini API (via fetch direct)
 * Si pas de clé API → fallback vers analyse locale
 * 
 * À configurer : VITE_GEMINI_API_KEY dans les variables d'environnement Vercel
 * Ou via .env.local : GEMINI_API_KEY=votre_clé
 */

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { reponse: "Veuillez fournir un message valide." },
        { status: 400 }
      );
    }

    // Essayer Gemini API si une clé est configurée
    const geminiKey = process.env.GEMINI_API_KEY;

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: prompt }],
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              },
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return NextResponse.json({ reponse: text });
          }
        }
      } catch {
        // Fallback silencieux
      }
    }

    // Fallback : retourner une réponse indiquant que l'IA n'est pas configurée
    return NextResponse.json({
      reponse: `🤖 **Assistant MEAL prêt !**\n\nPour activer l'IA avancée (Gemini), ajoutez votre clé API Gemini dans les variables d'environnement.\n\n**En attendant**, voici ce que je peux faire :\n- Résumé automatique de vos KPIs\n- Analyse des tendances\n- Prévisions par régression linéaire\n- Détection des alertes\n\nPosez votre question dans le chat pour une analyse locale instantanée !`,
    });
  } catch (error) {
    console.error("Erreur API IA:", error);
    return NextResponse.json(
      { reponse: "Désolé, une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
