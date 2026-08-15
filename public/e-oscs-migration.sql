-- ============================================================================
-- MIGRATION INITIALE e-OSCS (SaaS Multi-Tenant pour MCNSLP Côte d'Ivoire)
-- ============================================================================
-- Fichier : 0001_init.sql
-- Description : Schéma complet de la base de données avec RLS, fonctions, triggers
-- Version : 1.0.0
-- Date création : 2025
-- ============================================================================

-- ============================================================================
-- PARTIE 1 : TYPES ENUMÉRÉS (ENUMS)
-- ============================================================================

-- Type énuméré pour les rôles au sein d'une organisation
DO $$ BEGIN
  CREATE TYPE org_role AS ENUM ('PROPRIETAIRE', 'AGENT', 'LECTEUR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE org_role IS 'Rôle d''un utilisateur dans une organisation : PROPRIETAIRE (droits complets), AGENT (lecture/écriture), LECTEUR (lecture seule)';

-- Type énuméré pour les statuts d'abonnement
DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('DEMANDE', 'EN_TRAITEMENT', 'EN_ATTENTE_PAIEMENT', 'ACTIF', 'EXPIRANT_BIENTOT', 'EXPIRE', 'SUSPENDU', 'RESILIE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE subscription_status IS 'Statut d''un abonnement organisationnel';

-- Type énuméré pour les statuts d'activité
DO $$ BEGIN
  CREATE TYPE activity_status AS ENUM ('BROUILLON', 'SOUMIS', 'EN_VERIFICATION', 'VALIDE', 'REJETE', 'CORRECTION', 'CONSOLIDE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE activity_status IS 'Cycle de vie d''une activité : BROUILLON -> SOUMIS -> EN_VERIFICATION -> VALIDÉ/REJETÉ -> CORRECTION/CONSOLIDÉ';

-- Type énuméré pour les statuts de demande d'abonnement
DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('NOUVELLE', 'EN_CONTACT', 'EN_ATTENTE_PAIEMENT', 'AYEE', 'REFUSEE', 'CLOTUREE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE request_status IS 'Statut d''une demande d''abonnement reçue via le formulaire public';

-- Type énuméré pour les statuts de période (trimestre)
DO $$ BEGIN
  CREATE TYPE period_status AS ENUM ('OUVERT', 'CLOTURE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE period_status IS 'Statut d''une période de déclaration : OUVERT (saisie possible) ou CLOTURÉE';

-- Type énuméré pour le type d'indicateur
DO $$ BEGIN
  CREATE TYPE indicator_kind AS ENUM ('QUANTITATIF', 'QUALITATIF');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE indicator_kind IS 'Nature d''un indicateur : QUANTITATIF (valeur numérique) ou QUALITATIF (texte descriptif)';

-- Type énuméré pour la gravité d'un incident
DO $$ BEGIN
  CREATE TYPE severity AS ENUM ('FAIBLE', 'MOYENNE', 'ELEVEE', 'CRITIQUE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE severity IS 'Niveau de gravité d''un incident : FAIBLE, MOYENNE, ÉLEVÉE ou CRITIQUE';

-- Type énuméré pour le statut d'un incident
DO $$ BEGIN
  CREATE TYPE incident_status AS ENUM ('EN_COURS', 'CLOTURE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE incident_status IS 'Statut de suivi d''un incident : EN_COURS ou CLOTURÉ';

-- Type énuméré pour le type de pièce jointe
DO $$ BEGIN
  CREATE TYPE attachment_kind AS ENUM ('PHOTO', 'DOCUMENT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE attachment_kind IS 'Type de pièce jointe : PHOTO (image) ou DOCUMENT (fichier)';

-- Type énuméré pour le type d'acteur
DO $$ BEGIN
  CREATE TYPE actor_type AS ENUM ('INTERNE', 'PARTENAIRE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON TYPE actor_type IS 'Type d''acteur impliqué dans une activité : INTERNE (agent MCNSLP) ou PARTENAIRE (extérieur)';


-- ============================================================================
-- PARTIE 2 : TABLES PRINCIPALES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table : organizations
-- Représente une organisation cliente (DR ou DD du MCNSLP)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- Informations identitaires
  nom TEXT NOT NULL,                          -- Nom de la direction régionale/départementale
  type_org TEXT NOT NULL CHECK (type_org IN ('DR', 'DD')), -- Direction Régionale ou Départementale
  region TEXT NOT NULL,                        -- Région administrative
  departement TEXT,                           -- Département (pour DD)
  
  -- Coordonnées
  telephone TEXT,                             -- Téléphone principal
  email TEXT,                                 -- Email professionnel
  
  -- Branding
  logo_url TEXT,                              -- URL du logo de l'organisation
  
  -- État
  actif BOOLEAN DEFAULT TRUE,                 -- Organisation active ou désactivée
  
  -- Traçabilité
  created_by UUID REFERENCES auth.users(id)   -- Créateur initial (super admin)
);

COMMENT ON TABLE organizations IS 'Organisations clientes (DR/DD) du système multi-tenant';
COMMENT ON COLUMN organizations.type_org IS 'Type : DR = Direction Régionale, DD = Direction Départementale';
COMMENT ON COLUMN organizations.actif IS 'Permet de désactiver une organisation sans supprimer ses données';

-- Index pour recherches fréquentes
CREATE INDEX idx_organizations_region ON organizations(region);
CREATE INDEX idx_organizations_type_org ON organizations(type_org);
CREATE INDEX idx_organizations_actif ON organizations(actif);


-- ----------------------------------------------------------------------------
-- Table : subscription_plans
-- Plans d'abonnement disponibles (table globale, non tenant)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  code TEXT UNIQUE NOT NULL,                  -- Code unique du plan (ex: STARTER, PRO, ENTERPRISE)
  nom TEXT NOT NULL,                          -- Nom affiché du plan
  prix_mensuel INTEGER NOT NULL DEFAULT 0,    -- Prix en FCFA par mois
  max_users INTEGER,                          -- Nombre max d'utilisateurs (NULL = illimité)
  storage_gb INTEGER NOT NULL DEFAULT 1,      -- Espace stockage en Go
  features JSONB DEFAULT '{}',                -- Liste des fonctionnalités activées
  ordre INTEGER NOT NULL DEFAULT 0,           -- Ordre d'affichage
  actif BOOLEAN DEFAULT TRUE                  -- Plan disponible à la souscription
);

COMMENT ON TABLE subscription_plans IS 'Catalogue des plans d''abonnement disponibles';
COMMENT ON COLUMN subscription_plans.features IS 'JSON des fonctionnalités : {"rapports": true, "api": false, ...}';

CREATE INDEX idx_subscription_plans_code ON subscription_plans(code);
CREATE INDEX idx_subscription_plans_actif ON subscription_plans(actif);


-- ----------------------------------------------------------------------------
-- Table : subscriptions
-- Abonnements actifs des organisations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  
  -- Période
  date_debut TIMESTAMPTZ NOT NULL,            -- Date de début d'abonnement
  date_fin TIMESTAMPTZ NOT NULL,              -- Date de fin d'abonnement
  duree_mois INTEGER NOT NULL,                -- Durée en mois
  
  -- Statut et paiement
  statut subscription_status NOT NULL DEFAULT 'DEMANDE',
  montant INTEGER,                            -- Montant total payé en FCFA
  reference_paiement TEXT,                    -- Référence transaction paiement
  confirme_le TIMESTAMPTZ,                    -- Date de confirmation paiement
  confirme_par UUID,                          -- Utilisateur qui a confirmé
  
  notes TEXT                                  -- Notes internes
);

COMMENT ON TABLE subscriptions IS 'Abonnements des organisations aux plans';
COMMENT ON COLUMN subscriptions.statut IS 'Statut calculé ou manuel de l''abonnement';

CREATE INDEX idx_subscriptions_organization_id ON subscriptions(organization_id);
CREATE INDEX idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX idx_subscriptions_statut ON subscriptions(statut);
CREATE INDEX idx_subscriptions_date_fin ON subscriptions(date_fin);


-- ----------------------------------------------------------------------------
-- Table : activation_codes
-- Codes d'activation pour les nouvelles organisations (global)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  code TEXT UNIQUE NOT NULL,                  -- Code unique d'activation
  organization_id UUID REFERENCES organizations(id), -- Organisation associée après activation
  plan_id UUID REFERENCES subscription_plans(id),   -- Plan attribué
  
  email_proprietaire TEXT NOT NULL,           -- Email du futur propriétaire
  duree_mois INTEGER NOT NULL DEFAULT 12,     -- Durée offerte en mois
  expire_le TIMESTAMPTZ NOT NULL,             -- Date d'expiration du code
  
  -- Utilisation
  utilise BOOLEAN DEFAULT FALSE,              -- Code déjà utilisé ?
  utilise_le TIMESTAMPTZ,                     -- Date d'utilisation
  cree_par UUID                               -- Admin créateur du code
);

COMMENT ON TABLE activation_codes IS 'Codes d''activation pour onboarder de nouvelles organisations';
COMMENT ON COLUMN activation_codes.code IS 'Code à communiquer au nouveau propriétaire (ex: EOSCS-XXXX-XXXX)';

CREATE INDEX idx_activation_codes_code ON activation_codes(code);
CREATE INDEX idx_activation_codes_utilise ON activation_codes(utilise);
CREATE INDEX idx_activation_codes_expire_le ON activation_codes(expire_le);


-- ----------------------------------------------------------------------------
-- Table : subscription_requests
-- Demandes d'abonnement reçues depuis le formulaire public (global)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS subscription_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- Identité demandeur
  nom TEXT NOT NULL,
  fonction TEXT NOT NULL,
  direction TEXT NOT NULL,
  type_direction TEXT CHECK (type_direction IN ('DR', 'DD')),
  region TEXT NOT NULL,
  departement TEXT,
  telephone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT NOT NULL,
  
  -- Besoins
  taille_equipe INTEGER,                      -- Taille estimée de l'équipe
  besoin TEXT,                                -- Description des besoins
  formule_souhaitee TEXT,                     -- Formule préférée
  
  -- Traitement
  statut request_status NOT NULL DEFAULT 'NOUVELLE',
  traite_par UUID,                            -- Administrateur en charge
  traite_le TIMESTAMPTZ,                      -- Date de dernier traitement
  notes_internes TEXT,                        -- Notes admin uniquement
  historique_statuts JSONB DEFAULT '[]'       -- Historique des changements de statut
);

COMMENT ON TABLE subscription_requests IS 'Demandes d''abonnement soumises via le formulaire public';
COMMENT ON COLUMN subscription_requests.historique_statuts IS 'Format : [{"statut": "...", "date": "...", "user": "..."}]';

CREATE INDEX idx_subscription_requests_statut ON subscription_requests(statut);
CREATE INDEX idx_subscription_requests_email ON subscription_requests(email);
CREATE INDEX idx_subscription_requests_region ON subscription_requests(region);


-- ----------------------------------------------------------------------------
-- Table : profiles
-- Profils utilisateurs (liés à auth.users de Supabase Auth)
-- L'id correspond à l'UUID de l'utilisateur dans auth.users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  nom_complet TEXT,                           -- Nom complet de l'utilisateur
  telephone TEXT,                             -- Téléphone personnel/professionnel
  
  -- Organisation (NULL = super administrateur)
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  org_role org_role,                          -- Rôle dans l'organisation
  is_super_admin BOOLEAN DEFAULT FALSE,       -- Super admin plateforme
  
  -- État et avatar
  actif BOOLEAN DEFAULT TRUE,
  avatar_url TEXT                             -- URL avatar
);

COMMENT ON TABLE profiles IS 'Profils utilisateurs étendus (jointure avec auth.users)';
COMMENT ON COLUMN profiles.id IS 'Correspond à auth.users.id - même UUID';
COMMENT ON COLUMN profiles.organization_id IS 'NULL pour les super admins';
COMMENT ON COLUMN profiles.org_role IS 'Rôle dans l''organisation (NULL si super admin sans org)';

CREATE INDEX idx_profiles_organization_id ON profiles(organization_id);
CREATE INDEX idx_profiles_is_super_admin ON profiles(is_super_admin);
CREATE INDEX idx_profiles_actif ON profiles(actif);


-- ----------------------------------------------------------------------------
-- Table : regions
-- Référentiel des régions administratives de Côte d'Ivoire (global)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  nom TEXT UNIQUE NOT NULL,                   -- Nom de la région
  code TEXT UNIQUE NOT NULL                   -- Code ISO/administratif
);

COMMENT ON TABLE regions IS 'Référentiel des régions administratives ivoiriennes';

CREATE INDEX idx_regions_nom ON regions(nom);
CREATE INDEX idx_regions_code ON regions(code);


-- ----------------------------------------------------------------------------
-- Table : departments
-- Référentiel des départements (global)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  nom TEXT NOT NULL,
  code TEXT,
  region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE
);

COMMENT ON TABLE departments IS 'Référentiel des départements par région';

CREATE INDEX idx_departments_region_id ON departments(region_id);
CREATE INDEX idx_departments_nom ON departments(nom);


-- ----------------------------------------------------------------------------
-- Table : structures
-- Services/structures internes d'une organisation
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  nom TEXT NOT NULL,                          -- Nom du service/structure
  description TEXT                            -- Description optionnelle
);

COMMENT ON TABLE structures IS 'Services ou structures internes d''une organisation';

CREATE INDEX idx_structures_organization_id ON structures(organization_id);


-- ----------------------------------------------------------------------------
-- Table : activity_categories
-- Catégories d'activités (référentiel global)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  code TEXT UNIQUE NOT NULL,                  -- Code unique de catégorie
  nom TEXT NOT NULL,                          -- Nom affiché
  description TEXT,                           -- Description détaillée
  couleur TEXT                                -- Couleur d'affichage (hex)
);

