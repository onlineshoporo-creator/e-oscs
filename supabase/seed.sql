-- ============================================================================
-- SEED e-OSCS - Données initiales
-- ============================================================================
-- Idempotent : peut être exécuté plusieurs fois sans erreur
-- Exécution : psql ou Supabase SQL Editor après la migration 0001_init
-- ============================================================================

-- Désactiver temporairement les triggers/RLS pour le seed

-- ============================================================================
-- 1. PLANS D'ABONNEMENT (3 plans)
-- ============================================================================

INSERT INTO subscription_plans (code, nom, prix_mensuel, max_users, storage_gb, features, ordre, actif) VALUES
('ESSENTIEL', 'Essentiel', 10000, 5, 1, 
 '{"monthly_report": false, "annual_report": false, "pptx": false, "advanced_indicators": false, "archive": false, "custom_templates": false, "national_stats": false, "data_export": false}'::jsonb,
 1, true),
('PROFESSIONNEL', 'Professionnel', 15000, 15, 5,
 '{"monthly_report": true, "annual_report": true, "pptx": true, "advanced_indicators": true, "archive": true, "custom_templates": false, "national_stats": false, "data_export": false}'::jsonb,
 2, true),
('INSTITUTIONNEL', 'Institutionnel', 25000, NULL, 20,
 '{"monthly_report": true, "annual_report": true, "pptx": true, "advanced_indicators": true, "archive": true, "custom_templates": true, "national_stats": true, "data_export": true}'::jsonb,
 3, true)
ON CONFLICT (code) DO NOTHING;



-- ============================================================================
-- 2. CATÉGORIES D'ACTIVITÉS + TYPES
-- ============================================================================

-- 2.1 Catégories principales (5 catégories)
INSERT INTO activity_categories (code, nom, description, couleur) VALUES
('SOLIDARITE', 'Solidarité', 'Actions de solidarité et d''assistance aux populations vulnérables', '#F77F00'),
('COHESION_SOCIALE', 'Cohésion sociale', 'Activités de cohésion sociale, sensibilisation et vivre-ensemble', '#009E60'),
('VISITES_COMPASSION', 'Visites de compassion', 'Visites d''écoute et d''accompagnement des personnes en difficulté', '#0891B2'),
('ALERTE_PRECOCE', 'Alerte précoce', 'Gestion des alertes et intervention rapide sur incidents', '#DC2626'),
('AUTRES', 'Autres', 'Autres activités administratives et événementielles', '#64748B')
ON CONFLICT (code) DO NOTHING;

-- Récupérer les IDs des catégories pour les types
DO $$
DECLARE
  v_cat_solidarite UUID;
  v_cat_cohesion UUID;
  v_cat_visites UUID;
  v_cat_alerte UUID;
  v_cat_autres UUID;
