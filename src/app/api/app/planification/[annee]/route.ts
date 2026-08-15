import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ annee: string }>
}

/**
 * GET /api/app/planification/[annee]
 * Récupère le détail d'un plan annuel avec ses activités
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
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
      return NextResponse.json({ plan: null, activities: [] })
    }

    const yearNum = parseInt(annee, 10)

    // Récupérer le plan
    const { data: plan, error: planError } = await supabase
      .from('annual_plans')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .eq('annee', yearNum)
      .maybeSingle()

    if (planError) {
      console.error('Error fetching plan:', planError)
      return NextResponse.json({ error: planError.message }, { status: 500 })
    }

    if (!plan) {
      return NextResponse.json({ plan: null, activities: [] })
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

    return NextResponse.json({
      plan,
      activities: activities || [],
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

/**
 * PUT /api/app/planification/[annee]
 * Met à jour un plan annuel
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Récupérer le corps de la requête
    const body = await request.json()
    const yearNum = parseInt(annee, 10)

    // Récupérer le plan existant
    const { data: existingPlan } = await supabase
      .from('annual_plans')
      .select('id, statut')
      .eq('organization_id', profile.organization_id)
      .eq('annee', yearNum)
      .maybeSingle()

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan non trouvé' }, { status: 404 })
    }

    // Mettre à jour le plan
    const { data: plan, error } = await supabase
      .from('annual_plans')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPlan.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating plan:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      plan,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