COMMENT ON TABLE activity_categories IS 'Catégories principales d''activités MCNSLP';

CREATE INDEX idx_activity_categories_code ON activity_categories(code);


-- ----------------------------------------------------------------------------
-- Table : activity_types
-- Types/sous-catégories d'activités
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  category_id UUID NOT NULL REFERENCES activity_categories(id) ON DELETE CASCADE,
  nom TEXT NOT NULL                           -- Nom du type d'activité
);

COMMENT ON TABLE activity_types IS 'Types ou sous-catégories d''activités';

CREATE INDEX idx_activity_types_category_id ON activity_types(category_id);


-- ----------------------------------------------------------------------------
-- Table : annual_plans
-- Plans annuels d'activités par organisation
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS annual_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  annee INTEGER NOT NULL,                     -- Année du plan
  titre TEXT,                                 -- Titre du plan
  statut period_status NOT NULL DEFAULT 'OUVERT'
);

COMMENT ON TABLE annual_plans IS 'Plans annuels d''activités par organisation';

CREATE INDEX idx_annual_plans_organization_id ON annual_plans(organization_id);
CREATE INDEX idx_annual_plans_annee ON annual_plans(annee);
CREATE UNIQUE INDEX idx_annual_plans_org_annee ON annual_plans(organization_id, annee);


-- ----------------------------------------------------------------------------
-- Table : plan_activities
-- Activités prévues dans un plan annuel
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS plan_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  plan_id UUID NOT NULL REFERENCES annual_plans(id) ON DELETE CASCADE,
  axe_strategique TEXT,                       -- Axe stratégique
  objectif TEXT,                              -- Objectif visé
  activite_prevue TEXT,                       -- Activité prévue
  indicateur TEXT,                            -- Indicateur de suivi
  cible TEXT,                                 -- Cible à atteindre
  responsable TEXT,                           -- Responsable désigné
  periode_prevue TEXT,                        -- Période prévue
  budget NUMERIC,                             -- Budget alloué
  observations TEXT                           -- Observations complémentaires
);

COMMENT ON TABLE plan_activities IS 'Lignes d''activités dans un plan annuel';

CREATE INDEX idx_plan_activities_plan_id ON plan_activities(plan_id);


-- ----------------------------------------------------------------------------
-- Table : activities
-- Activités réalisées (table centrale du système)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  -- Organisation et référence
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  reference TEXT UNIQUE NOT NULL,             -- Référence unique auto-générée
  
  -- Dates (avec colonnes générées pour agrégation)
  date_activite DATE NOT NULL,                -- Date de réalisation
  mois INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM date_activite)::INT) STORED,
  trimestre INTEGER GENERATED ALWAYS AS (CEIL(EXTRACT(MONTH FROM date_activite)/3.0)::INT) STORED,
  annee INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date_activite)::INT) STORED,
  
  -- Localisation
  region TEXT NOT NULL,
  departement TEXT,
  sous_prefecture TEXT,
  
  -- Classification
  category_id UUID REFERENCES activity_categories(id),
  type_id UUID REFERENCES activity_types(id),
  
  -- Contenu
  intitule TEXT NOT NULL,                      -- Titre/intitulé de l'activité
  description TEXT,                            -- Description détaillée
  objectif TEXT,                               -- Objectif de l'activité
  structure_responsable TEXT,                  -- Service/structure responsable
  responsables TEXT[],                         -- Liste des responsables (noms)
  
  -- Résultats et analyse
  resultats TEXT,                              -- Résultats obtenus
  difficultes TEXT,                            -- Difficultés rencontrées
  recommandations TEXT,                        -- Recommandations
  perspectives TEXT,                           -- Perspectives
  observations TEXT,                           -- Observations générales
  
  -- Workflow validation
  statut activity_status DEFAULT 'BROUILLON',
  plan_activity_id UUID,                       -- Lien vers activité planifiée
  est_supplementaire BOOLEAN DEFAULT FALSE,    -- Hors plan initial
  
  -- Traçabilité
  cree_par UUID,                               -- Créateur de l'activité
  soumis_le TIMESTAMPTZ,                       -- Date de soumission
  valide_le TIMESTAMPTZ,                       -- Date de validation
  valide_par UUID,                             -- Validateur
  motif_rejet TEXT                             -- Motif de rejet si applicable
);