BEGIN
  -- Récupérer les IDs des catégories
  SELECT id INTO v_cat_solidarite FROM activity_categories WHERE code = 'SOLIDARITE';
  SELECT id INTO v_cat_cohesion FROM activity_categories WHERE code = 'COHESION_SOCIALE';
  SELECT id INTO v_cat_visites FROM activity_categories WHERE code = 'VISITES_COMPASSION';
  SELECT id INTO v_cat_alerte FROM activity_categories WHERE code = 'ALERTE_PRECOCE';
  SELECT id INTO v_cat_autres FROM activity_categories WHERE code = 'AUTRES';
  
  RAISE NOTICE 'Catégories récupérées : Solidarité=%, Cohésion=%, Visites=%, Alerte=%, Autres=%', 
    v_cat_solidarite, v_cat_cohesion, v_cat_visites, v_cat_alerte, v_cat_autres;

  -- 2.2 Types par catégorie
  
  -- Solidarité : 6 types
  INSERT INTO activity_types (category_id, nom) VALUES
    (v_cat_solidarite, 'Action de solidarité'),
    (v_cat_solidarite, 'Assistance'),
    (v_cat_solidarite, 'Appui matériel'),
    (v_cat_solidarite, 'Appui financier'),
    (v_cat_solidarite, 'Distribution'),
    (v_cat_solidarite, 'Aide aux personnes vulnérables')
  ON CONFLICT DO NOTHING;
  
  -- Cohésion sociale : 8 types
  INSERT INTO activity_types (category_id, nom) VALUES
    (v_cat_cohesion, 'Sensibilisation'),
    (v_cat_cohesion, 'Formation'),
    (v_cat_cohesion, 'Dialogue'),
    (v_cat_cohesion, 'Sport'),
    (v_cat_cohesion, 'Activité communautaire'),
    (v_cat_cohesion, 'Activité culturelle'),
    (v_cat_cohesion, 'Promotion de la paix'),
    (v_cat_cohesion, 'Vivre-ensemble')
  ON CONFLICT DO NOTHING;
  
  -- Visites de compassion : 3 types
  INSERT INTO activity_types (category_id, nom) VALUES
    (v_cat_visites, 'Visite'),
    (v_cat_visites, 'Assistance'),
    (v_cat_visites, 'Accompagnement')
  ON CONFLICT DO NOTHING;
  
  -- Alerte précoce : 4 types
  INSERT INTO activity_types (category_id, nom) VALUES
    (v_cat_alerte, 'Alerte'),
    (v_cat_alerte, 'Vérification'),
    (v_cat_alerte, 'Suivi'),
    (v_cat_alerte, 'Intervention')
  ON CONFLICT DO NOTHING;
  
  -- Autres : 6 types
  INSERT INTO activity_types (category_id, nom) VALUES
    (v_cat_autres, 'Réunion'),
    (v_cat_autres, 'Cérémonie'),
    (v_cat_autres, 'Mission'),
    (v_cat_autres, 'Atelier'),
    (v_cat_autres, 'Supervision'),
    (v_cat_autres, 'Journée internationale/nationale')
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Types d''activités insérés';
END $$;


-- ============================================================================
-- 3. RÉGIONS DE CÔTE D'IVOIRE (31 régions + 2 districts autonomes)
-- ============================================================================

INSERT INTO regions (nom, code) VALUES
-- Districts autonomes (2)
('District d''Abidjan', 'ABJ'),
('District de Yamoussoukro', 'YKR'),

-- Régions (31)
('Agnéby-Tiassa', 'AGT'),
('Bafing', 'BAF'),
('Bagoué', 'BAG'),
('Béré', 'BER'),
('Bounkani', 'BKN'),
('Cavally', 'CAV'),
('Folon', 'FOL'),
('Gbêkê', 'GBE'),
('Gbôklé', 'GBK'),
('Gôh', 'GOH'),
('Gontougo', 'GNT'),
('Grands-Ponts', 'GRP'),
('Guémon', 'GUE'),
('Hambol', 'HAM'),
('Haut-Sassandra', 'HSS'),
('Iffou', 'IFF'),
('Indénié-Djuablin', 'IDJ'),
('Kabadougou', 'KAB'),
('La Mé', 'LME'),
('Lôh-Djiboua', 'LDJ'),
('Marahoué', 'MAR'),
('Moronou', 'MOR'),
('N''Zi', 'NZI'),
('Nawa', 'NAW'),
('Poro', 'POR'),
('San-Pédro', 'SAN'),
('Sud-Comoé', 'SUC'),
('Tchologo', 'TCH'),
('Tonkpi', 'TON'),
('Worodougou', 'WOR')
ON CONFLICT (nom) DO NOTHING;



-- ============================================================================
-- 4. DÉPARTEMENTS (principaux départements par région)
-- ============================================================================

DO $$
DECLARE
  v_region_abidjan UUID;
  v_region_bouake UUID;
  v_region_daloa UUID;
  v_region_korhogo UUID;
  v_region_sanpedro UUID;
  v_region_yamoussoukro UUID;
  v_region_man UUID;
  v_region_gagnoa UUID;
  v_region_soubre UUID;
  v_region_abengourou UUID;
  v_region_sassandra UUID;
  v_region_bondoukou UUID;
