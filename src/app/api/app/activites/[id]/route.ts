import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/app/activites/[id]
 * Récupère les détails d'une activité
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'activité
    const { data: activity, error } = await supabase
      .from('activites')
      .select(`
        *,
        categories (id, nom),
        types_activite (id, nom),
        organizations (id, nom, type_org)
      `)
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 })
      }
      console.error('Error fetching activity:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ activity })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

/**
 * PUT /api/app/activites/[id]
 * Met à jour une activité
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le corps de la requête
    const body = await request.json()

    // Vérifier que l'activité existe
    const { data: existingActivity } = await supabase
      .from('activites')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingActivity) {
      return NextResponse.json({ error: 'Activité non trouvée' }, { status: 404 })
    }

    // Mettre à jour l'activité
    const { data: activity, error } = await supabase
      .from('activites')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        categories (id, nom),
        types_activite (id, nom)
      `)
      .single()

    if (error) {
      console.error('Error updating activity:', error)
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
 * PATCH /api/app/activites/[id]
 * Met à jour le statut d'une activité (validation/rejet/correction)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le corps de la requête
    const body = await request.json()
    const { statut, motif_decision } = body

    if (!statut) {
      return NextResponse.json(
        { error: 'Le statut est obligatoire' },
        { status: 400 }
      )
    }

    // Statuts valides pour cette action
    const validStatuts = ['BROUILLON', 'SOUMIS', 'EN_VERIFICATION', 'VALIDE', 'REJETE', 'CORRECTION', 'CONSOLIDE']
    if (!validStatuts.includes(statut)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Construire les données de mise à jour
    const updateData: any = {
      statut,
      updated_at: new Date().toISOString(),
    }

    // Ajouter les infos de validation si changement de statut vers VALIDE/REJETE/CORRECTION
    if (['VALIDE', 'REJETE', 'CORRECTION'].includes(statut)) {
      updateData.valide_par = user.id
      updateData.date_validation = new Date().toISOString()
      
      if (motif_decision) {
        updateData.motif_decision = motif_decision
      }
    }

    // Si soumission, mettre à jour la date de soumission
    if (statut === 'SOUMIS') {
      updateData.date_soumission = new Date().toISOString()
    }

    // Mettre à jour l'activité
    const { data: activity, error } = await supabase
      .from('activites')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        categories (id, nom),
        organizations (id, nom)
      `)
      .single()

    if (error) {
      console.error('Error updating activity status:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Statut mis à jour: ${statut}`,
      activity,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