COMMENT ON TABLE activities IS 'Table centrale : activités réalisées par les organisations';
COMMENT ON COLUMN activities.reference IS 'Référence unique formatée (ex: ACT-2024-001)';
COMMENT ON COLUMN activities.mois IS 'Colonne générée : numéro du mois (1-12)';
COMMENT ON COLUMN activities.trimestre IS 'Colonne générée : numéro du trimestre (1-4)';
COMMENT ON COLUMN activities.annee IS 'Colonne générée : année';
COMMENT ON COLUMN activities.est_supplementaire TRUE IS 'Activité non prévue au plan annuel';

-- Index optimisés pour les requêtes métier
CREATE INDEX idx_activities_organization_id ON activities(organization_id);
CREATE INDEX idx_activities_date_activite ON activities(date_activite);
CREATE INDEX idx_activities_mois ON activities(mois);
CREATE INDEX idx_activities_trimestre ON activities(trimestre);
CREATE INDEX idx_activities_annee ON activities(annee);
CREATE INDEX idx_activities_statut ON activities(statut);
CREATE INDEX idx_activities_category_id ON activities(category_id);
CREATE INDEX idx_activities_type_id ON activities(type_id);
CREATE INDEX idx_activities_region ON activities(region);
CREATE INDEX idx_activities_reference ON activities(reference);
CREATE INDEX idx_activities_cree_par ON activities(cree_par);

-- Index composite pour les filtres courants
CREATE INDEX idx_activities_org_annee_trimestre ON activities(organization_id, annee, trimestre);
CREATE INDEX idx_activities_org_statut ON activities(organization_id, statut);


-- ----------------------------------------------------------------------------
-- Table : activity_actors
-- Acteurs (internes/partenaires) impliqués dans une activité
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_actors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  acteur TEXT NOT NULL,                       -- Nom de l'acteur
  type_acteur actor_type NOT NULL,            -- INTERNE ou PARTENAIRE
  role TEXT                                   -- Rôle dans l'activité
);

COMMENT ON TABLE activity_actors IS 'Acteurs impliqués dans chaque activité';

CREATE INDEX idx_activity_actors_activity_id ON activity_actors(activity_id);
CREATE INDEX idx_activity_actors_type_acteur ON activity_actors(type_acteur);


-- ----------------------------------------------------------------------------
-- Table : beneficiaries
-- Bénéficiaires d'une activité (démographie)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS beneficiaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  
  -- Démographie
  hommes INTEGER DEFAULT 0,                   -- Nombre d'hommes
  femmes INTEGER DEFAULT 0,                   -- Nombre de femmes
  enfants INTEGER DEFAULT 0,                  -- Nombre d'enfants (<18 ans)
  adultes INTEGER DEFAULT 0,                  -- Nombre d'adultes
  personnes_agees INTEGER DEFAULT 0,          -- Nombre de personnes âgées (>60 ans)
  vulnerables INTEGER DEFAULT 0,              -- Personnes vulnérables
  total INTEGER DEFAULT 0                     -- Total bénéficiaires
);

COMMENT ON TABLE beneficiaries IS 'Démographie des bénéficiaires d''une activité';
COMMENT ON COLUMN beneficiaries.total IS 'Total calculé (doit être >= somme catégories)';

CREATE INDEX idx_beneficiaries_activity_id ON beneficiaries(activity_id);

-- Contrainte de cohérence sur les totaux
ALTER TABLE beneficiaries 
ADD CONSTRAINT check_beneficiaires_total 
CHECK (total >= hommes + femmes);


-- ----------------------------------------------------------------------------
-- Table : indicators
-- Indicateurs de suivi (globaux ou spécifiques à une organisation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  nom TEXT NOT NULL,                          -- Nom de l'indicateur
  unite TEXT,                                 -- Unité de mesure
  kind indicator_kind NOT NULL,               -- Quantitatif ou qualitatif
  axe TEXT,                                   -- Axe stratégique
  category_id UUID REFERENCES activity_categories(id), -- Catégorie associée (optionnel)
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE -- NULL = indicateur global
);

COMMENT ON TABLE indicators IS 'Indicateurs de suivi (globaux ou personnalisés)';
COMMENT ON COLUMN indicators.organization_id IS 'NULL = indicateur global disponible pour toutes les organisations';

CREATE INDEX idx_indicators_organization_id ON indicators(organization_id);
CREATE INDEX idx_indicators_category_id ON indicators(category_id);
CREATE INDEX idx_indicators_kind ON indicators(kind);


-- ----------------------------------------------------------------------------
-- Table : indicator_values
-- Valeurs d'indicateurs pour une activité
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS indicator_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  indicator_id UUID NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
  
  valeur_numerique NUMERIC,                    -- Valeur quantitative
  valeur_texte TEXT                           -- Valeur qualitative
);

COMMENT ON TABLE indicator_values IS 'Valeurs mesurées d''indicateurs par activité';
COMMENT ON COLUMN indicator_values.valeur_numerique IS 'Pour indicateurs quantitatifs';
COMMENT ON COLUMN indicator_values.valeur_texte IS 'Pour indicateurs qualitatifs';

CREATE INDEX idx_indicator_values_activity_id ON indicator_values(activity_id);
CREATE INDEX idx_indicator_values_indicator_id ON indicator_values(indicator_id);

-- Unicité : une seule valeur par couple activité/indicateur
CREATE UNIQUE INDEX idx_indicator_values_unique ON indicator_values(activity_id, indicator_id);


-- ----------------------------------------------------------------------------
-- Table : incident_types
-- Types d'incidents (référentiel global)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS incident_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  nom TEXT UNIQUE NOT NULL,                   -- Nom du type d'incident
  description TEXT                            -- Description détaillée
);

COMMENT ON TABLE incident_types IS 'Typologie des incidents/sinistres';

CREATE INDEX idx_incident_types_nom ON incident_types(nom);


-- ----------------------------------------------------------------------------
-- Table : incidents
-- Incidents/sinistres déclarés par les organisations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  
  -- Informations générales
  date DATE NOT NULL,                         -- Date de l'incident
  lieu TEXT NOT NULL,                         -- Lieu de l'incident
  region TEXT NOT NULL,
  departement TEXT,
  
  -- Classification
  nature TEXT NOT NULL,                       -- Nature de l'incident
  type_id UUID REFERENCES incident_types(id), -- Type prédéfini
  gravite severity NOT NULL DEFAULT 'MOYENNE',
  
  -- Impact humain
  victimes INTEGER DEFAULT 0,                 -- Nombre de victimes
  deces INTEGER DEFAULT 0,                    -- Nombre de décès
  
  -- Gestion
  actions_entreprises TEXT,                   -- Actions menées
  acteurs TEXT[],                             -- Acteurs intervenants
  statut incident_status DEFAULT 'EN_COURS'
);

COMMENT ON TABLE incidents IS 'Déclaration d''incidents/sinistres';

CREATE INDEX idx_incidents_organization_id ON incidents(organization_id);
CREATE INDEX idx_incidents_date ON incidents(date);
CREATE INDEX idx_incidents_gravite ON incidents(gravite);
CREATE INDEX idx_incidents_statut ON incidents(statut);
CREATE INDEX idx_incidents_region ON incidents(region);
CREATE INDEX idx_incidents_type_id ON incidents(type_id);


-- ----------------------------------------------------------------------------
-- Table : attachments
-- Pièces jointes (photos et documents)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,  -- Liée à une activité (optionnel)
  incident_id UUID REFERENCES incidents(id) ON DELETE SET NULL,   -- Ou liée à un incident (optionnel)
  
  kind attachment_kind NOT NULL,              -- PHOTO ou DOCUMENT
  storage_path TEXT NOT NULL,                 -- Chemin dans Supabase Storage
  nom_fichier TEXT NOT NULL,                  -- Nom original du fichier
  mime TEXT NOT NULL,                         -- Type MIME
  taille INTEGER NOT NULL,                    -- Taille en octets
  
  -- Métadonnées
  legende TEXT,                               -- Légende/crédit photo
  date_prise DATE,                            -- Date de prise (pour photos)
  lieu_prise TEXT,                            -- Lieu de prise
  description TEXT,                           -- Description
  selection_presentation BOOLEAN DEFAULT FALSE -- Sélectionnée pour présentation/rapport
);

COMMENT ON TABLE attachments IS 'Pièces jointes (photos et documents) liées aux activités/incidents';
COMMENT ON COLUMN attachments.storage_path IS 'Chemin dans le bucket Storage';
COMMENT ON COLUMN attachments.selection_presentation TRUE IS 'Marquée pour inclusion automatique dans rapports';

CREATE INDEX idx_attachments_organization_id ON attachments(organization_id);
CREATE INDEX idx_attachments_activity_id ON attachments(activity_id);
CREATE INDEX idx_attachments_incident_id ON attachments(incident_id);
CREATE INDEX idx_attachments_kind ON attachments(kind);
CREATE INDEX idx_attachments_selection_presentation ON attachments(selection_presentation);


