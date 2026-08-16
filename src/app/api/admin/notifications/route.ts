/**
 * API Notifications - e-OSCS (Super Admin)
 * 
 * Gestion des notifications du super admin avec stockage en mémoire
 */

import { NextRequest, NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

// GET - Récupérer les notifications (avec pagination et filtres)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const onlyUnread = searchParams.get('unread') === 'true'

    // Récupérer toutes les notifications
    let notifications = inMemoryStore.getNotifications()

    // Filtrer non lues si demandé
    if (onlyUnread) {
      notifications = notifications.filter(n => !n.lue)
    }

    // Pagination
    const total = notifications.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedNotifs = notifications.slice(start, start + limit)

    // Compter les non lues
    const unreadCount = inMemoryStore.getUnreadCount()

    return NextResponse.json({
      data: paginatedNotifs,
      total,
      unreadCount,
      page,
      limit,
      totalPages
    })

  } catch (error) {
    console.error('Erreur récupération notifications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    )
  }
}

// POST - Créer une notification manuelle (pour tests/admin)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { type, titre, description, lien } = body

    // Validation
    if (!titre?.trim()) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      )
    }

    const validTypes = ['demande_abonnement', 'organisation_activee', 'paiement_recu', 'systeme']
    const notifType = validTypes.includes(type) ? type : 'systeme'

    // Créer la notification
    const notification = inMemoryStore.createNotification({
      type: notifType,
      titre: titre.trim(),
      description: description?.trim() || '',
      lue: false,
      lien: lien || undefined
    })

    console.log(`✅ Notification créée: ${titre}`)

    return NextResponse.json(notification, { status: 201 })

  } catch (error) {
    console.error('Erreur création notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la notification' },
      { status: 500 }
    )
  }
}

// PATCH - Marquer comme lu / tout marquer comme lu
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, markAllRead } = body

    if (markAllRead) {
      // Tout marquer comme lu
      inMemoryStore.markAllAsRead()
      
      console.log('✅ Toutes les notifications marquées comme lues')
      
      return NextResponse.json({
        success: true,
        message: 'Toutes les notifications ont été marquées comme lues'
      })
    }

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis pour marquer une notification spécifique' },
        { status: 400 }
      )
    }

    // Marquer une notification spécifique comme lue
    const result = inMemoryStore.markAsRead(id)

    if (!result) {
      return NextResponse.json(
        { error: 'Notification non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marquée comme lue'
    })

  } catch (error) {
    console.error('Erreur mise à jour notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une notification ou toutes
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll') === 'true'

    if (clearAll) {
      // Supprimer toutes les notifications
      inMemoryStore.clearAllNotifications()
      
      console.log('🗑️ Toutes les notifications supprimées')
      
      return NextResponse.json({
        success: true,
        message: 'Toutes les notifications ont été supprimées'
      })
    }

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis pour supprimer une notification spécifique' },
        { status: 400 }
      )
    }

    // Supprimer une notification spécifique
    const result = inMemoryStore.deleteNotification(id)

    if (!result) {
      return NextResponse.json(
        { error: 'Notification non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Notification supprimée'
    })

  } catch (error) {
    console.error('Erreur suppression notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}

// GET endpoint spécial pour le compteur de notifications non lues
export async function HEAD() {
  try {
    const unreadCount = inMemoryStore.getUnreadCount()
    
    return new NextResponse(null, {
      headers: {
        'X-Unread-Count': String(unreadCount)
      }
    })
  } catch (error) {
    return new NextResponse(null, {
      status: 500
    })
  }
}
