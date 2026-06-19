import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const DEMO_DATA: Record<string, any[]> = {
  activities: [
    { id: 1, type: "formation", titre: "Formation agricole", description: "Session techniques culturales", date: "2026-06-15", responsable: "Agent Terrain", statut: "termine" },
    { id: 2, type: "visite", titre: "Visite de suivi", description: "Suivi bénéficiaires", date: "2026-06-16", responsable: "Admin MEAL", statut: "en_cours" },
  ],
  collectes: [
    { id: "1", code: "COL-001", collecteur: "Agent Terrain", indicateur: "P-1 — Personnes formées", localite: "Natitingou", zone: "Atacora", valeur: 45, unite: "personnes", date: "2026-06-15", statut: "valide" },
    { id: "2", code: "COL-002", collecteur: "Marie Kossi", indicateur: "K-3 — Kits distribués", localite: "Tanguiéta", zone: "Atacora", valeur: 120, unite: "kits", date: "2026-06-16", statut: "en_attente" },
    { id: "3", code: "COL-003", collecteur: "Admin MEAL", indicateur: "P-5 — Séances tenues", localite: "Kouandé", zone: "Atacora", valeur: 3, unite: "séances", date: "2026-06-14", statut: "valide" },
    { id: "4", code: "COL-004", collecteur: "Paul Djibril", indicateur: "K-7 — Kits semences", localite: "Péhunco", zone: "Atacora", valeur: 85, unite: "kits", date: "2026-06-13", statut: "en_attente" },
  ],
  indicateurs: [
    { id: "ind-1", code: "P-1", nom: "Personnes formées", categorie: "Production", type_chart: "bar", unite: "personnes", icone: "👥", objectif: 500, baseline: 0 },
    { id: "ind-2", code: "K-3", nom: "Kits distribués", categorie: "Distribution", type_chart: "bar", unite: "kits", icone: "📦", objectif: 1000, baseline: 0 },
  ],
  collecteurs: [
    { id: "col-1", nom: "Agent Terrain", email: "collecte@meal.app", telephone: "+229 01 23 45 67", zone: "Atacora" },
    { id: "col-2", nom: "Marie Kossi", email: "marie@meal.app", telephone: "+229 01 23 45 68", zone: "Donga" },
  ],
  kpis: [
    { id: "1", nom: "Chiffre d'Affaires", valeur: 2845000, objectif: 5000000, unite: "FCFA", icone: "💰", evolution: 12.5 },
    { id: "2", nom: "Marge Bénéficiaire", valeur: 32.4, objectif: 35, unite: "%", icone: "📈", evolution: -2.1 },
    { id: "3", nom: "Production", valeur: 847, objectif: 1000, unite: "tonnes", icone: "🌾", evolution: 8.3 },
  ],
  validation: [
    { id: "val-1", collecte_id: "1", validateur: "Admin MEAL", commentaire: "Données conformes", statut: "valide", date: "2026-06-16" },
  ],
  vues: [
    { id: "vue-1", nom: "Vue standard", configuration: { indicateurs: ["ind-1", "ind-2"], type_chart: "area" } },
  ],
};

function createMockSupabase() {
  const mock = (table: string) => ({
    select: (columns?: string) => ({
      order: (col: string, opts?: any) => ({
        data: DEMO_DATA[table] || [],
        error: null,
      }),
      single: () => ({
        data: (DEMO_DATA[table] || [])[0] || null,
        error: null,
      }),
      eq: (col: string, val: any) => ({
        data: (DEMO_DATA[table] || []).filter((r: any) => r[col] === val),
        error: null,
      }),
    }),
    insert: (vals: any) => ({
      select: () => ({
        single: () => ({ data: { ...vals, id: Date.now() }, error: null }),
      }),
    }),
    update: (vals: any) => ({
      eq: () => ({
        select: () => ({
          single: () => ({ data: vals, error: null }),
        }),
      }),
    }),
    delete: () => ({
      eq: () => ({ data: null, error: null }),
    }),
  });

  return { from: mock };
}

const isPlaceholder = !supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("placeholder");
const supabase = isPlaceholder
  ? createMockSupabase() as any
  : createClient(supabaseUrl, supabaseAnonKey);

if (isPlaceholder) {
  console.warn("⚠️ Supabase non configuré — utilisation des données de démonstration");
}

export { supabase };
