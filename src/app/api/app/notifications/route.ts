import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/notifications - Liste des notifications
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Parser les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const filters = {
      tab: searchParams.get('tab') as 'toutes' | 'non_lues' | 'importantes' || undefined,
      type: searchParams.get('type') as any,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    const { getNotifications } = await import('@/lib/actions/notifications')
    const result = await getNotifications(user.id, filters)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur API notifications GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// PATCH /api/app/notifications - Actions en lot (marquer tout lu)
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const action = body.action

    if (action === 'mark-all-read') {
      const { markAllAsRead } = await import('@/lib/actions/notifications')
      const result = await markAllAsRead(user.id)

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }

      return NextResponse.json({ count: result.count })
    }

    return NextResponse.json({ error: 'Action non valide' }, { status: 400 })
  } catch (error) {
    console.error('Erreur API notifications PATCH:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