BEGIN
  -- Récupérer les IDs des régions pour les départements
  SELECT id INTO v_region_abidjan FROM regions WHERE nom = 'District d''Abidjan';
  SELECT id INTO v_region_yamoussoukro FROM regions WHERE nom = 'District de Yamoussoukro';
  SELECT id INTO v_region_bouake FROM regions WHERE nom = 'Gbêkê';
  SELECT id INTO v_region_daloa FROM regions WHERE nom = 'Haut-Sassandra';
  SELECT id INTO v_region_korhogo FROM regions WHERE nom = 'Poro';
  SELECT id INTO v_region_sanpedro FROM regions WHERE nom = 'San-Pédro';
  SELECT id INTO v_region_man FROM regions WHERE nom = 'Tonkpi';
  SELECT id INTO v_region_gagnoa FROM regions WHERE nom = 'Gôh';
  SELECT id INTO v_region_soubre FROM regions WHERE nom = 'Nawa';
  SELECT id INTO v_region_abengourou FROM regions WHERE nom = 'Indénié-Djuablin';
  SELECT id INTO v_region_sassandra FROM regions WHERE nom = 'Gbôklé';
  SELECT id INTO v_region_bondoukou FROM regions WHERE nom = 'Zanzan';

  -- Départements du District d'Abidjan (10 communes traitées comme départements)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Abidjan', 'ABJ', v_region_abidjan),
    ('Attécoubé', 'ATC', v_region_abidjan),
    ('Adjamé', 'ADJ', v_region_abidjan),
    ('Yopougon', 'YOP', v_region_abidjan),
    ('Cocody', 'COC', v_region_abidjan),
    ('Plateau', 'PLA', v_region_abidjan),
    ('Treichville', 'TRV', v_region_abidjan),
    ('Marcory', 'MAR', v_region_abidjan),
    ('Koumassi', 'KMS', v_region_abidjan),
    ('Port-Bouët', 'PBT', v_region_abidjan)
  ON CONFLICT DO NOTHING;

  -- Départements de Gbêkê (Bouaké)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Bouaké', 'BKE', v_region_bouake),
    ('Sakassou', 'SKS', v_region_bouake),
    ('Béoumi', 'BEU', v_region_bouake),
    ('Botro', 'BOT', v_region_bouake),
    ('Koko', 'KKO', v_region_bouake)
  ON CONFLICT DO NOTHING;

  -- Départements de Haut-Sassandra (Daloa)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Daloa', 'DAL', v_region_daloa),
    ('Issia', 'ISS', v_region_daloa),
    ('Vavoua', 'VAV', v_region_daloa),
    ('Zoukougbeu', 'ZOZ', v_region_daloa),
    ('Bouaflé', 'BUF', v_region_daloa)
  ON CONFLICT DO NOTHING;

  -- Départements de Poro (Korhogo)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Korhogo', 'KRG', v_region_korhogo),
    ('Sinématiali', 'SIN', v_region_korhogo),
    ('Kong', 'KNG', v_region_korhogo),
    ('M''Bengué', 'MBG', v_region_korhogo)
  ON CONFLICT DO NOTHING;

  -- Départements de San-Pédro
  INSERT INTO departments (nom, code, region_id) VALUES
    ('San-Pédro', 'SPD', v_region_sanpedro),
    ('Tabou', 'TAB', v_region_sanpedro),
    ('Saint-Pierre-Du-Sud', 'SPS', v_region_sanpedro),
    ('Djouroutou', 'DJR', v_region_sanpedro)
  ON CONFLICT DO NOTHING;

  -- Départements de Yamoussoukro
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Yamoussoukro', 'YMK', v_region_yamoussoukro),
    ('Attiegouakro', 'ATG', v_region_yamoussoukro),
    ('Yamoussoukro-Ville', 'YMV', v_region_yamoussoukro)
  ON CONFLICT DO NOTHING;

  -- Départements de Tonkpi (Man)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Man', 'MAN', v_region_man),
    ('Danané', 'DAN', v_region_man),
    ('Zouan-Hounien', 'ZOU', v_region_man),
    ('Bin-Houyé', 'BIN', v_region_man),
    ('Bloléquin', 'BLO', v_region_man),
    ('Toulépleu', 'TOU', v_region_man),
    ('Kpânzan', 'KPA', v_region_man)
  ON CONFLICT DO NOTHING;

  -- Départements de Gôh (Gagnoa)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Gagnoa', 'GGA', v_region_gagnoa),
    ('Oumé', 'OUM', v_region_gagnoa),
    ('Loulou', 'LOL', v_region_gagnoa)
  ON CONFLICT DO NOTHING;

  -- Départements de Nawa (Soubré)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Soubré', 'SUB', v_region_soubre),
    ('Buyo', 'BUY', v_region_soubre),
    ('Méagui', 'MEA', v_region_soubre),
    ('Guiglo', 'GUI', v_region_soubre),
    ('Toulépleu-Guiré', 'TLG', v_region_soubre)
  ON CONFLICT DO NOTHING;

  -- Départements d'Indénié-Djuablin (Abengourou)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Abengourou', 'ABE', v_region_abengourou),
    ('Agboville', 'AGB', v_region_abengourou),
    ('Assikoi', 'ASK', v_region_abengourou),
    ('Betitie', 'BET', v_region_abengourou)
  ON CONFLICT DO NOTHING;

  -- Départements supplémentaires importants
  -- Gbôklé (Sassandra)
  INSERT INTO departments (nom, code, region_id) VALUES
    ('Sassandra', 'SSA', v_region_sassandra),
    ('Fresco', 'FRS', v_region_sassandra),
    ('Soubre-Gbôklé', 'SGB', v_region_sassandra)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Départements insérés';
