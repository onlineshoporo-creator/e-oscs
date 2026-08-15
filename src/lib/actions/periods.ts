'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Types
export interface Periode {
  id: string
  organization_id: string
  annee: number
  trimestre: number
  statut: 'OUVERT' | 'CLOTURE'
  cloture_le: string | null
  cloture_par: string | null
  rouverte_le: string | null
  rouverte_par: string | null
  motif_reouverture: string | null
  created_at: string
  updated_at: string
}

export interface PeriodeStats {
  totalActivites: number
  activitesBrouillon: number
  activitesSoumises: number
  activitesValidees: number
  tauxValidation: number
  budgetTotal: number
  beneficiairesTotal: number
}

export interface PeriodeDetail {
  periode: Periode
  stats: PeriodeStats
  activities: any[]
}

export interface BilanTrimestriel {
  annee: number
  trimestre: number
  kpis: {
    nbActivites: number
    tauxValidation: number
    budgetTotal: number
    budgetDepense: number
    beneficiairesHommes: number
    beneficiairesFemmes: number
    beneficiairesTotal: number
  }
  activities: any[]
  comparaisonPrecedent?: {
    evolutionActivites: number
    evolutionBudget: number
    evolutionValidation: number
  }
}

// Configuration des trimestres
export const TRIMESTRES_CONFIG = [
  { trimestre: 1, mois: ['Janvier', 'Février', 'Mars'], abbreviation: 'T1' },
  { trimestre: 2, mois: ['Avril', 'Mai', 'Juin'], abbreviation: 'T2' },
  { trimestre: 3, mois: ['Juillet', 'Août', 'Septembre'], abbreviation: 'T3' },
  { trimestre: 4, mois: ['Octobre', 'Novembre', 'Décembre'], abbreviation: 'T4' },
]

/**
 * Récupère les périodes d'une organisation
 */
export async function getPeriods(
  organizationId: string,
  annee?: number
): Promise<Periode[]> {
  const supabase = await createClient()

  let query = supabase
    .from('periods')
    .select('*')
    .eq('organization_id', organizationId)
    .order('annee', { ascending: true })
    .order('trimestre', { ascending: true })

  if (annee) {
    query = query.eq('annee', annee)
  }

  const { data, error } = await query

  if (error) {
    console.error('Erreur récupération périodes:', error)
    return []
  }

  return (data as Periode[]) || []
}

/**
 * Récupère ou crée les périodes pour une année donnée
 */
export async function getOrCreatePeriodsForYear(
  organizationId: string,
  annee: number
): Promise<Periode[]> {
  const supabase = await createClient()

  // D'abord vérifier si les périodes existent déjà
  const { data: existing } = await supabase
    .from('periods')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('annee', annee)

  if (existing && existing.length === 4) {
    return existing as Periode[]
  }

  // Créer les 4 trimestres s'ils n'existent pas
  const newPeriods = TRIMESTRES_CONFIG.map((t) => ({
    organization_id: organizationId,
    annee,
    trimestre: t.trimestre,
    statut: 'OUVERT',
  }))

  // Ne créer que ceux qui manquent
  const existingTrimestres = (existing || []).map((p: any) => p.trimestre)
  const toCreate = newPeriods.filter((p) => !existingTrimestres.includes(p.trimestre))

  if (toCreate.length > 0) {
    const { error } = await supabase.from('periods').insert(toCreate)

    if (error) {
      console.error('Erreur création périodes:', error)
    }
  }

  // Récupérer toutes les périodes de l'année
  const { data: allPeriods } = await supabase
    .from('periods')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('annee', annee)
    .order('trimestre', { ascending: true })

  return (allPeriods as Periode[]) || []
}

/**
 * Récupère le détail d'une période avec ses statistiques
 */
export async function getPeriodDetail(
  organizationId: string,
  annee: number,
  trimestre: number
): Promise<PeriodeDetail | null> {
  const supabase = await createClient()

  // Récupérer la période
  const { data: periode, error: periodeError } = await supabase
    .from('periods')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('annee', annee)
    .eq('trimestre', trimestre)
    .single()

  if (periodeError || !periode) {
    return null
  }

  // Calculer les dates de début et fin du trimestre
  const config = TRIMESTRES_CONFIG.find((t) => t.trimestre === trimestre)!
  const moisDebut = config.mois[0]
  const indexMoisDebut = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ].indexOf(moisDebut)
  const dateDebut = new Date(annee, indexMoisDebut, 1).toISOString()
  const dateFin = new Date(annee, indexMoisDebut + 3, 0, 23, 59, 59).toISOString()

  // Récupérer les activités de la période
  const { data: activities, error: actError } = await supabase
    .from('activites')
    .select('*')
    .eq('organization_id', organizationId)
    .gte('date_debut', dateDebut)
    .lte('date_debut', dateFin)

  if (actError) {
    console.error('Erreur récupération activités période:', actError)
  }

  const acts = activities || []

  // Calculer les statistiques
  const stats: PeriodeStats = {
    totalActivites: acts.length,
    activitesBrouillon: acts.filter((a) => a.statut === 'BROUILLON').length,
    activitesSoumises: acts.filter((a) =>
      ['SOUMIS', 'EN_VERIFICATION'].includes(a.statut)
    ).length,
    activitesValidees: acts.filter((a) => a.statut === 'VALIDE').length,
    tauxValidation:
      acts.length > 0
        ? Math.round(
            (acts.filter((a) => a.statut === 'VALIDE').length / acts.length) * 100
          )
        : 0,
    budgetTotal: acts.reduce((sum, a) => sum + (a.budget_alloue || 0), 0),
    beneficiairesTotal: acts.reduce(
      (sum, a) => sum + (a.beneficiaires_count || 0),
      0
    ),
  }

  return {
    periode: periode as Periode,
    stats,
    activities: acts,
  }
}

