import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statut = searchParams.get('statut')
    const region = searchParams.get('region')
    const search = searchParams.get('search')

    // Build query
    let query = supabaseAdmin
      .from('subscription_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    // Apply filters
    if (statut) {
      query = query.eq('statut', statut)
    }
    if (region) {
      query = query.ilike('region', `%${region}%`)
    }
    if (search) {
      query = query.or(`nom_complet.ilike.%${search}%,email.ilike.%${search}%,nom_organisation.ilike.%${search}%`)
    }

    // Get total count first
    const { count, error: countError } = await query

    if (countError) throw countError

    // Apply pagination
    const from = (page - 1) * limit
    const to = from + limit - 1

    let paginatedQuery = supabaseAdmin
      .from('subscription_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)

    // Re-apply filters for paginated query
    if (statut) {
      paginatedQuery = paginatedQuery.eq('statut', statut)
    }
    if (region) {
      paginatedQuery = paginatedQuery.ilike('region', `%${region}%`)
    }
    if (search) {
      paginatedQuery = paginatedQuery.or(`nom_complet.ilike.%${search}%,email.ilike.%${search}%,nom_organisation.ilike.%${search}%`)
    }

    const { data, error } = await paginatedQuery

    if (error) throw error

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    })

  } catch (error) {
    console.error('Erreur récupération demandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { nom_complet, email, telephone, nom_organisation, type_org, region, departement, message } = body

    // Validation
    if (!nom_complet || !email || !telephone || !nom_organisation || !type_org || !region) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants' },
        { status: 400 }
      )
    }

    // Create subscription request
    const { data, error } = await supabaseAdmin
      .from('subscription_requests')
      .insert({
        nom_complet,
        email,
        telephone,
        nom_organisation,
        type_org,
        region,
        departement: departement || null,
        message: message || null,
        statut: 'NOUVELLE'
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('Erreur création demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande' },
      { status: 500 }
    )
  }
}
