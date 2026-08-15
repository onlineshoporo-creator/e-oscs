'use client'

import React from 'react'
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  BarChart3,
  AlertTriangle,
  UserPlus,
  Settings,
  Info,
  type LucideIcon,
} from 'lucide-react'
import { NotificationType, NOTIFICATION_TYPES_CONFIG } from '@/lib/actions/notifications'

interface NotificationTypeIconProps {
  type: NotificationType
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Mapping des icônes
const ICON_MAP: Record<NotificationType, LucideIcon> = {
  ACTIVITE_SOUMISE: ClipboardList,
  ACTIVITE_VALIDEE: CheckCircle2,
  ACTIVITE_REJETEE: XCircle,
  RAPPORT_DISPONIBLE: BarChart3,
  PERIODE_CLOTUREE: AlertTriangle,
  NOUVEAU_MEMBRE: UserPlus,
  SYSTEME: Settings,
  INFO: Info,
}

// Mapping des couleurs de fond et d'icône
const COLOR_MAP: Record<
  NotificationType,
  { bg: string; icon: string; border?: string }
> = {
  ACTIVITE_SOUMISE: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    border: 'border-blue-200',
  },
  ACTIVITE_VALIDEE: {
    bg: 'bg-green-100',
    icon: 'text-green-600',
    border: 'border-green-200',
  },
  ACTIVITE_REJETEE: {
    bg: 'bg-red-100',
    icon: 'text-red-600',
    border: 'border-red-200',
  },
  RAPPORT_DISPONIBLE: {
    bg: 'bg-purple-100',
    icon: 'text-purple-600',
    border: 'border-purple-200',
  },
  PERIODE_CLOTUREE: {
    bg: 'bg-amber-100',
    icon: 'text-amber-600',
    border: 'border-amber-200',
  },
  NOUVEAU_MEMBRE: {
    bg: 'bg-slate-100',
    icon: 'text-slate-600',
    border: 'border-slate-200',
  },
  SYSTEME: {
    bg: 'bg-gray-100',
    icon: 'text-gray-600',
    border: 'border-gray-200',
  },
  INFO: {
    bg: 'bg-blue-100',
    icon: 'text-blue-600',
    border: 'border-blue-200',
  },
}

// Tailles
const SIZE_MAP = {
  sm: { container: 'w-8 h-8', icon: 'w-4 h-4' },
  md: { container: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { container: 'w-12 h-12', icon: 'w-6 h-6' },
}

export function NotificationTypeIcon({
  type,
  size = 'md',
  className = '',
}: NotificationTypeIconProps) {
  const Icon = ICON_MAP[type] || Info
  const colors = COLOR_MAP[type] || COLOR_MAP.INFO
  const sizes = SIZE_MAP[size]

  return (
    <div
      className={`${sizes.container} rounded-full flex items-center justify-center ${colors.bg} ${className}`}
      title={NOTIFICATION_TYPES_CONFIG[type]?.label || type}
    >
      <Icon className={`${sizes.icon} ${colors.icon}`} />
    </div>
  )
}

// Exporter les configs pour utilisation externe
export { ICON_MAP, COLOR_MAP, NOTIFICATION_TYPES_CONFIG }
