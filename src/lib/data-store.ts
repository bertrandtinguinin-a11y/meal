// Données partagées entre les API routes MEAL
// Simule Supabase en attendant la connexion réelle

export interface CollecteData {
  id: string; collecteur_id: string; collecteur_nom: string;
  indicateur_id: string; indicateur_nom: string; indicateur_code: string;
  localite: string; zone: string; date_collecte: string;
  statut: string; donnees: Record<string, any>;
  note_terrain: string; created_at: string;
  validation_date?: string; validated_by?: string;
}

export interface CorrectionData {
  id: string; collecte_id: string; message: string;
  champs_corriges: string[]; faite_par: string;
  repondu: boolean; reponse?: string; created_at: string;
}

// Données initiales
export const collectesData: CollecteData[] = [
  { id: "1", collecteur_id: "c1", collecteur_nom: "Mathieu Kpanou", indicateur_id: "i-7", indicateur_nom: "Agriculteurs formés", indicateur_code: "P-1", localite: "NKP-01", zone: "Zone A", date_collecte: "2026-01-15", statut: "valide", donnees: { hommes: 25, femmes: 12, total: 37 }, note_terrain: "Formation terminée. Bonne participation.", created_at: "2026-01-15T08:00:00Z", validation_date: "2026-01-17T10:00:00Z", validated_by: "Bertrand" },
  { id: "2", collecteur_id: "c1", collecteur_nom: "Mathieu Kpanou", indicateur_id: "i-8", indicateur_nom: "Agriculteurs formés — dont femmes", indicateur_code: "P-1F", localite: "NKP-01", zone: "Zone A", date_collecte: "2026-01-15", statut: "valide", donnees: { total_femmes: 12, pct_femmes: 32.4 }, note_terrain: "Les femmes moins nombreuses.", created_at: "2026-01-15T08:00:00Z", validation_date: "2026-01-17T10:00:00Z", validated_by: "Bertrand" },
  { id: "3", collecteur_id: "c2", collecteur_nom: "Fatima Bio", indicateur_id: "i-15", indicateur_nom: "Femmes en CPN nutritionnelle", indicateur_code: "P-7", localite: "NKP-02", zone: "Zone A", date_collecte: "2026-02-10", statut: "valide", donnees: { nouvelles_cpn: 8, total_suivies: 15 }, note_terrain: "CPN bien suivies.", created_at: "2026-02-10T10:00:00Z", validation_date: "2026-02-12T08:00:00Z", validated_by: "Bertrand" },
  { id: "4", collecteur_id: "c3", collecteur_nom: "Inoussa Garba", indicateur_id: "i-13", indicateur_nom: "Kits semences distribués", indicateur_code: "P-4", localite: "NKP-03", zone: "Zone B", date_collecte: "2026-03-10", statut: "en_attente", donnees: { kits_distribues: 45, type_semence: "mais_ameliore" }, note_terrain: "3 nouveaux villages.", created_at: "2026-03-10T09:30:00Z" },
  { id: "5", collecteur_id: "c3", collecteur_nom: "Inoussa Garba", indicateur_id: "i-7", indicateur_nom: "Agriculteurs formés", indicateur_code: "P-1", localite: "NKP-04", zone: "Zone B", date_collecte: "2026-03-12", statut: "rejete", donnees: { hommes: 18, femmes: 5, total: 23 }, note_terrain: "Session écourtée pluie.", created_at: "2026-03-12T14:00:00Z", validation_date: "2026-03-13T10:00:00Z", validated_by: "Bertrand" },
  { id: "6", collecteur_id: "c4", collecteur_nom: "Bintou Diallo", indicateur_id: "i-17", indicateur_nom: "Séances IEC nutrition", indicateur_code: "P-9", localite: "NKP-03", zone: "Zone B", date_collecte: "2026-02-20", statut: "valide", donnees: { seances: 4, participants_h: 38, participants_f: 52 }, note_terrain: "Bonne participation mères.", created_at: "2026-02-20T11:00:00Z", validation_date: "2026-02-22T09:00:00Z", validated_by: "Bertrand" },
  { id: "7", collecteur_id: "c5", collecteur_nom: "Cyrille Hounsou", indicateur_id: "i-11", indicateur_nom: "Sessions de formation", indicateur_code: "P-2", localite: "NKP-05", zone: "Zone C", date_collecte: "2026-03-05", statut: "en_attente", donnees: { sessions_prevues: 5, sessions_realisees: 5, total_participants: 112 }, note_terrain: "100% tenues.", created_at: "2026-03-05T16:00:00Z" },
  { id: "8", collecteur_id: "c7", collecteur_nom: "Souleymane Yaya", indicateur_id: "i-13", indicateur_nom: "Kits semences distribués", indicateur_code: "P-4", localite: "NKP-01", zone: "Zone A", date_collecte: "2026-02-28", statut: "corrige", donnees: { kits_distribues: 35, type_semence: "sorgho_ameliore" }, note_terrain: "Distribution terminée.", created_at: "2026-02-28T07:00:00Z" },
  { id: "9", collecteur_id: "c8", collecteur_nom: "Rosine Ahyi", indicateur_id: "i-3", indicateur_nom: "Ménages sécurité alim.", indicateur_code: "R-1", localite: "NKP-03", zone: "Zone B", date_collecte: "2026-03-18", statut: "en_attente", donnees: { menages_enquete: 80, hfias_moyen: 6.2, menages_securises: 52 }, note_terrain: "Enquête HFIAS en cours.", created_at: "2026-03-18T10:30:00Z" },
];

export const correctionsData: CorrectionData[] = [
  { id: "corr1", collecte_id: "5", message: "Le nombre de participants semble bas (prévu 35, déclaré 23). Peux-tu vérifier et corriger ?", champs_corriges: ["hommes", "femmes", "total"], faite_par: "Bertrand", repondu: true, created_at: "2026-03-13T10:00:00Z" },
  { id: "corr2", collecte_id: "8", message: "Bonjour, merci de préciser la date exacte et d'ajouter une photo des bénéficiaires.", champs_corriges: ["date_distribution"], faite_par: "Fatima", repondu: false, created_at: "2026-03-01T08:00:00Z" },
];
