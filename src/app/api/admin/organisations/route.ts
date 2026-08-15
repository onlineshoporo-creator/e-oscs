import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')
    const type_org = searchParams.get('type_org')
    const region = searchParams.get('region')
    const actif = searchParams.get('actif')

    // Build query
    let query = supabaseAdmin
      .from('organizations')
      .select('*', { count: 'exact' })
      .order('nom', { ascending: true })

    // Apply filters
    if (search) {
      query = query.or(`nom.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (type_org) {
      query = query.eq('type_org', type_org)
    }
    if (region) {
      query = query.ilike('region', `%${region}%`)
    }
    if (actif !== null && actif !== undefined && actif !== '') {
      query = query.eq('actif', actif === 'true')
    }

    // Get total count
    const { count, error: countError } = await query

    if (countError) throw countError

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    let paginatedQuery = supabaseAdmin
      .from('organizations')
      .select('*')
      .order('nom', { ascending: true })
      .range(from, to)

    // Re-apply filters for paginated query
    if (search) {
      paginatedQuery = paginatedQuery.or(`nom.ilike.%${search}%,email.ilike.%${search}%`)
    }
    if (type_org) {
      paginatedQuery = paginatedQuery.eq('type_org', type_org)
    }
    if (region) {
      paginatedQuery = paginatedQuery.ilike('region', `%${region}%`)
    }
    if (actif !== null && actif !== undefined && actif !== '') {
      paginatedQuery = paginatedQuery.eq('actif', actif === 'true')
    }

    const { data, error } = await paginatedQuery

    if (error) throw error

    // Enrich data with subscription info and member counts
    const enrichedData = await Promise.all((data || []).map(async (org) => {
      // Get active subscription
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select(`
          *,
          plan:subscription_plans(nom)
        `)
        .eq('organization_id', org.id)
        .eq('statut', 'ACTIF')
        .order('date_fin', { ascending: false })
        .limit(1)
        .maybeSingle()

      // Get member count (from profiles table)
      const { count: membersCount } = await supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('organization_id', org.id)

      return {
        ...org,
        members_count: membersCount || 0,
        subscription: subscription ? {
          statut: subscription.statut,
          plan_nom: subscription.plan?.nom || 'Inconnu',
          date_fin: subscription.date_fin
        } : null
      }
    }))

    return NextResponse.json({
      data: enrichedData,
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })

  } catch (error) {
    console.error('Erreur récupération organisations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des organisations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { nom, type_org, region, departement, telephone, email } = body

    // Validation
    if (!nom || !type_org || !region) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: nom, type_org, region' },
        { status: 400 }
      )
    }

    // Validate type_org
    if (!['DR', 'DD'].includes(type_org)) {
      return NextResponse.json(
        { error: 'type_org doit être DR ou DD' },
        { status: 400 }
      )
    }

    // Create organization
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .insert({
        nom,
        type_org,
        region,
        departement: departement || null,
        telephone: telephone || null,
        email: email || null,
        actif: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('Erreur création organisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'organisation' },
      { status: 500 }
    )
  }
}
