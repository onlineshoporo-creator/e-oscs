import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/indicators/[id] - Détail d'un indicateur avec valeurs
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    // Récupérer l'indicateur
    const { data: indicator, error: indicatorError } = await supabase
      .from('indicators')
      .select('*')
      .eq('id', id)
      .single()

    if (indicatorError || !indicator) {
      return NextResponse.json({ error: 'Indicateur non trouvé' }, { status: 404 })
    }

    // Récupérer les valeurs associées
    const { data: values, error: valuesError } = await supabase
      .from('indicator_values')
      .select(`
        *,
        activites (id, titre, statut)
      `)
      .eq('indicator_id', id)
      .order('created_at', { ascending: false })
      .limit(100)

    if (valuesError) {
      console.error('Erreur récupération valeurs:', valuesError)
    }

    return NextResponse.json({
      indicator,
      values: values || [],
    })
  } catch (error) {
    console.error('Erreur serveur GET indicateur detail:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

// DELETE /api/app/indicators/[id] - Supprimer un indicateur personnalisé
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params

    // Vérifier que l'indicateur existe et appartient à l'org
    const { data: indicator } = await supabase
      .from('indicators')
      .select('*, organization_id')
      .eq('id', id)
      .single()

    if (!indicator) {
      return NextResponse.json({ error: 'Indicateur non trouvé' }, { status: 404 })
    }

    // Seuls les indicateurs personnels peuvent être supprimés
    if (!indicator.organization_id) {
      return NextResponse.json(
        { error: 'Les indicateurs globaux ne peuvent pas être supprimés' },
        { status: 403 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (profile?.organization_id !== indicator.organization_id) {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 })
    }

    // Supprimer les valeurs d'abord
    await supabase
      .from('indicator_values')
      .delete()
      .eq('indicator_id', id)

    // Puis supprimer l'indicateur
    const { error } = await supabase
      .from('indicators')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur suppression indicateur:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur serveur DELETE indicateur:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