/**
 * Clôturer une période
 */
export async function closePeriod(
  organizationId: string,
  annee: number,
  trimestre: number,
  userId: string,
  motif?: string
): Promise<{ success: boolean; periode?: Periode; error?: string }> {
  const supabase = await createClient()

  // Vérifier que la période est bien OUVERTE
  const { data: current } = await supabase
    .from('periods')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('annee', annee)
    .eq('trimestre', trimestre)
    .single()

  if (!current) {
    return { success: false, error: 'Période non trouvée' }
  }

  if (current.statut === 'CLOTURE') {
    return { success: false, error: 'Cette période est déjà clôturée' }
  }

  const { data: periode, error } = await supabase
    .from('periods')
    .update({
      statut: 'CLOTURE',
      cloture_le: new Date().toISOString(),
      cloture_par: userId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', current.id)
    .select()
    .single()

  if (error) {
    console.error('Erreur clôture période:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/periodes')

  return { success: true, periode: periode as Periode }
}

/**
 * Rouvrir une période
 */
export async function reopenPeriod(
  organizationId: string,
  annee: number,
  trimestre: number,
  motif: string,
  userId: string
): Promise<{ success: boolean; periode?: Periode; error?: string }> {
  const supabase = await createClient()

  if (!motif || motif.trim().length === 0) {
    return { success: false, error: 'Le motif de réouverture est obligatoire' }
  }

  // Vérifier que la période est bien CLOTURÉE
  const { data: current } = await supabase
    .from('periods')
    .select('*')
    .eq('organization_id', organizationId)
    .eq('annee', annee)
    .eq('trimestre', trimestre)
    .single()

  if (!current) {
    return { success: false, error: 'Période non trouvée' }
  }

  if (current.statut === 'OUVERT') {
    return { success: false, error: 'Cette période est déjà ouverte' }
  }

  const { data: periode, error } = await supabase
    .from('periods')
    .update({
      statut: 'OUVERT',
      rouverte_le: new Date().toISOString(),
      rouverte_par: userId,
      motif_reouverture: motif,
      updated_at: new Date().toISOString(),
    })
    .eq('id', current.id)
    .select()
    .single()

  if (error) {
    console.error('Erreur réouverture période:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/periodes')

  return { success: true, periode: periode as Periode }
}

/**
 * Générer le bilan trimestriel
 */
export async function getTrimestrialReport(
  organizationId: string,
  annee: number,
  trimestre: number
): Promise<BilanTrimestriel | null> {
  const detail = await getPeriodDetail(organizationId, annee, trimestre)

  if (!detail) {
    return null
  }

  const { periode, stats, activities } = detail

  // Calculer les KPIs détaillés
  const kpis = {
    nbActivites: stats.totalActivites,
    tauxValidation: stats.tauxValidation,
    budgetTotal: stats.budgetTotal,
    budgetDepense: activities.reduce((sum, a) => sum + (a.budget_depense || 0), 0),
    beneficiairesHommes: activities.reduce(
      (sum, a) => sum + (a.beneficiaires_hommes || 0),
      0
    ),
    beneficiairesFemmes: activities.reduce(
      (sum, a) => sum + (a.beneficiaires_femmes || 0),
      0
    ),
    beneficiairesTotal: stats.beneficiairesTotal,
  }

  // Chercher le trimestre précédent pour comparaison
  const trimestrePrecedent = trimestre === 1 ? 4 : trimestre - 1
  const anneePrecedente = trimestre === 1 ? annee - 1 : annee

  const precedentDetail = await getPeriodDetail(
    organizationId,
    anneePrecedente,
    trimestrePrecedent
  )

  let comparaisonPrecedent: BilanTrimestriel['comparaisonPrecedent'] | undefined

  if (precedentDetail) {
    const prevKpis = precedentDetail.stats
    comparaisonPrecedent = {
      evolutionActivites: prevKpis.totalActivites
        ? Math.round(((kpis.nbActivites - prevKpis.totalActivites) / prevKpis.totalActivites) * 100)
        : 0,
      evolutionBudget: prevKpis.budgetTotal
        ? Math.round(((kpis.budgetTotal - prevKpis.budgetTotal) / prevKpis.budgetTotal) * 100)
        : 0,
      evolutionValidation: kpis.tauxValidation - prevKpis.tauxValidation,
    }
  }

  return {
    annee,
    trimestre,
    kpis,
    activities,
    comparaisonPrecedent,
  }
}

// Note: getCurrentTrimestre et formatRelativeDate sont exportés depuis @/lib/utils
