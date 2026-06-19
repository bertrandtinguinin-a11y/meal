// Fallback mémoire pour les API routes quand Supabase n'est pas configuré
// Stockage partagé entre les requêtes (module-level cache)

interface FallbackCollecteur {
  id: string; nom: string; role: string; zone: string; telephone?: string;
  actif: boolean; nb_collectes: number; created_at: string;
}

interface FallbackIndicateur {
  id: string; code: string; nom: string; categorie: string;
  type_chart: string; unite: string; objectif: number; baseline: number;
  icone: string; valeur_courante: number; ordre: number; actif: boolean;
  created_at: string;
}

interface FallbackCollecte {
  id: string; collecteur_id: string; collecteur_nom: string;
  indicateur_id: string; indicateur_nom: string; indicateur_code: string;
  localite: string; zone: string; date_collecte: string;
  statut: string; donnees: Record<string, any>; note_terrain?: string;
  created_at: string;
}

// Vérifier si Supabase est configurée
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

// Générateur d'ID simple
const uid = () => Math.random().toString(36).slice(2, 10);

// Module-level store (survit entre les requêtes en mémoire)
let collIdx = 0;
let indIdx = 0;
const collecteursMem: FallbackCollecteur[] = [];
const indicateursMem: FallbackIndicateur[] = [];
const collectesMem: FallbackCollecte[] = [];

export const fallback = {
  isConfigured: isSupabaseConfigured,

  // --- Collecteurs ---
  getCollecteurs: (): FallbackCollecteur[] => collecteursMem,

  addCollecteur: (data: Partial<FallbackCollecteur>): FallbackCollecteur => {
    const c: FallbackCollecteur = {
      id: uid(),
      nom: data.nom || "Sans nom",
      role: data.role || "agent_terrain",
      zone: data.zone || "",
      telephone: data.telephone || "",
      actif: true,
      nb_collectes: 0,
      created_at: new Date().toISOString(),
    };
    collecteursMem.push(c);
    return c;
  },

  // --- Indicateurs ---
  getIndicateurs: (): FallbackIndicateur[] => indicateursMem,

  addIndicateur: (data: Partial<FallbackIndicateur>): FallbackIndicateur => {
    collIdx++;
    const ind: FallbackIndicateur = {
      id: uid(),
      code: data.code || `I-${collIdx}`,
      nom: data.nom || "Nouvel indicateur",
      categorie: data.categorie || "Produit",
      type_chart: data.type_chart || "barre",
      unite: data.unite || "unité",
      objectif: data.objectif || 0,
      baseline: data.baseline || 0,
      icone: data.icone || "📊",
      valeur_courante: 0,
      ordre: data.ordre || indIdx++,
      actif: true,
      created_at: new Date().toISOString(),
    };
    indicateursMem.push(ind);
    return ind;
  },

  // --- Collectes ---
  getCollectes: (): FallbackCollecte[] => collectesMem,

  addCollecte: (data: Partial<FallbackCollecte>): FallbackCollecte => {
    const col: FallbackCollecte = {
      id: uid(),
      collecteur_id: data.collecteur_id || "",
      collecteur_nom: data.collecteur_nom || "",
      indicateur_id: data.indicateur_id || "",
      indicateur_nom: data.indicateur_nom || "",
      indicateur_code: data.indicateur_code || "",
      localite: data.localite || "",
      zone: data.zone || "",
      date_collecte: new Date().toISOString().slice(0, 10),
      statut: "en_attente",
      donnees: data.donnees || {},
      note_terrain: data.note_terrain || "",
      created_at: new Date().toISOString(),
    };
    collectesMem.push(col);
    return col;
  },
};
