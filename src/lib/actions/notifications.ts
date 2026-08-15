'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Types
export type NotificationType =
  | 'ACTIVITE_SOUMISE'
  | 'ACTIVITE_VALIDEE'
  | 'ACTIVITE_REJETEE'
  | 'RAPPORT_DISPONIBLE'
  | 'PERIODE_CLOTUREE'
  | 'NOUVEAU_MEMBRE'
  | 'SYSTEME'
  | 'INFO'

export interface Notification {
  id: string
  organization_id: string
  user_id: string
  type: NotificationType
  titre: string
  message: string
  lien: string | null
  lue: boolean
  created_at: string
}

export interface NotificationFilters {
  tab?: 'toutes' | 'non_lues' | 'importantes'
  type?: NotificationType
  search?: string
  page?: number
  limit?: number
}

// Configuration des types de notifications
export const NOTIFICATION_TYPES_CONFIG: Record<
  NotificationType,
  { label: string; color: string; icon: string }
> = {
  ACTIVITE_SOUMISE: {
    label: 'Activité soumise',
    color: 'blue',
    icon: 'ClipboardList',
  },
  ACTIVITE_VALIDEE: {
    label: 'Activité validée',
    color: 'green',
    icon: 'CheckCircle',
  },
  ACTIVITE_REJETEE: {
    label: 'Activité rejetée',
    color: 'red',
    icon: 'XCircle',
  },
  RAPPORT_DISPONIBLE: {
    label: 'Rapport disponible',
    color: 'purple',
    icon: 'BarChart3',
  },
  PERIODE_CLOTUREE: {
    label: 'Période clôturée',
    color: 'amber',
    icon: 'AlertTriangle',
  },
  NOUVEAU_MEMBRE: {
    label: 'Nouveau membre',
    color: 'slate',
    icon: 'UserPlus',
  },
  SYSTEME: {
    label: 'Système',
    color: 'gray',
    icon: 'Settings',
  },
  INFO: {
    label: 'Information',
    color: 'blue',
    icon: 'Info',
  },
}

/**
 * Récupère les notifications d'un utilisateur avec filtres
 */
export async function getNotifications(
  userId: string,
  filters?: NotificationFilters
): Promise<{ notifications: Notification[]; count: number }> {
  const supabase = await createClient()

  let query = supabase
    .from('notifications')
    .select('*', { count: 'exact' })
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  // Filtre par onglet
  switch (filters?.tab) {
    case 'non_lues':
      query = query.eq('lue', false)
      break
    case 'importantes':
      query = query.in('type', [
        'PERIODE_CLOTUREE',
        'ACTIVITE_REJETEE',
      ])
      break
    case 'toutes':
    default:
      // Pas de filtre supplémentaire
      break
  }

  // Filtre par type
  if (filters?.type) {
    query = query.eq('type', filters.type)
  }

  // Recherche (titre, message)
  if (filters?.search) {
    query = query.or(`titre.ilike.%${filters.search}%,message.ilike.%${filters.search}%`)
  }

  const page = filters?.page || 1
  const limit = filters?.limit || 20
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await query.range(from, to)

  if (error) {
    console.error('Erreur récupération notifications:', error)
    return { notifications: [], count: 0 }
  }

  return { notifications: (data as Notification[]) || [], count: count || 0 }
}

/**
 * Récupérer le nombre de notifications non lues
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('lue', false)

  if (error) {
    console.error('Erreur compteur notifications:', error)
    return 0
  }

  return count || 0
}

/**
 * Marquer une notification comme lue ou non lue
 */
export async function markAsRead(
  notificationId: string,
  lue: boolean = true
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ lue, updated_at: new Date().toISOString() })
    .eq('id', notificationId)

  if (error) {
    console.error('Erreur marquage notification:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/notifications')

  return { success: true }
}

/**
 * Marquer toutes les notifications comme lues
 */
export async function markAllAsRead(
  userId: string
): Promise<{ success: boolean; count?: number; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notifications')
    .update({ lue: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .eq('lue', false)
    .select('id')

  if (error) {
    console.error('Erreur marquage toutes notifications:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/notifications')

  return { success: true, count: data?.length || 0 }
}

/**
 * Supprimer une notification
 */
export async function deleteNotification(
  notificationId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId)

  if (error) {
    console.error('Erreur suppression notification:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/app/notifications')

  return { success: true }
}

/**
 * Créer une nouvelle notification
 */
export async function createNotification(data: {
  organization_id: string
  user_id: string
  type: NotificationType
  titre: string
  message: string
  lien?: string | null
}): Promise<{ success: boolean; notification?: Notification; error?: string }> {
  const supabase = await createClient()

  const { data: notification, error } = await supabase
    .from('notifications')
    .insert({
      ...data,
      lue: false,
    })
    .select()
    .single()

  if (error) {
    console.error('Erreur création notification:', error)
    return { success: false, error: error.message }
  }

  return { success: true, notification: notification as Notification }
}

/**
 * Créer des notifications en lot (pour plusieurs utilisateurs)
 */
export async function createBulkNotifications(
  notifications: Array<{
    organization_id: string
    user_id: string
    type: NotificationType
    titre: string
    message: string
    lien?: string | null
  }>
): Promise<{ success: boolean; count?: number; error?: string }> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('notifications')
    .insert(
      notifications.map((n) => ({ ...n, lue: false }))
    )
    .select('id')

  if (error) {
    console.error('Erreur création notifications bulk:', error)
    return { success: false, error: error.message }
  }

  return { success: true, count: data?.length || 0 }
}

// Note: formatRelativeDate est exporté depuis @/lib/utils
