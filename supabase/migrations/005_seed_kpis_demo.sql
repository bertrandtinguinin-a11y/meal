-- ============================================================
-- MEAL-Pro — Données de démo pour tester l'application
-- Exécuter dans l'éditeur SQL Supabase (app.supabase.com)
-- ============================================================

-- 1. COLLECTEURS (équipe terrain)
INSERT INTO collecteurs (nom, role, zone, telephone, actif) VALUES
  ('AGBOTON Michel', 'agent_terrain', 'Zone A', '00 229 91 00 00 01', true),
  ('BIAO B. Marcelle', 'agent_terrain', 'Zone B', '00 229 91 00 00 02', true),
  ('CHABI Ganiou', 'facilitateur', 'Zone A', '00 229 91 00 00 03', true),
  ('DOSSOU Victoire', 'agent_terrain', 'Zone C', '00 229 91 00 00 04', true),
  ('HOUNDJO K. Richard', 'ASC', 'Zone B', '00 229 91 00 00 05', true),
  ('KPATCHA A. Esther', 'agent_terrain', 'Zone C', '00 229 91 00 00 06', true),
  ('SAGBO A. Paul', 'superviseur', 'Toutes zones', '00 229 91 00 00 07', true),
  ('TOSSOU M. Julienne', 'agent_terrain', 'Zone A', '00 229 91 00 00 08', true)
ON CONFLICT DO NOTHING;

-- 2. INDICATEURS
INSERT INTO indicateurs (code, nom, categorie, type_chart, unite, objectif, baseline, icone, ordre, actif) VALUES
  ('P-1', 'Taux d\'exécution des activités planifiées', 'Produit', 'jauge', '%', 90, 65, '📋', 1, true),
  ('P-2', 'Nombre de séances IEC réalisées', 'Produit', 'barre', 'séances', 120, 48, '🎤', 2, true),
  ('P-3', 'Kits distribués aux ménages vulnérables', 'Produit', 'barre', 'kits', 500, 200, '🎒', 3, true),
  ('R-1', 'Ménages ayant adopté les bonnes pratiques', 'Réalisation', 'ligne', '%', 80, 35, '🏠', 4, true),
  ('R-2', 'Femmes enceintes ayant fait 4+ CPN', 'Réalisation', 'ligne', '%', 75, 42, '👩', 5, true),
  ('R-3', 'Taux de couverture vaccinale Penta 3', 'Réalisation', 'jauge', '%', 95, 78, '💉', 6, true),
  ('I-1', 'Réduction incidence paludisme', 'Impact', 'ligne', '%', 50, 12, '🦟', 7, true),
  ('I-2', 'Amélioration sécurité alimentaire', 'Impact', 'ligne', '%', 60, 25, '🍲', 8, true),
  ('G-1', 'Femmes dans les instances décisionnelles', 'Genre', 'jauge', '%', 50, 30, '⚖️', 9, true),
  ('G-2', 'Égalité d\'accès aux services', 'Genre', 'jauge', '%', 100, 60, '🤝', 10, true)
ON CONFLICT (code) DO NOTHING;

-- 3. VALEURS CALCULEES (historique 6 mois)
-- P-1 : Taux exécution
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 1, 2026, 58, 'collecte' FROM indicateurs WHERE code = 'P-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 2, 2026, 62, 'collecte' FROM indicateurs WHERE code = 'P-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 3, 2026, 71, 'collecte' FROM indicateurs WHERE code = 'P-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 4, 2026, 68, 'collecte' FROM indicateurs WHERE code = 'P-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 5, 2026, 78, 'collecte' FROM indicateurs WHERE code = 'P-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 6, 2026, 85, 'collecte' FROM indicateurs WHERE code = 'P-1';

-- R-1 : Adoption bonnes pratiques
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 1, 2026, 32, 'collecte' FROM indicateurs WHERE code = 'R-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 2, 2026, 38, 'collecte' FROM indicateurs WHERE code = 'R-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 3, 2026, 41, 'collecte' FROM indicateurs WHERE code = 'R-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 4, 2026, 45, 'collecte' FROM indicateurs WHERE code = 'R-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 5, 2026, 52, 'collecte' FROM indicateurs WHERE code = 'R-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 6, 2026, 58, 'collecte' FROM indicateurs WHERE code = 'R-1';

-- I-1 : Réduction paludisme
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 1, 2026, 10, 'collecte' FROM indicateurs WHERE code = 'I-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 2, 2026, 14, 'collecte' FROM indicateurs WHERE code = 'I-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 3, 2026, 18, 'collecte' FROM indicateurs WHERE code = 'I-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 4, 2026, 22, 'collecte' FROM indicateurs WHERE code = 'I-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 5, 2026, 28, 'collecte' FROM indicateurs WHERE code = 'I-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 6, 2026, 35, 'collecte' FROM indicateurs WHERE code = 'I-1';

-- G-1 : Femmes instances
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 1, 2026, 28, 'collecte' FROM indicateurs WHERE code = 'G-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 3, 2026, 32, 'collecte' FROM indicateurs WHERE code = 'G-1';
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur, source)
  SELECT id, 6, 2026, 38, 'collecte' FROM indicateurs WHERE code = 'G-1';

