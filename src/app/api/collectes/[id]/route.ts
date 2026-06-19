// API Route: /api/collectes/[id] — Collecte individuelle
// Fallback mémoire si Supabase non configuré
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fallback } from "@/lib/supabase-fallback";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!fallback.isConfigured()) {
    const collectes = fallback.getCollectes();
    const found = collectes.find((c) => c.id === id);
    if (!found) {
      return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
    }
    return NextResponse.json(found);
  }

  const { data, error } = await supabase
    .from("collectes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!fallback.isConfigured()) {
    const ok = fallback.deleteCollecte(id);
    if (!ok) return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
    return NextResponse.json({ success: true, message: "Collecte supprimée" });
  }

  const { error } = await supabase.from("collectes").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, message: "Collecte supprimée" });
}
