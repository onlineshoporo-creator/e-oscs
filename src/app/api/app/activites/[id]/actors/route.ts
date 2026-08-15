import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * GET /api/app/activites/[id]/actors
 * Récupère les acteurs d'une activité
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

    // Récupérer les acteurs
    const { data: actors, error } = await supabase
      .from('activity_actors')
      .select('*')
      .eq('activity_id', id)
      .order('type_acteur', { ascending: true })

    if (error) {
      console.error('Error fetching actors:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ actors: actors || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

/**
 * POST /api/app/activites/[id]/actors
 * Ajoute un acteur à une activité
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
    const { acteur, type_acteur, role } = body

    if (!acteur || !type_acteur) {
      return NextResponse.json(
        { error: "Les champs 'acteur' et 'type_acteur' sont obligatoires" },
        { status: 400 }
      )
    }

    if (!['INTERNE', 'PARTENAIRE'].includes(type_acteur)) {
      return NextResponse.json(
        { error: "Le type_acteur doit être 'INTERNE' ou 'PARTENAIRE'" },
        { status: 400 }
      )
    }

    // Créer l'acteur
    const { data: actor, error } = await supabase
      .from('activity_actors')
      .insert({
        activity_id: id,
        acteur,
        type_acteur,
        role: role || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding actor:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      actor,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
