import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric')

    // If specific metric requested
    if (metric === 'pending_requests') {
      const { count, error } = await supabaseAdmin
        .from('subscription_requests')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'NOUVELLE')

      if (error) throw error
      return NextResponse.json({ count: count || 0 })
    }

    // Get all dashboard stats
    const [
      orgsResult,
      pendingResult,
      activeSubsResult,
      revenueResult
    ] = await Promise.all([
      // Total organizations
      supabaseAdmin
        .from('organizations')
        .select('*', { count: 'exact', head: true }),
      
      // Pending requests
      supabaseAdmin
        .from('subscription_requests')
        .select('*', { count: 'exact', head: true })
        .in('statut', ['NOUVELLE', 'EN_CONTACT']),
      
      // Active subscriptions
      supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('statut', 'ACTIF'),
      
      // Monthly revenue from active subscriptions
      supabaseAdmin
        .from('subscriptions')
        .select('montant')
        .eq('statut', 'ACTIF')
    ])

    if (orgsResult.error) throw orgsResult.error
    if (pendingResult.error) throw pendingResult.error
    if (activeSubsResult.error) throw activeSubsResult.error

    // Calculate monthly revenue
    let monthlyRevenue = 0
    if (!revenueResult.error && revenueResult.data) {
      monthlyRevenue = revenueResult.data.reduce((sum, sub) => sum + (sub.montant || 0), 0)
    }

    // Get last month's data for trend calculation
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [newOrgsLastMonth] = await Promise.all([
      supabaseAdmin
        .from('organizations')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString())
    ])

    return NextResponse.json({
      totalOrganizations: orgsResult.count || 0,
      pendingRequests: pendingResult.count || 0,
      activeSubscriptions: activeSubsResult.count || 0,
      monthlyRevenue,
      newOrganizationsLastMonth: newOrgsLastMonth?.count || 0,
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
