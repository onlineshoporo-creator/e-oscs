// ===========================================
// Types e-OSCS
// ===========================================

/** Rôle utilisateur dans une organisation */
export type OrgRole = 'PROPRIETAIRE' | 'AGENT' | 'LECTEUR'

/** Type d'organisation */
export type OrgType = 'DR' | 'DD'

/** Statut abonnement */
export type SubscriptionStatus = 
  | 'DEMANDE' 
  | 'EN_TRAITEMENT' 
  | 'EN_ATTENTE_PAIEMENT' 
  | 'ACTIF' 
  | 'EXPIRANT_BIENTOT' 
  | 'EXPIRE' 
  | 'SUSPENDU' 
  | 'RESILIE'

/** Statut activité */
export type ActivityStatus = 
  | 'BROUILLON' 
  | 'SOUMIS' 
  | 'EN_VERIFICATION' 
  | 'VALIDE' 
  | 'REJETE' 
  | 'CORRECTION' 
  | 'CONSOLIDE'

/** Statut demande d'abonnement */
export type RequestStatus = 
  | 'NOUVELLE' 
  | 'EN_CONTACT' 
  | 'EN_ATTENTE_PAIEMENT' 
  | 'AYEE' 
  | 'REFUSEE' 
  | 'CLOTUREE'

/** Organisation */
export interface Organization {
  id: string
  created_at: string
  updated_at?: string
  nom: string
  type_org: OrgType
  region: string
  departement?: string
  telephone?: string
  email?: string
  logo_url?: string
  actif: boolean
  created_by?: string
}

/** Plan d'abonnement */
export interface SubscriptionPlan {
  id: string
  code: string
  nom: string
  prix_mensuel: number
  max_users?: number
  storage_gb: number
  features: Record<string, boolean>
  ordre: number
  actif: boolean
}

/** Abonnement */
export interface Subscription {
  id: string
  organization_id: string
  plan_id: string
  date_debut: string
  date_fin: string
  duree_mois: number
  statut: SubscriptionStatus
  montant?: number
  reference_paiement?: string
  confirme_le?: string
  confirme_par?: string
  notes?: string
  plan?: SubscriptionPlan
  organization?: Organization
}

/** Utilisateur avec profil étendu */
export interface UserWithProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role?: OrgRole
  organization_id?: string
  organization?: Organization
}

/** Demande d'abonnement */
export interface SubscriptionRequest {
  id: string
  created_at: string
  nom_complet: string
  email: string
  telephone: string
  nom_organisation: string
  type_org: OrgType
  region: string
  departement?: string
  message?: string
  statut: RequestStatus
  notes_admin?: string
  assigned_to?: string
}

/** Activité */
export interface Activity {
  id: string
  created_at: string
  updated_at?: string
  organization_id: string
  titre: string
  description?: string
  categorie_id: string
  type_activite_id: string
  statut: ActivityStatus
  date_debut: string
  date_fin?: string
  lieu?: string
  budget_alloue?: number
  budget_depense?: number
  beneficiaires_count?: number
  beneficiaires_hommes?: number
  beneficiaires_femmes?: number
  beneficiaires_jeunes?: number
  created_by: string
}

/** Indicateur */
export interface Indicator {
  id: string
  code: string
  nom: string
  description?: string
  kind: 'QUANTITATIF' | 'QUALITATIF'
  unite?: string
  objectif?: number
  axe?: string
  category_id?: string
  organization_id?: string
  created_at?: string
}

// ===========================================
// Types Incidents / Sinistres
// ===========================================

/** Gravité d'un incident */
export type IncidentGravite = 'FAIBLE' | 'MOYENNE' | 'ELEVEE' | 'CRITIQUE'

/** Statut d'un incident */
export type IncidentStatut = 'EN_COURS' | 'CLOTURE'

/** Type d'incident (référentiel) */
export interface IncidentType {
  id: string
  nom: string
  description?: string
  code?: string
  created_at?: string
}

