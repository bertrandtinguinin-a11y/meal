-- ============================================================
-- MEAL — Données de démonstration
-- Insère après avoir exécuté 001_meal_schema.sql
-- ============================================================

-- KPIs de démo
INSERT INTO kpis (code, nom, description, unite, categorie, objectif, poids, periode, responsable) VALUES
  ('FORM_01', 'Agriculteurs formés', 'Nombre d''agriculteurs ayant suivi au moins une formation technique', 'personnes', 'Produit', 3000, 3, '2026', 'Dr NAGASSI'),
  ('SEAL_01', 'Ménages sécurité alimentaire', 'Pourcentage de ménages atteignant le score de sécurité alimentaire', '%', 'Réalisation', 70, 5, '2026', 'Dr BOGNON'),
  ('SEM_01', 'Kits semences distribués', 'Nombre total de kits semences améliorées distribués', 'kits', 'Produit', 3000, 4, '2026', 'Équipe terrain'),
  ('GENR_01', 'Dont femmes formées', 'Nombre de femmes agricultrices formées (désagrégation)', 'personnes', 'Genre', 1500, 5, '2026', 'Chargée Genre'),
  ('IEC_01', 'Séances IEC nutrition', 'Nombre total de séances IEC réalisées', 'séances', 'Réalisation', 36, 2, '2026', 'Équipe IEC'),
  ('RAPP_01', 'Rapports mensuels', 'Rapports mensuels soumis à temps', 'rapports', 'Suivi', 3, 2, '2026', 'M&E Officer')
ON CONFLICT (code) DO NOTHING;

-- Valeurs mensuelles (cumul progressif sur 6 mois)
INSERT INTO kpi_values (kpi_id, mois, annee, valeur)
SELECT k.id, mois, 2026, v FROM kpis k
JOIN (VALUES
  ('FORM_01', 1, 140), ('FORM_01', 2, 200), ('FORM_01', 3, 260), ('FORM_01', 4, 320), ('FORM_01', 5, 370), ('FORM_01', 6, 420),
  ('SEAL_01', 1, 18), ('SEAL_01', 2, 22), ('SEAL_01', 3, 26), ('SEAL_01', 4, 30), ('SEAL_01', 5, 33), ('SEAL_01', 6, 36),
  ('SEM_01', 1, 200), ('SEM_01', 2, 320), ('SEM_01', 3, 400), ('SEM_01', 4, 480), ('SEM_01', 5, 550), ('SEM_01', 6, 620),
  ('GENR_01', 1, 50), ('GENR_01', 2, 75), ('GENR_01', 3, 95), ('GENR_01', 4, 120), ('GENR_01', 5, 140), ('GENR_01', 6, 165),
  ('IEC_01', 1, 12), ('IEC_01', 2, 18), ('IEC_01', 3, 24), ('IEC_01', 4, 28), ('IEC_01', 5, 32), ('IEC_01', 6, 36),
  ('RAPP_01', 1, 1), ('RAPP_01', 2, 2), ('RAPP_01', 3, 2), ('RAPP_01', 4, 3), ('RAPP_01', 5, 3), ('RAPP_01', 6, 3)
) AS kv(code, mois, v) ON k.code = kv.code
ON CONFLICT (kpi_id, mois, annee) DO NOTHING;

-- Activités
INSERT INTO activities (nom, emoji, prevu, realise, categorie, responsable, statut, mois_cible) VALUES
  ('Sessions formation', '🎓', 30, 21, 'Formation', 'Dr NAGASSI', 'en_cours', 6),
  ('Kits semences', '🌱', 750, 620, 'Distribution', 'Équipe terrain', 'en_cours', 7),
  ('Rounds dépistage MUAC', '📏', 3, 2, 'Suivi', 'Infirmiers', 'en_cours', 6),
  ('Séances IEC nutrition', '📣', 36, 36, 'IEC', 'Équipe IEC', 'termine', 6),
  ('Missions supervision', '🛵', 8, 6, 'Supervision', 'Coordination', 'en_cours', 7);

-- Alertes
INSERT INTO alerts (kpi_id, message, action, action_url, severity) 
SELECT id, '39% de femmes parmi les formés (cible 50%)', 'Sessions exclusivement féminines', '/activities', 'high'
FROM kpis WHERE code = 'GENR_01';
