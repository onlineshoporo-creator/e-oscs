import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// PATCH /api/admin/organisations/[id]/toggle-status - Toggle organization active status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get current status
    const { data: org, error: fetchError } = await supabaseAdmin
      .from('organizations')
      .select('actif, nom')
      .eq('id', id)
      .single()

    if (fetchError || !org) {
      return NextResponse.json(
        { error: 'Organisation non trouvée' },
        { status: 404 }
      )
    }

    // Toggle status
    const newStatus = !org.actif

    const { data, error: updateError } = await supabaseAdmin
      .from('organizations')
      .update({ 
        actif: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    // If deactivating, also suspend active subscriptions
    if (!newStatus) {
      await supabaseAdmin
        .from('subscriptions')
        .update({ statut: 'SUSPENDU' })
        .eq('organization_id', id)
        .eq('statut', 'ACTIF')
    }

    return NextResponse.json({
      success: true,
      message: `Organisation ${newStatus ? 'réactivée' : 'suspendue'} avec succès`,
      data
    })

  } catch (error) {
    console.error('Erreur toggle statut organisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification du statut' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/organisations/[id] - Delete an organization
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if organization exists
    const { data: org, error: fetchError } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !org) {
      return NextResponse.json(
        { error: 'Organisation non trouvée' },
        { status: 404 }
      )
    }

    // Delete related subscriptions first
    await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('organization_id', id)

    // Delete the organization
    const { error: deleteError } = await supabaseAdmin
      .from('organizations')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({
      success: true,
      message: 'Organisation supprimée avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression organisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'organisation' },
      { status: 500 }
    )
  }
}