/** Incident / Sinistre */
export interface Incident {
  id: string
  created_at: string
  updated_at?: string
  organization_id: string
  date: string
  lieu: string
  region: string
  departement?: string
  nature: string
  type_id?: string
  gravite: IncidentGravite
  victimes: number
  deces: number
  actions_entreprises?: string
  acteurs?: string[]
  statut: IncidentStatut
  cloture_le?: string
  cloture_par?: string
  motif_cloture?: string
  created_by?: string
  incident_type?: IncidentType
}

/** Filtres pour la liste des incidents */
export interface IncidentFilters {
  statut?: IncidentStatut | 'all'
  gravite?: IncidentGravite | 'all'
  date_debut?: string
  date_fin?: string
  search?: string
  page?: number
  limit?: number
}

/** Formulaire de création/modification d'incident */
export interface IncidentFormData {
  date: string
  lieu: string
  region: string
  departement?: string
  nature: string
  incident_type_id?: string
  gravite: IncidentGravite
  victimes?: number
  deces?: number
  actions_entreprises?: string
  acteurs?: string[]
}

// ===========================================
// Types Indicateurs (étendus)
// ===========================================

/** Type d'indicateur */
export type IndicatorKind = 'QUANTITATIF' | 'QUALITATIF'

/** Valeur d'un indicateur */
export interface IndicatorValue {
  id: string
  activity_id: string
  indicator_id: string
  valeur_numerique?: number
  valeur_texte?: string
  created_at: string
  created_by?: string
  activity?: Activity
  indicator?: Indicator
}

/** Filtres pour les indicateurs */
export interface IndicatorFilters {
  axe?: string
  kind?: IndicatorKind | 'all'
  search?: string
  organization_id?: string
  global_only?: boolean
  page?: number
  limit?: number
}

/** Données de saisie groupée */
export interface IndicatorBatchInput {
  activity_id: string
  values: {
    indicator_id: string
    valeur_numerique?: number
    valeur_texte?: string
  }[]
}

/** Statistiques indicateur */
export interface IndicatorStats {
  moyenne?: number
  min?: number
  max?: number
  derniere_valeur?: string
  nombre_valeurs: number
}

// ===========================================
// CODES D'ACTIVATION
// ===========================================

/** Statut d'un code d'activation */
export type CodeStatus = 'DISPONIBLE' | 'UTILISE' | 'EXPIRE' | 'EN_ATTENTE' | 'REVOQUE'

/** Code d'activation */
export interface ActivationCode {
  id: string
  code: string
  organization_id?: string
  plan_id?: string
  email_proprietaire: string
  duree_mois: number
  expire_le: string
  utilise: boolean
  utilise_le?: string
  cree_par: string
  created_at: string
  updated_at?: string
  // Jointures optionnelles
  plan?: SubscriptionPlan
  organization?: Organization
}

// ===========================================
// UTILISATEURS (PROFILS)
// ===========================================

/** Rôle étendu avec super admin */
export type ExtendedOrgRole = 'SUPER_ADMIN' | 'PROPRIETAIRE' | 'AGENT' | 'LECTEUR'

/** Profil utilisateur complet */
export interface UserProfile {
  id: string
  nom_complet: string
  telephone?: string
  organization_id?: string
  org_role: ExtendedOrgRole
  is_super_admin: boolean
  actif: boolean
  avatar_url?: string
  created_at: string
  updated_at?: string
  // Jointures
  organization?: Organization
  email?: string // Depuis auth.users
}

/** Filtres pour codes d'activation */
export interface CodeFilters {
  statut?: CodeStatus
  search?: string
  page?: number
  limit?: number
}

/** Filtres pour utilisateurs */
export interface UserFilters {
  role?: ExtendedOrgRole
  organization_id?: string
  actif?: boolean
  search?: string
  page?: number
  limit?: number
}

/** Stats des codes d'activation */
export interface CodeStats {
  total: number
  utilises: number
  expires: number
  disponibles: number
}

/** Stats des utilisateurs */
export interface UserStats {
  total: number
  superAdmins: number
  actifs: number
  inactifs: number
}
