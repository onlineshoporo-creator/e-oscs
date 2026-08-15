import { NextRequest, NextResponse } from 'next/server'
import { 
  getCodeDetail, 
  revokeCode, 
  sendCodeEmail 
} from '@/lib/actions/admin-codes'

/**
 * GET /api/admin/codes/[code]
 * Détails d'un code d'activation
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const codeDetail = await getCodeDetail(code)

    if (!codeDetail) {
      return NextResponse.json(
        { error: 'Code non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(codeDetail)
  } catch (error) {
    console.error('Erreur GET /api/admin/codes/[code]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du code' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/codes/[code]/revoke
 * Révoquer un code d'activation
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()

    if (body.action === 'revoke') {
      const result = await revokeCode(code)
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erreur PATCH /api/admin/codes/[code]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du code' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/codes/[code]/send-email
 * Renvoyer l'email avec le code
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()

    if (body.action === 'send-email') {
      const result = await sendCodeEmail(code)

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 400 }
        )
      }

      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Action non reconnue' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Erreur POST /api/admin/codes/[code]:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi de l\'email' },
      { status: 500 }
    )
  }
}
