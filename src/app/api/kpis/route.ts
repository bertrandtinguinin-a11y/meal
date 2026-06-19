// API Route: /api/kpis — Indicateurs clés (agrégés depuis les collectes)
// Démarre vide. Les KPIs sont calculés à partir des collectes validées.
import { NextResponse } from "next/server";

interface Kpi { id: string; nom: string; valeur: number; objectif: number; unite: string; icone: string; evolution: number; }
const kpisData: Kpi[] = [];

export async function GET() {
  return NextResponse.json(kpisData);
}