-- ----------------------------------------------------------------------------
-- Table : periods
-- Périodes de déclaration (trimestres gérés par organisation)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  annee INTEGER NOT NULL,
  trimestre INTEGER NOT NULL CHECK (trimestre BETWEEN 1 AND 4),
  statut period_status NOT NULL DEFAULT 'OUVERT',
  
  -- Cloture/Réouverture
  cloture_le TIMESTAMPTZ,
  cloture_par UUID,
  rouverte_le TIMESTAMPTZ,
  rouverte_par UUID,
  motif_reouverture TEXT
);

COMMENT ON TABLE periods IS 'Périodes de déclaration (gestion ouverture/cloture trimestres)';
COMMENT ON COLUMN periods.statut IS 'OUVERT = saisie possible, CLOTURE = verrouillé';

CREATE INDEX idx_periods_organization_id ON periods(organization_id);
CREATE INDEX idx_periods_annee ON periods(annee);
CREATE INDEX idx_periods_trimestre ON periods(trimestre);
CREATE INDEX idx_periods_statut ON periods(statut);
CREATE UNIQUE INDEX idx_periods_org_annee_trimestre ON periods(organization_id, annee, trimestre);


-- ----------------------------------------------------------------------------
-- Table : reports
-- Rapports générés (mensuels, trimestriels, annuels)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  type_rapport TEXT NOT NULL CHECK (type_rapport IN ('MENSUEL', 'TRIMESTRIEL', 'ANNUEL')),
  annee INTEGER NOT NULL,
  periode INTEGER NOT NULL,                    -- Mois (1-12) ou Trimestre (1-4) selon type
  statut TEXT NOT NULL DEFAULT 'BROUILLON' CHECK (statut IN ('BROUILLON', 'FINAL')),
  titre TEXT                                  -- Titre personnalisé du rapport
);

COMMENT ON TABLE reports IS 'Rapports générés (métadonnées, fichiers dans report_versions)';
COMMENT ON COLUMN reports.periode IS 'Mois pour MENSUEL, Trimestre pour TRIMESTRIEL/ANNUEL';

CREATE INDEX idx_reports_organization_id ON reports(organization_id);
CREATE INDEX idx_reports_type_rapport ON reports(type_rapport);
CREATE INDEX idx_reports_annee ON reports(annee);
CREATE INDEX idx_reports_periode ON reports(periode);
CREATE INDEX idx_reports_statut ON reports(statut);
CREATE UNIQUE INDEX idx_reports_org_type_annee_periode ON reports(organization_id, type_rapport, annee, periode);


-- ----------------------------------------------------------------------------
-- Table : report_versions
-- Versions de fichiers de rapports générés
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS report_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,          -- Numéro de version
  format TEXT NOT NULL CHECK (format IN ('DOCX', 'PPTX')), -- Format de sortie
  storage_path TEXT NOT NULL,                  -- Chemin vers le fichier généré
  genere_par UUID,                             -- Utilisateur ayant demandé la génération
  parametres JSONB DEFAULT '{}'               -- Paramètres utilisés pour cette version
);

COMMENT ON TABLE report_versions IS 'Fichiers de rapports générés (plusieurs versions possibles)';
COMMENT ON COLUMN report_versions.parametres IS 'Configuration utilisée : template, sections incluses, etc.';

CREATE INDEX idx_report_versions_report_id ON report_versions(report_id);
CREATE INDEX idx_report_versions_format ON report_versions(format);


-- ----------------------------------------------------------------------------
-- Table : notifications
-- Notifications utilisateurs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID,                                -- Destinataire spécifique (NULL = tous membres org)
  type TEXT NOT NULL,                          -- Type de notification
  titre TEXT NOT NULL,                         -- Titre court
  message TEXT NOT NULL,                       -- Message détaillé
  lien TEXT,                                   -- Lien action (optionnel)
  lue BOOLEAN DEFAULT FALSE                    -- Statut lecture
);

COMMENT ON TABLE notifications IS 'Notifications destinées aux utilisateurs';
COMMENT ON COLUMN notifications.user_id IS 'NULL = notification pour tous les membres de l''organisation';

CREATE INDEX idx_notifications_organization_id ON notifications(organization_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_lue ON notifications(lue);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);


-- ----------------------------------------------------------------------------
-- Table : audit_logs
-- Journal d'audit des actions sensibles
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  user_id UUID NOT NULL,                       -- Auteur de l'action
  action TEXT NOT NULL,                        -- Action effectuée (INSERT, UPDATE, DELETE, etc.)
  objet_type TEXT NOT NULL,                    -- Type d'objet modifié
  objet_id UUID NOT NULL,                      -- ID de l'objet
  ancienne_valeur JSONB,                       -- Valeur avant modification
  nouvelle_valeur JSONB,                       -- Valeur après modification
  
  -- Contexte technique
  ip TEXT,                                     -- IP de l'utilisateur
  user_agent TEXT                              -- User agent navigateur
);

COMMENT ON TABLE audit_logs IS 'Journal d''audit traçant les modifications sensibles';
COMMENT ON COLUMN audit_logs.ancienne_valeur IS 'Snapshot de l''objet avant modification (JSON)';
COMMENT ON COLUMN audit_logs.nouvelle_valeur IS 'Snapshot de l''objet après modification (JSON)';

CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_objet_type ON audit_logs(objet_type);
CREATE INDEX idx_audit_logs_objet_id ON audit_logs(objet_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);


-- ----------------------------------------------------------------------------
-- Table : admin_settings
-- Configuration globale de la plateforme (singleton)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ,
  
  whatsapp TEXT,                               -- Numéro WhatsApp contact support
  email TEXT,                                  -- Email contact support
  textes JSONB DEFAULT '{}'                    -- Textes configurables (mentions légales, etc.)
);

COMMENT ON TABLE admin_settings IS 'Paramètres globaux de la plateforme (une seule ligne)';

-- Insertion de la ligne initiale si inexistante
INSERT INTO admin_settings (id, whatsapp, email, textes)
VALUES (gen_random_uuid(), NULL, NULL, '{}')
ON CONFLICT DO NOTHING;


-- ============================================================================
-- PARTIE 3 : FONCTIONS SQL HELPER
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Fonction : current_org_id()
-- Retourne l'organisation_id de l'utilisateur connecté
-- Security Definer pour accès cross-schema (auth -> public)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_org_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid();
$$;

COMMENT ON FUNCTION current_org_id() IS 'Retourne l''ID organisation de l''utilisateur connecté';


-- ----------------------------------------------------------------------------
-- Fonction : current_org_role()
-- Retourne le rôle de l'utilisateur dans son organisation
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION current_org_role()
RETURNS org_role
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT org_role FROM public.profiles WHERE id = auth.uid();
$$;

COMMENT ON FUNCTION current_org_role() IS 'Retourne le rôle (PROPRIETAIRE/AGENT/LECTEUR) de l''utilisateur connecté';


-- ----------------------------------------------------------------------------
-- Fonction : is_super_admin()
-- Vérifie si l'utilisateur est super administrateur
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_super_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

COMMENT ON FUNCTION is_super_admin() IS 'Vérifie si l''utilisateur est super administrateur de la plateforme';


-- ----------------------------------------------------------------------------
-- Fonction : compute_subscription_status()
-- Calcule le statut effectif d'un abonnement en fonction des dates
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION compute_subscription_status(subs subscriptions)
RETURNS subscription_status
LANGUAGE sql
STABLE
AS $$
  CASE
    WHEN subs.statut IN ('RESILIE', 'SUSPENDU') THEN subs.statut
    WHEN subs.date_fin <= NOW() THEN 'EXPIRE'
    WHEN subs.date_fin <= NOW() + INTERVAL '30 days' THEN 'EXPIRANT_BIENTOT'
    ELSE subs.statut
  END;
$$;

COMMENT ON FUNCTION compute_subscription_status(subscriptions) IS 'Calcule le statut effectif d''un abonnement (gère expiration automatique)';


-- ----------------------------------------------------------------------------
-- Fonction : update_updated_at_column()
-- Trigger générique pour mettre à jour le champ updated_at
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger : met à jour automaticement updated_at à chaque modification';


-- ----------------------------------------------------------------------------
-- Fonction : handle_new_user()
-- Trigger appelé lors de la création d'un utilisateur dans auth.users
-- Crée automatiquement le profil associé
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, nom_complet)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nom_complet', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

COMMENT ON FUNCTION handle_new_user() IS 'Trigger post-insert auth.users : crée le profil utilisateur automatiquement';


-- ----------------------------------------------------------------------------
-- Fonction : audit_trigger_function()
-- Trigger générique d'audit qui logue les modifications dans audit_logs
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_old_json JSONB;
  v_new_json JSONB;
  v_user_id UUID;
  v_org_id UUID;
