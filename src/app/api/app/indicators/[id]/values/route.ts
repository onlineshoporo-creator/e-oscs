import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/app/indicators/[id]/values - Historique des valeurs d'un indicateur
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
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')

    // Vérifier que l'indicateur existe
    const { data: indicator } = await supabase
      .from('indicators')
      .select('id')
      .eq('id', id)
      .single()

    if (!indicator) {
      return NextResponse.json({ error: 'Indicateur non trouvé' }, { status: 404 })
    }

    // Récupérer les valeurs historiques
    const { data: values, error } = await supabase
      .from('indicator_values')
      .select(`
        *,
        activites (id, titre, date_debut, date_fin, statut)
      `)
      .eq('indicator_id', id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Erreur historique valeurs indicateur:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculer des statistiques simples
    const numericValues = (values || [])
      .filter(v => v.valeur_numerique !== null && v.valeur_numerique !== undefined)
      .map(v => v.valeur_numerique!)

    let stats = null
    if (numericValues.length > 0) {
      stats = {
        moyenne: numericValues.reduce((a, b) => a + b, 0) / numericValues.length,
        min: Math.min(...numericValues),
        max: Math.max(...numericValues),
        count: numericValues.length,
        derniere_valeur: numericValues[0],
      }
    }

    return NextResponse.json({
      values: values || [],
      stats,
      count: values?.length || 0,
    })
  } catch (error) {
    console.error('Erreur serveur GET indicator values:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