END $$;


-- ============================================================================
-- 5. TYPES D'INCIDENTS (8 types)
-- ============================================================================

INSERT INTO incident_types (nom, description) VALUES
('Conflit communautaire', 'Conflits entre communautés ou groupes sociaux'),
('Catastrophe naturelle', 'Événements naturels majeurs (inondations, sécheresse, tremblement de terre)'),
('Incendie', 'Incendies de forêts, habitations ou infrastructures'),
('Inondation', 'Inondations dues aux pluies ou crues'),
('Épidémie', 'Propagation de maladies contagieuses'),
('Accident', 'Accidents de la route, du travail ou domestiques'),
('Tension sociale', 'Tensions sociales pouvant dégénérer en conflits'),
('Autre', 'Autres types d''incidents non classifiés')
ON CONFLICT (nom) DO NOTHING;



-- ============================================================================
-- 6. INDICATEURS GLOBAUX (7 indicateurs)
-- ============================================================================

INSERT INTO indicators (nom, unite, kind, axe, organization_id) VALUES
('Nombre d''activités réalisées', 'activités', 'QUANTITATIF', 'Performance globale', NULL),
('Nombre de bénéficiaires directs', 'personnes', 'QUANTITATIF', 'Impact social', NULL),
('Nombre de femmes bénéficiaires', 'femmes', 'QUANTITATIF', 'Genre et inclusion', NULL),
('Nombre de personnes vulnérables assistées', 'personnes', 'QUANTITATIF', 'Protection sociale', NULL),
('Nombre de sessions de sensibilisation', 'sessions', 'QUANTITATIF', 'Prévention', NULL),
('Nombre d''alertes traitées', 'alertes', 'QUANTITATIF', 'Sécurité', NULL),
('Taux de résolution des incidents', '%', 'QUANTITATIF', 'Réponse aux crises', NULL)
ON CONFLICT DO NOTHING;



-- ============================================================================
-- 7. ADMIN SETTINGS
-- ============================================================================

INSERT INTO admin_settings (whatsapp, email, textes) VALUES
('2250576103277', 'omouitsi@gmail.com', '{}'::jsonb)
ON CONFLICT DO NOTHING;



-- ============================================================================
-- 8. SUPER ADMIN PAR DÉFAUT
-- ============================================================================
-- NOTE: Le Super Admin est créé via l'API /api/setup/super-admin
-- car Supabase Auth nécessite le SDK pour créer des utilisateurs avec mot de passe.
--
-- Identifiants du Super Admin:
--   Email:    omouitsi@gmail.com
--   Mot de passe: Ogou1987
--   Rôle:    Super Administrateur (is_super_admin = true)
--
-- Pour initialiser: curl -X POST /api/setup/super-admin
-- Pour vérifier:     GET /api/setup/super-admin
-- ============================================================================


