'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Types
export interface AttachmentFilters {
  kind?: 'PHOTO' | 'DOCUMENT' | 'ALL'
  lien?: 'activites' | 'incidents' | 'aucun'
  periode_debut?: string
  periode_fin?: string
  search?: string
  page?: number
  limit?: number
}

export interface Attachment {
  id: string
  organization_id: string
  activity_id: string | null
  incident_id: string | null
  kind: 'PHOTO' | 'DOCUMENT'
  storage_path: string
  nom_fichier: string
  mime: string
  taille: number
  legende: string | null
  date_prise: string | null
  lieu_prise: string | null
  description: string | null
  selection_presentation: boolean
  created_at: string
  updated_at: string
}

export interface AttachmentStats {
  totalPhotos: number
  totalDocuments: number
  tailleTotale: number
  selectionneesPresentation: number
}

/**
 * Récupère les pièces jointes avec filtres
 */
export async function getAttachments(
  organizationId: string,
  filters?: AttachmentFilters
): Promise<{ attachments: Attachment[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('attachments')
    .select('*', { count: 'exact' })
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  // Filtre par type (photo/document)
  if (filters?.kind && filters.kind !== 'ALL') {
    query = query.eq('kind', filters.kind)
  }

  // Filtre par lien (activité/incident)
  if (filters?.lien) {
    switch (filters.lien) {
      case 'activites':
        query = query.not('activity_id', 'is', null)
        break
      case 'incidents':
        query = query.not('incident_id', 'is', null)
        break
      case 'aucun':
        query = query.is('activity_id', null).is('incident_id', null)
        break
    }
  }

  // Filtre par période
  if (filters?.periode_debut) {
    query = query.gte('created_at', filters.periode_debut)
  }
  if (filters?.periode_fin) {
    query = query.lte('created_at', filters.periode_fin)
  }

  // Recherche (nom fichier, légende)
  if (filters?.search) {
    query = query.or(`nom_fichier.ilike.%${filters.search}%,legende.ilike.%${filters.search}%`)
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Erreur récupération attachments:', error)
    return { attachments: [], count: 0 }
  }

  return { attachments: (data as Attachment[]) || [], count: count || 0 }
}

/**
 * Récupère un attachment par ID
 */
export async function getAttachmentDetail(id: string): Promise<Attachment | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('attachments')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Erreur détail attachment:', error)
    return null
  }

  return data as Attachment
}

/**
 * Met à jour un attachment
 */
export async function updateAttachment(
  id: string,
  data: {
    legende?: string
    date_prise?: string
    lieu_prise?: string
    description?: string
  }
): Promise<{ success: boolean; attachment?: Attachment; error?: string }> {
  const supabase = await createClient()

  const { data: attachment, error } = await supabase
    .from('attachments')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Erreur mise à jour attachment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/galerie')

  return { success: true, attachment: attachment as Attachment }
}

/**
 * Supprime un attachment
 */
export async function deleteAttachment(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Récupérer le storage_path avant suppression pour nettoyer le stockage
  const { data: attachment } = await supabase
    .from('attachments')
    .select('storage_path')
    .eq('id', id)
    .single()

  const { error } = await supabase
    .from('attachments')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erreur suppression attachment:', error)
    return { success: false, error: error.message }
  }

  // TODO: Supprimer le fichier du storage Supabase si storage_path existe
  // if (attachment?.storage_path) {
  //   await supabase.storage.from('attachments').remove([attachment.storage_path])
  // }

  revalidatePath('/app/galerie')

  return { success: true }
}

/**
 * Toggle sélection pour présentation/rapport
 */
export async function toggleSelectionPresentation(
  id: string
): Promise<{ success: boolean; selected?: boolean; error?: string }> {
  const supabase = await createClient()

  // Récupérer l'état actuel
  const { data: current } = await supabase
    .from('attachments')
    .select('selection_presentation')
    .eq('id', id)
    .single()

  if (!current) {
    return { success: false, error: 'Attachment non trouvé' }
  }

  const newSelection = !current.selection_presentation

  const { error } = await supabase
    .from('attachments')
    .update({
      selection_presentation: newSelection,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Erreur toggle sélection:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/galerie')

  return { success: true, selected: newSelection }
}

/**
 * Crée un nouvel enregistrement d'attachment (métadonnées uniquement)
 */
export async function createAttachmentRecord(data: {
  organization_id: string
  activity_id?: string | null
  incident_id?: string | null
  kind: 'PHOTO' | 'DOCUMENT'
  storage_path: string
  nom_fichier: string
  mime: string
  taille: number
  legende?: string | null
  date_prise?: string | null
  lieu_prise?: string | null
  description?: string | null
}): Promise<{ success: boolean; attachment?: Attachment; error?: string }> {
  const supabase = await createClient()

  const { data: attachment, error } = await supabase
    .from('attachments')
    .insert({
      ...data,
      selection_presentation: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur création attachment:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/galerie')

  return { success: true, attachment: attachment as Attachment }
}

/**
 * Récupère les statistiques des attachments
 */
export async function getAttachmentStats(organizationId: string): Promise<AttachmentStats> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('attachments')
    .select('kind, taille, selection_presentation')
    .eq('organization_id', organizationId)

  if (error || !data) {
    return {
      totalPhotos: 0,
      totalDocuments: 0,
      tailleTotale: 0,
      selectionneesPresentation: 0,
    }
  }

  const photos = data.filter((a) => a.kind === 'PHOTO')
  const documents = data.filter((a) => a.kind === 'DOCUMENT')
  const tailleTotale = data.reduce((sum, a) => sum + (a.taille || 0), 0)
  const selectionnees = data.filter((a) => a.selection_presentation).length

  return {
    totalPhotos: photos.length,
    totalDocuments: documents.length,
    tailleTotale,
    selectionneesPresentation: selectionnees,
  }
}

/**
 * Toggle sélection multiple pour présentation
 */
export async function toggleMultipleSelectionPresentation(
  ids: string[],
  selected: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('attachments')
    .update({
      selection_presentation: selected,
      updated_at: new Date().toISOString(),
    })
    .in('id', ids)

  if (error) {
    console.error('Erreur toggle sélection multiple:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/galerie')

  return { success: true }
}
