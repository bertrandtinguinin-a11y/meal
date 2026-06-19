// API Route: /api/kpis — Indicateurs clés calculés (Supabase)
// Les KPIs sont calculés à partir des indicateurs + valeurs_calculees
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  // Récupérer les indicateurs actifs
  const { data: indicateurs, error: indErr } = await supabase
    .from("indicateurs")
    .select("*")
    .eq("actif", true)
    .order("ordre", { ascending: true });

  if (indErr) return NextResponse.json({ error: indErr.message }, { status: 500 });

  // Pour chaque indicateur, récupérer la dernière valeur calculée
  const kpis = await Promise.all(
    (indicateurs || []).map(async (ind) => {
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
