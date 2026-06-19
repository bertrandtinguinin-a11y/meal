// API Route: /api/validation — Approuver/Rejeter avec feedback (Supabase)
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { action, collecte_id, message, faite_par, champs_corriges } = await request.json();

    if (!collecte_id || !action) {
      return NextResponse.json({ error: "collecte_id et action requis" }, { status: 400 });
    }

    // Vérifier que la collecte existe
    const { data: collecte, error: findErr } = await supabase
      .from("collectes")
      .select("*")
      .eq("id", collecte_id)
      .single();

    if (findErr || !collecte) {
      return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
    }

    if (action === "valider") {
      const { data, error } = await supabase
        .from("collectes")
        .update({
          statut: "valide",
          validation_date: new Date().toISOString(),
          validated_by: faite_par || "Superviseur",
        })
        .eq("id", collecte_id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        message: "Collecte validée ✅ — indicateur mis à jour",
        collecte: data,
      });
    }

    if (action === "rejeter") {
      if (!message) {
        return NextResponse.json({ error: "Un message de correction est requis" }, { status: 400 });
      }

      // Mettre à jour le statut de la collecte
      const { error: updateErr } = await supabase
        .from("collectes")
        .update({
          statut: "rejete",
          validation_date: new Date().toISOString(),
          validated_by: faite_par || "Superviseur",
        })
        .eq("id", collecte_id);

      if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

      // Créer une correction
      const { data: correction, error: corrErr } = await supabase
        .from("corrections")
        .insert({
          collecte_id,
          message,
          champs_corriges: champs_corriges || [],
          faite_par: faite_par || "Superviseur",
          repondu: false,
        })
        .select()
        .single();

      if (corrErr) return NextResponse.json({ error: corrErr.message }, { status: 500 });

      return NextResponse.json({
        success: true,
        message: "🔴 Collecte rejetée — feedback envoyé au terrain",
        correction,
      });
    }

    return NextResponse.json({ error: "Action invalide. Utiliser 'valider' ou 'rejeter'" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const collecteId = searchParams.get("collecte_id");

  let query = supabase.from("corrections").select("*").order("created_at", { ascending: false });
  if (collecteId) query = query.eq("collecte_id", collecteId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