BEGIN
  -- Récupération infos utilisateur
  v_user_id := COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid);
  
  -- Tentative récupération organisation (peut échouer si pas de profil)
  BEGIN
    SELECT organization_id INTO v_org_id FROM public.profiles WHERE id = v_user_id;
  EXCEPTION WHEN OTHERS THEN
    v_org_id := NULL;
  END;
  
  -- Construction des snapshots
  IF TG_OP = 'DELETE' THEN
    v_old_json := to_jsonb(OLD);
    v_new_json := NULL;
  ELSIF TG_OP = 'INSERT' THEN
    v_old_json := NULL;
    v_new_json := to_jsonb(NEW);
  ELSIF TG_OP = 'UPDATE' THEN
    v_old_json := to_jsonb(OLD);
    v_new_json := to_jsonb(NEW);
  END IF;
  
  -- Insertion dans le journal d'audit
  INSERT INTO public.audit_logs (
    organization_id,
    user_id,
    action,
    objet_type,
    objet_id,
    ancienne_valeur,
    nouvelle_valeur
  ) VALUES (
    v_org_id,
    v_user_id,
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    v_old_json,
    v_new_json
  );
  
  -- Pour UPDATE/DELETE, on retourne la ligne originale/modifiée
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

COMMENT ON FUNCTION audit_trigger_function() IS 'Trigger d''audit : enregistre toutes les modifications dans audit_logs';


-- ============================================================================
-- PARTIE 4 : TRIGGERS AUTOMATIQUES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Trigger : updated_at automatique sur toutes les tables
-- ----------------------------------------------------------------------------

-- Organizations
DROP TRIGGER IF EXISTS set_updated_at_organizations ON organizations;
CREATE TRIGGER set_updated_at_organizations
  BEFORE INSERT OR UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Subscription plans
DROP TRIGGER IF EXISTS set_updated_at_subscription_plans ON subscription_plans;
CREATE TRIGGER set_updated_at_subscription_plans
  BEFORE INSERT OR UPDATE ON subscription_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Subscriptions
DROP TRIGGER IF EXISTS set_updated_at_subscriptions ON subscriptions;
CREATE TRigger set_updated_at_subscriptions
  BEFORE INSERT OR UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activation codes
DROP TRIGGER IF EXISTS set_updated_at_activation_codes ON activation_codes;
CREATE TRIGGER set_updated_at_activation_codes
  BEFORE INSERT OR UPDATE ON activation_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Subscription requests
DROP TRIGGER IF EXISTS set_updated_at_subscription_requests ON subscription_requests;
CREATE TRIGGER set_updated_at_subscription_requests
  BEFORE INSERT OR UPDATE ON subscription_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Profiles
DROP TRIGGER IF EXISTS set_updated_at_profiles ON profiles;
CREATE TRIGGER set_updated_at_profiles
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Regions
DROP TRIGGER IF EXISTS set_updated_at_regions ON regions;
CREATE TRIGGER set_updated_at_regions
  BEFORE INSERT OR UPDATE ON regions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Departments
DROP TRIGGER IF EXISTS set_updated_at_departments ON departments;
CREATE TRIGGER set_updated_at_departments
  BEFORE INSERT OR UPDATE ON departments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Structures
DROP TRIGGER IF EXISTS set_updated_at_structures ON structures;
CREATE TRIGGER set_updated_at_structures
  BEFORE INSERT OR UPDATE ON structures
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activity categories
DROP TRIGGER IF EXISTS set_updated_at_activity_categories ON activity_categories;
CREATE TRIGGER set_updated_at_activity_categories
  BEFORE INSERT OR UPDATE ON activity_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activity types
DROP TRIGGER IF EXISTS set_updated_at_activity_types ON activity_types;
CREATE TRIGGER set_updated_at_activity_types
  BEFORE INSERT OR UPDATE ON activity_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Annual plans
DROP TRIGGER IF EXISTS set_updated_at_annual_plans ON annual_plans;
CREATE TRIGGER set_updated_at_annual_plans
  BEFORE INSERT OR UPDATE ON annual_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Plan activities
DROP TRIGGER IF EXISTS set_updated_at_plan_activities ON plan_activities;
CREATE TRIGGER set_updated_at_plan_activities
  BEFORE INSERT OR UPDATE ON plan_activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activities
DROP TRIGGER IF EXISTS set_updated_at_activities ON activities;
CREATE TRIGGER set_updated_at_activities
  BEFORE INSERT OR UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Activity actors
DROP TRIGGER IF EXISTS set_updated_at_activity_actors ON activity_actors;
CREATE TRIGGER set_updated_at_activity_actors
  BEFORE INSERT OR UPDATE ON activity_actors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Beneficiaries
DROP TRIGGER IF EXISTS set_updated_at_beneficiaries ON beneficiaries;
CREATE TRIGGER set_updated_at_beneficiaries
  BEFORE INSERT OR UPDATE ON beneficiaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indicators
DROP TRIGGER IF EXISTS set_updated_at_indicators ON indicators;
CREATE TRIGGER set_updated_at_indicators
  BEFORE INSERT OR UPDATE ON indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indicator values
DROP TRIGGER IF EXISTS set_updated_at_indicator_values ON indicator_values;
CREATE TRIGGER set_updated_at_indicator_values
  BEFORE INSERT OR UPDATE ON indicator_values
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Incident types
DROP TRIGGER IF EXISTS set_updated_at_incident_types ON incident_types;
CREATE TRIGGER set_updated_at_incident_types
  BEFORE INSERT OR UPDATE ON incident_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Incidents
DROP TRIGGER IF EXISTS set_updated_at_incidents ON incidents;
CREATE TRIGGER set_updated_at_incidents
  BEFORE INSERT OR UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Attachments
DROP TRIGGER IF EXISTS set_updated_at_attachments ON attachments;
CREATE TRIGGER set_updated_at_attachments
  BEFORE INSERT OR UPDATE ON attachments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Periods
DROP TRIGGER IF EXISTS set_updated_at_periods ON periods;
CREATE TRIGGER set_updated_at_periods
  BEFORE INSERT OR UPDATE ON periods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Reports
DROP TRIGGER IF EXISTS set_updated_at_reports ON reports;
CREATE TRIGGER set_updated_at_reports
  BEFORE INSERT OR UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Report versions
DROP TRIGGER IF EXISTS set_updated_at_report_versions ON report_versions;
CREATE TRIGGER set_updated_at_report_versions
  BEFORE INSERT OR UPDATE ON report_versions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Notifications
DROP TRIGGER IF EXISTS set_updated_at_notifications ON notifications;
CREATE TRIGGER set_updated_at_notifications
  BEFORE INSERT OR UPDATE ON notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Admin settings
DROP TRIGGER IF EXISTS set_updated_at_admin_settings ON admin_settings;
CREATE TRIGGER set_updated_at_admin_settings
  BEFORE INSERT OR UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ----------------------------------------------------------------------------
-- Trigger : handle_new_user sur auth.users
-- Crée automatiquement le profil quand un utilisateur s'inscrit
-- ----------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- ============================================================================
-- PARTIE 5 : TRIGGERS D'AUDIT
-- Tables auditées : modifications loguées dans audit_logs
-- ============================================================================

-- Audit des activités (table principale)
DROP TRIGGER IF EXISTS audit_activities ON activities;
CREATE TRIGGER audit_activities
  AFTER UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit des abonnements
DROP TRIGGER IF EXISTS audit_subscriptions ON subscriptions;
CREATE TRIGGER audit_subscriptions
  AFTER INSERT OR UPDATE OR DELETE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit des organisations
DROP TRIGGER IF EXISTS audit_organizations ON organizations;
CREATE TRIGGER audit_organizations
  AFTER INSERT OR UPDATE OR DELETE ON organizations
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit des profils
DROP TRIGGER IF EXISTS audit_profiles ON profiles;
CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit des périodes (cloture/réouverture)
DROP TRIGGER IF EXISTS audit_periods ON periods;
CREATE TRIGGER audit_periods
  AFTER INSERT OR UPDATE OR DELETE ON periods
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Audit des incidents
DROP TRIGGER IF EXISTS audit_incidents ON incidents;
CREATE TRIGGER audit_incidents
  AFTER INSERT OR UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();


-- ============================================================================
-- PARTIE 6 : ROW LEVEL SECURITY (RLS)
-- Activation et politiques par table
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Table : organizations
-- ----------------------------------------------------------------------------
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Les super admins voient tout, les autres voient leur organisation
CREATE POLICY "select_organizations" ON organizations
  FOR SELECT USING (
    is_super_admin() OR id = current_org_id()
  );

-- Seuls les super admins peuvent créer des organisations
CREATE POLICY "insert_organizations" ON organizations
  FOR INSERT WITH CHECK (
    is_super_admin()
  );

-- Seuls les super admins peuvent modifier
CREATE POLICY "update_organizations" ON organizations
  FOR UPDATE USING (
    is_super_admin()
  )
  WITH CHECK (
    is_super_admin()
  );

-- Seuls les super admins peuvent supprimer
CREATE POLICY "delete_organizations" ON organizations
  FOR DELETE USING (
    is_super_admin()
  );


-- ----------------------------------------------------------------------------
-- Table : subscriptions
-- ----------------------------------------------------------------------------
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_subscriptions" ON subscriptions
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_subscriptions" ON subscriptions
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_subscriptions" ON subscriptions
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : subscription_plans (globale, lecture pour tous authentifiés)
-- ----------------------------------------------------------------------------
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_subscription_plans" ON subscription_plans
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "insert_subscription_plans" ON subscription_plans
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "update_subscription_plans" ON subscription_plans
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_subscription_plans" ON subscription_plans
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : activation_codes (globale)
-- ----------------------------------------------------------------------------
ALTER TABLE activation_codes ENABLE ROW LEVEL SECURITY;

