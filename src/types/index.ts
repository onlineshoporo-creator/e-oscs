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
}
