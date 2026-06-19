// API Route: /api/collecteurs — Agents de terrain
// Fallback mémoire si Supabase non configuré
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fallback } from "@/lib/supabase-fallback";

export async function GET() {
  if (!fallback.isConfigured()) {
    return NextResponse.json(fallback.getCollecteurs());
  }

  const { data, error } = await supabase
    .from("collecteurs")
    .select("*")
    .order("nom", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!fallback.isConfigured()) {
      const c = fallback.addCollecteur(body);
      return NextResponse.json(c, { status: 201 });
    }

    const { data, error } = await supabase
      .from("collecteurs")
      .insert({
        nom: body.nom,
        role: body.role || "agent_terrain",
        zone: body.zone || "",
        telephone: body.telephone || "",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Données invalides: " + (e.message || "") }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis (?id=...)" }, { status: 400 });

  if (!fallback.isConfigured()) {
    const ok = fallback.deleteCollecteur(id);
    if (!ok) return NextResponse.json({ error: "Collecteur introuvable" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Collecteur supprimé" });
  }

  const { error } = await supabase.from("collecteurs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "Collecteur supprimé" });
}
