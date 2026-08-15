import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/app/incidents/[id]/close - Clôturer un incident
export async function PATCH(
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

    // Ne peut clôturer que si en cours
    if (existing.statut === 'CLOTURE') {
      return NextResponse.json({ 
        error: 'Cet incident est déjà clôturé' 
      }, { status: 400 })
    }

    const { data: incident, error } = await supabase
      .from('incidents')
      .update({
        statut: 'CLOTURE',
        cloture_le: new Date().toISOString(),
        cloture_par: user.id,
        motif_cloture: body.motif || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        incident_types (id, nom, description, code)
      `)
      .single()

    if (error) {
      console.error('Erreur clôture incident:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, incident })
  } catch (error) {
    console.error('Erreur serveur PATCH close incident:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
