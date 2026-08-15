import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAttachmentRecord } from '@/lib/actions/attachments'

// GET /api/app/attachments - Liste des attachments avec filtres
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'organisation de l'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    // Parser les paramètres de recherche
    const { searchParams } = new URL(request.url)
    const filters = {
      kind: (searchParams.get('kind') as 'PHOTO' | 'DOCUMENT' | 'ALL') || undefined,
      lien: searchParams.get('lien') as 'activites' | 'incidents' | 'aucun' | undefined,
      periode_debut: searchParams.get('periode_debut') || undefined,
      periode_fin: searchParams.get('periode_fin') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }

    // Importer et utiliser la fonction server action
    const { getAttachments } = await import('@/lib/actions/attachments')
    const result = await getAttachments(profile.organization_id, filters)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Erreur API attachments GET:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST /api/app/attachments - Créer un attachment (métadonnées)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'organisation de l'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', user.id)
      .single()

    if (!profile?.organization_id) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    const body = await request.json()

    // Validation des champs requis
    if (!body.nom_fichier || !body.mime || !body.storage_path) {
      return NextResponse.json(
        { error: 'Champs requis manquants: nom_fichier, mime, storage_path' },
        { status: 400 }
      )
    }

    const result = await createAttachmentRecord({
      organization_id: profile.organization_id,
      activity_id: body.activity_id || null,
      incident_id: body.incident_id || null,
      kind: body.kind || 'DOCUMENT',
      storage_path: body.storage_path,
      nom_fichier: body.nom_fichier,
      mime: body.mime,
      taille: body.taille || 0,
      legende: body.legende || null,
      date_prise: body.date_prise || null,
      lieu_prise: body.lieu_prise || null,
      description: body.description || null,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json(result.attachment, { status: 201 })
  } catch (error) {
    console.error('Erreur API attachments POST:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
