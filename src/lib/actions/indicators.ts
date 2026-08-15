'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type {
  Indicator,
  IndicatorValue,
  IndicatorFilters,
  IndicatorBatchInput,
  IndicatorStats,
  IndicatorKind
} from '@/types'

/**
 * Récupère la liste des indicateurs avec filtres
 */
export async function getIndicators(
  filters?: IndicatorFilters
): Promise<{ indicators: Indicator[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('indicators')
    .select('*', { count: 'exact' })
    .order('nom')

  // Filtre par axe stratégique
  if (filters?.axe && filters.axe !== 'all') {
    query = query.eq('axe', filters.axe)
  }

  // Filtre par type (quantitatif/qualitatif)
  if (filters?.kind && filters.kind !== 'all') {
    query = query.eq('kind', filters.kind)
  }

  // Filtre par organisation
  if (filters?.organization_id) {
    query = query.or(`organization_id.is.null,organization_id.eq.${filters.organization_id}`)
  }

  // Uniquement les indicateurs globaux
  if (filters?.global_only) {
    query = query.is('organization_id', null)
  }

  // Recherche texte
  if (filters?.search) {
    query = query.or(`nom.ilike.%${filters.search}%,code.ilike.%${filters.search}%`)
  }

  // Pagination
  const page = filters?.page || 1
  const limit = filters?.limit || 50
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Erreur récupération indicateurs:', error)
    return { indicators: [], count: 0 }
  }

  return { 
    indicators: (data || []).map(mapIndicator), 
    count: count || 0 
  }
}

/**
 * Récupère un indicateur avec ses valeurs historiques
 */
export async function getIndicatorDetail(id: string): Promise<{
  indicator: Indicator | null
  values: IndicatorValue[]
}> {
  const supabase = await createClient()

  // Récupérer l'indicateur
  const { data: indicator, error: indicatorError } = await supabase
    .from('indicators')
    .select('*')
    .eq('id', id)
    .single()

  if (indicatorError || !indicator) {
    console.error('Erreur récupération indicateur:', indicatorError)
    return { indicator: null, values: [] }
  }

  // Récupérer les valeurs associées
  const { data: values, error: valuesError } = await supabase
    .from('indicator_values')
    .select(`
      *,
      activites (id, titre, statut)
    `)
    .eq('indicator_id', id)
    .order('created_at', { ascending: false })

  if (valuesError) {
    console.error('Erreur récupération valeurs indicateur:', valuesError)
    return { indicator: mapIndicator(indicator), values: [] }
  }

  return {
    indicator: mapIndicator(indicator),
    values: (values || []).map(v => mapIndicatorValue(v))
  }
}

/**
 * Crée un nouvel indicateur personnalisé pour une organisation
 */
