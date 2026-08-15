import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/periods - Liste des périodes d'une organisation
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

    // Parser les paramètres
    const { searchParams } = new URL(request.url)
    const annee = searchParams.get('annee') ? parseInt(searchParams.get('annee')!) : undefined

    // Importer les fonctions server actions
    const { getPeriods, getOrCreatePeriodsForYear, getCurrentTrimestre } = await import('@/lib/actions/periods')

    // Si une année est spécifiée, s'assurer que les périodes existent
    let periods
    if (annee) {
      periods = await getOrCreatePeriodsForYear(profile.organization_id, annee)
    } else {
      periods = await getPeriods(profile.organization_id)
    }

    // Ajouter le trimestre courant pour le frontend
    const currentTrimestre = getCurrentTrimestre()

    return NextResponse.json({
      periods,
      currentTrimestre,
    })
  } catch (error) {
    console.error('Erreur API periods GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
