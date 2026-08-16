/**
 * API Unread Count - e-OSCS
 * 
 * Endpoint léger pour récupérer le nombre de notifications non lues
 * Utilisé par le header admin pour afficher le badge
 */

import { NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

export async function GET() {
  try {
    const unreadCount = inMemoryStore.getUnreadCount()

    return NextResponse.json({
      count: unreadCount
    })
  } catch (error) {
    console.error('Erreur unread count:', error)
    return NextResponse.json(
      { count: 0 },
      { status: 500 }
    )
  }
}
