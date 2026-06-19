// API Route: /api/collecteurs — Liste des collecteurs terrain
import { NextResponse } from "next/server";

const collecteurs = [
  { id: "c1", nom: "Mathieu Kpanou", role: "facilitateur", zone: "Zone A", telephone: "+229 91 01 00 10", nb_collectes: 45, nb_corrections: 3, taux_erreur: 6.7, actif: true },
  { id: "c2", nom: "Fatima Bio", role: "ASC", zone: "Zone A", telephone: "+229 97 11 20 30", nb_collectes: 28, nb_corrections: 1, taux_erreur: 3.6, actif: true },
  { id: "c3", nom: "Inoussa Garba", role: "agent_terrain", zone: "Zone B", telephone: "+229 90 05 15 25", nb_collectes: 62, nb_corrections: 7, taux_erreur: 11.3, actif: true },
  { id: "c4", nom: "Bintou Diallo", role: "ASC", zone: "Zone B", telephone: "+229 94 10 50 60", nb_collectes: 19, nb_corrections: 0, taux_erreur: 0, actif: true },
  { id: "c5", nom: "Cyrille Hounsou", role: "facilitateur", zone: "Zone C", telephone: "+229 96 30 40 50", nb_collectes: 33, nb_corrections: 2, taux_erreur: 6.1, actif: true },
  { id: "c6", nom: "Aminata Traoré", role: "ASC", zone: "Zone C", telephone: "+229 61 12 34 56", nb_collectes: 12, nb_corrections: 0, taux_erreur: 0, actif: true },
  { id: "c7", nom: "Souleymane Yaya", role: "agent_terrain", zone: "Zone A", telephone: "+229 97 40 50 60", nb_collectes: 51, nb_corrections: 5, taux_erreur: 9.8, actif: true },
  { id: "c8", nom: "Rosine Ahyi", role: "facilitateur", zone: "Zone B", telephone: "+229 95 00 11 22", nb_collectes: 37, nb_corrections: 1, taux_erreur: 2.7, actif: true },
];

export async function GET() {
  return NextResponse.json(collecteurs);
}
