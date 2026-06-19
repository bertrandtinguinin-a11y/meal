// API Route: /api/collectes — Soumissions terrain
// Fallback mémoire si Supabase non configuré
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fallback } from "@/lib/supabase-fallback";

export async function GET(request: Request) {
  if (!fallback.isConfigured()) {
    return NextResponse.json(fallback.getCollectes());
  }

  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit") || "100");
  const statut = searchParams.get("statut");

  let query = supabase
    .from("collectes")
    .select("*, collecteurs!inner(nom), indicateurs!inner(nom,code)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (statut) query = query.eq("statut", statut);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Aplatir les JOINs pour exposer collecteur_nom, indicateur_nom, indicateur_code
  const flattened = (data || []).map((c: any) => ({
    ...c,
    collecteur_nom: c.collecteurs?.nom || "N/A",
    indicateur_nom: c.indicateurs?.nom || "N/A",
    indicateur_code: c.indicateurs?.code || "",
    collecteurs: undefined,
    indicateurs: undefined,
  }));

  return NextResponse.json(flattened);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!fallback.isConfigured()) {
      const col = fallback.addCollecte(body);
      return NextResponse.json(col, { status: 201 });
    }

    const { data, error } = await supabase
      .from("collectes")
      .insert({
        collecteur_id: body.collecteur_id,
        indicateur_id: body.indicateur_id,
        localite: body.localite,
        date_collecte: body.date_collecte || new Date().toISOString().slice(0, 10),
        donnees: body.donnees || {},
        note_terrain: body.note_terrain || "",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Données invalides: " + (e.message || "") }, { status: 400 });
  }
}
