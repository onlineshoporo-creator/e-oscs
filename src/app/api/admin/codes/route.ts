import { NextRequest, NextResponse } from 'next/server'
import { 
  getActivationCodes, 
  getCodeStats, 
  generateCode,
  getPlansForCodes 
} from '@/lib/actions/admin-codes'

/**
 * GET /api/admin/codes
 * Liste des codes d'activation avec filtres
 * Query params: statut, search, page, limit, stats (boolean)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Si stats=true, retourner uniquement les statistiques
    if (searchParams.get('stats') === 'true') {
      const stats = await getCodeStats()
      return NextResponse.json(stats)
    }

    const filters = {
      statut: searchParams.get('statut') as any || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    }

    const result = await getActivationCodes(filters)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur GET /api/admin/codes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des codes' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/codes
 * Générer un nouveau code d'activation
 * Body: { email_proprietaire, plan_id?, duree_mois, expire_le? }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const result = await generateCode({
      email_proprietaire: body.email_proprietaire,
      plan_id: body.plan_id,
      duree_mois: body.duree_mois || 12,
      expire_le: body.expire_le,
      cree_par: body.cree_par || 'admin'
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(result.code, { status: 201 })
  } catch (error) {
    console.error('Erreur POST /api/admin/codes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du code' },
      { status: 500 }
    )
  }
}
