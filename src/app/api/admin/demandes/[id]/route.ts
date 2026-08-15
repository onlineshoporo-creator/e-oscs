import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

// GET /api/admin/demandes/[id] - Get request details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('subscription_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur récupération demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la demande' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/demandes/[id] - Update request status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { statut, notes_admin } = body

    // Validate status
    const validStatuses = ['NOUVELLE', 'EN_CONTACT', 'EN_ATTENTE_PAIEMENT', 'AYEE', 'REFUSEE', 'CLOTUREE']
    if (statut && !validStatuses.includes(statut)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: Record<string, unknown> = {}
    if (statut) updateData.statut = statut
    if (notes_admin !== undefined) updateData.notes_admin = notes_admin

    // Update the request
    const { data, error } = await supabaseAdmin
      .from('subscription_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)

  } catch (error) {
    console.error('Erreur mise à jour demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la demande' },
      { status: 500 }
    )
  }
}

// POST /api/admin/demandes/[id]/approve - Approve request and create org + subscription
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get the request details
    const { data: requestData, error: fetchError } = await supabaseAdmin
      .from('subscription_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !requestData) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    // Check if already approved
    if (requestData.statut === 'AYEE') {
      return NextResponse.json(
        { error: 'Cette demande a déjà été approuvée' },
        { status: 400 }
      )
    }

    // Get default plan (ESSENTIEL or first available)
    const { data: defaultPlan, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('code', 'ESSENTIEL')
      .eq('actif', true)
      .limit(1)
      .single()

    if (planError || !defaultPlan) {
      // Try to get any active plan
      const { data: anyPlan } = await supabaseAdmin
        .from('subscription_plans')
        .select('*')
        .eq('actif', true)
        .order('ordre', { ascending: true })
        .limit(1)
        .single()
      
      if (!anyPlan) {
        return NextResponse.json(
          { error: 'Aucun plan d\'abonnement disponible' },
          { status: 400 }
        )
      }
      
      // Use anyPlan instead of defaultPlan
      Object.assign(defaultPlan!, anyPlan)
    }

    // Create organization
    const { data: organization, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        nom: requestData.nom_organisation,
        type_org: requestData.type_org,
        region: requestData.region,
        departement: requestData.departement,
        telephone: requestData.telephone,
        email: requestData.email,
        actif: true
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Calculate subscription dates
    const dateDebut = new Date()
    const dateFin = new Date()
    dateFin.setMonth(dateFin.getMonth() + 1)

    // Create subscription
    const { data: subscription, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        organization_id: organization.id,
        plan_id: defaultPlan!.id,
        date_debut: dateDebut.toISOString(),
        date_fin: dateFin.toISOString(),
        duree_mois: 1,
        statut: 'ACTIF',
        montant: defaultPlan!.prix_mensuel,
        confirme_le: new Date().toISOString(),
        notes: `Créé automatiquement depuis la demande #${id.slice(0, 8)}`
      })
      .select()
      .single()

    if (subError) throw subError

    // Update request status to AYEE
    const { error: updateError } = await supabaseAdmin
      .from('subscription_requests')
      .update({
        statut: 'AYEE',
        notes_admin: `Approuvée le ${new Date().toLocaleDateString('fr-FR')}. Organisation créée: ${organization.id}`
      })
      .eq('id', id)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: 'Organisation et abonnement créés avec succès',
      organization,
      subscription
    })

  } catch (error) {
    console.error('Erreur approbation demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'approbation de la demande' },
      { status: 500 }
    )
  }
}
