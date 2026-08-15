import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/app/planification
 * Récupère les plans annuels de l'organisation
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

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
      return NextResponse.json({ plans: [] })
    }

    // Récupérer les plans annuels
    const { data: plans, error } = await supabase
      .from('annual_plans')
      .select('*')
      .eq('organization_id', profile.organization_id)
      .order('annee', { ascending: false })

    if (error) {
      console.error('Error fetching annual plans:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ plans: plans || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

/**
 * POST /api/app/planification
 * Crée un nouveau plan annuel
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

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
        { error: 'Aucune organisation associée à cet utilisateur' },
        { status: 400 }
      )
    }

    // Récupérer le corps de la requête
    const body = await request.json()
    const { annee, titre } = body

    if (!annee || !titre) {
      return NextResponse.json(
        { error: "Les champs 'annee' et 'titre' sont obligatoires" },
        { status: 400 }
      )
    }

    // Vérifier si un plan existe déjà pour cette année
    const { data: existing } = await supabase
      .from('annual_plans')
      .select('id')
      .eq('organization_id', profile.organization_id)
      .eq('annee', annee)
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Un plan existe déjà pour cette année' },
        { status: 409 }
      )
    }

    // Créer le plan
    const { data: plan, error } = await supabase
      .from('annual_plans')
      .insert({
        organization_id: profile.organization_id,
        annee,
        titre,
        statut: 'OUVERT',
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating annual plan:', error)
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
