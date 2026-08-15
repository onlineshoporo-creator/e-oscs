import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/app/activites
 * Récupère la liste des activités avec filtres optionnels
 * 
 * Query params:
 * - statut: Filtrer par statut (BROUILLON, SOUMIS, EN_VERIFICATION, VALIDE, REJETE, CORRECTION)
 * - categorie_id: Filtrer par catégorie
 * - search: Recherche dans titre/description
 * - page: Numéro de page (défaut: 1)
 * - limit: Nombre par page (défaut: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer les paramètres de requête
    const { searchParams } = new URL(request.url)
    const statut = searchParams.get('statut')
    const categorieId = searchParams.get('categorie_id')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Construire la requête
    let query = supabase
      .from('activites')
      .select(`
        *,
        categories (id, nom),
        types_activite (id, nom),
        organizations (id, nom)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Appliquer les filtres
    if (statut && statut !== 'all') {
      query = query.eq('statut', statut)
    }

    if (categorieId && categorieId !== 'all') {
      query = query.eq('categorie_id', categorieId)
    }

    if (search) {
      query = query.or(`titre.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Pagination
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching activities:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      activities: data || [],
      count: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}

/**
 * POST /api/app/activites
 * Crée une nouvelle activité
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer le corps de la requête
    const body = await request.json()
    const {
      titre,
      description,
      categorie_id,
      type_activite_id,
      date_debut,
      date_fin,
      lieu,
      budget_alloue,
      beneficiaires_hommes = 0,
      beneficiaires_femmes = 0,
      beneficiaires_jeunes = 0,
      organization_id,
    } = body

    // Validation des champs obligatoires
    if (!titre || !categorie_id || !type_activite_id || !date_debut || !organization_id) {
      return NextResponse.json(
        { error: 'Champs obligatoires manquants: titre, categorie_id, type_activite_id, date_debut, organization_id' },
        { status: 400 }
      )
    }

    // Calculer le total des bénéficiaires
    const beneficiaires_count = beneficiaires_hommes + beneficiaires_femmes + beneficiaires_jeunes

    // Créer l'activité
    const { data: activity, error } = await supabase
      .from('activites')
      .insert({
        organization_id,
        titre,
        description: description || null,
        categorie_id,
        type_activite_id,
        date_debut,
        date_fin: date_fin || null,
        lieu: lieu || null,
        budget_alloue: budget_alloue || null,
        beneficiaires_hommes,
        beneficiaires_femmes,
        beneficiaires_jeunes,
        beneficiaires_count,
        created_by: user.id,
        statut: 'BROUILLON',
      })
      .select(`
        *,
        categories (id, nom),
        types_activite (id, nom)
      `)
      .single()

    if (error) {
      console.error('Error creating activity:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      activity,
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
