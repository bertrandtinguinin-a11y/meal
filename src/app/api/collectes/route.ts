// API Route: /api/collectes — CRUD pour les soumissions terrain
import { NextResponse } from "next/server";
import { collectesData, type CollecteData } from "@/lib/data-store";

// Use shared data
const data: CollecteData[] = collectesData;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statut = searchParams.get("statut");
  const collecteur = searchParams.get("collecteur");
  const limit = parseInt(searchParams.get("limit") || "100");

  let result = [...data];
  if (statut) result = result.filter(c => c.statut === statut);
  if (collecteur) result = result.filter(c => c.collecteur_nom?.toLowerCase().includes(collecteur.toLowerCase()));
  result = result.slice(0, limit);

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCollecte: CollecteData = {
      id: String(Date.now()),
      collecteur_id: body.collecteur_id || "",
      collecteur_nom: body.collecteur_nom || "",
      indicateur_id: body.indicateur_id || "",
      indicateur_nom: body.indicateur_nom || "",
      indicateur_code: body.indicateur_code || "",
      localite: body.localite || "",
      zone: body.zone || "",
      date_collecte: body.date_collecte || new Date().toISOString().split("T")[0],
      statut: "en_attente",
      donnees: body.donnees || {},
      note_terrain: body.note_terrain || "",
      created_at: new Date().toISOString(),
    };
    data.unshift(newCollecte);
    return NextResponse.json(newCollecte, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const idx = data.findIndex(c => c.id === body.id);
    if (idx === -1) return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
    data[idx] = { ...data[idx], ...body, updated_at: new Date().toISOString() };
    return NextResponse.json(data[idx]);
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
