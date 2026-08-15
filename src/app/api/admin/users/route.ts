import { NextRequest, NextResponse } from 'next/server'
import { 
  getUsers, 
  getUserStats, 
  inviteUser,
  getOrganizationsForUsers 
} from '@/lib/actions/admin-users'

/**
 * GET /api/admin/users
 * Liste des utilisateurs avec filtres
 * Query params: role, organization_id, actif, search, page, limit, stats (boolean)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Si stats=true, retourner uniquement les statistiques
    if (searchParams.get('stats') === 'true') {
      const stats = await getUserStats()
      return NextResponse.json(stats)
    }

    const filters = {
      role: searchParams.get('role') as any || undefined,
      organization_id: searchParams.get('organization_id') || undefined,
      actif: searchParams.get('actif') === 'true' ? true : 
              searchParams.get('actif') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }

    const result = await getUsers(filters)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur GET /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/users
 * Inviter un nouvel utilisateur
 * Body: { email, nom_complet, organization_id?, role, message_accueil? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const result = await inviteUser({
      email: body.email,
      nom_complet: body.nom_complet,
      organization_id: body.organization_id,
      role: body.role || 'AGENT',
      message_accueil: body.message_accueil,
      invitedBy: body.invitedBy || 'admin'
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.user, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'invitation de l\'utilisateur' },
      { status: 500 }
    )
  }
}
