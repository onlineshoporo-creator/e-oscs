import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string; actorId: string }>
}

/**
 * DELETE /api/app/activites/[id]/actors/[actorId]
 * Supprime un acteur d'une activité
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const supabase = await createClient()
    const { actorId } = await params

    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Vérifier que l'acteur existe
    const { data: existing } = await supabase
      .from('activity_actors')
      .select('id')
      .eq('id', actorId)
      .maybeSingle()

    if (!existing) {
      return NextResponse.json({ error: 'Acteur non trouvé' }, { status: 404 })
    }

    // Supprimer l'acteur
    const { error } = await supabase
      .from('activity_actors')
      .delete()
      .eq('id', actorId)

    if (error) {
      console.error('Error deleting actor:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Acteur supprimé avec succès',
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
