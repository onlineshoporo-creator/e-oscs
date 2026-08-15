import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/notifications/unread-count - Compteur de notifications non lues
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ count: 0 }, { status: 200 })
    }

    const { getUnreadCount } = await import('@/lib/actions/notifications')
    const count = await getUnreadCount(user.id)

    return NextResponse.json({ count })
  } catch (error) {
    console.error('Erreur API unread count:', error)
    return NextResponse.json({ count: 0 }, { status: 200 })
  }
}
