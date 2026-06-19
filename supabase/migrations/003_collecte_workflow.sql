-- ============================================================
-- MEAL — Workflow de Collecte avec Validation
-- Tables pour la collecte terrain + feedback + auto-calcul
-- Exécuter dans l'éditeur SQL Supabase (app.supabase.com)
-- ============================================================

-- 1. COLLECTEURS (équipe terrain)
CREATE TABLE IF NOT EXISTS collecteurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('ASC', 'facilitateur', 'agent_terrain', 'superviseur')),
  zone TEXT NOT NULL,
  telephone TEXT,
  email TEXT,
  mot_de_passe TEXT, -- hash simple pour démo
  actif BOOLEAN DEFAULT true,
  nb_collectes INTEGER DEFAULT 0,
  nb_corrections INTEGER DEFAULT 0,
  taux_erreur NUMERIC(5,2) DEFAULT 0,
  derniere_sync TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. INDICATEURS ENTIEREMENT PERSOS (définis par l'utilisateur)
CREATE TABLE IF NOT EXISTS indicateurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,           -- P-1, R-1, I-1...
  nom TEXT NOT NULL,
  categorie TEXT NOT NULL,             -- Impact, Realisation, Produit, Processus, Genre
  type_chart TEXT DEFAULT 'barre' CHECK (type_chart IN ('barre', 'ligne', 'camembert', 'jauge', 'tableau', 'carte')),
  unite TEXT DEFAULT 'unite',
  objectif NUMERIC(12,2) DEFAULT 0,
  baseline NUMERIC(12,2) DEFAULT 0,
  valeur_courante NUMERIC(12,2) DEFAULT 0,
  description TEXT,
  formule JSONB,                        -- Formule de calcul personnalisable
  desagregation TEXT[] DEFAULT '{}',    -- ['sexe', 'zone', 'age']
  responsable TEXT,
  icone TEXT DEFAULT '📊',
  ordre INTEGER DEFAULT 0,
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. COLLECTES (soumissions terrain)
CREATE TABLE IF NOT EXISTS collectes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collecteur_id UUID REFERENCES collecteurs(id),
  indicateur_id UUID REFERENCES indicateurs(id),
  localite TEXT NOT NULL,
  date_collecte DATE NOT NULL DEFAULT CURRENT_DATE,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'valide', 'rejete', 'corrige')),
  donnees JSONB NOT NULL DEFAULT '{}',      -- {"hommes": 45, "femmes": 12, "total": 57}
  validation_date TIMESTAMPTZ,
  validated_by TEXT,
  photo_url TEXT,                           -- URL photo preuve
  note_terrain TEXT,                        -- Commentaire du collecteur
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. CORRECTIONS (feedback superviseur → terrain)
CREATE TABLE IF NOT EXISTS corrections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  collecte_id UUID REFERENCES collectes(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  champs_corriges JSONB DEFAULT '[]',       -- ["hommes", "femmes"]
  faite_par TEXT NOT NULL,
  repondu BOOLEAN DEFAULT false,
  reponse TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  replied_at TIMESTAMPTZ
);

-- 5. VALEURS CALCULEES (auto-générées depuis collectes validées)
CREATE TABLE IF NOT EXISTS valeurs_calculees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  indicateur_id UUID REFERENCES indicateurs(id) ON DELETE CASCADE,
  mois INTEGER NOT NULL CHECK (mois BETWEEN 1 AND 12),
  annee INTEGER NOT NULL DEFAULT 2026,
  valeur NUMERIC(12,2) NOT NULL DEFAULT 0,
  desagregation JSONB DEFAULT '{}',         -- {"sexe": "femme", "zone": "Zone A"}
  source TEXT DEFAULT 'collecte',            -- collecte, import, manuel
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(indicateur_id, mois, annee, source)
);

-- 6. VUES PERSONNALISEES (analyse builder)
CREATE TABLE IF NOT EXISTS vues_analyse (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  description TEXT,
  config JSONB NOT NULL DEFAULT '[]',        -- [{indicateur_id, type_chart, periode, filtres, position}]
  est_defaut BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_collectes_statut ON collectes(statut);
CREATE INDEX IF NOT EXISTS idx_collectes_collecteur ON collectes(collecteur_id);
CREATE INDEX IF NOT EXISTS idx_collectes_date ON collectes(date_collecte);
CREATE INDEX IF NOT EXISTS idx_corrections_collecte ON corrections(collecte_id);
CREATE INDEX IF NOT EXISTS idx_valeurs_indicateur ON valeurs_calculees(indicateur_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE collectes;
ALTER PUBLICATION supabase_realtime ADD TABLE corrections;
ALTER PUBLICATION supabase_realtime ADD TABLE indicateurs;
ALTER PUBLICATION supabase_realtime ADD TABLE valeurs_calculees;
