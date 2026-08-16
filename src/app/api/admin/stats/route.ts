import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * API Stats Admin e-OSCS
 * 
 * Retourne les statistiques du tableau de bord admin.
 * Utilise Prisma/SQLite (base locale) au lieu de Supabase.
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')

    // If specific metric requested
    if (metric === 'pending_requests') {
      const count = await db.demandeAcces.count({
        where: { statut: 'NOUVELLE' }
      })
      return NextResponse.json({ count })
    }

    // Get all dashboard stats from local database
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      totalUsers,
      pendingRequests,
      activeUsers,
      totalActivites,
      recentUsers
    ] = await Promise.all([
      // Total utilisateurs
      db.user.count(),
      
      // Demandes d'accès en attente
      db.demandeAcces.count({
        where: { statut: 'NOUVELLE' }
      }),
      
      // Utilisateurs actifs
      db.user.count({
        where: { isActive: true }
      }),
      
      // Total activités
      db.activite.count(),
      
      // Nouveaux utilisateurs (30 derniers jours)
      db.user.count({
        where: {
          createdAt: { gte: thirtyDaysAgo }
        }
      })
    ])

    return NextResponse.json({
      totalOrganizations: totalUsers,
      pendingRequests,
      activeSubscriptions: activeUsers,
      monthlyRevenue: 0, // Pas encore implémenté
      newOrganizationsLastMonth: recentUsers,
      totalActivites,
      revenueTrend: 'up' as const,
      organizationsTrend: 'up' as const,
    })

  } catch (error) {
    console.error('Erreur stats admin:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    )
  }
}
