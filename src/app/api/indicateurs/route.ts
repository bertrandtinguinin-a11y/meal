// API Route: /api/indicateurs — Indicateurs personnalisables
// Fallback mémoire si Supabase non configuré
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fallback } from "@/lib/supabase-fallback";

export async function GET() {
  if (!fallback.isConfigured()) {
    return NextResponse.json(fallback.getIndicateurs());
  }

  const { data, error } = await supabase
    .from("indicateurs")
    .select("*")
    .order("ordre", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!fallback.isConfigured()) {
      const ind = fallback.addIndicateur(body);
      return NextResponse.json(ind, { status: 201 });
    }

    const { data, error } = await supabase
      .from("indicateurs")
      .insert({
        code: body.code,
        nom: body.nom,
        categorie: body.categorie,
        type_chart: body.type_chart || "barre",
        unite: body.unite || "",
        objectif: body.objectif || 0,
        baseline: body.baseline || 0,
        icone: body.icone || "📊",
        description: body.description || "",
        desagregation: body.desagregation || [],
        ordre: body.ordre || 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: "Données invalides: " + (e.message || "") }, { status: 400 });
  }
}
