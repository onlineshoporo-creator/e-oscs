'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// ===========================================
// Types pour les actions Activités
// ===========================================

export interface ActivityDetail {
  id: string
  created_at: string
  updated_at?: string
  organization_id: string
  reference: string
  date_activite: string
  mois: number
  trimestre: number
  annee: number
  region: string
  departement?: string
  sous_prefecture?: string
  category_id?: string
  type_id?: string
  intitule: string
  description?: string
  objectif?: string
  structure_responsable?: string
  responsables: string[]
  resultats?: string
  difficultes?: string
  recommandations?: string
  perspectives?: string
  observations?: string
  statut: 'BROUILLON' | 'SOUMIS' | 'EN_VERIFICATION' | 'VALIDE' | 'REJETE' | 'CORRECTION' | 'CONSOLIDE'
  plan_activity_id?: string
  est_supplementaire: boolean
  cree_par: string
  soumis_le?: string
  valide_le?: string
  valide_par?: string
  motif_rejet?: string
  budget_alloue?: number
  // Relations
  categories?: { id: string; nom: string }
  types_activite?: { id: string; nom: string }
}

export interface BeneficiaryData {
  id?: string
  activity_id: string
  hommes: number
  femmes: number
  enfants: number
  adultes: number
  personnes_agees: number
  vulnerables: number
  total: number
}

export interface ActorData {
  id?: string
  activity_id: string
  acteur: string
  type_acteur: 'INTERNE' | 'PARTENAIRE'
  role?: string
}

export interface AnnualPlan {
  id: string
  created_at: string
  updated_at?: string
  organization_id: string
  annee: number
  titre: string
  statut: 'OUVERT' | 'CLOTURE'
}

export interface PlanActivity {
  id: string
  created_at: string
  updated_at?: string
  plan_id: string
  axe_strategique: string
  objectif: string
  activite_prevue: string
  indicateur?: string
  cible?: string
  responsable?: string
  periode_prevue?: string
  budget?: number
  observations?: string
  realise?: boolean
  activity_id?: string
}

// ===========================================
// Actions Activités
// ===========================================

/**
 * Récupère le détail complet d'une activité avec bénéficiaires et acteurs
 */
export async function getActivityDetail(id: string): Promise<{
  activity: ActivityDetail | null
  beneficiaries: BeneficiaryData | null
  actors: ActorData[]
}> {
  const supabase = await createClient()

  // Récupérer l'activité principale
  const { data: activity, error: activityError } = await supabase
    .from('activities')
    .select(`
      *,
      categories (id, nom),
      types_activite (id, nom)
    `)
    .eq('id', id)
    .single()

  if (activityError || !activity) {
    console.error('Error fetching activity:', activityError)
    return { activity: null, beneficiaries: null, actors: [] }
  }

  // Récupérer les bénéficiaires
  const { data: beneficiaries, error: benError } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('activity_id', id)
    .maybeSingle()

  if (benError) {
    console.error('Error fetching beneficiaries:', benError)
  }

  // Récupérer les acteurs
  const { data: actors, error: actorsError } = await supabase
    .from('activity_actors')
    .select('*')
    .eq('activity_id', id)
    .order('type_acteur', { ascending: true })

  if (actorsError) {
    console.error('Error fetching actors:', actorsError)
  }

  return {
    activity: activity as ActivityDetail,
    beneficiaries: beneficiaries as BeneficiaryData || null,
    actors: (actors || []) as ActorData[],
  }
}

/**
 * Met à jour une activité
 */
