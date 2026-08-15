import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/periods/[annee]/[trimestre]/bilan - Bilan trimestriel
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ annee: string; trimestre: string }> }
) {
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

    const { annee, trimestre } = await params

    const { getTrimestrialReport } = await import('@/lib/actions/periods')
    const bilan = await getTrimestrialReport(
      profile.organization_id,
      parseInt(annee),
      parseInt(trimestre)
    )

    if (!bilan) {
      return NextResponse.json({ error: 'Bilan non disponible' }, { status: 404 })
    }

    return NextResponse.json(bilan)
  } catch (error) {
    console.error('Erreur API bilan GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
