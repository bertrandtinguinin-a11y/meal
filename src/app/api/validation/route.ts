// API Route: /api/validation — Approuver/Rejeter avec feedback
// Fallback mémoire si Supabase non configuré
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fallback } from "@/lib/supabase-fallback";

// Stockage mémoire pour les corrections
interface MemCorrection {
  id: string; collecte_id: string; message: string;
  champs_corriges: string[]; faite_par: string;
  repondu: boolean; created_at: string;
}
const correctionsMem: MemCorrection[] = [];
const uid = () => Math.random().toString(36).slice(2, 10);

export async function POST(request: Request) {
  try {
    const { action, collecte_id, message, faite_par, champs_corriges } = await request.json();

    if (!collecte_id || !action) {
      return NextResponse.json({ error: "collecte_id et action requis" }, { status: 400 });
    }

    if (!fallback.isConfigured()) {
      const collectes = fallback.getCollectes();
      const collecte = collectes.find((c) => c.id === collecte_id);
      if (!collecte) {
        return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
      }

      if (action === "valider") {
        collecte.statut = "valide";
        return NextResponse.json({ success: true, message: "Collecte validée ✅", collecte });
      }

      if (action === "rejeter") {
        if (!message) return NextResponse.json({ error: "Message requis" }, { status: 400 });
        collecte.statut = "rejete";
        const correction: MemCorrection = {
          id: uid(),
          collecte_id,
          message,
          champs_corriges: champs_corriges || [],
          faite_par: faite_par || "Superviseur",
          repondu: false,
          created_at: new Date().toISOString(),
        };
        correctionsMem.push(correction);
        return NextResponse.json({ success: true, message: "🔴 Rejetée", correction });
      }

      return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    }

    // Supabase
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
      return NextResponse.json({ success: true, message: "Collecte validée ✅", collecte: data });
    }

    if (action === "rejeter") {
      if (!message) return NextResponse.json({ error: "Message requis" }, { status: 400 });

      await supabase
        .from("collectes")
        .update({ statut: "rejete", validation_date: new Date().toISOString(), validated_by: faite_par || "Superviseur" })
        .eq("id", collecte_id);

      const { data: correction, error: corrErr } = await supabase
        .from("corrections")
        .insert({ collecte_id, message, champs_corriges: champs_corriges || [], faite_par: faite_par || "Superviseur", repondu: false })
        .select()
        .single();

      if (corrErr) return NextResponse.json({ error: corrErr.message }, { status: 500 });
      return NextResponse.json({ success: true, message: "🔴 Rejetée", correction });
    }

    return NextResponse.json({ error: "Action invalide" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  if (!fallback.isConfigured()) {
    return NextResponse.json(correctionsMem);
  }

  const { searchParams } = new URL(request.url);
  const collecteId = searchParams.get("collecte_id");
  let query = supabase.from("corrections").select("*").order("created_at", { ascending: false });
  if (collecteId) query = query.eq("collecte_id", collecteId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
