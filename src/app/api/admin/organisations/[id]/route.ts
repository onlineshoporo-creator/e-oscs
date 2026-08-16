/**
 * API Organisations [id] - e-OSCS
 * 
 * Gestion individuelle des organisations avec stockage en mémoire (fallback Vercel)
 */

import { NextRequest, NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

// GET /api/admin/organisations/[id] - Récupérer une organisation spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const org = inMemoryStore.getOrganisation(id)

    if (!org) {
      return NextResponse.json(
        { error: 'Organisation non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(org)

  } catch (error) {
    console.error('Erreur récupération organisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'organisation' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/organisations/[id] - Mettre à jour une organisation (toggle statut, etc.)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Récupérer l'organisation actuelle
    const org = inMemoryStore.getOrganisation(id)

    if (!org) {
      return NextResponse.json(
        { error: 'Organisation non trouvée' },
        { status: 404 }
      )
    }

    // Si c'est un toggle de statut
    if (body.toggleStatus !== undefined) {
      const newStatus = !org.actif
      const updated = inMemoryStore.updateOrganisation(id, { actif: newStatus })
      
      // Notification
      inMemoryStore.createNotification({
        type: 'organisation_activee',
        titre: newStatus ? 'Organisation réactivée' : 'Organisation suspendue',
        description: `${org.nom} est maintenant ${newStatus ? 'active' : 'suspendue'}`,
        lue: false,
        lien: '/admin/organisations'
      })

      console.log(`✅ Organisation ${id} ${newStatus ? 'réactivée' : 'suspendue'}`)

      return NextResponse.json({
        success: true,
        message: `Organisation ${newStatus ? 'réactivée' : 'suspendue'} avec succès`,
        data: updated
      })
    }

    // Mise à jour générique
    const allowedFields = ['nom', 'type_org', 'region', 'departement', 'telephone', 'email', 'actif']
    const updateData: Record<string, unknown> = {}
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const updated = inMemoryStore.updateOrganisation(id, updateData)

    return NextResponse.json({
      success: true,
      data: updated
    })

  } catch (error) {
    console.error('Erreur mise à jour organisation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'organisation' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/organisations/[id] - Supprimer une organisation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Vérifier si l'organisation existe
    const org = inMemoryStore.getOrganisation(id)
    
    if (!org) {
      return NextResponse.json(
        { error: 'Organisation non trouvée' },
        { status: 404 }
      )
    }

    // Supprimer l'organisation
    const deleted = inMemoryStore.deleteOrganisation(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Erreur lors de la suppression' },
        { status: 500 }
      )
    }

    console.log(`✅ Organisation ${id} supprimée`)

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
