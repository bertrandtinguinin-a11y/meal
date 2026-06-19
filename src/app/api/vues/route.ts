// API Route: /api/vues — Vues d'analyse personnalisables
import { NextResponse } from "next/server";

let vues = [
  {
    id: "v1",
    nom: "Dashboard Suivi Trimestriel",
    description: "Vue par défaut — indicateurs clés du trimestre",
    est_defaut: true,
    created_at: "2026-03-01",
    config: [
      { indicateur_code: "P-1", type_chart: "barre", taille: "pleine", periode: 6 },
      { indicateur_code: "P-4", type_chart: "barre", taille: "pleine", periode: 6 },
      { indicateur_code: "R-1", type_chart: "jauge", taille: "demi", periode: 3 },
      { indicateur_code: "G-1", type_chart: "jauge", taille: "demi", periode: 3 },
      { indicateur_code: "P-7", type_chart: "ligne", taille: "pleine", periode: 6 },
    ],
  },
  {
    id: "v2",
    nom: "Focus Genre",
    description: "Indicateurs désagrégés par sexe",
    est_defaut: false,
    created_at: "2026-03-15",
    config: [
      { indicateur_code: "P-1F", type_chart: "jauge", taille: "pleine", periode: 3 },
      { indicateur_code: "G-1", type_chart: "barre", taille: "pleine", periode: 6 },
      { indicateur_code: "G-2", type_chart: "barre", taille: "pleine", periode: 6 },
    ],
  },
  {
    id: "v3",
    nom: "Suivi Production Agricole",
    description: "Rendements et distribution d'intrants",
    est_defaut: false,
    created_at: "2026-03-20",
    config: [
      { indicateur_code: "R-3", type_chart: "ligne", taille: "pleine", periode: 6 },
      { indicateur_code: "P-4", type_chart: "barre", taille: "pleine", periode: 6 },
      { indicateur_code: "P-5", type_chart: "jauge", taille: "demi", periode: 3 },
      { indicateur_code: "P-6", type_chart: "barre", taille: "demi", periode: 6 },
    ],
  },
];

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
