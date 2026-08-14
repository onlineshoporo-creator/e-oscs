// Types Supabase pour e-OSCS
// Ces types seront générés automatiquement avec Supabase CLI ou définis manuellement

export type Organization = {
  id: string
  nom: string
  description?: string | null
  type: 'ministere' | 'direction' | 'service' | 'division'
  organization_parent_id?: string | null
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  nom_complet: string
  telephone?: string | null
  role: 'admin' | 'gestionnaire' | 'validateur' | 'observateur'
  organization_id: string
  avatar_url?: string | null
  actif: boolean
  created_at: string
  updated_at: string
}

export type Activity = {
  id: string
  nom: string
  description?: string | null
  intitule?: string | null
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'valide' | 'rejete'
  date_activite: string
  date_fin_prevue?: string | null
  lieu?: string | null
  budget_alloue?: number | null
  budget_depense?: number | null
  progression?: number | null
  category_id?: string | null
  organization_id: string
  plan_activity_id?: string | null
  created_by: string
  validated_by?: string | null
  validated_at?: string | null
  motif_rejet?: string | null
  created_at: string
  updated_at: string
}

export type ActivityCategory = {
  id: string
  nom: string
  description?: string | null
  color?: string | null
  icon?: string | null
  created_at: string
}

export type Beneficiary = {
  id: string
  nom: string
  type: 'physique' | 'morale' | 'groupe'
  categorie?: string | null
  contact?: string | null
  localisation?: string | null
  activity_id: string
  created_at: string
}

export type Indicator = {
  id: string
  nom: string
  description?: string | null
  type: 'quantitatif' | 'qualitatif'
  unite?: string | null
  cible_valeur?: number | null
  activity_id?: string | null
  organization_id?: string | null
  created_at: string
}

export type IndicatorValue = {
  id: string
  indicator_id: string
  valeur: number | string
  periode: string
  date_mesure: string
  notes?: string | null
  created_at: string
}

export type Incident = {
  id: string
  titre: string
  description?: string | null
  type: 'retard' | 'depassement_budget' | 'qualite' | 'autre'
  severite: 'faible' | 'moyenne' | 'critique'
  statut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme'
  date_incident: string
  date_resolution?: string | null
  activity_id: string
  reported_by: string
  created_at: string
  updated_at: string
}

export type PlanActivity = {
  id: string
  nom: string
  objectif?: string | null
  annee: number
  trimestre?: number | null
  mois?: number | null
  priorite: 'haute' | 'moyenne' | 'basse'
  budget_prevu?: number | null
  organization_id: string
  parent_id?: string | null
  created_at: string
  updated_at: string
}

// Profile étendu pour l'utilisateur authentifié
export type UserProfile = {
  id: string
  email: string
  nom_complet: string
  role: User['role']
  organization: Organization
  organization_id: string
}
