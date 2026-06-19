// API Route: /api/collectes — CRUD soumissions terrain (Supabase)
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statut = searchParams.get("statut");
  const collecteur = searchParams.get("collecteur");
  const limit = parseInt(searchParams.get("limit") || "100");

  let query = supabase
    .from("collectes")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (statut) query = query.eq("statut", statut);
  if (collecteur) query = query.ilike("collecteur_id", `%${collecteur}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("collectes")
      .insert({
        collecteur_id: body.collecteur_id,
        indicateur_id: body.indicateur_id,
        localite: body.localite,
        zone: body.zone,
        date_collecte: body.date_collecte || new Date().toISOString().split("T")[0],
        donnees: body.donnees || {},
        note_terrain: body.note_terrain || "",
        statut: "en_attente",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { data, error } = await supabase
      .from("collectes")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", body.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
