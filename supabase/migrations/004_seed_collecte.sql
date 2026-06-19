-- ============================================================
-- MEAL — Données de démonstration (Collecte & Indicateurs)
-- ============================================================

-- INDICATEURS NUTRI+ (21 indicateurs SMART)
INSERT INTO indicateurs (code, nom, categorie, type_chart, unite, objectif, baseline, valeur_courante, description, desagregation, icone, ordre) VALUES
('I-1', 'Prévalence stunting enfants <5 ans', 'Impact', 'jauge', '%', 15, 35, 32, 'Retard de croissance chez les enfants', '{"sexe", "commune"}', '📉', 1),
('I-2', 'Taux mortalité infanto-juvénile', 'Impact', 'ligne', '‰', 85, 115, 110, 'Pour 1000 naissances vivantes', '{"sexe", "commune"}', '⚠️', 2),
('R-1', 'Ménages en sécurité alimentaire (HFIAS ≤7)', 'Realisation', 'barre', '%', 70, 28, 36, 'Score HFIAS ≤ 7', '{"commune", "chef_menage"}', '🌾', 3),
('R-2', 'Score Diversité Alimentaire Ménages (SDAM)', 'Realisation', 'barre', '/12', 6.5, 4.2, 4.8, 'Rappel 24h sur 400 ménages', '{"commune"}', '🥗', 4),
('R-3', 'Rendement cultures principales (t/ha)', 'Realisation', 'ligne', 't/ha', 3.0, 1.84, 2.1, 'Maïs et sorgho', '{"commune", "type_semence"}', '🌽', 5),
('R-4', 'Femmes allaitement exclusif 0-6 mois', 'Realisation', 'jauge', '%', 60, 31, 34, 'Allaitement maternel exclusif', '{"commune"}', '🍼', 6),
('R-5', 'Changement pratiques agricoles', 'Realisation', 'barre', '%', 80, 0, 45, 'Adoption 2+ nouvelles pratiques', '{"commune", "sexe"}', '🌱', 7),
('P-1', 'Agriculteurs formés (total)', 'Produit', 'barre', 'personnes', 3000, 0, 420, 'Tous les agriculteurs formés', '{"sexe", "commune", "groupe_age"}', '👨‍🌾', 8),
('P-1F', 'Agriculteurs formés — dont femmes', 'Genre', 'jauge', '%', 50, 30, 39, 'Pourcentage de femmes formées', '{"commune"}', '👩‍🌾', 9),
('P-2', 'Sessions de formation organisées', 'Produit', 'barre', 'sessions', 120, 0, 21, 'Sessions/an', '{"commune", "theme"}', '📚', 10),
('P-3', 'Score connaissance post-formation', 'Produit', 'barre', '/100', 80, 0, 74, 'Score test post-formation', '{"sexe", "commune"}', '📝', 11),
('P-4', 'Kits semences améliorées distribués', 'Produit', 'barre', 'kits', 3000, 0, 620, 'Kits distribués avant saison', '{"commune", "type_semence"}', '🌰', 12),
('P-5', 'Bénéficiaires ayant utilisé le kit', 'Produit', 'jauge', '%', 85, 0, 72, 'Taux d''utilisation des kits', '{"commune"}', '✅', 13),
('P-6', 'Champs-écoles opérationnels', 'Produit', 'barre', 'champs', 50, 0, 12, 'Champs-écoles actifs', '{"commune"}', '🏫', 14),
('P-7', 'Femmes en CPN nutritionnelle', 'Produit', 'barre', 'femmes', 600, 0, 78, 'Consultations prénatales nutrition', '{"commune", "trimestre"}', '🤰', 15),
('P-8', 'Enfants <5 ans dépistés MUAC', 'Produit', 'barre', 'enfants', 1200, 0, 198, 'Dépistage malnutrition par MUAC', '{"sexe", "commune"}', '👶', 16),
('P-9', 'Séances IEC nutrition organisées', 'Produit', 'ligne', 'sessions', 144, 0, 40, 'Séances IEC mensuelles', '{"commune", "theme"}', '📢', 17),
('A-1', 'Taux exécution plan activités', 'Processus', 'jauge', '%', 85, 0, 71, '% activités réalisées vs planifiées', '{}', '📋', 18),
('A-2', 'Taux utilisation budget', 'Processus', 'jauge', '%', 85, 0, 62, '% dépensé vs alloué', '{}', '💰', 19),
('G-1', 'Participation femmes aux formations', 'Genre', 'barre', '%', 50, 30, 39, '% de femmes parmi les formés', '{"commune"}', '♀️', 20),
('G-2', 'Histoires de changement documentées', 'Genre', 'barre', 'histoires', 20, 0, 3, 'Témoignages de femmes bénéficiaires', '{"commune"}', '📖', 21);

