/**
 * Server Actions pour la génération de rapports e-OSCS
 * 
 * Ce module expose les actions serveur pour :
 * - Générer des rapports Word (.docx)
 * - Générer des présentations PowerPoint (.pptx)
 * - Récupérer l'historique des rapports générés
 * 
 * @module actions/rapports
 */

'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import {
  generateWordReport,
  generatePowerPointReport,
} from '@/lib/engines'
import {
  RapportType,
  RapportFormat,
  RapportParams,
  PresentationParams,
  PeriodeRapport,
  OrganisationRapport,
  ActivityForReport,
  RapportStats,
  GenerationResult,
} from '@/lib/engines/types'
import {
  getPeriodeLabel,
  getTrimestreLabel,
  calculerStats,
  calculerEvolutionMensuelle,
} from '@/lib/engines/utils'

// ===========================================
// Types d'entrée
// ===========================================

/** Paramètres pour la génération de rapport */
export interface GenererRapportInput {
  type: RapportType
  format: RapportFormat
  periode: {
    annee: number
    mois?: number      // Pour rapport mensuel (1-12)
    trimestre?: number // Pour rapport trimestriel (1-4)
  }
  organizationId?: string
}

/** Résultat de génération avec données Base64 */
export interface GenererRapportResult {
  success: boolean
  data?: {
    filename: string
    mimeType: string
    base64: string
    size: number
  }
  error?: string
  rapportId?: string
}

// ===========================================
// Fonctions helpers
// ===========================================

/**
 * Récupère l'organisation courante de l'utilisateur connecté
 */
async function getCurrentOrganization(userId: string) {
  const { data: profile, error } = await supabaseAdmin
    .from('profiles')
    .select('organization_id, organizations(id, nom, type_org, region, departement, telephone, email)')
    .eq('id', userId)
    .single()
  
  if (error || !profile?.organization_id) {
    return null
  }
  
  const org = profile.organizations as any
  return {
    id: org?.id || profile.organization_id,
    nom: org?.nom || 'Organisation inconnue',
    type_org: org?.type_org || 'DR',
    region: org?.region || 'Non spécifié',
    departement: org?.departement,
    telephone: org?.telephone,
    email: org?.email,
  }
}

/**
 * Calcule les dates de début et fin selon le type et la période
 */
function calculerDatesPeriode(input: GenererRapportInput): { debut: string; fin: string; label: string } {
  const { type, periode } = input
  const { annee, mois, trimestre } = periode
  
  switch (type) {
    case 'mensuel': {
      const m = mois || 1
      const debut = new Date(annee, m - 1, 1)
      const fin = new Date(annee, m, 0) // Dernier jour du mois
      return {
        debut: debut.toISOString().split('T')[0],
        fin: fin.toISOString().split('T')[0],
        label: getPeriodeLabel(m, annee),
      }
    }
    
    case 'trimestriel': {
      const t = trimestre || 1
      const moisDebut = (t - 1) * 3 + 1
      const debut = new Date(annee, moisDebut - 1, 1)
      const fin = new Date(annee, moisDebut + 2, 0) // Dernier jour du 3ème mois
      return {
        debut: debut.toISOString().split('T')[0],
        fin: fin.toISOString().split('T')[0],
        label: getTrimestreLabel(t, annee),
      }
    }
    
    case 'annuel':
    default: {
      return {
        debut: `${annee}-01-01`,
        fin: `${annee}-12-31`,
        label: `Année ${annee}`,
      }
    }
  }
}

/**
 * Récupère les activités depuis Supabase pour une période donnée
 */
async function fetchActivities(
  organizationId: string,
  dateDebut: string,
  dateFin: string
): Promise<ActivityForReport[]> {
  const { data, error } = await supabaseAdmin
    .from('activities')
    .select(`
      id,
      titre,
      description,
      categorie_id,
      categories!inner(nom),
      type_activite_id,
      types_activites!inner(nom),
      statut,
      date_debut,
      date_fin,
      lieu,
      budget_alloue,
      budget_depense,
      beneficiaires_count,
      beneficiaires_hommes,
      beneficiaires_femmes,
      beneficiaires_jeunes
    `)
    .eq('organization_id', organizationId)
    .gte('date_debut', dateDebut)
    .lte('date_debut', dateFin)
    .order('date_debut', { ascending: true })
  
  if (error) {
    console.error('Erreur lors de la récupération des activités:', error)
    return []
  }
  
  // Mapper les données au format attendu
  return (data || []).map((act: any) => ({
    id: act.id,
    titre: act.titre,
    description: act.description,
    categorie: act.categories?.nom || 'Non classifié',
    type_activite: act.types_activites?.nom || 'Non défini',
    statut: act.statut,
    date_debut: act.date_debut,
    date_fin: act.date_fin,
    lieu: act.lieu,
    budget_alloue: act.budget_alloue || 0,
    budget_depense: act.budget_depense || 0,
    beneficiaires_count: act.beneficiaires_count || 0,
    beneficiaires_hommes: act.beneficiaires_hommes || 0,
    beneficiaires_femmes: act.beneficiaires_femmes || 0,
    beneficiaires_jeunes: act.beneficiaires_jeunes || 0,
  }))
}

