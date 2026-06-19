// API Route: /api/kpis — Indicateurs clés calculés
// Fallback mémoire si Supabase non configuré
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fallback } from "@/lib/supabase-fallback";

export async function GET() {
  if (!fallback.isConfigured()) {
    // Générer des KPIs à partir des indicateurs en mémoire
    const indicateurs = fallback.getIndicateurs();
    return NextResponse.json(
      indicateurs.map((ind) => ({
        id: ind.id,
        code: ind.code,
        nom: ind.nom,
        icone: ind.icone,
        valeur: ind.valeur_courante || Math.round(Math.random() * ind.objectif * 0.8),
        objectif: ind.objectif,
        unite: ind.unite,
        evolution: Math.round((Math.random() - 0.3) * 30),
        historique: [
          { mois: 4, valeur: Math.round(Math.random() * ind.objectif * 0.5) },
          { mois: 5, valeur: Math.round(Math.random() * ind.objectif * 0.7) },
          { mois: 6, valeur: Math.round(Math.random() * ind.objectif * 0.8) },
        ],
      }))
    );
  }

  const { data: indicateurs, error: indErr } = await supabase
    .from("indicateurs")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true });

  if (indErr) return NextResponse.json({ error: indErr.message }, { status: 500 });

  const kpis = await Promise.all(
    (indicateurs || []).map(async (ind: any) => {
      const { data: valeurs } = await supabase
        .from("valeurs_calculees")
        .select("*")
        .eq("indicateur_id", ind.id)
        .order("annee", { ascending: false })
        .order("mois", { ascending: false })
        .limit(12);

      const derniere = valeurs?.[0];
      const avant = valeurs?.[1];

      return {
        id: ind.id,
        code: ind.code,
        nom: ind.nom,
        icone: ind.icone,
        valeur: derniere?.valeur || ind.valeur_courante || 0,
        objectif: ind.objectif || 0,
        unite: ind.unite,
        evolution: avant ? ((derniere?.valeur || 0) - avant.valeur) / avant.valeur * 100 : 0,
        historique: (valeurs || []).reverse(),
      };
    })
  );

  return NextResponse.json(kpis);
}