-- Lecture : super admin ou code non utilisé visible publiquement (limité)
CREATE POLICY "select_activation_codes" ON activation_codes
  FOR SELECT USING (
    is_super_admin() OR 
    (NOT utilise AND email_proprietaire = (SELECT email FROM profiles WHERE id = auth.uid()))
  );

-- Écriture réservée aux super admins
CREATE POLICY "insert_activation_codes" ON activation_codes
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "update_activation_codes" ON activation_codes
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_activation_codes" ON activation_codes
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : subscription_requests (formulaire public)
-- ----------------------------------------------------------------------------
ALTER TABLE subscription_requests ENABLE ROW LEVEL SECURITY;

-- Insertion publique (anon) pour le formulaire de demande
CREATE POLICY "insert_subscription_requests_public" ON subscription_requests
  FOR INSERT WITH CHECK (true);

-- Lecture/Modification réservée aux super admins
CREATE POLICY "select_subscription_requests" ON subscription_requests
  FOR SELECT USING (is_super_admin());

CREATE POLICY "update_subscription_requests" ON subscription_requests
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_subscription_requests" ON subscription_requests
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : profiles
-- ----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Voir son propre profil ou super admin voit tout
CREATE POLICY "select_profiles" ON profiles
  FOR SELECT USING (
    is_super_admin() OR id = auth.uid()
  );

-- Seuls super admins peuvent créer des profils (normalement via trigger)
CREATE POLICY "insert_profiles" ON profiles
  FOR INSERT WITH CHECK (
    is_super_admin() OR id = auth.uid()
  );

-- Modifier son propre profil
CREATE POLICY "update_profiles" ON profiles
  FOR UPDATE USING (
    is_super_admin() OR id = auth.uid()
  )
  WITH CHECK (
    is_super_admin() OR id = auth.uid()
  );

