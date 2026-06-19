// API Route: /api/collectes/[id] — Collecte individuelle (Supabase)
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
