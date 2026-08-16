/**
 * API Notifications - e-OSCS
 * 
 * Gestion des notifications du super admin avec stockage en mémoire (fallback Vercel)
 */

import { NextRequest, NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

// GET - Récupérer toutes les notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const onlyUnread = searchParams.get('unread') === 'true'
    
    let notifications = inMemoryStore.getNotifications()
    
    // Filtrer par non lues si demandé
    if (onlyUnread) {
      notifications = notifications.filter(n => !n.lue)
    }
    
    // Compter les non lues
    const unreadCount = inMemoryStore.getUnreadCount()
    
    return NextResponse.json({
      data: notifications,
      unreadCount,
      total: notifications.length
    })

  } catch (error) {
    console.error('Erreur récupération notifications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    )
  }
}

// POST - Créer une notification manuelle
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

    // Types valides
    const validTypes = ['demande_abonnement', 'organisation_activee', 'paiement_recu', 'systeme', 'info']
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

// PATCH - Marquer comme lues / tout marquer comme lu
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, notificationId } = body

    if (action === 'markAllRead') {
      // Marquer toutes comme lues
      inMemoryStore.markAllAsRead()
      return NextResponse.json({ success: true, message: 'Toutes les notifications marquées comme lues' })
    }

    if (action === 'markRead' && notificationId) {
      // Marquer une spécifique comme lue
      const success = inMemoryStore.markAsRead(notificationId)
      if (!success) {
        return NextResponse.json(
          { error: 'Notification non trouvée' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Action invalide. Utilisez "markRead" ou "markAllRead"' },
      { status: 400 }
    )

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
    const deleteAll = searchParams.get('all') === 'true'
    const notificationId = searchParams.get('id')

    if (deleteAll) {
      // Supprimer toutes les notifications
      inMemoryStore.clearAllNotifications()
      return NextResponse.json({ success: true, message: 'Toutes les notifications supprimées' })
    }

    if (notificationId) {
      // Supprimer une notification spécifique
      const success = inMemoryStore.deleteNotification(notificationId)
      if (!success) {
        return NextResponse.json(
          { error: 'Notification non trouvée' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'ID requis ou paramètre all=true' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Erreur suppression notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression' },
      { status: 500 }
    )
  }
}
