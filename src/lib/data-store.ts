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

// Données initiales (vierges — l'utilisateur crée tout lui-même)
export const collectesData: CollecteData[] = [];
export const correctionsData: CorrectionData[] = [];
