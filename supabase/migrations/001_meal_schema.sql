-- ============================================================
-- MEAL — Schéma Supabase
-- Tables pour le Monitoring & Evaluation with AI Logic
-- Exécuter dans l'éditeur SQL Supabase (app.supabase.com)
-- ============================================================

-- 1. TABLE KPI_DEFINITIONS
CREATE TABLE IF NOT EXISTS kpis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,                   -- ex: "FORM_01", "SEM_01"
  nom TEXT NOT NULL,                            -- ex: "Agriculteurs formés"
  description TEXT,
  unite TEXT NOT NULL DEFAULT 'unités',         -- personnes, %, kits, FCFA
  categorie TEXT NOT NULL,                      -- Produit, Réalisation, Genre, Suivi
  objectif INTEGER NOT NULL DEFAULT 0,          -- Valeur cible
  poids INTEGER DEFAULT 1,                      -- Priorité 1-5
  periode TEXT DEFAULT '2026',                  -- Année de référence
  responsable TEXT,                             -- Personne en charge
  actif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. TABLE KPI_VALUES (valeurs mensuelles)
CREATE TABLE IF NOT EXISTS kpi_values (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
  mois INTEGER NOT NULL CHECK (mois BETWEEN 1 AND 12),
  annee INTEGER NOT NULL DEFAULT 2026,
  valeur NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(kpi_id, mois, annee)
);

-- 3. TABLE ACTIVITIES (activités vs PTA)
CREATE TABLE IF NOT EXISTS activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nom TEXT NOT NULL,
  emoji TEXT DEFAULT '📋',
  prevu INTEGER NOT NULL DEFAULT 0,
  realise INTEGER NOT NULL DEFAULT 0,
  categorie TEXT DEFAULT 'Formation',           -- Formation, Distribution, IEC, Supervision
  responsable TEXT,
  statut TEXT DEFAULT 'en_cours' CHECK (statut IN ('en_cours', 'termine', 'retard', 'non_debute')),
  mois_cible INTEGER,                           -- Mois de réalisation prévu
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLE COLLECTIONS (collectes de terrain)
CREATE TABLE IF NOT EXISTS collections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,                           -- "enquete", "recensement", "suivi"
  titre TEXT NOT NULL,
  description TEXT,
  statut TEXT DEFAULT 'brouillon' CHECK (statut IN ('brouillon', 'en_cours', 'termine')),
  nb_formulaires INTEGER DEFAULT 0,
  nb_remplis INTEGER DEFAULT 0,
  agent TEXT,                                   -- Agent de terrain
  date_debut DATE,
  date_fin DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLE ALERTS
CREATE TABLE IF NOT EXISTS alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  kpi_id UUID REFERENCES kpis(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  action TEXT,                                  -- Texte du lien d'action
  action_url TEXT,                             -- URL de l'action
  severity TEXT DEFAULT 'high' CHECK (severity IN ('high', 'medium', 'low')),
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Index pour performances
CREATE INDEX IF NOT EXISTS idx_kpi_values_kpi_id ON kpi_values(kpi_id);
CREATE INDEX IF NOT EXISTS idx_kpi_values_mois ON kpi_values(mois, annee);
CREATE INDEX IF NOT EXISTS idx_alerts_kpi_id ON alerts(kpi_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_activities_statut ON activities(statut);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE kpis;
ALTER PUBLICATION supabase_realtime ADD TABLE kpi_values;
ALTER PUBLICATION supabase_realtime ADD TABLE activities;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
