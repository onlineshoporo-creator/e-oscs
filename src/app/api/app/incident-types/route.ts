import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/incident-types - Liste des types d'incidents (référentiel)
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('incident_types')
      .select('*')
      .order('nom')

    if (error) {
      console.error('Erreur récupération types incidents:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ types: data || [] })
  } catch (error) {
    console.error('Erreur serveur GET incident types:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
