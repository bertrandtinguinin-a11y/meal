// API Route: /api/collecteurs — Agents de terrain
// L'utilisateur crée ses propres collecteurs. Démarre vide.
import { NextResponse } from "next/server";

interface Collecteur { id: string; nom: string; role: string; zone: string; telephone: string; }
const collecteursData: Collecteur[] = [];

export async function GET() {
  return NextResponse.json(collecteursData);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const c: Collecteur = {
      id: String(Date.now()), nom: body.nom || "", role: body.role || "agent_terrain",
      zone: body.zone || "", telephone: body.telephone || "",
    };
    collecteursData.push(c);
    return NextResponse.json(c, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
