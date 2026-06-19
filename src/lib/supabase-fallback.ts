// Fallback mémoire pour les API routes (mode démo sans Supabase)
// Module-level cache — prérempli avec un projet micro-entrepreneurs
// Marecharge & Transformation Agro-Alimentaire

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

const isSupabaseConfigured = () =>
  !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

let idCounter = 0;
const uid = () => `mem_${++idCounter}_${Date.now().toString(36)}`;

// ========== DONNÉES DÉMO : Micro-entrepreneurs Marecharge & Agro-Alimentaire ==========

const seedCollecteurs: FallbackCollecteur[] = [
  { id: uid(), nom: "ADJOVI B. Rachel", role: "agent_terrain", zone: "Lac Nokoué", telephone: "+229 91 00 01 01", actif: true, nb_collectes: 12, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), nom: "BOKO Bienvenu", role: "agent_terrain", zone: "Zè", telephone: "+229 91 00 01 02", actif: true, nb_collectes: 8, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), nom: "DEGUENON Alassane", role: "facilitateur", zone: "Dassa-Zoumè", telephone: "+229 91 00 01 03", actif: true, nb_collectes: 15, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), nom: "GNONLONFHOUN B. Clarisse", role: "agent_terrain", zone: "Abomey-Calavi", telephone: "+229 91 00 01 04", actif: true, nb_collectes: 6, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), nom: "HOUNKPONOU Basile", role: "agent_terrain", zone: "So-Ava", telephone: "+229 91 00 01 05", actif: true, nb_collectes: 10, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), nom: "KPADE C. Thérèse", role: "agent_terrain", zone: "Porto-Novo", telephone: "+229 91 00 01 06", actif: true, nb_collectes: 4, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), nom: "SAGBO Florent", role: "superviseur", zone: "Toutes zones sud", telephone: "+229 91 00 01 07", actif: true, nb_collectes: 0, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), nom: "TOGBE J. Mireille", role: "ASC", zone: "Grand-Popo", telephone: "+229 91 00 01 08", actif: true, nb_collectes: 7, created_at: "2026-03-01T08:00:00Z" },
];

const seedIndicateurs: FallbackIndicateur[] = [
  // Marecharge (Pisciculture)
  { id: uid(), code: "P-1", nom: "Nombre d'étangs aménagés", categorie: "Marecharge", type_chart: "barre", unite: "étangs", objectif: 50, baseline: 12, icone: "🏞️", valeur_courante: 28, ordre: 1, actif: true, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), code: "P-2", nom: "Alevins mis en charge", categorie: "Marecharge", type_chart: "barre", unite: "milliers", objectif: 100, baseline: 30, icone: "🐟", valeur_courante: 65, ordre: 2, actif: true, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), code: "R-1", nom: "Taux de survie des alevins", categorie: "Marecharge", type_chart: "jauge", unite: "%", objectif: 80, baseline: 40, icone: "📈", valeur_courante: 62, ordre: 3, actif: true, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), code: "R-2", nom: "Production de poisson (tonnes)", categorie: "Marecharge", type_chart: "ligne", unite: "tonnes", objectif: 25, baseline: 5, icone: "⚖️", valeur_courante: 14, ordre: 4, actif: true, created_at: "2026-03-01T08:00:00Z" },
  // Transformation Agro-Alimentaire
  { id: uid(), code: "P-3", nom: "Unités de transformation installées", categorie: "Agro-Alimentaire", type_chart: "barre", unite: "unités", objectif: 30, baseline: 8, icone: "🏭", valeur_courante: 18, ordre: 5, actif: true, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), code: "P-4", nom: "Tonnes de produits transformés", categorie: "Agro-Alimentaire", type_chart: "barre", unite: "tonnes", objectif: 60, baseline: 15, icone: "📦", valeur_courante: 35, ordre: 6, actif: true, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), code: "R-3", nom: "Taux de conformité sanitaire", categorie: "Agro-Alimentaire", type_chart: "jauge", unite: "%", objectif: 95, baseline: 50, icone: "✅", valeur_courante: 72, ordre: 7, actif: true, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), code: "R-4", nom: "Chiffre d'affaires moyen/unité", categorie: "Agro-Alimentaire", type_chart: "ligne", unite: "1000 FCFA", objectif: 5000, baseline: 1200, icone: "💰", valeur_courante: 2800, ordre: 8, actif: true, created_at: "2026-03-01T08:00:00Z" },
  // Impact & Genre
  { id: uid(), code: "I-1", nom: "Emplois créés (jeunes 18-35 ans)", categorie: "Impact", type_chart: "ligne", unite: "emplois", objectif: 200, baseline: 45, icone: "👥", valeur_courante: 110, ordre: 9, actif: true, created_at: "2026-03-01T08:00:00Z" },
  { id: uid(), code: "G-1", nom: "Femmes bénéficiaires actives", categorie: "Genre", type_chart: "jauge", unite: "%", objectif: 60, baseline: 25, icone: "👩‍🌾", valeur_courante: 42, ordre: 10, actif: true, created_at: "2026-03-01T08:00:00Z" },
];

