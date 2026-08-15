/**
 * API Route pour la génération de rapports e-OSCS
 * 
 * POST /api/app/rapports/generer - Génère un rapport (Word ou PowerPoint)
 * GET /api/app/rapports/generer - Liste les rapports générés
 * 
 * @module api/rapports/generer
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import {
  generateWordReport,
  generatePowerPointReport,
} from '@/lib/engines'
import {
  RapportType,
  RapportFormat,
  OrganisationRapport,
  PeriodeRapport,
  ActivityForReport,
  RapportStats,
  calculerStats,
  calculerEvolutionMensuelle,
  getPeriodeLabel,
  getTrimestreLabel,
} from '@/lib/engines'

// ===========================================
// Types
// ===========================================

interface GenererRequestBody {
  type: RapportType
  format: RapportFormat
  periode: {
    annee: number
    mois?: number
    trimestre?: number
  }
  organization_id?: string
}

// ===========================================
// Helpers
// ===========================================

/**
 * Formate la taille du fichier
 */
function formatTaille(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Récupère l'organisation depuis la base
 */
async function getOrganization(organizationId?: string, userId?: string) {
  let orgId = organizationId
  
  // Si pas d'organisation fournie, récupérer celle de l'utilisateur
  if (!orgId && userId) {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('organization_id')
      .eq('id', userId)
      .single()
    
    orgId = profile?.organization_id
  }
  
  if (!orgId) return null
  
  const { data: org } = await supabaseAdmin
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .single()
  
  return org
}

/**
 * Calcule les dates de période selon le type et paramètres
 */
function calculatePeriodDates(type: RapportType, periode: { annee: number; mois?: number; trimestre?: number }) {
  const { annee, mois, trimestre } = periode
  
  switch (type) {
    case 'mensuel': {
      const m = mois || 1
      const debut = new Date(annee, m - 1, 1)
      const fin = new Date(annee, m, 0)
      return {
        debut: debut.toISOString().split('T')[0],
        fin: fin.toISOString().split('T')[0],
        label: getPeriodeLabel(m, annee),
        mois: m,
      }
    }
    
    case 'trimestriel': {
      const t = trimestre || 1
      const moisDebut = (t - 1) * 3 + 1
      const debut = new Date(annee, moisDebut - 1, 1)
      const fin = new Date(annee, moisDebut + 2, 0)
      return {
        debut: debut.toISOString().split('T')[0],
        fin: fin.toISOString().split('T')[0],
        label: getTrimestreLabel(t, annee),
        trimestre: t,
      }
    }
    
    case 'annuel':
    default:
      return {
        debut: `${annee}-01-01`,
        fin: `${annee}-12-31`,
        label: `Année ${annee}`,
      }
  }
}

/**
 * Récupère les activités pour une période donnée
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
      categories(nom),
      types_activites(nom),
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
    console.error('Erreur fetchActivities:', error)
    return []
  }
  
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
 * Sauvegarde le rapport en base de données
 */
async function saveReportToDb(params: {
  userId: string
  organizationId: string
  type: string
  format: string
  periodeLabel: string
  filename: string
  size: number
}): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('rapports')
    .insert({
      organization_id: params.organizationId,
      type: params.type,
      periode: params.periodeLabel,
      format: params.format,
      statut: 'GENERE',
      genere_par: params.userId,
      fichier_nom: params.filename,
      taille_estimee: formatTaille(params.size),
      date_generation: new Date().toISOString(),
    })
    .select('id')
    .single()
  
  if (error) {
    console.error('Erreur saveReportToDb:', error)
    return null
  }
  
  return data?.id
}

// ===========================================
// POST Handler - Génération de rapport
// ===========================================

