import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { IncidentGravite, IncidentStatut } from '@/types'

// GET /api/app/incidents - Liste des incidents avec filtres
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
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    // Parser les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut') as IncidentStatut | 'all' | null
    const gravite = searchParams.get('gravite') as IncidentGravite | 'all' | null
    const date_debut = searchParams.get('date_debut') || undefined
    const date_fin = searchParams.get('date_fin') || undefined
    const search = searchParams.get('search') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('incidents')
      .select(`
        *,
        incident_types (id, nom, description, code)
      `, { count: 'exact' })
      .eq('organization_id', profile.organization_id)
      .order('date', { ascending: false })

    if (statut && statut !== 'all') {
      query = query.eq('statut', statut)
    }

    if (gravite && gravite !== 'all') {
      query = query.eq('gravite', gravite)
    }

    if (date_debut) {
      query = query.gte('date', date_debut)
    }

    if (date_fin) {
      query = query.lte('date', date_fin)
    }

    if (search) {
      query = query.or(`lieu.ilike.%${search}%,nature.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Erreur GET incidents:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      incidents: data || [],
      count: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Erreur serveur GET incidents:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// POST /api/app/incidents - Créer un incident
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
    const requiredFields = ['date', 'lieu', 'region', 'nature', 'gravite']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Champ obligatoire manquant: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validation de la gravité
    const validGravites: IncidentGravite[] = ['FAIBLE', 'MOYENNE', 'ELEVEE', 'CRITIQUE']
    if (!validGravites.includes(body.gravite)) {
      return NextResponse.json(
        { error: 'Gravité invalide. Valeurs acceptées: FAIBLE, MOYENNE, ELEVEE, CRITIQUE' },
        { status: 400 }
      )
    }

    const { data: incident, error } = await supabase
      .from('incidents')
      .insert({
        organization_id: profile.organization_id,
        date: body.date,
        lieu: body.lieu,
        region: body.region,
        departement: body.departement,
        nature: body.nature,
        type_id: body.incident_type_id,
        gravite: body.gravite,
        victimes: body.victimes || 0,
        deces: body.deces || 0,
        actions_entreprises: body.actions_entreprises,
        acteurs: body.acteurs || [],
        statut: 'EN_COURS',
        created_by: user.id,
      })
      .select(`
        *,
        incident_types (id, nom, description, code)
      `)
      .single()

    if (error) {
      console.error('Erreur création incident:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, incident }, { status: 201 })
  } catch (error) {
    console.error('Erreur serveur POST incident:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
