import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// GET /api/admin/plans - Get all plans with subscriber counts
export async function GET() {
  try {
    // Get all plans
    const { data: plans, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .order('ordre', { ascending: true })

    if (error) throw error

    // Get subscriber count for each plan
    const enrichedPlans = await Promise.all((plans || []).map(async (plan) => {
      const { count } = await supabaseAdmin
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('plan_id', plan.id)
        .in('statut', ['ACTIF', 'EN_TRAITEMENT'])

      return {
        ...plan,
        subscribers_count: count || 0
      }
    }))

    return NextResponse.json({
      plans: enrichedPlans
    })

  } catch (error) {
    console.error('Erreur récupération plans:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des plans' },
      { status: 500 }
    )
  }
}

// POST /api/admin/plans - Create a new plan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { code, nom, prix_mensuel, max_users, storage_gb, features, ordre } = body

    // Validation
    if (!code || !nom || prix_mensuel === undefined) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: code, nom, prix_mensuel' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const { data: existingPlan } = await supabaseAdmin
      .from('subscription_plans')
      .select('id')
      .eq('code', code.toUpperCase())
      .single()

    if (existingPlan) {
      return NextResponse.json(
        { error: 'Un plan avec ce code existe déjà' },
        { status: 409 }
      )
    }

    // Create plan
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .insert({
        code: code.toUpperCase(),
        nom,
        prix_mensuel,
        max_users: max_users || null,
        storage_gb: storage_gb || 5,
        features: features || {},
        ordre: ordre || 0,
        actif: true
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })

  } catch (error) {
    console.error('Erreur création plan:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du plan' },
      { status: 500 }
    )
  }
}
