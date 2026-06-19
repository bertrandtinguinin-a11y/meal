// API Route: /api/vues — Vues d'analyse personnalisables
import { NextResponse } from "next/server";

type VueConfig = { indicateur_id: string; type_chart: string; taille: string; periode: number };
interface Vue { id: string; nom: string; description: string; config: VueConfig[]; est_defaut: boolean; created_at: string; }

let vues: Vue[] = [];

export async function GET() {
  return NextResponse.json(vues);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newVue = {
      id: `v${Date.now()}`,
      ...body,
      created_at: new Date().toISOString().split("T")[0],
    };
    vues.push(newVue);
    return NextResponse.json(newVue, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const index = vues.findIndex(v => v.id === body.id);
    if (index === -1) return NextResponse.json({ error: "Vue introuvable" }, { status: 404 });
    vues[index] = { ...vues[index], ...body };
    return NextResponse.json(vues[index]);
  } catch {
    return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });
  vues = vues.filter(v => v.id !== id);
  return NextResponse.json({ success: true });
}
