import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { IndicatorKind } from '@/types'

// GET /api/app/indicators - Liste des indicateurs
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const axe = searchParams.get('axe') || undefined
    const kind = searchParams.get('kind') as IndicatorKind | 'all' | null
    const search = searchParams.get('search') || undefined
    const global_only = searchParams.get('global_only') === 'true'

    let query = supabase
      .from('indicators')
      .select('*', { count: 'exact' })
      .order('nom')

    if (axe && axe !== 'all') {
      query = query.eq('axe', axe)
    }

    if (kind && kind !== 'all') {
      query = query.eq('kind', kind)
    }

    if (global_only) {
      query = query.is('organization_id', null)
    }

    if (search) {
      query = query.or(`nom.ilike.%${search}%,code.ilike.%${search}%`)
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Erreur GET indicateurs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      indicators: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Erreur serveur GET indicateurs:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/app/indicators - Créer un indicateur personnalisé
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'organisation
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    const body = await request.json()
    
    // Validation des champs obligatoires
    if (!body.code || !body.nom || !body.kind) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: code, nom, kind' },
        { status: 400 }
      )
    }

    // Validation du type
    const validKinds: IndicatorKind[] = ['QUANTITATIF', 'QUALITATIF']
    if (!validKinds.includes(body.kind)) {
      return NextResponse.json(
        { error: 'Type invalide. Valeurs acceptées: QUANTITATIF, QUALITATIF' },
        { status: 400 }
      )
    }

    // Vérifier que le code n'existe pas déjà pour cette org
    const { data: existing } = await supabase
      .from('indicators')
      .select('id')
      .eq('code', body.code.toUpperCase())
      .eq('organization_id', profile.organization_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Un indicateur avec ce code existe déjà' },
        { status: 409 }
      )
    }

    const { data: indicator, error } = await supabase
      .from('indicators')
      .insert({
        code: body.code.toUpperCase(),
        nom: body.nom,
        description: body.description,
        kind: body.kind,
        unite: body.unite,
        objectif: body.objectif,
        axe: body.axe,
        category_id: body.category_id,
        organization_id: profile.organization_id,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur création indicateur:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, indicator }, { status: 201 })
  } catch (error) {
    console.error('Erreur serveur POST indicateur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
