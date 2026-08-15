'use client'

import React from 'react'
import { Notification, NotificationFilters } from '@/lib/actions/notifications'
import { NotificationItem } from './notification-item'
import { EmptyNotifications } from './empty-notifications'

interface NotificationListProps {
  notifications: Notification[]
  isLoading?: boolean
  onToggleRead?: (id: string, lue: boolean) => void
  onDelete?: (id: string) => void
  onClick?: (notification: Notification) => void
  onMarkAllRead?: () => void
  emptyMessage?: string
}

export function NotificationList({
  notifications,
  isLoading = false,
  onToggleRead,
  onDelete,
  onClick,
  onMarkAllRead,
  emptyMessage,
}: NotificationListProps) {
  // État de chargement
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex items-start gap-3 p-4 bg-slate-50 rounded-lg"
          >
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-3/4" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
              <div className="h-3 bg-slate-200 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Liste vide
  if (notifications.length === 0) {
    return <EmptyNotifications message={emptyMessage} onAction={onMarkAllRead} />
  }

  return (
    <div className="space-y-2">
      {/* Header actions */}
      {onMarkAllRead && notifications.some((n) => !n.lue) && (
        <div className="flex justify-end mb-2">
          <button
            onClick={onMarkAllRead}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Tout marquer comme lu
          </button>
        </div>
      )}

      {/* Liste des notifications */}
      <div className="space-y-2">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onToggleRead={onToggleRead}
            onDelete={onDelete}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  )
}
