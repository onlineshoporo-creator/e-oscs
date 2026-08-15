'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Types pour les actions
interface ActivityFilters {
  statut?: string
  categorie_id?: string
  search?: string
  page?: number
  limit?: number
}

interface CreateActivityData {
  titre: string
  description?: string
  categorie_id: string
  type_activite_id: string
  date_debut: string
  date_fin?: string
  lieu?: string
  budget_alloue?: number
  beneficiaires_hommes?: number
  beneficiaires_femmes?: number
  beneficiaires_jeunes?: number
  organization_id: string
  created_by: string
}

interface DashboardData {
  totalActivites: number
  activitesEnCours: number
  activitesEnAttente: number
  activitesValidees: number
  tauxExecution: number
  budgetTotal: number
  budgetDepense: number
  beneficiairesTotal: number
  repartitionStatut: Record<string, number>
  activitesRecentes: any[]
}

/**
 * Récupère les activités avec filtres
 */
export async function getActivities(organizationId?: string, filters?: ActivityFilters) {
  const supabase = await createClient()
  
  let query = supabase
    .from('activites')
    .select(`
      *,
      categories (id, nom),
      types_activite (id, nom)
    `)
    .order('created_at', { ascending: false })

  if (organizationId) {
    query = query.eq('organization_id', organizationId)
  }

  if (filters?.statut && filters.statut !== 'all') {
    query = query.eq('statut', filters.statut)
  }

  if (filters?.categorie_id && filters.categorie_id !== 'all') {
    query = query.eq('categorie_id', filters.categorie_id)
  }

  if (filters?.search) {
    query = query.or(`titre.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Error fetching activities:', error)
    return { activities: [], count: 0 }
  }

  return { activities: data || [], count: count || 0 }
}

/**
 * Crée une nouvelle activité
 */
export async function createActivity(data: CreateActivityData) {
  const supabase = await createClient()

  const { data: activity, error } = await supabase
    .from('activites')
    .insert({
      organization_id: data.organization_id,
      titre: data.titre,
      description: data.description,
      categorie_id: data.categorie_id,
      type_activite_id: data.type_activite_id,
      date_debut: data.date_debut,
      date_fin: data.date_fin,
      lieu: data.lieu,
      budget_alloue: data.budget_alloue,
      beneficiaires_hommes: data.beneficiaires_hommes || 0,
      beneficiaires_femmes: data.beneficiaires_femmes || 0,
      beneficiaires_jeunes: data.beneficiaires_jeunes || 0,
      beneficiaires_count: (data.beneficiaires_hommes || 0) + (data.beneficiaires_femmes || 0) + (data.beneficiaires_jeunes || 0),
      created_by: data.created_by,
      statut: 'BROUILLON',
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating activity:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/activites')
  revalidatePath('/app/dashboard')

  return { success: true, activity }
}

/**
 * Met à jour le statut d'une activité
 */
export async function updateActivityStatus(
  id: string, 
  statut: string, 
  motif?: string,
  decidedBy?: string
) {
  const supabase = await createClient()

  const updateData: any = {
    statut,
    updated_at: new Date().toISOString(),
  }

  // Ajouter le motif si présent (pour rejet ou correction)
  if (motif) {
    updateData.motif_decision = motif
  }

  // Ajouter qui a décidé
  if (decidedBy) {
    updateData.valide_par = decidedBy
    updateData.date_validation = new Date().toISOString()
  }

  const { error } = await supabase
    .from('activites')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating activity status:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/validation')
  revalidatePath('/app/activites')
  revalidatePath('/app/dashboard')

  return { success: true }
}

/**
 * Récupère les données du dashboard
 */
export async function getDashboardData(organizationId?: string): Promise<DashboardData> {
  const supabase = await createClient()

  let query = supabase.from('activites').select('*')
  
  if (organizationId) {
    query = query.eq('organization_id', organizationId)
  }

  const { data: activites, error } = await query

  if (error || !activites) {
    // Retourner des données par défaut en cas d'erreur
    return {
      totalActivites: 0,
      activitesEnCours: 0,
      activitesEnAttente: 0,
      activitesValidees: 0,
      tauxExecution: 0,
      budgetTotal: 0,
      budgetDepense: 0,
      beneficiairesTotal: 0,
      repartitionStatut: {},
      activitesRecentes: [],
    }
  }

  const totalActivites = activites.length
  const activitesEnCours = activites.filter(a => 
    ['EN_VERIFICATION', 'CONSOLIDE'].includes(a.statut)
  ).length
  const activitesEnAttente = activites.filter(a => 
    a.statut === 'SOUMIS'
  ).length
  const activitesValidees = activites.filter(a => 
    a.statut === 'VALIDE'
  ).length
  const tauxExecution = totalActivites > 0 ? Math.round((activitesValidees / totalActivites) * 100) : 0
  
  const budgetTotal = activites.reduce((sum, a) => sum + (a.budget_alloue || 0), 0)
  const budgetDepense = activites.reduce((sum, a) => sum + (a.budget_depense || 0), 0)
  const beneficiairesTotal = activites.reduce((sum, a) => sum + (a.beneficiaires_count || 0), 0)

  // Répartition par statut
  const repartitionStatut: Record<string, number> = {}
  activites.forEach(a => {
    repartitionStatut[a.statut] = (repartitionStatut[a.statut] || 0) + 1
  })

  // Activités récentes (5 dernières)
  const activitesRecentes = activites
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return {
    totalActivites,
    activitesEnCours,
    activitesEnAttente,
    activitesValidees,
    tauxExecution,
    budgetTotal,
    budgetDepense,
    beneficiairesTotal,
    repartitionStatut,
    activitesRecentes,
  }
}

/**
 * Récupère les catégories d'activités
 */
export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('nom')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

/**
 * Récupère les types d'activités pour une catégorie
 */
export async function getTypesActivite(categorieId?: string) {
  const supabase = await createClient()

  let query = supabase
    .from('types_activite')
    .select('*')
    .order('nom')

  if (categorieId) {
    query = query.eq('categorie_id', categorieId)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching activity types:', error)
    return []
  }

  return data || []
}

/**
 * Récupère l'utilisateur courant avec son organisation
 */
export async function getCurrentUserWithOrg() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return null
  }

  // Récupérer le profil utilisateur
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      organizations (*)
    `)
    .eq('id', user.id)
    .single()

  return {
    ...user,
    profile,
  }
}

/**
 * Génère un rapport
 */
export async function generateReport(
  type: 'mensuel' | 'trimestriel' | 'annuel',
  periode: string,
  format: 'docx' | 'pptx',
  organizationId?: string
) {
  const supabase = await createClient()

  // Créer l'enregistrement du rapport
  const { data: rapport, error } = await supabase
    .from('rapports')
    .insert({
      organization_id: organizationId,
      type,
      periode,
      format,
      statut: 'GENERATION_EN_COURS',
      genere_par: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating report:', error)
    return { success: false, error: error.message }
  }

  // Ici, la génération réelle du fichier serait faite
  // Pour l'instant, on simule et on met à jour le statut
  
  await supabase
    .from('rapports')
    .update({ statut: 'GENERE' })
    .eq('id', rapport.id)

  revalidatePath('/app/rapports')

  return { success: true, rapport }
}

/**
 * Récupère les organisations (pour admin)
 */
export async function getOrganizations(filters?: { type?: string; actif?: boolean }) {
  const supabase = await createClient()

  let query = supabase
    .from('organizations')
    .select(`
      *,
      subscriptions (*, plans (*))
    `)
    .order('nom')

  if (filters?.type) {
    query = query.eq('type_org', filters.type)
  }

  if (filters?.actif !== undefined) {
    query = query.eq('actif', filters.actif)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching organizations:', error)
    return []
  }

  return data || []
}
