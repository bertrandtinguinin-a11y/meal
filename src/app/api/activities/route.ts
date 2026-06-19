// API Route: /api/activities — suivi d'activités terrain
// Démarre vide. Les activités sont créées par l'utilisateur.
import { NextResponse } from "next/server";

interface Activity { id: string; type: string; titre: string; description: string; date: string; responsable: string; statut: string; }
const activities: Activity[] = [];

export async function GET() {
  return NextResponse.json(activities);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const a: Activity = {
      id: String(Date.now()), type: body.type || "", titre: body.titre || "",
      description: body.description || "", date: body.date || new Date().toISOString().split("T")[0],
      responsable: body.responsable || "", statut: body.statut || "planifie",
    };
    activities.push(a);
    return NextResponse.json(a, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}