-- 4. COLLECTES DE DEMO
-- Générer des collectes reliées aux collecteurs et indicateurs créés ci-dessus
INSERT INTO collectes (collecteur_id, indicateur_id, localite, date_collecte, statut, donnees, note_terrain)
SELECT
  c.id AS collecteur_id,
  i.id AS indicateur_id,
  locs.loc AS localite,
  locs.d AS date_collecte,
  CASE WHEN locs.d < '2026-06-01' THEN 'valide' ELSE 'en_attente' END AS statut,
  jsonb_build_object('total', floor(random() * 50 + 10)::int) AS donnees,
  CASE WHEN random() > 0.7 THEN 'Observation : bonne participation des communautés' ELSE '' END AS note_terrain
FROM (
  VALUES
    ('AGBOTON Michel', 'P-1', 'NKP-01', '2026-04-15'),
    ('AGBOTON Michel', 'P-2', 'NKP-01', '2026-04-15'),
    ('AGBOTON Michel', 'R-1', 'NKP-01', '2026-04-15'),
    ('BIAO B. Marcelle', 'P-1', 'NKP-03', '2026-04-16'),
    ('BIAO B. Marcelle', 'P-3', 'NKP-03', '2026-04-16'),
    ('CHABI Ganiou', 'P-2', 'NKP-02', '2026-05-10'),
    ('CHABI Ganiou', 'R-2', 'NKP-02', '2026-05-10'),
    ('DOSSOU Victoire', 'P-1', 'NKP-04', '2026-05-12'),
    ('DOSSOU Victoire', 'R-1', 'NKP-04', '2026-05-12'),
    ('KPATCHA A. Esther', 'P-3', 'NKP-06', '2026-05-20'),
    ('TOSSOU M. Julienne', 'I-1', 'NKP-01', '2026-06-01'),
    ('TOSSOU M. Julienne', 'G-1', 'NKP-01', '2026-06-01'),
    ('BIAO B. Marcelle', 'P-1', 'NKP-03', '2026-06-05'),
    ('CHABI Ganiou', 'P-2', 'NKP-02', '2026-06-08'),
    ('KPATCHA A. Esther', 'R-1', 'NKP-06', '2026-06-10'),
    ('SAGBO A. Paul', 'G-2', 'NKP-07', '2026-06-12')
) AS locs(collecteur_nom, indicateur_code, loc, d)
JOIN collecteurs c ON c.nom = locs.collecteur_nom
JOIN indicateurs i ON i.code = locs.indicateur_code;

-- 5. CORRECTIONS DE DEMO (une collecte rejetée avec feedback)
INSERT INTO corrections (collecte_id, message, champs_corriges, faite_par, repondu)
SELECT
  col.id,
  'Les données pour "hommes" et "femmes" doivent être séparées, pas de total uniquement',
  '["total"]'::jsonb,
  'SAGBO A. Paul',
  false
FROM collectes col
WHERE col.statut = 'en_attente'
LIMIT 1;

-- Mettre à jour le statut de cette collecte
UPDATE collectes
SET statut = 'rejete', validation_date = now(), validated_by = 'SAGBO A. Paul'
WHERE id = (SELECT col.id FROM collectes col WHERE col.statut = 'en_attente' LIMIT 1);

-- 6. VUE D ANALYSE PAR DEFAUT
INSERT INTO vues_analyse (nom, description, config, est_defaut) VALUES
(
  'Vue d\'ensemble',
  'KPIs principaux en un coup d\'œil',
  '[{"indicateur_id":"P-1","type_chart":"jauge","taille":"moyen","periode":6},{"indicateur_id":"R-1","type_chart":"ligne","taille":"moyen","periode":6},{"indicateur_id":"I-1","type_chart":"ligne","taille":"moyen","periode":6},{"indicateur_id":"G-1","type_chart":"jauge","taille":"petit","periode":3}]'::jsonb,
  true
);

-- 7. ACTIVITES DE DEMO
INSERT INTO activities (type, titre, description, date, responsable, statut) VALUES
  ('formation', 'Formation des ASC sur le paludisme', 'Session de 3 jours pour 25 ASC des zones A et B', '2026-04-10', 'SAGBO A. Paul', 'termine'),
  ('collecte', 'Enquête ménage Zone A', 'Collecte des données de base dans 120 ménages', '2026-04-15', 'AGBOTON Michel', 'termine'),
  ('distribution', 'Distribution kits scolaires', '200 kits distribués dans les écoles de NKP', '2026-05-05', 'CHABI Ganiou', 'termine'),
  ('collecte', 'Suivi CPN trimestriel', 'Monitoring des consultations prénatales', '2026-05-20', 'BIAO B. Marcelle', 'termine'),
  ('sante', 'Campagne vaccination Penta 3', 'Vaccination de rattrapage dans les zones mal desservies', '2026-06-15', 'DOSSOU Victoire', 'en_cours'),
  ('formation', 'Atelier genre et inclusion', 'Sensibilisation des comités de gestion', '2026-07-01', 'KPATCHA A. Esther', 'planifie'),
  ('collecte', 'Évaluation mi-parcours', 'Collecte des données pour le rapport semestriel', '2026-07-10', 'TOSSOU M. Julienne', 'planifie')
ON CONFLICT DO NOTHING;

-- Mettre à jour les valeurs courantes des indicateurs
UPDATE indicateurs SET valeur_courante = 85 WHERE code = 'P-1';
UPDATE indicateurs SET valeur_courante = 58 WHERE code = 'R-1';
UPDATE indicateurs SET valeur_courante = 35 WHERE code = 'I-1';
UPDATE indicateurs SET valeur_courante = 38 WHERE code = 'G-1';
