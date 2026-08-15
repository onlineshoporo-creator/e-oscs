import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/app/indicators/values - Saisie de valeurs en lot
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    
    // Validation
    if (!body.activity_id || !body.values || !Array.isArray(body.values)) {
      return NextResponse.json(
        { error: 'Données invalides: activity_id et values[] requis' },
        { status: 400 }
      )
    }

    if (body.values.length === 0) {
      return NextResponse.json(
        { error: 'Aucune valeur à sauvegarder' },
        { status: 400 }
      )
    }

    // Préparer les données d'insertion
    const valuesToInsert = body.values.map((v: any) => ({
      activity_id: body.activity_id,
      indicator_id: v.indicator_id,
      valeur_numerique: v.valeur_numerique ?? null,
      valeur_texte: v.valeur_texte ?? null,
      created_by: user.id,
    }))

    // Upsert pour gérer les mises à jour
    const { data, error } = await supabase
      .from('indicator_values')
      .upsert(valuesToInsert, {
        onConflict: 'activity_id,indicator_id',
        ignoreDuplicates: false,
      })
      .select(`
        *,
        activites (id, titre),
        indicators (id, nom, code, kind, unite)
      `)

    if (error) {
      console.error('Erreur saisie valeurs indicateurs:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      values: data || [],
      count: data?.length || 0,
    }, { status: 201 })
  } catch (error) {
    console.error('Erreur serveur POST indicators/values:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