-- Suppression réservée aux super admins
CREATE POLICY "delete_profiles" ON profiles
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : regions (référentiel global)
-- ----------------------------------------------------------------------------
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_regions" ON regions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "insert_regions" ON regions
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "update_regions" ON regions
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_regions" ON regions
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : departments (référentiel global)
-- ----------------------------------------------------------------------------
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_departments" ON departments
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "insert_departments" ON departments
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "update_departments" ON departments
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_departments" ON departments
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : structures (par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_structures" ON structures
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_structures" ON structures
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_structures" ON structures
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_structures" ON structures
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : activity_categories (référentiel global)
-- ----------------------------------------------------------------------------
ALTER TABLE activity_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_activity_categories" ON activity_categories
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "insert_activity_categories" ON activity_categories
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "update_activity_categories" ON activity_categories
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_activity_categories" ON activity_categories
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : activity_types (référentiel global)
-- ----------------------------------------------------------------------------
ALTER TABLE activity_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_activity_types" ON activity_types
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "insert_activity_types" ON activity_types
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "update_activity_types" ON activity_types
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_activity_types" ON activity_types
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : annual_plans (par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE annual_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_annual_plans" ON annual_plans
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_annual_plans" ON annual_plans
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_annual_plans" ON annual_plans
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_annual_plans" ON annual_plans
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : plan_activities (via plan parent)
-- ----------------------------------------------------------------------------
ALTER TABLE plan_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_plan_activities" ON plan_activities
  FOR SELECT USING (
    is_super_admin() OR plan_id IN (SELECT id FROM annual_plans WHERE organization_id = current_org_id())
  );

CREATE POLICY "insert_plan_activities" ON plan_activities
  FOR INSERT WITH CHECK (
    is_super_admin() OR (plan_id IN (SELECT id FROM annual_plans WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_plan_activities" ON plan_activities
  FOR UPDATE USING (
    is_super_admin() OR plan_id IN (SELECT id FROM annual_plans WHERE organization_id = current_org_id())
  )
  WITH CHECK (
    is_super_admin() OR (plan_id IN (SELECT id FROM annual_plans WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_plan_activities" ON plan_activities
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : activities (table principale - par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_activities" ON activities
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_activities" ON activities
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_activities" ON activities
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_activities" ON activities
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : activity_actors (via activité parente)
-- ----------------------------------------------------------------------------
ALTER TABLE activity_actors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_activity_actors" ON activity_actors
  FOR SELECT USING (
    is_super_admin() OR activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id())
  );

CREATE POLICY "insert_activity_actors" ON activity_actors
  FOR INSERT WITH CHECK (
    is_super_admin() OR (activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_activity_actors" ON activity_actors
  FOR UPDATE USING (
    is_super_admin() OR activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id())
  )
  WITH CHECK (
    is_super_admin() OR (activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_activity_actors" ON activity_actors
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : beneficiaries (via activité parente)
-- ----------------------------------------------------------------------------
ALTER TABLE beneficiaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_beneficiaries" ON beneficiaries
  FOR SELECT USING (
    is_super_admin() OR activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id())
  );

CREATE POLICY "insert_beneficiaries" ON beneficiaries
  FOR INSERT WITH CHECK (
    is_super_admin() OR (activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_beneficiaries" ON beneficiaries
  FOR UPDATE USING (
    is_super_admin() OR activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id())
  )
  WITH CHECK (
    is_super_admin() OR (activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_beneficiaries" ON beneficiaries
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : indicators (global + par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE indicators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_indicators" ON indicators
  FOR SELECT USING (
    is_super_admin() OR organization_id IS NULL OR organization_id = current_org_id()
  );

CREATE POLICY "insert_indicators" ON indicators
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_indicators" ON indicators
  FOR UPDATE USING (
    is_super_admin() OR organization_id IS NULL OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_indicators" ON indicators
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : indicator_values (via activité parente)
-- ----------------------------------------------------------------------------
ALTER TABLE indicator_values ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_indicator_values" ON indicator_values
  FOR SELECT USING (
    is_super_admin() OR activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id())
  );

CREATE POLICY "insert_indicator_values" ON indicator_values
  FOR INSERT WITH CHECK (
    is_super_admin() OR (activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_indicator_values" ON indicator_values
  FOR UPDATE USING (
    is_super_admin() OR activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id())
  )
  WITH CHECK (
    is_super_admin() OR (activity_id IN (SELECT id FROM activities WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_indicator_values" ON indicator_values
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : incident_types (référentiel global)
-- ----------------------------------------------------------------------------
ALTER TABLE incident_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_incident_types" ON incident_types
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "insert_incident_types" ON incident_types
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "update_incident_types" ON incident_types
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "delete_incident_types" ON incident_types
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : incidents (par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_incidents" ON incidents
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_incidents" ON incidents
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_incidents" ON incidents
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_incidents" ON incidents
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : attachments (par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_attachments" ON attachments
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_attachments" ON attachments
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_attachments" ON attachments
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_attachments" ON attachments
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : periods (par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_periods" ON periods
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_periods" ON periods
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() = 'PROPRIETAIRE')
  );

CREATE POLICY "update_periods" ON periods
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() = 'PROPRIETAIRE')
  );

CREATE POLICY "delete_periods" ON periods
  FOR DELETE USING (
    is_super_admin()
  );


-- ----------------------------------------------------------------------------
-- Table : reports (par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_reports" ON reports
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_reports" ON reports
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_reports" ON reports
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_reports" ON reports
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : report_versions (via rapport parent)
-- ----------------------------------------------------------------------------
ALTER TABLE report_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_report_versions" ON report_versions
  FOR SELECT USING (
    is_super_admin() OR report_id IN (SELECT id FROM reports WHERE organization_id = current_org_id())
  );

CREATE POLICY "insert_report_versions" ON report_versions
  FOR INSERT WITH CHECK (
    is_super_admin() OR (report_id IN (SELECT id FROM reports WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_report_versions" ON report_versions
  FOR UPDATE USING (
    is_super_admin() OR report_id IN (SELECT id FROM reports WHERE organization_id = current_org_id())
  )
  WITH CHECK (
    is_super_admin() OR (report_id IN (SELECT id FROM reports WHERE organization_id = current_org_id()) AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "delete_report_versions" ON report_versions
  FOR DELETE USING (
    is_super_admin() OR current_org_role() = 'PROPRIETAIRE'
  );


-- ----------------------------------------------------------------------------
-- Table : notifications (par organisation)
-- ----------------------------------------------------------------------------
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_notifications" ON notifications
  FOR SELECT USING (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "insert_notifications" ON notifications
  FOR INSERT WITH CHECK (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() != 'LECTEUR')
  );

CREATE POLICY "update_notifications" ON notifications
  FOR UPDATE USING (
    is_super_admin() OR organization_id = current_org_id()
  )
  WITH CHECK (
    is_super_admin() OR organization_id = current_org_id()
  );

CREATE POLICY "delete_notifications" ON notifications
  FOR DELETE USING (
    is_super_admin()
  );


-- ----------------------------------------------------------------------------
-- Table : audit_logs (lecture restreinte, insertion via trigger)
-- ----------------------------------------------------------------------------
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Lecture : super admins + propriétaires de leur org
CREATE POLICY "select_audit_logs" ON audit_logs
  FOR SELECT USING (
    is_super_admin() OR (organization_id = current_org_id() AND current_org_role() = 'PROPRIETAIRE')
  );

-- Insertion via trigger uniquement (pas de politique INSERT publique)
CREATE POLICY "insert_audit_logs" ON audit_logs
  FOR INSERT WITH CHECK (true);  -- Le trigger a les droits SECURITY DEFINER

-- Suppression réservée aux super admins
CREATE POLICY "delete_audit_logs" ON audit_logs
  FOR DELETE USING (is_super_admin());


-- ----------------------------------------------------------------------------
-- Table : admin_settings (globale, singleton)
-- ----------------------------------------------------------------------------
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_admin_settings" ON admin_settings
  FOR SELECT USING (auth.uid() IS NOT NULL);  -- Tous les authentifiés voient les settings

CREATE POLICY "update_admin_settings" ON admin_settings
  FOR UPDATE USING (is_super_admin())
  WITH CHECK (is_super_admin());

CREATE POLICY "insert_admin_settings" ON admin_settings
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY "delete_admin_settings" ON admin_settings
  FOR DELETE USING (is_super_admin());


-- ============================================================================
-- PARTIE 7 : STORAGE BUCKETS
-- Buckets Supabase Storage pour les fichiers
-- ============================================================================

-- Bucket pour les pièces jointes (photos et documents)
INSERT INTO storage.buckets (id, name, public)
VALUES ('attachments', 'attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Bucket pour les rapports générés
INSERT INTO storage.buckets (id, name, public)
VALUES ('reports', 'reports', false)
ON CONFLICT (id) DO NOTHING;


-- ============================================================================
-- PARTIE 8 : STORAGE POLICIES
-- Politiques d'accès aux buckets Storage
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Policy : Attachments bucket - Upload
-- Les utilisateurs peuvent uploader dans leur dossier organisation
-- ----------------------------------------------------------------------------
CREATE POLICY "Attachments upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attachments' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = current_org_id()::text
  );

-- Policy : Attachments bucket - Read
-- Lire les fichiers de son organisation
CREATE POLICY "Attachments read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attachments' AND
    (is_super_admin() OR (storage.foldername(name))[1] = current_org_id()::text)
  );

-- Policy : Attachments bucket - Update
CREATE POLICY "Attachments update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'attachments' AND
    (is_super_admin() OR (storage.foldername(name))[1] = current_org_id()::text)
  )
  WITH CHECK (
    bucket_id = 'attachments' AND
    (is_super_admin() OR (storage.foldername(name))[1] = current_org_id()::text)
  );

-- Policy : Attachments bucket - Delete
CREATE POLICY "Attachments delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'attachments' AND
    (is_super_admin() OR current_org_role() = 'PROPRIETAIRE')
  );


-- ----------------------------------------------------------------------------
-- Policy : Reports bucket - Upload
-- ----------------------------------------------------------------------------
CREATE POLICY "Reports upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'reports' AND
    auth.uid() IS NOT NULL AND
    (storage.foldername(name))[1] = current_org_id()::text
  );

-- Policy : Reports bucket - Read
CREATE POLICY "Reports read" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'reports' AND
    (is_super_admin() OR (storage.foldername(name))[1] = current_org_id()::text)
  );

-- Policy : Reports bucket - Update
CREATE POLICY "Reports update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'reports' AND
    (is_super_admin() OR (storage.foldername(name))[1] = current_org_id()::text)
  )
  WITH CHECK (
    bucket_id = 'reports' AND
    (is_super_admin() OR (storage.foldername(name))[1] = current_org_id()::text)
  );

-- Policy : Reports bucket - Delete
CREATE POLICY "Reports delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'reports' AND
    (is_super_admin() OR current_org_role() = 'PROPRIETAIRE')
  );


-- ============================================================================
-- PARTIE 9 : DONNÉES DE RÉFÉRENCE INITIALES (SEED DATA)
-- Peuplement des référentiels globaux
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Seed : Régions de Côte d'Ivoire
-- ----------------------------------------------------------------------------
INSERT INTO regions (nom, code) VALUES
  ('Abidjan', 'ABJ'),
  ('Lacs', 'LAC'),
  ('Des Lagunes', 'LAG'),
  ('Gôh-Djiboua', 'GDJ'),
  ('Cavally', 'CAV'),
  ('Montagnes', 'MTG'),
  ('Bas-Sassandra', 'BSS'),
  ('Sassandra-Marahoué', 'SMa'),
  ('Woroba', 'WOR'),
  ('Denguelé', 'DEN'),
  ('Savanes', 'SAV'),
  ('Vallee du Bandama', 'VBC'),
  ('Zanzan', 'ZAN'),
  ('Agnéby-Tiassa', 'AGT'),
  ('Grands-Ponts', 'GP'),
  ('Yamoussoukro', 'YAM'),
  ('Bélier', 'BEL'),
  ('Moronou', 'MOR'),
  ('Iffou', 'IFF'),
  ('Nzi', 'NZI'),
  ('Bounkani', 'BOU'),
  ('Gbêkê', 'GBK'),
  ('Hambol', 'HAM'),
  ('Poro', 'POR'),
  ('Tchologo', 'TCH'),
  ('Bafing', 'BAF'),
  ('Folou', 'FOL'),
  ('Kabadougou', 'KAB'),
  ('Tonkpi', 'TON'),
  ('Guémon', 'GUE'),
  ('San-Pedro', 'SAN'),
  ('Gboklé-Nawa-San Pedro', 'GNS'),
  ('Nawa', 'NAW'),
  ('Marahoué', 'MAR'),
  ('Haut-Sassandra', 'HSS'),
  ('La Mé', 'ME')
ON CONFLICT (code) DO NOTHING;

COMMENT ON regions IS '31 régions administratives de Côte d''Ivoire (décret 2011)';


-- ----------------------------------------------------------------------------
-- Seed : Types d'incidents courants
-- ----------------------------------------------------------------------------
INSERT INTO incident_types (nom, description) VALUES
  ('Incendie', 'Feu de végétation, bâtiment ou véhicule'),
  ('Inondation', 'Débordement eau, crue, inondation'),
  ('Accident de circulation', 'Accident routier avec ou sans victimes'),
  ('Accident domestique', 'Accident survenant au domicile'),
  ('Accident du travail', 'Accident sur le lieu de travail'),
  ('Maladie à déclaration', 'Maladie nécessitant signalement'),
  ('Dispute/Violence', 'Conflit entre personnes'),
  ('Catastrophe naturelle', 'Tempête, sécheresse, tremblement de terre'),
  ('Accident technologique', 'Incident industriel ou technique'),
  ('Autre', 'Autre type d''incident non listé')
ON CONFLICT (nom) DO NOTHING;


-- ----------------------------------------------------------------------------
-- Seed : Catégories d'activités MCNSLP
-- ----------------------------------------------------------------------------
INSERT INTO activity_categories (code, nom, description, couleur) VALUES
  ('FORMATION', 'Formation', 'Sessions de formation et renforcement des capacités', '#3B82F6'),
  ('SENSIBILISATION', 'Sensibilisation', 'Campagnes de sensibilisation et communication', '#10B981'),
  ('ENCADREMENT', 'Encadrement', 'Accompagnement et suivi des bénéficiaires', '#F59E0B'),
  ('PLAIDOYER', 'Plaidoyer', 'Actions de plaidoyer et défense des droits', '#EF4444'),
  ('REUNION', 'Réunion', 'Réunions internes et rencontres', '#8B5CF6'),
  ('EVALUATION', 'Évaluation', 'Évaluations et suivis-évaluations', '#EC4899'),
  ('DOCUMENTATION', 'Documentation', 'Production documentaire et capitalisation', '#06B6D4'),
  ('PARTENARIAT', 'Partenariat', 'Rencontre partenaires et coordination', '#84CC16')
ON CONFLICT (code) DO NOTHING;


-- ----------------------------------------------------------------------------
-- Seed : Types d'activité par catégorie
-- Note : Les IDs des catégories sont dynamiques, on utilise une subquery
-- ----------------------------------------------------------------------------
DO $$
DECLARE
  v_cat_id UUID;
BEGIN
  -- Formation
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'FORMATION';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Formation initiale'),
      (v_cat_id, 'Perfectionnement'),
      (v_cat_id, 'Atelier pratique'),
      (v_cat_id, 'Stage terrain')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Sensibilisation
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'SENSIBILISATION';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Campagne villageoise'),
      (v_cat_id, 'Diffusion média'),
      (v_cat_id, 'Théâtre forum'),
      (v_cat_id, 'Visite à domicile')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Encadrement
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'ENCADREMENT';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Suivi individuel'),
      (v_cat_id, 'Accompagnement groupe'),
      (v_cat_id, 'Visite institutionnelle'),
      (v_cat_id, 'Médiation familiale')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Plaidoyer
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'PLAIDOYER';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Rencontre autorités'),
      (v_cat_id, 'Manifestation publique'),
      (v_cat_id, 'Plaidoyer communautaire'),
      (v_cat_id, 'Advocacy médiatique')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Réunion
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'REUNION';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Réunion équipe'),
      (v_cat_id, 'Réunion partenariale'),
      (v_cat_id, 'Assemblée générale'),
      (v_cat_id, 'Revue de projet')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Évaluation
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'EVALUATION';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Enquête terrain'),
      (v_cat_id, 'Collecte données'),
      (v_cat_id, 'Analyse impact'),
      (v_cat_id, 'Rapport évaluation')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Documentation
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'DOCUMENTATION';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Rédaction rapport'),
      (v_cat_id, 'Production vidéo/photo'),
      (v_cat_id, 'Capitalisation expérience'),
      (v_cat_id, 'Base données')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Partenariat
  SELECT id INTO v_cat_id FROM activity_categories WHERE code = 'PARTENARIAT';
  IF v_cat_id IS NOT NULL THEN
    INSERT INTO activity_types (category_id, nom) VALUES
      (v_cat_id, 'Réseau partenarial'),
      (v_cat_id, 'Conventionnement'),
      (v_cat_id, 'Coordination acteurs'),
      (v_cat_id, 'Échange inter-structure')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;


-- ----------------------------------------------------------------------------
-- Seed : Plans d'abonnement par défaut
-- ----------------------------------------------------------------------------
INSERT INTO subscription_plans (code, nom, prix_mensuel, max_users, storage_gb, features, ordre, actif) VALUES
  (
    'STARTER',
    'Plan Starter',
    0,
    5,
    5,
    '{"activities": true, "basic_reports": true, "attachments": true, "incidents": true}',
    1,
    true
  ),
  (
    'PRO',
    'Plan Pro',
    25000,
    20,
    20,
    '{"activities": true, "basic_reports": true, "advanced_reports": true, "attachments": true, "incidents": true, "indicators": true, "export": true}',
    2,
    true
  ),
  (
    'ENTERPRISE',
    'Plan Enterprise',
    75000,
    NULL,
    100,
    '{"activities": true, "basic_reports": true, "advanced_reports": true, "custom_reports": true, "attachments": true, "incidents": true, "indicators": true, "export": true, "api": true, "priority_support": true}',
    3,
    true
  ),
  (
    'TRIAL',
    'Essai Gratuit',
    0,
    10,
    2,
    '{"activities": true, "basic_reports": true, "attachments": true}',
    0,
    true
  )
ON CONFLICT (code) DO NOTHING;

COMMENT ON subscription_plans IS 'Plans STARTER (gratuit), PRO (25 000 FCFA/mois), ENTERPRISE (75 000 FCFA/mois)';


-- ----------------------------------------------------------------------------
-- Seed : Indicateurs globaux par défaut
-- ----------------------------------------------------------------------------
INSERT INTO indicators (nom, unite, kind, axe, category_id, organization_id) VALUES
  ('Nombre de bénéficiaires directs', 'personnes', 'QUANTITATIF', 'Impact', NULL, NULL),
  ('Nombre de formations réalisées', 'sessions', 'QUANTITATIF', 'Activités', NULL, NULL),
  ('Taux de satisfaction bénéficiaires', '%', 'QUANTITATIF', 'Qualité', NULL, NULL),
  ('Nombre de partenaires mobilisés', 'partenaires', 'QUANTITATIF', 'Partenariat', NULL, NULL),
  ('Niveau d''appropriation', NULL, 'QUALITATIF', 'Durabilité', NULL, NULL),
  ('Observations terrain', NULL, 'QUALITATIF', 'Contexte', NULL, NULL)
ON CONFLICT DO NOTHING;


-- ============================================================================
-- PARTIE 10 : VUES UTILES
-- Vues simplifiant les requêtes courantes
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Vue : v_activities_with_details
-- Vue complète des activités avec informations jointes
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_activities_with_details AS
SELECT
  a.*,
  o.nom as organization_nom,
  ac.nom as category_nom,
  at.nom as type_nom,
  compute_subscription_status(s) as subscription_statut_effectif,
  COALESCE(b.total, 0) as total_beneficiaires,
  COALESCE(b.hommes, 0) as nb_hommes,
  COALESCE(b.femmes, 0) as nb_femmes
FROM activities a
LEFT JOIN organizations o ON a.organization_id = o.id
LEFT JOIN activity_categories ac ON a.category_id = ac.id
LEFT JOIN activity_types at ON a.type_id = at.id
LEFT JOIN subscriptions s ON s.organization_id = a.organization_id AND s.statut = 'ACTIF'
LEFT JOIN beneficiaries b ON b.activity_id = a.id;

COMMENT ON VIEW v_activities_with_details IS 'Vue synthétique des activités avec détails joints';


-- ----------------------------------------------------------------------------
-- Vue : v_organization_stats
-- Statistiques par organisation
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_organization_stats AS
SELECT
  o.id as organization_id,
  o.nom as organization_nom,
  o.type_org,
  o.region,
  COUNT(DISTINCT a.id) as total_activites,
  COUNT(DISTINCT CASE WHEN a.statut = 'VALIDE' THEN a.id END) as activites_validees,
  COUNT(DISTINCT CASE WHEN a.annee = EXTRACT(YEAR FROM CURRENT_DATE) THEN a.id END) as activites_annee_courante,
  COUNT(DISTINCT p.id) as total_profils,
  COALESCE(SUM(COALESCE(b.total, 0)), 0) as total_beneficiaires_tous,
  COALESCE(SUM(COALESCE(b.femmes, 0)), 0) as total_femmes,
  COALESCE(SUM(COALESCE(b.hommes, 0)), 0) as total_hommes
FROM organizations o
LEFT JOIN activities a ON a.organization_id = o.id
LEFT JOIN profiles p ON p.organization_id = o.id AND p.actif = true
LEFT JOIN beneficiaries b ON b.activity_id = a.id
GROUP BY o.id, o.nom, o.type_org, o.region;

COMMENT ON VIEW v_organization_stats IS 'Statistiques agrégées par organisation';


-- ----------------------------------------------------------------------------
-- Vue : v_current_period
-- Période courante pour chaque organisation
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_current_period AS
SELECT
  o.id as organization_id,
  o.nom as organization_nom,
  EXTRACT(YEAR FROM CURRENT_DATE)::int as annee_courante,
  CEIL(EXTRACT(MONTH FROM CURRENT_DATE)/3.0)::int as trimestre_courant,
  COALESCE(p.statut, 'OUVERT') as statut_periode,
  p.id as period_id
FROM organizations o
LEFT JOIN periods p ON p.organization_id = o.id 
  AND p.annee = EXTRACT(YEAR FROM CURRENT_DATE)::int 
  AND p.trimestre = CEIL(EXTRACT(MONTH FROM CURRENT_DATE)/3.0)::int;

COMMENT ON VIEW v_current_period IS 'Période de déclaration courante par organisation';


-- ----------------------------------------------------------------------------
-- Vue : v_pending_validations
-- Activités en attente de validation
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_pending_validations AS
SELECT
  a.*,
  o.nom as organization_nom,
  u.nom_complet as soumis_par_nom,
  u.email as soumis_par_email
FROM activities a
JOIN organizations o ON a.organization_id = o.id
JOIN profiles u ON a.cree_par = u.id
WHERE a.statut IN ('SOUMIS', 'EN_VERIFICATION')
ORDER BY a.soumis_le ASC NULLS LAST;

COMMENT ON VIEW v_pending_validations IS 'Liste des activités en attente de validation';


-- ============================================================================
-- PARTIE 11 : FIN DE MIGRATION
-- Résumé et vérifications
-- ============================================================================

-- Afficher un résumé de la migration (visible dans les logs Supabase)
DO $$
DECLARE
  v_table_count INTEGER;
  v_enum_count INTEGER;
  v_policy_count INTEGER;
  v_trigger_count INTEGER;
  v_function_count INTEGER;
  v_view_count INTEGER;
BEGIN
  -- Comptages
  SELECT COUNT(*) INTO v_enum_count FROM pg_type WHERE typtype = 'e' AND typnamespace = 'public'::regnamespace;
  SELECT COUNT(*) INTO v_table_count FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
  SELECT COUNT(*) INTO v_view_count FROM information_schema.views WHERE table_schema = 'public';
  SELECT COUNT(*) INTO v_policy_count FROM pg_policies WHERE schemaname = 'public';
  SELECT COUNT(*) INTO v_trigger_count FROM pg_trigger WHERE tgrelid::regclass::text LIKE 'public.%';
  SELECT COUNT(*) INTO v_function_count FROM pg_proc WHERE pronamespace = 'public'::regnamespace;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE 'MIGRATION e-OSCS TERMINÉE AVEC SUCCÈS';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Types énumérés (ENUMS) : %', v_enum_count;
  RAISE NOTICE 'Tables créées : %', v_table_count;
  RAISE NOTICE 'Vues créées : %', v_view_count;
  RAISE NOTICE 'Politiques RLS : %', v_policy_count;
  RAISE NOTE 'Triggers : %', v_trigger_count;
  RAISE NOTICE 'Fonctions SQL : %', v_function_count;
  RAISE NOTICE '========================================';
END $$;
