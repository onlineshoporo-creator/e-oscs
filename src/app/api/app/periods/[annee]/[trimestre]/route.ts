import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/periods/[annee]/[trimestre] - Détail d'une période avec stats
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

    const { getPeriodDetail } = await import('@/lib/actions/periods')
    const detail = await getPeriodDetail(
      profile.organization_id,
      parseInt(annee),
      parseInt(trimestre)
    )

    if (!detail) {
      return NextResponse.json({ error: 'Période non trouvée' }, { status: 404 })
    }

    return NextResponse.json(detail)
  } catch (error) {
    console.error('Erreur API period detail GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PATCH /api/app/periods/[annee]/[trimestre] - Clôturer ou rouvrir une période
export async function PATCH(
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
    const body = await request.json()
    const action = body.action // 'close' or 'reopen'

    if (action === 'close') {
      const { closePeriod } = await import('@/lib/actions/periods')
      const result = await closePeriod(
        profile.organization_id,
        parseInt(annee),
        parseInt(trimestre),
        user.id,
        body.motif
      )

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json(result.periode)
    }

    if (action === 'reopen') {
      const { reopenPeriod } = await import('@/lib/actions/periods')
      const result = await reopenPeriod(
        profile.organization_id,
        parseInt(annee),
        parseInt(trimestre),
        body.motif,
        user.id
      )

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json(result.periode)
    }

    return NextResponse.json({ error: 'Action non valide. Utilisez "close" ou "reopen"' }, { status: 400 })
  } catch (error) {
    console.error('Erreur API period PATCH:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
