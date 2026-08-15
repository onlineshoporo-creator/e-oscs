import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/app/activites/[id]/beneficiaries
 * Récupère les bénéficiaires d'une activité
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

    // Récupérer les bénéficiaires
    const { data: beneficiaries, error } = await supabase
      .from('beneficiaries')
      .select('*')
      .eq('activity_id', id)
      .maybeSingle()

    if (error) {
      console.error('Error fetching beneficiaries:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ beneficiaries: beneficiaries || null })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

/**
 * POST /api/app/activites/[id]/beneficiaries
 * Crée ou met à jour les bénéficiaires d'une activité
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const { hommes, femmes, enfants, adultes, personnes_agees, vulnerables, total } = body

    // Vérifier si des bénéficiaires existent déjà
    const { data: existing } = await supabase
      .from('beneficiaries')
      .select('id')
      .eq('activity_id', id)
      .maybeSingle()

    let result

    if (existing) {
      // Mettre à jour
      const { data, error } = await supabase
        .from('beneficiaries')
        .update({
          hommes: hommes || 0,
          femmes: femmes || 0,
          enfants: enfants || 0,
          adultes: adultes || 0,
          personnes_agees: personnes_agees || 0,
          vulnerables: vulnerables || 0,
          total: total || (hommes || 0) + (femmes || 0),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating beneficiaries:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    } else {
      // Créer
      const { data, error } = await supabase
        .from('beneficiaries')
        .insert({
          activity_id: id,
          hommes: hommes || 0,
          femmes: femmes || 0,
          enfants: enfants || 0,
          adultes: adultes || 0,
          personnes_agees: personnes_agees || 0,
          vulnerables: vulnerables || 0,
          total: total || (hommes || 0) + (femmes || 0),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating beneficiaries:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      result = data
    }

    return NextResponse.json({
      success: true,
      beneficiaries: result,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

/**
 * PUT /api/app/activites/[id]/beneficiaries
 * Met à jour les bénéficiaires d'une activité
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

    // Vérifier que les bénéficiaires existent
    const { data: existing } = await supabase
      .from('beneficiaries')
      .select('id')
      .eq('activity_id', id)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json(
        { error: 'Bénéficiaires non trouvés. Utilisez POST pour créer.' },
        { status: 404 }
      )
    }

    // Mettre à jour
    const { data, error } = await supabase
      .from('beneficiaries')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating beneficiaries:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      beneficiaries: data,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