export async function updateActivity(
  id: string,
  data: Partial<ActivityDetail>
): Promise<{ success: boolean; error?: string; activity?: ActivityDetail }> {
  const supabase = await createClient()

  const { data: activity, error } = await supabase
    .from('activities')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select(`
      *,
      categories (id, nom),
      types_activite (id, nom)
    `)
    .single()

  if (error) {
    console.error('Error updating activity:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/activites')
  revalidatePath(`/app/activites/${id}`)

  return { success: true, activity: activity as ActivityDetail }
}

/**
 * Soumet une activité pour validation
 */
export async function submitActivity(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('activities')
    .update({
      statut: 'SOUMIS',
      soumis_le: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('statut', 'BROUILLON')

  if (error) {
    console.error('Error submitting activity:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/activites')
  revalidatePath(`/app/activites/${id}`)
  revalidatePath('/app/validation')

  return { success: true }
}

// ===========================================
// Actions Bénéficiaires
// ===========================================

/**
 * Récupère les bénéficiaires d'une activité
 */
export async function getBeneficiaries(activityId: string): Promise<BeneficiaryData | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('beneficiaries')
    .select('*')
    .eq('activity_id', activityId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching beneficiaries:', error)
    return null
  }

  return data as BeneficiaryData
}

/**
 * Sauvegarde les bénéficiaires d'une activité (crée ou met à jour)
 */
export async function saveBeneficiaries(
  activityId: string,
  data: Omit<BeneficiaryData, 'id' | 'activity_id'>
): Promise<{ success: boolean; error?: string; beneficiaries?: BeneficiaryData }> {
  const supabase = await createClient()

  // Vérifier si des bénéficiaires existent déjà
  const { data: existing } = await supabase
    .from('beneficiaries')
    .select('id')
    .eq('activity_id', activityId)
    .maybeSingle()

  if (existing) {
    // Mettre à jour
    const { data: beneficiaries, error } = await supabase
      .from('beneficiaries')
      .update(data)
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating beneficiaries:', error)
      return { success: false, error: error.message }
    }

    return { success: true, beneficiaries: beneficiaries as BeneficiaryData }
  } else {
    // Créer
    const { data: beneficiaries, error } = await supabase
      .from('beneficiaries')
      .insert({
        activity_id: activityId,
        ...data,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating beneficiaries:', error)
      return { success: false, error: error.message }
    }

    return { success: true, beneficiaries: beneficiaries as BeneficiaryData }
  }
}

// ===========================================
// Actions Acteurs
// ===========================================

/**
 * Récupère les acteurs d'une activité
 */
export async function getActors(activityId: string): Promise<ActorData[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activity_actors')
    .select('*')
    .eq('activity_id', activityId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching actors:', error)
    return []
  }

  return (data || []) as ActorData[]
}

/**
 * Ajoute un acteur à une activité
 */
export async function addActor(
  activityId: string,
  data: Omit<ActorData, 'id' | 'activity_id'>
): Promise<{ success: boolean; error?: string; actor?: ActorData }> {
  const supabase = await createClient()

  const { data: actor, error } = await supabase
    .from('activity_actors')
    .insert({
      activity_id: activityId,
      ...data,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding actor:', error)
    return { success: false, error: error.message }
  }

  return { success: true, actor: actor as ActorData }
}

/**
 * Supprime un acteur
 */
export async function removeActor(actorId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('activity_actors')
    .delete()
    .eq('id', actorId)

  if (error) {
    console.error('Error removing actor:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

// ===========================================
// Actions Planification Annuelle
// ===========================================

/**
 * Récupère les plans annuels d'une organisation
 */
export async function getAnnualPlans(organizationId: string): Promise<AnnualPlan[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('annual_plans')
    .select('*')
    .eq('organization_id', organizationId)
    .order('annee', { ascending: false })

  if (error) {
    console.error('Error fetching annual plans:', error)
    return []
  }

  return (data || []) as AnnualPlan[]
}

/**
 * Crée un nouveau plan annuel
 */
export async function createAnnualPlan(data: {
  organization_id: string
  annee: number
  titre: string
}): Promise<{ success: boolean; error?: string; plan?: AnnualPlan }> {
  const supabase = await createClient()

  // Vérifier si un plan existe déjà pour cette année
  const { data: existing } = await supabase
    .from('annual_plans')
    .select('id')
    .eq('organization_id', data.organization_id)
    .eq('annee', data.annee)
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'Un plan existe déjà pour cette année' }
  }

  const { data: plan, error } = await supabase
    .from('annual_plans')
    .insert({
      organization_id: data.organization_id,
      annee: data.annee,
      titre: data.titre,
      statut: 'OUVERT',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating annual plan:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/planification')

  return { success: true, plan: plan as AnnualPlan }
}

/**
 * Récupère le détail d'un plan annuel avec ses activités
 */
export async function getPlanDetail(
  organizationId: string,
  annee: number
): Promise<{ plan: AnnualPlan | null; activities: PlanActivity[] }> {
  const supabase = await createClient()

  // Récupérer le plan
  const { data: plan, error: planError } = await supabase
    .from('annual_plans')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('annee', annee)
    .maybeSingle()

  if (planError || !plan) {
    console.error('Error fetching plan:', planError)
    return { plan: null, activities: [] }
  }

  // Récupérer les activités du plan
  const { data: activities, error: activitiesError } = await supabase
    .from('plan_activities')
    .select('*')
    .eq('plan_id', plan.id)
    .order('created_at', { ascending: true })

  if (activitiesError) {
    console.error('Error fetching plan activities:', activitiesError)
  }

  return {
    plan: plan as AnnualPlan,
    activities: (activities || []) as PlanActivity[],
  }
}

/**
 * Ajoute une activité au plan
 */
export async function addPlanActivity(
  planId: string,
  data: Omit<PlanActivity, 'id' | 'created_at' | 'updated_at' | 'plan_id'>
): Promise<{ success: boolean; error?: string; activity?: PlanActivity }> {
  const supabase = await createClient()

  const { data: activity, error } = await supabase
    .from('plan_activities')
    .insert({
      plan_id: planId,
      ...data,
    })
    .select()
    .single()

  if (error) {
    console.error('Error adding plan activity:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/planification')

  return { success: true, activity: activity as PlanActivity }
}

/**
 * Met à jour une activité du plan
 */
export async function updatePlanActivity(
  id: string,
  data: Partial<PlanActivity>
): Promise<{ success: boolean; error?: string; activity?: PlanActivity }> {
  const supabase = await createClient()

  const { data: activity, error } = await supabase
    .from('plan_activities')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating plan activity:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/planification')

  return { success: true, activity: activity as PlanActivity }
}

/**
 * Supprime une activité du plan
 */
export async function deletePlanActivity(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('plan_activities')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting plan activity:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/planification')

  return { success: true }
}

/**
 * Clôture un plan annuel
 */
export async function closeAnnualPlan(planId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('annual_plans')
    .update({
      statut: 'CLOTURE',
      updated_at: new Date().toISOString(),
    })
    .eq('id', planId)

  if (error) {
    console.error('Error closing annual plan:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/planification')

  return { success: true }
}
