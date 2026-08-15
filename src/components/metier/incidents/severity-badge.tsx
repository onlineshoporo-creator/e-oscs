'use client'

import { Badge } from '@/components/ui/badge'
import type { IncidentGravite } from '@/types'

interface SeverityBadgeProps {
  gravite: IncidentGravite
  size?: 'sm' | 'default' | 'lg'
}

const severityConfig: Record<IncidentGravite, {
  label: string
  className: string
  dotClass: string
}> = {
  FAIBLE: {
    label: 'Faible',
    className: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-100',
    dotClass: 'bg-green-500',
  },
  MOYENNE: {
    label: 'Moyenne',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-300 hover:bg-yellow-100',
    dotClass: 'bg-yellow-500',
  },
  ELEVEE: {
    label: 'Élevée',
    className: 'bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-100',
    dotClass: 'bg-orange-500',
  },
  CRITIQUE: {
    label: 'Critique',
    className: 'bg-red-100 text-red-700 border-red-300 hover:bg-red-100',
    dotClass: 'bg-red-500',
  },
}

export function SeverityBadge({ gravite, size = 'default' }: SeverityBadgeProps) {
  const config = severityConfig[gravite]
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${sizeClasses[size]} font-medium flex items-center gap-1.5`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
      {config.label}
    </Badge>
  )
}
