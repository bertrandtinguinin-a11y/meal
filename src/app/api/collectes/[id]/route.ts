// API Route: /api/collectes/[id] — Collecte individuelle
import { NextResponse } from "next/server";
import { collectesData } from "@/lib/data-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const collecte = collectesData.find(c => c.id === id);
  if (!collecte) return NextResponse.json({ error: "Collecte introuvable" }, { status: 404 });
  return NextResponse.json(collecte);
}
