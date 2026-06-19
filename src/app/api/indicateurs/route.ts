// API Route: /api/indicateurs — Tous les indicateurs avec valeurs calculées
import { NextResponse } from "next/server";

const indicateurs = [
  { id: "i-1", code: "I-1", nom: "Prévalence stunting enfants <5 ans", categorie: "Impact", type_chart: "jauge", unite: "%", objectif: 15, baseline: 35, valeur_courante: 32, icone: "📉", ordre: 1, desagregation: ["sexe", "commune"] },
  { id: "i-2", code: "I-2", nom: "Taux mortalité infanto-juvénile", categorie: "Impact", type_chart: "ligne", unite: "‰", objectif: 85, baseline: 115, valeur_courante: 110, icone: "⚠️", ordre: 2 },
  { id: "i-3", code: "R-1", nom: "Ménages en sécurité alimentaire (HFIAS ≤7)", categorie: "Realisation", type_chart: "barre", unite: "%", objectif: 70, baseline: 28, valeur_courante: 36, icone: "🌾", ordre: 3 },
  { id: "i-4", code: "R-2", nom: "Score Diversité Alimentaire (SDAM)", categorie: "Realisation", type_chart: "barre", unite: "/12", objectif: 6.5, baseline: 4.2, valeur_courante: 4.8, icone: "🥗", ordre: 4 },
  { id: "i-5", code: "R-3", nom: "Rendement cultures (t/ha)", categorie: "Realisation", type_chart: "ligne", unite: "t/ha", objectif: 3.0, baseline: 1.84, valeur_courante: 2.1, icone: "🌽", ordre: 5 },
  { id: "i-6", code: "R-4", nom: "Femmes allaitement exclusif 0-6 mois", categorie: "Realisation", type_chart: "jauge", unite: "%", objectif: 60, baseline: 31, valeur_courante: 34, icone: "🍼", ordre: 6 },
  { id: "i-7", code: "P-1", nom: "Agriculteurs formés (total)", categorie: "Produit", type_chart: "barre", unite: "personnes", objectif: 3000, baseline: 0, valeur_courante: 420, icone: "👨‍🌾", ordre: 7 },
  { id: "i-8", code: "P-1F", nom: "Agriculteurs formés — dont femmes", categorie: "Genre", type_chart: "jauge", unite: "%", objectif: 50, baseline: 30, valeur_courante: 39, icone: "👩‍🌾", ordre: 8 },
  { id: "i-9", code: "P-2", nom: "Sessions de formation organisées", categorie: "Produit", type_chart: "barre", unite: "sessions", objectif: 120, baseline: 0, valeur_courante: 21, icone: "📚", ordre: 9 },
  { id: "i-10", code: "P-3", nom: "Score connaissance post-formation", categorie: "Produit", type_chart: "barre", unite: "/100", objectif: 80, baseline: 0, valeur_courante: 74, icone: "📝", ordre: 10 },
  { id: "i-11", code: "P-4", nom: "Kits semences améliorées distribués", categorie: "Produit", type_chart: "barre", unite: "kits", objectif: 3000, baseline: 0, valeur_courante: 620, icone: "🌰", ordre: 11 },
  { id: "i-12", code: "P-5", nom: "Bénéficiaires ayant utilisé le kit", categorie: "Produit", type_chart: "jauge", unite: "%", objectif: 85, baseline: 0, valeur_courante: 72, icone: "✅", ordre: 12 },
  { id: "i-13", code: "P-7", nom: "Femmes en CPN nutritionnelle", categorie: "Produit", type_chart: "barre", unite: "femmes", objectif: 600, baseline: 0, valeur_courante: 78, icone: "🤰", ordre: 13 },
  { id: "i-14", code: "P-8", nom: "Enfants <5 ans dépistés MUAC", categorie: "Produit", type_chart: "barre", unite: "enfants", objectif: 1200, baseline: 0, valeur_courante: 198, icone: "👶", ordre: 14 },
  { id: "i-15", code: "P-9", nom: "Séances IEC nutrition organisées", categorie: "Produit", type_chart: "ligne", unite: "sessions", objectif: 144, baseline: 0, valeur_courante: 40, icone: "📢", ordre: 15 },
  { id: "i-16", code: "A-1", nom: "Taux exécution plan activités", categorie: "Processus", type_chart: "jauge", unite: "%", objectif: 85, baseline: 0, valeur_courante: 71, icone: "📋", ordre: 16 },
  { id: "i-17", code: "A-2", nom: "Taux utilisation budget", categorie: "Processus", type_chart: "jauge", unite: "%", objectif: 85, baseline: 0, valeur_courante: 62, icone: "💰", ordre: 17 },
  { id: "i-18", code: "G-1", nom: "Participation femmes aux formations", categorie: "Genre", type_chart: "barre", unite: "%", objectif: 50, baseline: 30, valeur_courante: 39, icone: "♀️", ordre: 18 },
  { id: "i-19", code: "G-2", nom: "Histoires de changement documentées", categorie: "Genre", type_chart: "barre", unite: "histoires", objectif: 20, baseline: 0, valeur_courante: 3, icone: "📖", ordre: 19 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorie = searchParams.get("categorie");
  const code = searchParams.get("code");

  let result = [...indicateurs];
  if (categorie) result = result.filter(i => i.categorie === categorie);
  if (code) result = result.filter(i => i.code === code);

  // Ajouter l'historique simulé (6 mois)
  result = result.map(ind => ({
    ...ind,
    historique: genererHistorique(ind.id, ind.valeur_courante, ind.objectif),
  }));

  return NextResponse.json(result);
}

function genererHistorique(id: string, valeurCourante: number, objectif: number) {
  const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin"];
  return mois.map((m, i) => ({
    mois: m,
    valeur: Math.round((valeurCourante * (0.6 + i * 0.08 + Math.random() * 0.1)) * 100) / 100,
    objectif: objectif,
  }));
}