export async function createIndicator(
  organizationId: string,
  data: {
    code: string
    nom: string
    description?: string
    kind: IndicatorKind
    unite?: string
    objectif?: number
    axe?: string
    category_id?: string
  },
  userId?: string
): Promise<{ success: boolean; indicator?: Indicator; error?: string }> {
  const supabase = await createClient()

  // Vérifier que le code n'existe pas déjà pour cette org
  const { data: existing } = await supabase
    .from('indicators')
    .select('id')
    .eq('code', data.code)
    .eq('organization_id', organizationId)
    .single()

  if (existing) {
    return { success: false, error: 'Un indicateur avec ce code existe déjà' }
  }

  const { data: indicator, error } = await supabase
    .from('indicators')
    .insert({
      code: data.code.toUpperCase(),
      nom: data.nom,
      description: data.description,
      kind: data.kind,
      unite: data.unite,
      objectif: data.objectif,
      axe: data.axe,
      category_id: data.category_id,
      organization_id: organizationId,
      created_by: userId,
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur création indicateur:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/indicateurs')

  return { success: true, indicator: mapIndicator(indicator) }
}

/**
 * Sauvegarde des valeurs d'indicateurs en lot (pour une activité)
 */
export async function saveIndicatorValues(
  input: IndicatorBatchInput,
  userId?: string
): Promise<{ success: boolean; values?: IndicatorValue[]; error?: string }> {
  const supabase = await createClient()

  const valuesToInsert = input.values.map(v => ({
    activity_id: input.activity_id,
    indicator_id: v.indicator_id,
    valeur_numerique: v.valeur_numerique,
    valeur_texte: v.valeur_texte,
    created_by: userId,
  }))

  const { data, error } = await supabase
    .from('indicator_values')
    .upsert(valuesToInsert, {
      onConflict: 'activity_id,indicator_id',
      ignoreDuplicates: false,
    })
    .select(`
      *,
      activites (id, titre),
      indicators (id, nom, code, kind, unite)
    `)

  if (error) {
    console.error('Erreur sauvegarde valeurs indicateurs:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/indicateurs')
  revalidatePath('/app/indicateurs/saisie')

  return { 
    success: true, 
    values: (data || []).map(v => ({
      id: v.id,
      activity_id: v.activity_id,
      indicator_id: v.indicator_id,
      valeur_numerique: v.valeur_numerique,
      valeur_texte: v.valeur_texte,
      created_at: v.created_at,
      created_by: v.created_by,
      activity: v.activites ? {
        id: v.activites.id,
        titre: v.activites.titre,
        statut: v.activites.statut,
        organization_id: '',
        created_at: '',
        created_by: '',
      } : undefined,
      indicator: v.indicators ? mapIndicator(v.indicators) : undefined,
    }))
  }
}

/**
 * Récupère l'historique des valeurs d'un indicateur
 */
export async function getIndicatorHistory(
  indicatorId: string,
  limit: number = 50
): Promise<IndicatorValue[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('indicator_values')
    .select(`
      *,
      activites (id, titre, date_debut, date_fin)
    `)
    .eq('indicator_id', indicatorId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Erreur historique valeurs indicateur:', error)
    return []
  }

  return (data || []).map(v => mapIndicatorValue(v))
}

/**
 * Calcule les statistiques d'un indicateur
 */
export async function getIndicatorStats(indicatorId: string): Promise<IndicatorStats> {
  const supabase = await createClient()

  const { data: values, error } = await supabase
    .from('indicator_values')
    .select('valeur_numerique, valeur_texte, created_at')
    .eq('indicator_id', indicatorId)
    .order('created_at', { ascending: true })

  if (error || !values || values.length === 0) {
    return {
      nombre_valeurs: 0,
    }
  }

  // Filtrer uniquement les valeurs numériques
  const numericValues = values
    .filter(v => v.valeur_numerique !== null && v.valeur_numerique !== undefined)
    .map(v => v.valeur_numerique!)

  const stats: IndicatorStats = {
    nombre_valeurs: values.length,
  }

  if (numericValues.length > 0) {
    stats.moyenne = numericValues.reduce((a, b) => a + b, 0) / numericValues.length
    stats.min = Math.min(...numericValues)
    stats.max = Math.max(...numericValues)
    stats.derniere_valeur = numericValues[numericValues.length - 1].toString()
  } else if (values.length > 0 && values[0].valeur_texte) {
    // Pour les indicateurs qualitatifs
    stats.derniere_valeur = values[values.length - 1].valeur_texte!
  }

  return stats
}

/**
 * Supprime un indicateur personnalisé
 */
export async function deleteIndicator(
  id: string,
  organizationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Vérifier que l'indicateur appartient à l'organisation
  const { data: indicator } = await supabase
    .from('indicators')
    .select('id, organization_id')
    .eq('id', id)
    .single()

  if (!indicator) {
    return { success: false, error: 'Indicateur non trouvé' }
  }

  if (indicator.organization_id !== organizationId) {
    return { success: false, error: 'Vous ne pouvez supprimer que vos indicateurs personnalisés' }
  }

  // Supprimer les valeurs associées puis l'indicateur
  const { error: valuesError } = await supabase
    .from('indicator_values')
    .delete()
    .eq('indicator_id', id)

  if (valuesError) {
    console.error('Erreur suppression valeurs:', valuesError)
  }

  const { error } = await supabase
    .from('indicators')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression indicateur:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/indicateurs')

  return { success: true }
}

/**
 * Récupère les axes stratégiques disponibles
 */
export async function getIndicatorAxes(): Promise<string[]> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('indicators')
    .select('axe')

  if (!data) return []

  // Extraire les axes uniques (non null)
  const axes = [...new Set(data.map(d => d.axe).filter(Boolean))] as string[]
  return axes.sort()
}

/**
 * Helper : Map les données brute vers l'interface Indicator
 */
function mapIndicator(data: any): Indicator {
  return {
    id: data.id,
    code: data.code,
    nom: data.nom,
    description: data.description,
    kind: data.kind as IndicatorKind,
    unite: data.unite,
    objectif: data.objectif,
    axe: data.axe,
    category_id: data.category_id,
    organization_id: data.organization_id,
    created_at: data.created_at,
  }
}

/**
 * Helper : Map les données brute vers l'interface IndicatorValue
 */
function mapIndicatorValue(data: any): IndicatorValue {
  return {
    id: data.id,
    activity_id: data.activity_id,
    indicator_id: data.indicator_id,
    valeur_numerique: data.valeur_numerique,
    valeur_texte: data.valeur_texte,
    created_at: data.created_at,
    created_by: data.created_by,
    activity: data.activites ? {
      id: data.activites.id,
      titre: data.activites.titre,
      statut: data.activites.statut,
      organization_id: '',
      created_at: '',
      created_by: '',
    } : undefined,
  }
}
