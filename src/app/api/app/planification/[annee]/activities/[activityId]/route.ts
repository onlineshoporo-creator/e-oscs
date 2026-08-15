import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ annee: string; activityId: string }>
}

/**
 * PUT /api/app/planification/[annee]/activities/[activityId]
 * Met à jour une activité du plan
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { activityId } = await params

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le corps de la requête
    const body = await request.json()

    // Vérifier que l'activité existe
    const { data: existing } = await supabase
      .from('plan_activities')
      .select(`
        id,
        annual_plans!inner (
          id,
          statut,
          organization_id
        )
      `)
      .eq('id', activityId)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 })
    }

    // Vérifier que le plan n'est pas clôturé
    if ((existing as any).annual_plans?.statut === 'CLOTURE') {
      return NextResponse.json(
        { error: 'Ce plan est clôturé. Impossible de modifier les activités.' },
        { status: 400 }
      )
    }

    // Mettre à jour l'activité
    const { data: activity, error } = await supabase
      .from('plan_activities')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', activityId)
      .select()
      .single()

    if (error) {
      console.error('Error updating plan activity:', error)
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

/**
 * DELETE /api/app/planification/[annee]/activities/[activityId]
 * Supprime une activité du plan
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { activityId } = await params

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que l'activité existe et récupérer le statut du plan
    const { data: existing } = await supabase
      .from('plan_activities')
      .select(`
        id,
        annual_plans!inner (
          id,
          statut
        )
      `)
      .eq('id', activityId)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 })
    }

    // Vérifier que le plan n'est pas clôturé
    if ((existing as any).annual_plans?.statut === 'CLOTURE') {
      return NextResponse.json(
        { error: 'Ce plan est clôturé. Impossible de supprimer les activités.' },
        { status: 400 }
      )
    }

    // Supprimer l'activité
    const { error } = await supabase
      .from('plan_activities')
      .delete()
      .eq('id', activityId)

    if (error) {
      console.error('Error deleting plan activity:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Activité supprimée avec succès',
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
