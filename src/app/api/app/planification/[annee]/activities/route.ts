import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ annee: string }>
}

/**
 * POST /api/app/planification/[annee]/activities
 * Ajoute une activité au plan annuel
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { annee } = await params

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'organisation de l'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json(
        { error: 'Aucune organisation associée' },
        { status: 400 }
      )
    }

    const yearNum = parseInt(annee, 10)

    // Récupérer le plan
    const { data: plan } = await supabase
      .from('annual_plans')
      .select('id, statut')
      .eq('organization_id', profile.organization_id)
      .eq('annee', yearNum)
      .maybeSingle()

    if (!plan) {
      return NextResponse.json({ error: 'Plan non trouvé pour cette année' }, { status: 404 })
    }

    if (plan.statut === 'CLOTURE') {
      return NextResponse.json(
        { error: 'Ce plan est clôturé. Impossible d\'ajouter des activités.' },
        { status: 400 }
      )
    }

    // Récupérer le corps de la requête
    const body = await request.json()
    const { axe_strategique, objectif, activite_prevue, indicateur, cible, responsable, periode_prevue, budget, observations } = body

    if (!axe_strategique || !objectif || !activite_prevue) {
      return NextResponse.json(
        { error: "Les champs 'axe_strategique', 'objectif' et 'activite_prevue' sont obligatoires" },
        { status: 400 }
      )
    }

    // Créer l'activité du plan
    const { data: activity, error } = await supabase
      .from('plan_activities')
      .insert({
        plan_id: plan.id,
        axe_strategique,
        objectif,
        activite_prevue,
        indicateur: indicateur || null,
        cible: cible || null,
        responsable: responsable || null,
        periode_prevue: periode_prevue || null,
        budget: budget || null,
        observations: observations || null,
        realise: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding plan activity:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      activity,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