const seedCollectes: FallbackCollecte[] = [
  { id: uid(), collecteur_id: seedCollecteurs[0].id, collecteur_nom: "ADJOVI B. Rachel", indicateur_id: seedIndicateurs[0].id, indicateur_nom: "Nombre d'étangs aménagés", indicateur_code: "P-1", localite: "Ganvié", zone: "Lac Nokoué", date_collecte: "2026-05-10", statut: "valide", donnees: { total: 8, femmes: 3, hommes: 5 }, note_terrain: "3 nouveaux étangs creusés ce mois", created_at: "2026-05-10T14:30:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[0].id, collecteur_nom: "ADJOVI B. Rachel", indicateur_id: seedIndicateurs[1].id, indicateur_nom: "Alevins mis en charge", indicateur_code: "P-2", localite: "Vidjè", zone: "Lac Nokoué", date_collecte: "2026-05-12", statut: "valide", donnees: { total: 12000, espece: "tilapia" }, note_terrain: "Alevins de bonne qualité", created_at: "2026-05-12T10:15:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[1].id, collecteur_nom: "BOKO Bienvenu", indicateur_id: seedIndicateurs[2].id, indicateur_nom: "Taux de survie des alevins", indicateur_code: "R-1", localite: "Koussin", zone: "Zè", date_collecte: "2026-05-15", statut: "valide", donnees: { taux: 68, mortalite_estimee: 32 }, note_terrain: "Qualité d'eau correcte", created_at: "2026-05-15T09:00:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[2].id, collecteur_nom: "DEGUENON Alassane", indicateur_id: seedIndicateurs[4].id, indicateur_nom: "Unités de transformation installées", indicateur_code: "P-3", localite: "Dassa", zone: "Dassa-Zoumè", date_collecte: "2026-05-18", statut: "en_attente", donnees: { unites: 3, type: "manioc", capacite_tonnes: 5 }, note_terrain: "2 séchoirs solaires installés", created_at: "2026-05-18T11:45:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[2].id, collecteur_nom: "DEGUENON Alassane", indicateur_id: seedIndicateurs[5].id, indicateur_nom: "Tonnes de produits transformés", indicateur_code: "P-4", localite: "Gbanlin", zone: "Dassa-Zoumè", date_collecte: "2026-05-20", statut: "en_attente", donnees: { total: 4.5, farine: 2, cossettes: 2.5 }, note_terrain: "", created_at: "2026-05-20T16:00:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[3].id, collecteur_nom: "GNONLONFHOUN B. Clarisse", indicateur_id: seedIndicateurs[2].id, indicateur_nom: "Taux de survie des alevins", indicateur_code: "R-1", localite: "Zogbadjè", zone: "Abomey-Calavi", date_collecte: "2026-05-22", statut: "rejete", donnees: { taux: 45 }, note_terrain: "Beaucoup de mortalité observée", created_at: "2026-05-22T08:30:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[4].id, collecteur_nom: "HOUNKPONOU Basile", indicateur_id: seedIndicateurs[3].id, indicateur_nom: "Production de poisson (tonnes)", indicateur_code: "R-2", localite: "Ahomey-Gblon", zone: "So-Ava", date_collecte: "2026-05-25", statut: "valide", donnees: { total: 2.8, espece_principale: "clarias" }, note_terrain: "Bonne récolte, marché local preneur", created_at: "2026-05-25T13:20:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[5].id, collecteur_nom: "KPADE C. Thérèse", indicateur_id: seedIndicateurs[8].id, indicateur_nom: "Emplois créés (jeunes 18-35 ans)", indicateur_code: "I-1", localite: "Adjohoun", zone: "Porto-Novo", date_collecte: "2026-06-01", statut: "en_attente", donnees: { total: 15, femmes: 10, hommes: 5 }, note_terrain: "Jeunes formés à la transformation du gari", created_at: "2026-06-01T15:00:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[4].id, collecteur_nom: "HOUNKPONOU Basile", indicateur_id: seedIndicateurs[6].id, indicateur_nom: "Taux de conformité sanitaire", indicateur_code: "R-3", localite: "Sô-Ava", zone: "So-Ava", date_collecte: "2026-06-03", statut: "en_attente", donnees: { taux: 70, inspections: 5, conformes: 3 }, note_terrain: "2 unités doivent améliorer le séchage", created_at: "2026-06-03T09:10:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[7].id, collecteur_nom: "TOGBE J. Mireille", indicateur_id: seedIndicateurs[7].id, indicateur_nom: "Chiffre d'affaires moyen/unité", indicateur_code: "R-4", localite: "Grand-Popo", zone: "Grand-Popo", date_collecte: "2026-06-05", statut: "en_attente", donnees: { ca_moyen: 245000, min: 85000, max: 520000 }, note_terrain: "Bonne progression vs trimestre dernier", created_at: "2026-06-05T10:00:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[7].id, collecteur_nom: "TOGBE J. Mireille", indicateur_id: seedIndicateurs[9].id, indicateur_nom: "Femmes bénéficiaires actives", indicateur_code: "G-1", localite: "Hounvè", zone: "Grand-Popo", date_collecte: "2026-06-07", statut: "valide", donnees: { total: 22, pourcentage: 44 }, note_terrain: "Groupe de femmes dynamiques sur le poisson fumé", created_at: "2026-06-07T11:30:00Z" },
  { id: uid(), collecteur_id: seedCollecteurs[3].id, collecteur_nom: "GNONLONFHOUN B. Clarisse", indicateur_id: seedIndicateurs[5].id, indicateur_nom: "Tonnes de produits transformés", indicateur_code: "P-4", localite: "Kinwédji", zone: "Abomey-Calavi", date_collecte: "2026-06-10", statut: "en_attente", donnees: { total: 6.2, farine_basilic: 1.5, huile_palme: 4.7 }, note_terrain: "Nouvelle presse à huile fonctionnelle", created_at: "2026-06-10T14:00:00Z" },
];

// Copier dans le store mémoire
const collecteursMem: FallbackCollecteur[] = [...seedCollecteurs];
const indicateursMem: FallbackIndicateur[] = [...seedIndicateurs];
const collectesMem: FallbackCollecte[] = [...seedCollectes];

// === FONCTIONS D'EXPORT ===
export const fallback = {
  isConfigured: isSupabaseConfigured,

  // --- Collecteurs ---
  getCollecteurs: () => collecteursMem,

  addCollecteur: (data: Partial<FallbackCollecteur>) => {
    const c: FallbackCollecteur = {
      id: uid(), nom: data.nom || "Sans nom", role: data.role || "agent_terrain",
      zone: data.zone || "", telephone: data.telephone || "", actif: true,
      nb_collectes: 0, created_at: new Date().toISOString(),
    };
    collecteursMem.push(c);
    return c;
  },

  deleteCollecteur: (id: string) => {
    const idx = collecteursMem.findIndex(c => c.id === id);
    if (idx === -1) return false;
    collecteursMem.splice(idx, 1);
    return true;
  },

  // --- Indicateurs ---
  getIndicateurs: () => indicateursMem,

  addIndicateur: (data: Partial<FallbackIndicateur>) => {
    const idx = indicateursMem.reduce((max, i) => Math.max(max, i.ordre || 0), 0) + 1;
    const ind: FallbackIndicateur = {
      id: uid(), code: data.code || `I-${idx}`, nom: data.nom || "Nouvel indicateur",
      categorie: data.categorie || "Produit", type_chart: data.type_chart || "barre",
      unite: data.unite || "unité", objectif: data.objectif || 0, baseline: data.baseline || 0,
      icone: data.icone || "📊", valeur_courante: 0, ordre: idx, actif: true,
      created_at: new Date().toISOString(),
    };
    indicateursMem.push(ind);
    return ind;
  },

  deleteIndicateur: (id: string) => {
    const idx = indicateursMem.findIndex(i => i.id === id);
    if (idx === -1) return false;
    indicateursMem.splice(idx, 1);
    return true;
  },

  // --- Collectes ---
  getCollectes: () => collectesMem,

  addCollecte: (data: Partial<FallbackCollecte>) => {
    const col: FallbackCollecte = {
      id: uid(), collecteur_id: data.collecteur_id || "",
      collecteur_nom: data.collecteur_nom || "",
      indicateur_id: data.indicateur_id || "",
      indicateur_nom: data.indicateur_nom || "",
      indicateur_code: data.indicateur_code || "",
      localite: data.localite || "", zone: data.zone || "",
      date_collecte: new Date().toISOString().slice(0, 10),
      statut: "en_attente", donnees: data.donnees || {},
      note_terrain: data.note_terrain || "",
      created_at: new Date().toISOString(),
    };
    collectesMem.push(col);
    return col;
  },

  updateCollecte: (id: string, updates: Partial<FallbackCollecte>) => {
    const idx = collectesMem.findIndex(c => c.id === id);
    if (idx === -1) return null;
    collectesMem[idx] = { ...collectesMem[idx], ...updates };
    return collectesMem[idx];
  },

  deleteCollecte: (id: string) => {
    const idx = collectesMem.findIndex(c => c.id === id);
    if (idx === -1) return false;
    collectesMem.splice(idx, 1);
    return true;
  },

  // --- Stats ---
  getStats: () => ({
    collecteurs: collecteursMem.length,
    indicateurs: indicateursMem.length,
    collectes: collectesMem.length,
    validees: collectesMem.filter(c => c.statut === "valide").length,
    en_attente: collectesMem.filter(c => c.statut === "en_attente").length,
    rejetees: collectesMem.filter(c => c.statut === "rejete").length,
  }),
};
