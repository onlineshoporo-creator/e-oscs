'use client'

import React from 'react'
import { BellOff, CheckCircle2, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyNotificationsProps {
  message?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyNotifications({
  message,
  actionLabel,
  onAction,
}: EmptyNotificationsProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Illustration */}
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center mb-6">
        <Inbox className="w-12 h-12 text-green-400" />
      </div>

      {/* Message */}
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        {message || 'Tout est à jour !'}
      </h3>
      
      <p className="text-sm text-slate-500 text-center max-w-md mb-6">
        Vous n'avez aucune notification pour le moment. 
        Les nouvelles notifications apparaîtront ici.
      </p>

      {/* Icônes décoratives */}
      <div className="flex items-center gap-4 text-slate-300 mb-6">
        <BellOff className="w-5 h-5" />
        <CheckCircle2 className="w-5 h-5" />
      </div>

      {/* Action optionnelle */}
      {actionLabel && onAction && (
        <Button
          variant="outline"
          onClick={onAction}
          className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
