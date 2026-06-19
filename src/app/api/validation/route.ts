// API Route: /api/validation — Approuver/Rejeter avec feedback
import { NextResponse } from "next/server";
import { collectesData, correctionsData, type CorrectionData } from "@/lib/data-store";

export async function POST(request: Request) {
  try {
    const { action, collecte_id, message, faite_par, champs_corriges } = await request.json();

    if (!collecte_id || !action) {
      return NextResponse.json({ error: "collecte_id et action requis" }, { status: 400 });
    }

    const idx = collectesData.findIndex(c => c.id === collecte_id);
    if (idx === -1) {
      return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
    }

    if (action === "valider") {
      collectesData[idx] = {
        ...collectesData[idx],
        statut: "valide",
        validation_date: new Date().toISOString(),
        validated_by: faite_par || "Superviseur",
      };
      return NextResponse.json({
        success: true,
        message: "Collecte validée ✅ — indicateur mis à jour",
        collecte: collectesData[idx],
      });
    }

    if (action === "rejeter") {
      if (!message) {
        return NextResponse.json({ error: "Un message de correction est requis" }, { status: 400 });
      }

      collectesData[idx] = {
        ...collectesData[idx],
        statut: "rejete",
        validation_date: new Date().toISOString(),
        validated_by: faite_par || "Superviseur",
      };

      const correction: CorrectionData = {
        id: `corr${Date.now()}`,
        collecte_id,
        message,
        champs_corriges: champs_corriges || [],
        faite_par: faite_par || "Superviseur",
        repondu: false,
        created_at: new Date().toISOString(),
      };
      correctionsData.unshift(correction);

      return NextResponse.json({
        success: true,
        message: "🔴 Collecte rejetée — feedback envoyé au terrain",
        collecte: collectesData[idx],
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
  if (collecteId) {
    return NextResponse.json(correctionsData.filter(c => c.collecte_id === collecteId));
  }
  return NextResponse.json(correctionsData);
}
