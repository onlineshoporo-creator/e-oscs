'use client'

import React from 'react'
import { Link2, Trash2, Check, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Notification, NOTIFICATION_TYPES_CONFIG } from '@/lib/actions/notifications'
import { formatRelativeDate } from '@/lib/utils'
import { NotificationTypeIcon } from './notification-type-icon'

interface NotificationItemProps {
  notification: Notification
  onToggleRead?: (id: string, lue: boolean) => void
  onDelete?: (id: string) => void
  onClick?: (notification: Notification) => void
}

export function NotificationItem({
  notification,
  onToggleRead,
  onDelete,
  onClick,
}: NotificationItemProps) {
  const typeConfig = NOTIFICATION_TYPES_CONFIG[notification.type]
  const isUnread = !notification.lue

  return (
    <Card
      className={`transition-all duration-200 cursor-pointer group ${
        isUnread
          ? 'bg-orange-50/50 border-orange-100 hover:bg-orange-50'
          : 'hover:bg-slate-50 border-slate-100'
      }`}
      onClick={() => onClick?.(notification)}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icône type */}
        <div className="flex-shrink-0 relative">
          <NotificationTypeIcon type={notification.type} size="md" />
          {/* Indicateur non lu */}
          {isUnread && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-orange-500 rounded-full border-2 border-white" />
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {/* Titre */}
              <p
                className={`font-medium truncate ${
                  isUnread ? 'text-slate-900' : 'text-slate-700'
                }`}
              >
                {notification.titre}
              </p>
              
              {/* Message */}
              <p className={`text-sm mt-0.5 line-clamp-2 ${
                isUnread ? 'text-slate-600' : 'text-slate-500'
              }`}>
                {notification.message}
              </p>

              {/* Métadonnées */}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-slate-400">
                  {formatRelativeDate(notification.created_at)}
                </span>
                
                {/* Badge type */}
                <Badge
                  variant="outline"
                  className="text-xs py-0 h-5"
                >
                  {typeConfig?.label || notification.type}
                </Badge>

                {/* Lien si présent */}
                {notification.lien && (
                  <span className="flex items-center text-xs text-blue-500">
                    <Link2 className="w-3 h-3 mr-0.5" />
                    Lien disponible
                  </span>
                )}
              </div>
            </div>

            {/* Actions (visible au hover) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600"
                  >
                    ⋯
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  {onToggleRead && (
                    <DropdownMenuItem
                      onClick={() => onToggleRead(notification.id, !notification.lue)}
                    >
                      {isUnread ? (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Marquer comme lue
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Marquer comme non lue
                        </>
                      )}
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => onDelete(notification.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
