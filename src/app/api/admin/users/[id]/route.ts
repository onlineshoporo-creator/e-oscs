import { NextRequest, NextResponse } from 'next/server'
import { 
  getUserDetail, 
  updateUser, 
  toggleUserStatus,
  resetUserPassword,
  deleteUser
} from '@/lib/actions/admin-users'

/**
 * GET /api/admin/users/[id]
 * Détails d'un utilisateur
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const user = await getUserDetail(id)

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Erreur GET /api/admin/users/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'utilisateur' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Mise à jour d'un utilisateur
 * Body: { nom_complet?, telephone?, organization_id?, role?, actif? }
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Actions spéciales via le champ action
    if (body.action === 'toggle-status') {
      const result = await toggleUserStatus(id)
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true, actif: result.actif })
    }

    if (body.action === 'reset-password') {
      const result = await resetUserPassword(id)

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true, message: 'Email de réinitialisation envoyé' })
    }

    // Mise à jour standard des champs
    const result = await updateUser(id, {
      nom_complet: body.nom_complet,
      telephone: body.telephone,
      organization_id: body.organization_id,
      role: body.role,
      actif: body.actif
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.user)
  } catch (error) {
    console.error('Erreur PATCH /api/admin/users/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'utilisateur' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Suppression (soft delete) d'un utilisateur
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const result = await deleteUser(id)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur DELETE /api/admin/users/[id]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'utilisateur' },
      { status: 500 }
    )
  }
}
