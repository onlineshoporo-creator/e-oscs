import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { IncidentGravite } from '@/types'

// GET /api/app/incidents/[id] - Détail d'un incident
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    const { data: incident, error } = await supabase
      .from('incidents')
      .select(`
        *,
        incident_types (id, nom, description, code)
      `)
      .eq('id', id)
      .single()

    if (error || !incident) {
      return NextResponse.json({ error: 'Incident non trouvé' }, { status: 404 })
    }

    // Vérifier que l'utilisateur a accès à cet incident
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profile?.organization_id !== incident.organization_id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    return NextResponse.json({ incident })
  } catch (error) {
    console.error('Erreur serveur GET incident detail:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// PUT /api/app/incidents/[id] - Mettre à jour un incident
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Vérifier que l'incident existe et appartient à l'org
    const { data: existing } = await supabase
      .from('incidents')
      .select('*, organization_id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Incident non trouvé' }, { status: 404 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profile?.organization_id !== existing.organization_id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    // Ne peut modifier que si en cours
    if (existing.statut === 'CLOTURE') {
      return NextResponse.json({ 
        error: 'Impossible de modifier un incident clôturé' 
      }, { status: 400 })
    }

    // Préparer les données de mise à jour
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    const allowedFields = [
      'date', 'lieu', 'region', 'departement', 'nature',
      'type_id', 'gravite', 'victimes', 'deces',
      'actions_entreprises', 'acteurs'
    ]

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    // Validation gravité si fournie
    if (body.gravite) {
      const validGravites: IncidentGravite[] = ['FAIBLE', 'MOYENNE', 'ELEVEE', 'CRITIQUE']
      if (!validGravites.includes(body.gravite)) {
        return NextResponse.json({ error: 'Gravité invalide' }, { status: 400 })
      }
    }

    const { data: incident, error } = await supabase
      .from('incidents')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        incident_types (id, nom, description, code)
      `)
      .single()

    if (error) {
      console.error('Erreur mise à jour incident:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, incident })
  } catch (error) {
    console.error('Erreur serveur PUT incident:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
