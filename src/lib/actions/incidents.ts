'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  Incident,
  IncidentFilters,
  IncidentFormData,
  IncidentType,
  IncidentGravite,
  IncidentStatut
} from '@/types'

/**
 * Récupère la liste des incidents avec filtres
 */
export async function getIncidents(
  organizationId: string,
  filters?: IncidentFilters
): Promise<{ incidents: Incident[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('incidents')
    .select(`
      *,
      incident_types (id, nom, description, code)
    `, { count: 'exact' })
    .order('date', { ascending: false })

  // Filtrer par organisation
  query = query.eq('organization_id', organizationId)

  // Filtre par statut
  if (filters?.statut && filters.statut !== 'all') {
    query = query.eq('statut', filters.statut)
  }

  // Filtre par gravité
  if (filters?.gravite && filters.gravite !== 'all') {
    query = query.eq('gravite', filters.gravite)
  }

  // Filtre par période (date début)
  if (filters?.date_debut) {
    query = query.gte('date', filters.date_debut)
  }

  // Filtre par période (date fin)
  if (filters?.date_fin) {
    query = query.lte('date', filters.date_fin)
  }

  // Recherche texte (lieu ou nature)
  if (filters?.search) {
    query = query.or(`lieu.ilike.%${filters.search}%,nature.ilike.%${filters.search}%`)
  }

  // Pagination
  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Erreur récupération incidents:', error)
    return { incidents: [], count: 0 }
  }

  return { 
    incidents: (data || []).map(mapIncident), 
    count: count || 0 
  }
}

/**
 * Récupère les statistiques des incidents pour une organisation
 */
export async function getIncidentStats(organizationId: string) {
  const supabase = await createClient()

  const { data: incidents, error } = await supabase
    .from('incidents')
    .select('statut, gravite')
    .eq('organization_id', organizationId)

  if (error || !incidents) {
    return {
      total: 0,
      enCours: 0,
      clotures: 0,
      critiques: 0,
      parGravite: {} as Record<string, number>,
      parStatut: {} as Record<string, number>
    }
  }

  const total = incidents.length
  const enCours = incidents.filter(i => i.statut === 'EN_COURS').length
  const clotures = incidents.filter(i => i.statut === 'CLOTURE').length
  const critiques = incidents.filter(i => i.gravite === 'CRITIQUE' && i.statut === 'EN_COURS').length

  // Répartition par gravité
  const parGravite: Record<string, number> = {}
  incidents.forEach(i => {
    parGravite[i.gravite] = (parGravite[i.gravite] || 0) + 1
  })

  // Répartition par statut
  const parStatut: Record<string, number> = {}
  incidents.forEach(i => {
    parStatut[i.statut] = (parStatut[i.statut] || 0) + 1
  })

  return {
    total,
    enCours,
    clotures,
    critiques,
    parGravite,
    parStatut
  }
}

/**
 * Récupère un incident par son ID avec toutes ses données
 */
export async function getIncidentDetail(id: string): Promise<Incident | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('incidents')
    .select(`
      *,
      incident_types (id, nom, description, code)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Erreur récupération incident:', error)
    return null
  }

  return mapIncident(data)
}

/**
 * Crée un nouvel incident
 */
export async function createIncident(
  organizationId: string,
  data: IncidentFormData,
  userId?: string
): Promise<{ success: boolean; incident?: Incident; error?: string }> {
  const supabase = await createClient()

  const { data: incident, error } = await supabase
    .from('incidents')
    .insert({
      organization_id: organizationId,
      date: data.date,
      lieu: data.lieu,
      region: data.region,
      departement: data.departement,
      nature: data.nature,
      type_id: data.incident_type_id,
      gravite: data.gravite,
      victimes: data.victimes || 0,
      deces: data.deces || 0,
      actions_entreprises: data.actions_entreprises,
      acteurs: data.acteurs || [],
      statut: 'EN_COURS',
      created_by: userId,
    })
    .select(`
      *,
      incident_types (id, nom, description, code)
    `)
    .single()

  if (error) {
    console.error('Erreur création incident:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/incidents')
  revalidatePath('/app/dashboard')

  return { success: true, incident: mapIncident(incident) }
}

/**
 * Met à jour un incident existant
 */
export async function updateIncident(
  id: string,
  data: Partial<IncidentFormData>
): Promise<{ success: boolean; incident?: Incident; error?: string }> {
  const supabase = await createClient()

  // Préparer les données à mettre à jour
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (data.date !== undefined) updateData.date = data.date
  if (data.lieu !== undefined) updateData.lieu = data.lieu
  if (data.region !== undefined) updateData.region = data.region
  if (data.departement !== undefined) updateData.departement = data.departement
  if (data.nature !== undefined) updateData.nature = data.nature
  if (data.incident_type_id !== undefined) updateData.type_id = data.incident_type_id
  if (data.gravite !== undefined) updateData.gravite = data.gravite
  if (data.victimes !== undefined) updateData.victimes = data.victimes
  if (data.deces !== undefined) updateData.deces = data.deces
  if (data.actions_entreprises !== undefined) updateData.actions_entreprises = data.actions_entreprises
  if (data.acteurs !== undefined) updateData.acteurs = data.acteurs

  const { data: incident, error } = await supabase
    .from('incidents')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      incident_types (id, nom, description, code)
    `)
    .single()

  if (error) {
    console.error('Erreur mise à jour incident:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/incidents')
  revalidatePath(`/app/incidents/${id}`)

  return { success: true, incident: mapIncident(incident) }
}

/**
 * Clôture un incident
 */
export async function closeIncident(
  id: string,
  motif?: string,
  userId?: string
): Promise<{ success: boolean; incident?: Incident; error?: string }> {
  const supabase = await createClient()

  const { data: incident, error } = await supabase
    .from('incidents')
    .update({
      statut: 'CLOTURE',
      cloture_le: new Date().toISOString(),
      cloture_par: userId,
      motif_cloture: motif,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('statut', 'EN_COURS') // Ne peut clôturer que si en cours
    .select(`
      *,
      incident_types (id, nom, description, code)
    `)
    .single()

  if (error) {
    console.error('Erreur clôture incident:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/incidents')
  revalidatePath(`/app/incidents/${id}`)

  return { success: true, incident: mapIncident(incident) }
}

/**
 * Récupère les types d'incidents (référentiel)
 */
export async function getIncidentTypes(): Promise<IncidentType[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('incident_types')
    .select('*')
    .order('nom')

  if (error) {
    console.error('Erreur récupération types incidents:', error)
    return []
  }

  return data || []
}

/**
 * Helper : Map les données brute vers l'interface Incident
 */
function mapIncident(data: any): Incident {
  return {
    id: data.id,
    created_at: data.created_at,
    updated_at: data.updated_at,
    organization_id: data.organization_id,
    date: data.date,
    lieu: data.lieu,
    region: data.region,
    departement: data.departement,
    nature: data.nature,
    type_id: data.type_id,
    gravite: data.gravite as IncidentGravite,
    victimes: data.victimes || 0,
    deces: data.deces || 0,
    actions_entreprises: data.actions_entreprises,
    acteurs: data.acteurs || [],
    statut: data.statut as IncidentStatut,
    cloture_le: data.cloture_le,
    cloture_par: data.cloture_par,
    motif_cloture: data.motif_cloture,
    created_by: data.created_by,
    incident_type: data.incident_types ? {
      id: data.incident_types.id,
      nom: data.incident_types.nom,
      description: data.incident_types.description,
      code: data.incident_types.code,
    } : undefined,
  }
}