/**
 * POST /api/app/rapports/generer
 * 
 * Génère un rapport Word (.docx) ou PowerPoint (.pptx)
 * 
 * Body:
 * - type: 'mensuel' | 'trimestriel' | 'annuel'
 * - format: 'docx' | 'pptx'
 * - periode: { annee, mois?, trimestre? }
 * - organization_id? (optionnel, utilise celle de l'utilisateur)
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    // Parser le corps de la requête
    let body: GenererRequestBody
    try {
      body = await request.json()
    } catch (parseError) {
      return NextResponse.json(
        { error: 'JSON invalide dans le corps de la requête' },
        { status: 400 }
      )
    }
    
    const { type, format, periode, organization_id } = body
    
    // Validation des champs obligatoires
    if (!type || !format || !periode?.annee) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: type, format, periode.annee' },
        { status: 400 }
      )
    }
    
    // Validation du type
    const validTypes: RapportType[] = ['mensuel', 'trimestriel', 'annuel']
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Type invalide. Valeurs acceptées: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Validation du format
    const validFormats: RapportFormat[] = ['docx', 'pptx']
    if (!validFormats.includes(format)) {
      return NextResponse.json(
        { error: `Format invalide. Valeurs acceptées: ${validFormats.join(', ')}` },
        { status: 400 }
      )
    }
    
    // Récupérer l'organisation
    const org = await getOrganization(organization_id, user.id)
    if (!org) {
      return NextResponse.json(
        { error: 'Organisation non trouvée' },
        { status: 404 }
      )
    }
    
    // Calculer les dates de période
    const periodDates = calculatePeriodDates(type, periode)
    
    // Récupérer les activités
    const activities = await fetchActivities(org.id, periodDates.debut, periodDates.fin)
    
    // Calculer les statistiques
    const stats: RapportStats = calculerStats(activities)
    
    // Ajouter l'évolution mensuelle pour les rapports trimestriels/annuels
    if (type !== 'mensuel') {
      stats.evolutionMensuelle = calculerEvolutionMensuelle(
        activities,
        periode.annee,
        type
      )
    }
    
    // Construire les paramètres du rapport
    const rapportParams = {
      organisation: {
        id: org.id,
        nom: org.nom,
        type_org: org.type_org,
        region: org.region,
        departement: org.departement,
        telephone: org.telephone,
        email: org.email,
      } as OrganisationRapport,
      periode: {
        debut: periodDates.debut,
        fin: periodDates.fin,
        label: periodDates.label,
        annee: periode.annee,
        mois: periodDates.mois,
        trimestre: periodDates.trimestre,
      } as PeriodeRapport,
      activities,
      stats,
      type,
    }
    
    // Générer le rapport selon le format demandé
    let result
    if (format === 'docx') {
      result = await generateWordReport(rapportParams)
    } else if (format === 'pptx') {
      result = await generatePowerPointReport(rapportParams)
    } else {
      return NextResponse.json(
        { error: `Format non supporté: ${format}` },
        { status: 400 }
      )
    }
    
    // Vérifier le résultat de génération
    if (!result.success || !result.buffer) {
      return NextResponse.json(
        { error: result.error || 'Erreur lors de la génération du rapport' },
        { status: 500 }
      )
    }
    
    // Sauvegarder en base de données
    const rapportId = await saveReportToDb({
      userId: user.id,
      organizationId: org.id,
      type,
      format,
      periodeLabel: periodDates.label,
      filename: result.filename,
      size: result.size || result.buffer.length,
    })
    
    // Retourner le fichier généré
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename="${result.filename}"`,
        'Content-Length': String(result.buffer.length),
        'X-Rapport-Id': rapportId || '',
        'X-Filename': result.filename,
      },
    })
    
  } catch (error) {
    console.error('Erreur inattendue dans POST /api/app/rapports/generer:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// ===========================================
// GET Handler - Liste des rapports
// ===========================================

/**
 * GET /api/app/rapports/generer
 * 
 * Retourne la liste des rapports générés par l'utilisateur
 * 
 * Query params:
 * - organization_id: Filtrer par organisation (optionnel)
 * - limit: Nombre max de résultats (défaut: 50)
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    // Récupérer les paramètres de query
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organization_id')
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    
    // Déterminer l'organisation à filtrer
    let orgId = organizationId
    if (!orgId) {
      const org = await getOrganization(undefined, user.id)
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
      .limit(Math.min(limit, 100))
    
    if (orgId) {
      query = query.eq('organization_id', orgId)
    }
    
    const { data: rapports, error } = await query
    
    if (error) {
      console.error('Erreur lors de la récupération des rapports:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      rapports: rapports || [],
      count: rapports?.length || 0,
    })
    
  } catch (error) {
    console.error('Erreur inattendue dans GET /api/app/rapports/generer:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// ===========================================
// DELETE Handler - Supprimer un rapport
// ===========================================

/**
 * DELETE /api/app/rapports/generer?id=xxx
 * 
 * Supprime un rapport généré
 */
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }
    
    // Récupérer l'ID du rapport à supprimer
    const { searchParams } = new URL(request.url)
    const rapportId = searchParams.get('id')
    
    if (!rapportId) {
      return NextResponse.json(
        { error: 'ID du rapport requis (query param: id)' },
        { status: 400 }
      )
    }
    
    // Vérifier que le rapport existe et appartient à l'utilisateur
    const { data: rapport, error: fetchError } = await supabaseAdmin
      .from('rapports')
      .select('id, genere_par')
      .eq('id', rapportId)
      .single()
    
    if (fetchError || !rapport) {
      return NextResponse.json(
        { error: 'Rapport non trouvé' },
        { status: 404 }
      )
    }
    
    // Vérifier les droits (seul le créateur peut supprimer)
    if (rapport.genere_par !== user.id) {
      return NextResponse.json(
        { error: 'Non autorisé à supprimer ce rapport' },
        { status: 403 }
      )
    }
    
    // Supprimer le rapport
    const { error: deleteError } = await supabaseAdmin
      .from('rapports')
      .delete()
      .eq('id', rapportId)
    
    if (deleteError) {
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Rapport supprimé avec succès',
    })
    
  } catch (error) {
    console.error('Erreur dans DELETE /api/app/rapports/generer:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