-- ============================================================================
-- 9. DONNÉES DÉMO (SEED_DEMO)
-- Activation conditionnelle via variable ou toujours présent
-- ============================================================================

DO $$
DECLARE
  v_org_demo UUID;
  v_plan_pro UUID;
  v_region_abidjan UUID;
  v_user_proprietaire UUID;
  v_user_agent UUID;
  v_cat_solidarite UUID;
  v_cat_cohesion UUID;
  v_cat_visites UUID;
  v_type_distri UUID;
  v_type_sensib UUID;
  v_type_formation UUID;
  v_type_visite UUID;
  v_type_accompagnement UUID;
  v_type_dialogue UUID;
  v_type_activite_commu UUID;
  v_type_sport UUID;
  v_incident_conflit UUID;
BEGIN
  -- Vérifier si l'organisation demo existe déjà
  SELECT id INTO v_org_demo FROM organizations WHERE nom = 'DR DÉMO Abidjan';
  
  IF v_org_demo IS NULL THEN
    -- Créer l'organisation démo
    INSERT INTO organizations (nom, type_org, region, departement, telephone, email, actif)
    VALUES ('DR DÉMO Abidjan', 'DR', 'District d''Abidjan', 'Abidjan', '+2250700000000', 'demo@eoscs.ci', true)
    RETURNING id INTO v_org_demo;
    
    -- Récupérer le plan Professionnel
    SELECT id INTO v_plan_pro FROM subscription_plans WHERE code = 'PROFESSIONNEL';
    
    -- Récupérer la région Abidjan
    SELECT id INTO v_region_abidjan FROM regions WHERE nom = 'District d''Abidjan';
    
    -- Créer un abonnement pour l'org démo (12 mois à partir de maintenant)
    INSERT INTO subscriptions (organization_id, plan_id, date_debut, date_fin, duree_mois, statut, montant)
    VALUES (v_org_demo, v_plan_pro, NOW(), NOW() + INTERVAL '12 months', 12, 'ACTIF', 180000);
    
    -- Créer les périodes pour 2026
    INSERT INTO periods (organization_id, annee, trimestre, statut) VALUES
      (v_org_demo, 2026, 1, 'OUVERT'),
      (v_org_demo, 2026, 2, 'OUVERT');
    
    -- Créer le plan annuel
    INSERT INTO annual_plans (organization_id, annee, titre, statut)
    VALUES (v_org_demo, 2026, 'Plan annuel 2026 - DR DÉMO Abidjan', 'OUVERT');
    
    RAISE NOTICE 'Organisation démo créée avec ID : %', v_org_demo;
  ELSE
    RAISE NOTICE 'Organisation démo existe déjà avec ID : %', v_org_demo;
  END IF;
  
  -- Récupérer les IDs des catégories et types pour les activités
  SELECT id INTO v_cat_solidarite FROM activity_categories WHERE code = 'SOLIDARITE';
  SELECT id INTO v_cat_cohesion FROM activity_categories WHERE code = 'COHESION_SOCIALE';
  SELECT id INTO v_cat_visites FROM activity_categories WHERE code = 'VISITES_COMPASSION';
  
  -- Récupérer les types d'activités
  SELECT id INTO v_type_distri FROM activity_types WHERE nom = 'Distribution' AND category_id = v_cat_solidarite;
  SELECT id INTO v_type_sensib FROM activity_types WHERE nom = 'Sensibilisation' AND category_id = v_cat_cohesion;
  SELECT id INTO v_type_formation FROM activity_types WHERE nom = 'Formation' AND category_id = v_cat_cohesion;
  SELECT id INTO v_type_visite FROM activity_types WHERE nom = 'Visite' AND category_id = v_cat_visites;
  SELECT id INTO v_type_accompagnement FROM activity_types WHERE nom = 'Accompagnement' AND category_id = v_cat_visites;
  SELECT id INTO v_type_dialogue FROM activity_types WHERE nom = 'Dialogue' AND category_id = v_cat_cohesion;
  SELECT id INTO v_type_activite_commu FROM activity_types WHERE nom = 'Activité communautaire' AND category_id = v_cat_cohesion;
  SELECT id INTO v_type_sport FROM activity_types WHERE nom = 'Sport' AND category_id = v_cat_cohesion;
  
  -- Récupérer le type d'incident conflit
  SELECT id INTO v_incident_conflit FROM incident_types WHERE nom = 'Conflit communautaire';
  
  -- Insérer 8 activités variées sur T1/T2 2026 si elles n'existent pas déjà
  -- Activité 1 : Distribution alimentaire (Janvier 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-001', '2026-01-15', 'District d''Abidjan', 'Yopougon',
    v_cat_solidarite, v_type_distri, 
    'Distribution alimentaire aux familles vulnérables',
    'Distribution de kits alimentaires aux familles défavorisées du quartier Andokoi',
    'Soutenir 100 familles pendant la période de soudure',
    'Service solidarité', ARRAY['Koné Ibrahim', 'Touré Aminata'],
    '150 kits distribués, 120 familles bénéficiaires',
    'VALIDE'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 1
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 35, 45, 40, 30, 10, 50, 150 FROM activities WHERE reference = 'ACT-2026-001'
  ON CONFLICT DO NOTHING;
  
  -- Activité 2 : Sensibilisation paix (Février 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-002', '2026-02-20', 'District d''Abidjan', 'Abobo',
    v_cat_cohesion, v_type_sensib,
    'Campagne de sensibilisation pour la paix',
    'Sensibilisation des jeunes sur l''importance du vivre-ensemble et de la tolérance',
    'Toucher 500 jeunes avec un message de paix',
    'Service cohésion sociale', ARRAY['Bamba Kofi', 'Coulibaly Fatou'],
    '520 participants, 300 brochures distribuées',
    'VALIDE'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 2
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 280, 240, 80, 440, 0, 60, 520 FROM activities WHERE reference = 'ACT-2026-002'
  ON CONFLICT DO NOTHING;
  
  -- Activité 3 : Formation leadership (Mars 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-003', '2026-03-10', 'District d''Abidjan', 'Plateau',
    v_cat_cohesion, v_type_formation,
    'Formation au leadership communautaire',
    'Formation de 30 leaders communautaires sur la gestion des conflits et la médiation',
    'Renforcer les capacités de 30 leaders locaux',
    'Service formation', ARRAY['Diallo Mohamed', 'Yao Marie'],
    '30 formés, 90% de satisfaction',
    'VALIDE'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 3
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 18, 12, 0, 30, 0, 5, 30 FROM activities WHERE reference = 'ACT-2026-003'
  ON CONFLICT DO NOTHING;
  
  -- Activité 4 : Visite compassion (Mars 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-004', '2026-03-25', 'District d''Abidjan', 'Treichville',
    v_cat_visites, v_type_visite,
    'Visite au centre de soins palliatifs',
    'Visite d''écoute et de soutien moral aux patients du centre de soins palliatifs',
    'Apporter un réconfort aux patients et personnels soignants',
    'Service visites', ARRAY['Koffi Jeanne', 'Ouattara Issa'],
    '25 patients visités, dons de produits d''hygiène',
    'VALIDE'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 4
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 8, 12, 0, 17, 8, 25, 25 FROM activities WHERE reference = 'ACT-2026-004'
  ON CONFLICT DO NOTHING;
  
  -- Activité 5 : Dialogue intercommunautaire (Avril 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-005', '2026-04-05', 'District d''Abidjan', 'Adjame',
    v_cat_cohesion, v_type_dialogue,
    'Table ronde intercommunautaire',
    'Rencontre entre représentants des différentes communautés du quartier Adjamé',
    'Créer un espace de dialogue et prévenir les tensions',
    'Service médiation', ARRAY['Konaté Sékou', 'Aya Marie-Louise'],
    '45 participants, 3 accords signés',
    'VALIDE'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 5
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 25, 20, 0, 45, 0, 10, 45 FROM activities WHERE reference = 'ACT-2026-005'
  ON CONFLICT DO NOTHING;
  
  -- Activité 6 : Activité sportive (Avril 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-006', '2026-04-18', 'District d''Abidjan', 'Cocody',
    v_cat_cohesion, v_type_sport,
    'Tournoi de football pour la paix',
    'Organisation d''un tournoi de football réunissant des jeunes de différents quartiers',
    'Promouvoir la cohésion par le sport',
    'Service sports', ARRAY['Bamba Hervé', 'Diabaté Awa'],
    '8 équipes, 120 joueurs, finale réussie',
    'VALIDE'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 6
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 95, 25, 65, 55, 0, 20, 120 FROM activities WHERE reference = 'ACT-2026-006'
  ON CONFLICT DO NOTHING;
  
  -- Activité 7 : Accompagnement personnes âgées (Mai 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-007', '2026-05-12', 'District d''Abidjan', 'Marcory',
    v_cat_visites, v_type_accompagnement,
    'Accompagnement des personnes âgées isolées',
    'Programme de visite régulière et d''aide aux personnes âgées seules du quartier Marcory',
    'Accompagner 30 personnes âgées isolées',
    'Service compassion', ARRAY['Yao Philomène', 'Kouadio Emmanuel'],
    '30 personnes suivies, 15 visites à domicile réalisées',
    'EN_VERIFICATION'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 7
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 8, 22, 0, 5, 25, 30, 30 FROM activities WHERE reference = 'ACT-2026-007'
  ON CONFLICT DO NOTHING;
  
  -- Activité 8 : Journée communautaire (Mai 2026)
  INSERT INTO activities (
    organization_id, reference, date_activite, region, departement,
    category_id, type_id, intitule, description, objectif,
    structure_responsable, responsables, resultats, statut
  ) VALUES (
    v_org_demo, 'ACT-2026-008', '2026-05-28', 'District d''Abidjan', 'Koumassi',
    v_cat_cohesion, v_type_activite_commu,
    'Journée de nettoyage et cohésion communautaire',
    'Grande journée de salubrité et de renforcement des liens communautaires',
    'Mobiliser 200 habitants pour l''amélioration de leur cadre de vie',
    'Service animation', ARRAY['Touré Mamadou', 'Affi Évelyne'],
    '250 participants, 3 tonnes de déchets collectés',
    'SOUMIS'
  ) ON CONFLICT (reference) DO NOTHING;
  
  -- Bénéficiaires activité 8
  INSERT INTO beneficiaries (activity_id, hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total)
  SELECT id, 110, 140, 60, 190, 0, 30, 250 FROM activities WHERE reference = 'ACT-2026-008'
  ON CONFLICT DO NOTHING;
  
  -- Incident démo : Tension sociale (Janvier 2026)
  INSERT INTO incidents (
    organization_id, date, lieu, region, departement,
    nature, type_id, gravite, victimes, deces,
    actions_entreprises, acteurs, statut
  ) VALUES (
    v_org_demo, '2026-01-22', 'Quartier PK18, Abobo', 'District d''Abidjan', 'Abobo',
    'Tension entre groupes de jeunes suite à un différend foncier', v_incident_conflit,
    'MOYENNE', 0, 0,
    'Médiation engagée, rencontre avec les chefs de quartier prévue',
    ARRAY['MCNSLP', 'Chefs de quartier', 'Jeunesse'],
    'CLOTURE'
  );
  
  RAISE NOTICE 'Données démo créées (8 activités + 1 incident)';
END $$;


-- ============================================================================
-- Réactiver les triggers/RLS
-- ============================================================================


-- ============================================================================
-- VÉRIFICATION DU SEED
-- ============================================================================
SELECT 'subscription_plans' as table_name, count(*) as rows FROM subscription_plans
UNION ALL SELECT 'regions', count(*) FROM regions
UNION ALL SELECT 'departments', count(*) FROM departments
UNION ALL SELECT 'activity_categories', count(*) FROM activity_categories
UNION ALL SELECT 'activity_types', count(*) FROM activity_types
UNION ALL SELECT 'incident_types', count(*) FROM incident_types
UNION ALL SELECT 'indicateurs_globaux', count(*) FROM indicators WHERE organization_id IS NULL
UNION ALL SELECT 'admin_settings', count(*) FROM admin_settings
ORDER BY table_name;