-- COLLECTEURS (équipe terrain démo)
INSERT INTO collecteurs (nom, role, zone, telephone, email, nb_collectes, nb_corrections) VALUES
('Mathieu Kpanou', 'facilitateur', 'Zone A', '+229 91 01 00 10', 'mathieu.k@nutriplus.bj', 45, 3),
('Fatima Bio', 'ASC', 'Zone A', '+229 97 11 20 30', 'fatima.b@nutriplus.bj', 28, 1),
('Inoussa Garba', 'agent_terrain', 'Zone B', '+229 90 05 15 25', 'inoussa.g@nutriplus.bj', 62, 7),
('Bintou Diallo', 'ASC', 'Zone B', '+229 94 10 50 60', 'bintou.d@nutriplus.bj', 19, 0),
('Cyrille Hounsou', 'facilitateur', 'Zone C', '+229 96 30 40 50', 'cyrille.h@nutriplus.bj', 33, 2),
('Aminata Traoré', 'ASC', 'Zone C', '+229 61 12 34 56', 'aminata.t@nutriplus.bj', 12, 0),
('Souleymane Yaya', 'agent_terrain', 'Zone A', '+229 97 40 50 60', 'souleymane.y@nutriplus.bj', 51, 5),
('Rosine Ahyi', 'facilitateur', 'Zone B', '+229 95 00 11 22', 'rosine.a@nutriplus.bj', 37, 1);

-- COLLECTES DE DEMO (soumissions terrain)
INSERT INTO collectes (collecteur_id, indicateur_id, localite, statut, donnees, note_terrain) VALUES
((SELECT id FROM collecteurs WHERE nom='Mathieu Kpanou'), (SELECT id FROM indicateurs WHERE code='P-1'), 'NKP-01', 'valide', '{"hommes": 25, "femmes": 12, "total": 37, "date": "2026-01-15"}', 'Formation terminée. Bonne participation.'),
((SELECT id FROM collecteurs WHERE nom='Mathieu Kpanou'), (SELECT id FROM indicateurs WHERE code='P-1F'), 'NKP-01', 'valide', '{"total_femmes": 12, "total_hommes": 25, "pct_femmes": 32.4}', 'Les femmes étaient moins nombreuses ce jour.'),
((SELECT id FROM collecteurs WHERE nom='Fatima Bio'), (SELECT id FROM indicateurs WHERE code='P-7'), 'NKP-02', 'valide', '{"nouvelles_cpn": 8, "total_suivies": 15, "trimestre": 1}', 'CPN bien suivies ce mois.'),
((SELECT id FROM collecteurs WHERE nom='Fatima Bio'), (SELECT id FROM indicateurs WHERE code='P-8'), 'NKP-02', 'valide', '{"enfants_depistes": 24, "masculins": 11, "feminins": 13, "jaune": 3, "rouge": 1}', '1 enfant référé en URENAM.'),
((SELECT id FROM collecteurs WHERE nom='Inoussa Garba'), (SELECT id FROM indicateurs WHERE code='P-4'), 'NKP-03', 'en_attente', '{"kits_distribues": 45, "type_semence": "mais_ameliore", "date_distribution": "2026-03-10"}', 'Distribution dans 3 nouveaux villages.'),
((SELECT id FROM collecteurs WHERE nom='Inoussa Garba'), (SELECT id FROM indicateurs WHERE code='P-1'), 'NKP-04', 'rejete', '{"hommes": 18, "femmes": 5, "total": 23}', 'Session écourtée à cause de la pluie.'),
((SELECT id FROM collecteurs WHERE nom='Bintou Diallo'), (SELECT id FROM indicateurs WHERE code='P-9'), 'NKP-03', 'valide', '{"seances": 4, "participants_h": 38, "participants_f": 52, "theme": "Allaitement exclusif"}', 'Très bonne participation des mères.'),
((SELECT id FROM collecteurs WHERE nom='Bintou Diallo'), (SELECT id FROM indicateurs WHERE code='P-8'), 'NKP-03', 'valide', '{"enfants_depistes": 18, "masculins": 8, "feminins": 10, "jaune": 1, "rouge": 0}', 'Bon état nutritionnel ce mois.'),
((SELECT id FROM collecteurs WHERE nom='Cyrille Hounsou'), (SELECT id FROM indicateurs WHERE code='P-2'), 'NKP-05', 'en_attente', '{"sessions_prevues": 5, "sessions_realisees": 5, "total_participants": 112}', '100% des sessions tenues.'),
((SELECT id FROM collecteurs WHERE nom='Aminata Traoré'), (SELECT id FROM indicateurs WHERE code='P-9'), 'NKP-05', 'valide', '{"seances": 3, "participants_h": 22, "participants_f": 45, "theme": "Diversification alimentaire"}', ''),
((SELECT id FROM collecteurs WHERE nom='Souleymane Yaya'), (SELECT id FROM indicateurs WHERE code='P-4'), 'NKP-01', 'corrige', '{"kits_distribues": 35, "type_semence": "sorgho_ameliore", "date_distribution": "2026-02-28"}', 'Distribution terminée.'),
((SELECT id FROM collecteurs WHERE nom='Rosine Ahyi'), (SELECT id FROM indicateurs WHERE code='R-1'), 'NKP-03', 'en_attente', '{"menages_enquete": 80, "hfias_moyen": 6.2, "menages_securises": 52, "total_menages": 80}', 'Enquête HFIAS en cours.');

