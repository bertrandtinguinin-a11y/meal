// API Route: /api/indicateurs — Indicateurs personnalisables
// L'utilisateur crée ses propres indicateurs. Démarre vide.
import { NextResponse } from "next/server";

// Store vide — les utilisateurs ajouteront leurs indicateurs
interface Indicateur { id: string; code: string; nom: string; categorie: string; type_chart: string; unite: string; objectif: number; baseline: number; icone: string; }
const indicateursData: Indicateur[] = [];

export async function GET() {
  return NextResponse.json(indicateursData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ind: Indicateur = {
      id: String(Date.now()), code: body.code || "", nom: body.nom || "",
      categorie: body.categorie || "", type_chart: body.type_chart || "barre",
      unite: body.unite || "", objectif: body.objectif || 0, baseline: body.baseline || 0,
      icone: body.icone || "📊",
    };
    indicateursData.push(ind);
    return NextResponse.json(ind, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
