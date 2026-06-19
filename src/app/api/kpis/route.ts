import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/** GET /api/kpis — Liste tous les KPIs avec leurs dernières valeurs */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mois = searchParams.get("mois");
  const annee = searchParams.get("annee") || "2026";

  try {
    // 1. Récupérer les KPIs
    const { data: kpis, error: e1 } = await supabase
      .from("kpis")
      .select("*")
      .eq("actif", true)
      .order("poids", { ascending: false });

    if (e1) throw e1;
    if (!kpis || kpis.length === 0) {
      return NextResponse.json({ kpis: [], historiques: {} });
    }

    // 2. Récupérer les valeurs
    let query = supabase
      .from("kpi_values")
      .select("*")
      .in("kpi_id", kpis.map((k) => k.id))
      .eq("annee", parseInt(annee));

    if (mois) query = query.eq("mois", parseInt(mois));

    const { data: values, error: e2 } = await query.order("mois", { ascending: true });
    if (e2) throw e2;

    // 3. Assembler
    const valuesByKpi: Record<string, { mois: number; valeur: number }[]> = {};
    (values || []).forEach((v) => {
      if (!valuesByKpi[v.kpi_id]) valuesByKpi[v.kpi_id] = [];
      valuesByKpi[v.kpi_id].push({ mois: v.mois, valeur: v.valeur });
    });

    const kpisAvecValeurs = kpis.map((k) => ({
      id: k.id,
      code: k.code,
      nom: k.nom,
      description: k.description,
      unite: k.unite,
      categorie: k.categorie,
      objectif: k.objectif,
      poids: k.poids,
      responsable: k.responsable,
      valeur: valuesByKpi[k.id]?.slice(-1)?.[0]?.valeur || 0,
      mois_data: valuesByKpi[k.id] || [],
    }));

    // 4. Construire l'historique
    const historiques: Record<string, number[]> = {};
    kpis.forEach((k) => {
      historiques[k.id] = (valuesByKpi[k.id] || []).map((v) => v.valeur);
    });

    return NextResponse.json({ kpis: kpisAvecValeurs, historiques });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur inconnue";
    console.error("GET /api/kpis error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
