/**
 * API Demandes d'Abonnement [id] - e-OSCS
 * 
 * Gestion individuelle des demandes avec stockage en mémoire (fallback Vercel)
 */

import { NextRequest, NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

// GET /api/admin/demandes/[id] - Récupérer une demande spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const demande = inMemoryStore.getDemande(id)

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(demande)

  } catch (error) {
    console.error('Erreur récupération demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la demande' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/demandes/[id] - Mettre à jour le statut d'une demande
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { statut, notes_admin } = body

    // Valider le statut
    const validStatuses = ['NOUVELLE', 'EN_CONTACT', 'APPROUVEE', 'REJETEE', 'CONVERTIE']
    if (statut && !validStatuses.includes(statut)) {
      return NextResponse.json(
        { error: 'Statut invalide. Valeurs possibles: ' + validStatuses.join(', ') },
        { status: 400 }
      )
    }

    // Construire l'objet de mise à jour
    const updateData: Record<string, unknown> = {}
    if (statut) updateData.statut = statut
    if (notes_admin !== undefined) updateData.notes_admin = notes_admin

    // Mettre à jour la demande
    const updated = inMemoryStore.updateDemande(id, updateData)

    if (!updated) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    console.log(`✅ Demande ${id} mise à jour: ${statut}`)

    return NextResponse.json(updated)

  } catch (error) {
    console.error('Erreur mise à jour demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la demande' },
      { status: 500 }
    )
  }
}

// POST /api/admin/demandes/[id]/approve - Approuver une demande et créer organisation
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Récupérer les détails de la demande
    const demande = inMemoryStore.getDemande(id)
    
    if (!demande) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier si déjà approuvée
    if (demande.statut === 'CONVERTIE') {
      return NextResponse.json(
        { error: 'Cette demande a déjà été convertie en organisation' },
        { status: 400 }
      )
    }

    // Créer l'organisation à partir de la demande
    const organization = inMemoryStore.createOrganisation({
      nom: demande.nom_organisation,
      type_org: demande.type_org,
      region: demande.region,
      departement: demande.departement,
      telephone: demande.telephone,
      email: demande.email,
      actif: true,
      subscription: {
        statut: 'ACTIF',
        plan_nom: 'Plan Essentiel',
        date_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      members_count: 1
    })

    // Mettre à jour le statut de la demande
    inMemoryStore.updateDemande(id, {
      statut: 'CONVERTIE',
      notes_admin: `Convertie en organisation le ${new Date().toLocaleDateString('fr-FR')}. Org ID: ${organization.id}`
    })

    console.log(`✅ Demande ${id} approuvée → Organisation ${organization.id} créée`)

    return NextResponse.json({
      success: true,
      message: 'Organisation créée avec succès',
      organization,
      subscription: organization.subscription
    })

  } catch (error) {
    console.error('Erreur approbation demande:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'approbation de la demande" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/demandes/[id] - Supprimer une demande
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const demande = inMemoryStore.getDemande(id)
    
    if (!demande) {
      return NextResponse.json(
        { error: 'Demande non trouvée' },
        { status: 404 }
      )
    }

    // Suppression logique via le store (on pourrait ajouter une méthode delete)
    inMemoryStore.updateDemande(id, { statut: 'REJETEE', notes_admin: 'Demande supprimée par admin' })

    return NextResponse.json({ success: true, message: 'Demande supprimée' })

  } catch (error) {
    console.error('Erreur suppression demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la demande' },
      { status: 500 }
    )
  }
}