-- CORRECTIONS DE DEMO (feedback superviseur → terrain)
INSERT INTO corrections (collecte_id, message, champs_corriges, faite_par, repondu) VALUES
((SELECT id FROM collectes WHERE collecteur_id=(SELECT id FROM collecteurs WHERE nom='Inoussa Garba') AND indicateur_id=(SELECT id FROM indicateurs WHERE code='P-1') LIMIT 1),
 'Le nombre de participants semble bas par rapport à la session prévue (prévu: 35, déclaré: 23). Peux-tu vérifier et corriger ?',
 '["hommes", "femmes", "total"]', 'Bertrand', true),
((SELECT id FROM collectes WHERE collecteur_id=(SELECT id FROM collecteurs WHERE nom='Souleymane Yaya') AND indicateur_id=(SELECT id FROM indicateurs WHERE code='P-4') LIMIT 1),
 'Bonjour Souleymane, merci de préciser la date exacte de distribution et d''ajouter une photo des bénéficiaires.',
 '["date_distribution"]', 'Fatima', false);

-- VUES ANALYSE (configurations personnalisées)
INSERT INTO vues_analyse (nom, description, config, est_defaut) VALUES
('Dashboard Suivi Trimestriel', 'Vue par défaut pour le suivi trimestriel des indicateurs clés',
 '[{"indicateur_code": "P-1", "type_chart": "barre", "taille": "pleine", "periode": 6},
   {"indicateur_code": "P-4", "type_chart": "barre", "taille": "pleine", "periode": 6},
   {"indicateur_code": "R-1", "type_chart": "jauge", "taille": "demi", "periode": 3},
   {"indicateur_code": "G-1", "type_chart": "jauge", "taille": "demi", "periode": 3},
   {"indicateur_code": "P-7", "type_chart": "ligne", "taille": "pleine", "periode": 6},
   {"indicateur_code": "A-1", "type_chart": "jauge", "taille": "pleine", "periode": 1}]'::jsonb, true);

-- VALEURS CALCULEES (depuis collectes validées)
INSERT INTO valeurs_calculees (indicateur_id, mois, annee, valeur) 
SELECT 
  i.id, 1, 2026, 
  (SELECT COALESCE(SUM((c.donnees->>'total')::numeric), 0) FROM collectes c 
   WHERE c.indicateur_id = i.id AND c.statut = 'valide')
FROM indicateurs i WHERE i.code = 'P-1';
