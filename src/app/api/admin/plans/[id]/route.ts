import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// PATCH /api/admin/plans/[id] - Update a plan
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { nom, code, prix_mensuel, max_users, storage_gb, features, actif } = body

    // Check if plan exists
    const { data: existingPlan, error: fetchError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingPlan) {
      return NextResponse.json(
        { error: 'Plan non trouvé' },
        { status: 404 }
      )
    }

    // If code is being changed, check for uniqueness
    if (code && code !== existingPlan.code) {
      const { data: codeExists } = await supabaseAdmin
        .from('subscription_plans')
        .select('id')
        .eq('code', code.toUpperCase())
        .neq('id', id)
        .single()

      if (codeExists) {
        return NextResponse.json(
          { error: 'Un plan avec ce code existe déjà' },
          { status: 409 }
        )
      }
    }

    // Build update object - only include provided fields
    const updateData: Record<string, unknown> = {}
    if (nom !== undefined) updateData.nom = nom
    if (code !== undefined) updateData.code = code.toUpperCase()
    if (prix_mensuel !== undefined) updateData.prix_mensuel = prix_mensuel
    if (max_users !== undefined) updateData.max_users = max_users || null
    if (storage_gb !== undefined) updateData.storage_gb = storage_gb
    if (features !== undefined) updateData.features = features
    if (actif !== undefined) updateData.actif = actif

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString()

    // Update the plan
    const { data, error: updateError } = await supabaseAdmin
      .from('subscription_plans')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: 'Plan mis à jour avec succès',
      data
    })

  } catch (error) {
    console.error('Erreur mise à jour plan:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du plan' },
      { status: 500 }
    )
  }
}

// POST /api/admin/plans/[id]/toggle - Toggle plan active status
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current status
    const { data: plan, error: fetchError } = await supabaseAdmin
      .from('subscription_plans')
      .select('actif, nom')
      .eq('id', id)
      .single()

    if (fetchError || !plan) {
      return NextResponse.json(
        { error: 'Plan non trouvé' },
        { status: 404 }
      )
    }

    // Toggle status
    const newStatus = !plan.actif

    const { data, error: updateError } = await supabaseAdmin
      .from('subscription_plans')
      .update({ 
        actif: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: `Plan ${newStatus ? 'activé' : 'désactivé'} avec succès`,
      data
    })

  } catch (error) {
    console.error('Erreur toggle statut plan:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification du statut' },
      { status: 500 }
    )
  }
}