/**
 * Récupère les indicateurs depuis Supabase
 */
async function fetchIndicators(organizationId?: string) {
  // Pour l'instant, retourner un tableau vide
  // Les indicateurs peuvent être ajoutés ultérieurement
  return []
}

/**
 * Sauvegarde le rapport en base de données
 */
async function saveRapport(
  userId: string,
  organizationId: string,
  type: string,
  format: string,
  periodeLabel: string,
  filename: string,
  taille: number
): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('rapports')
    .insert({
      organization_id: organizationId,
      type,
      periode: periodeLabel,
      format,
      statut: 'GENERE',
      genere_par: userId,
      fichier_nom: filename,
      taille_estimee: formatTaille(taille),
      date_generation: new Date().toISOString(),
    })
    .select('id')
    .single()
  
  if (error) {
    console.error('Erreur lors de la sauvegarde du rapport:', error)
    return null
  }
  
  return data?.id
}

/**
 * Formate la taille du fichier
 */
function formatTaille(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ===========================================
// Actions principales
// ===========================================

/**
 * Génère un rapport Word (.docx)
 * 
 * @param input - Paramètres de génération
 * @returns Résultat avec le fichier en Base64
 * 
 * @example
 * ```typescript
 * const result = await genererRapportWord({
 *   type: 'mensuel',
 *   format: 'docx',
 *   periode: { annee: 2026, mois: 1 }
 * })
 * ```
 */
export async function genererRapportWord(
  input: GenererRapportInput
): Promise<GenererRapportResult> {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Non authentifié' }
    }
    
    // Récupérer l'organisation
    const organisation = await getCurrentOrganization(user.id)
    if (!organisation) {
      return { success: false, error: 'Organisation non trouvée' }
    }
    
    // Calculer les dates de période
    const dates = calculerDatesPeriode(input)
    
    // Récupérer les activités
    const activities = await fetchActivities(
      organisation.id,
      dates.debut,
      dates.fin
    )
    
    // Calculer les statistiques
    const stats = calculerStats(activities)
    
    // Ajouter l'évolution mensuelle pour les rapports trimestriels/annuels
    if (input.type !== 'mensuel') {
      stats.evolutionMensuelle = calculerEvolutionMensuelle(
        activities,
        input.periode.annee,
        input.type
      )
    }
    
    // Construire les paramètres du rapport
    const params: RapportParams = {
      organisation: organisation as OrganisationRapport,
      periode: {
        debut: dates.debut,
        fin: dates.fin,
        label: dates.label,
        annee: input.periode.annee,
        mois: input.periode.mois,
        trimestre: input.periode.trimestre,
      },
      activities,
      stats,
      indicators: await fetchIndicators(organisation.id),
      type: input.type,
    }
    
    // Générer le document Word
    const result: GenerationResult = await generateWordReport(params)
    
    if (!result.success || !result.buffer) {
      return { success: false, error: result.error || 'Erreur lors de la génération' }
    }
    
    // Convertir en Base64 pour le transport
    const base64 = result.buffer.toString('base64')
    
    // Sauvegarder en base
    const rapportId = await saveRapport(
      user.id,
      organisation.id,
      input.type,
      'docx',
      dates.label,
      result.filename,
      result.size || 0
    )
    
    return {
      success: true,
      data: {
        filename: result.filename,
        mimeType: result.mimeType,
        base64,
        size: result.size || 0,
      },
      rapportId: rapportId || undefined,
    }
  } catch (error) {
    console.error('Erreur dans genererRapportWord:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Génère une présentation PowerPoint (.pptx)
 * 
 * @param input - Paramètres de génération
 * @returns Résultat avec le fichier en Base64
 * 
 * @example
 * ```typescript
 * const result = await genererRapportPPTX({
 *   type: 'trimestriel',
 *   format: 'pptx',
 *   periode: { annee: 2025, trimestre: 1 }
 * })
 * ```
 */
export async function genererRapportPPTX(
  input: GenererRapportInput
): Promise<GenererRapportResult> {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Non authentifié' }
    }
    
    // Récupérer l'organisation
    const organisation = await getCurrentOrganization(user.id)
    if (!organisation) {
      return { success: false, error: 'Organisation non trouvée' }
    }
    
    // Calculer les dates de période
    const dates = calculerDatesPeriode(input)
    
    // Récupérer les activités
    const activities = await fetchActivities(
      organisation.id,
      dates.debut,
      dates.fin
    )
    
    // Calculer les statistiques
    const stats = calculerStats(activities)
    
    // Ajouter l'évolution mensuelle pour les rapports trimestriels/annuels
    if (input.type !== 'mensuel') {
      stats.evolutionMensuelle = calculerEvolutionMensuelle(
        activities,
        input.periode.annee,
        input.type
      )
    }
    
    // Construire les paramètres de présentation
    const params: PresentationParams = {
      organisation: organisation as OrganisationRapport,
      periode: {
        debut: dates.debut,
        fin: dates.fin,
        label: dates.label,
        annee: input.periode.annee,
        mois: input.periode.mois,
        trimestre: input.periode.trimestre,
      },
      activities,
      stats,
      indicators: await fetchIndicators(organisation.id),
      type: input.type,
    }
    
    // Générer la présentation PowerPoint
    const result: GenerationResult = await generatePowerPointReport(params)
    
    if (!result.success || !result.buffer) {
      return { success: false, error: result.error || 'Erreur lors de la génération' }
    }
    
    // Convertir en Base64 pour le transport
    const base64 = result.buffer.toString('base64')
    
    // Sauvegarder en base
    const rapportId = await saveRapport(
      user.id,
      organisation.id,
      input.type,
      'pptx',
      dates.label,
      result.filename,
      result.size || 0
    )
    
    return {
      success: true,
      data: {
        filename: result.filename,
        mimeType: result.mimeType,
        base64,
        size: result.size || 0,
      },
      rapportId: rapportId || undefined,
    }
  } catch (error) {
    console.error('Erreur dans genererRapportPPTX:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Récupère l'historique des rapports générés
 * 
 * @param organizationId - ID de l'organisation (optionnel, utilise celle de l'utilisateur si non fourni)
 * @returns Liste des rapports
 * 
 * @example
 * ```typescript
 * const rapports = await getRapportsHistorique()
 * ```
 */
export async function getRapportsHistorique(
  organizationId?: string
): Promise<{ success: boolean; rapports?: any[]; error?: string }> {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Non authentifié' }
    }
    
    // Utiliser l'organisation fournie ou récupérer celle de l'utilisateur
    let orgId = organizationId
    if (!orgId) {
      const org = await getCurrentOrganization(user.id)
      orgId = org?.id
    }
    
    // Construire la requête
    let query = supabaseAdmin
      .from('rapports')
      .select(`
        *,
        generateur:id (full_name, email, avatar_url)
      `)
      .order('created_at', { ascending: false })
      .limit(50)
    
    // Filtrer par organisation si disponible
    if (orgId) {
      query = query.eq('organization_id', orgId)
    }
    
    const { data: rapports, error } = await query
    
    if (error) {
      console.error('Erreur lors de la récupération des rapports:', error)
      return { success: false, error: error.message }
    }
    
    return {
      success: true,
      rapports: rapports || [],
    }
  } catch (error) {
    console.error('Erreur dans getRapportsHistorique:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}

/**
 * Supprime un rapport généré
 * 
 * @param rapportId - ID du rapport à supprimer
 * @returns Résultat de l'opération
 */
export async function supprimerRapport(
  rapportId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { success: false, error: 'Non authentifié' }
    }
    
    // Vérifier que le rapport appartient à l'utilisateur ou qu'il est admin
    const { data: rapport, error: fetchError } = await supabaseAdmin
      .from('rapports')
      .select('id, genere_par')
      .eq('id', rapportId)
      .single()
    
    if (fetchError || !rapport) {
      return { success: false, error: 'Rapport non trouvé' }
    }
    
    // Seul le créateur peut supprimer (ou un admin dans une version future)
    if (rapport.genere_par !== user.id) {
      return { success: false, error: 'Non autorisé à supprimer ce rapport' }
    }
    
    // Supprimer
    const { error: deleteError } = await supabaseAdmin
      .from('rapports')
      .delete()
      .eq('id', rapportId)
    
    if (deleteError) {
      return { success: false, error: deleteError.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Erreur dans supprimerRapport:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    }
  }
}
