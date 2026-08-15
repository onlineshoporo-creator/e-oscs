'use client'

import { Badge } from '@/components/ui/badge'
import type { IndicatorKind } from '@/types'

interface IndicatorTypeBadgeProps {
  kind: IndicatorKind
  size?: 'sm' | 'default' | 'lg'
}

const kindConfig: Record<IndicatorKind, {
  label: string
  className: string
  icon: string
}> = {
  QUANTITATIF: {
    label: 'Quantitatif',
    className: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-100',
    icon: '#',
  },
  QUALITATIF: {
    label: 'Qualitatif',
    className: 'bg-purple-100 text-purple-700 border-purple-300 hover:bg-purple-100',
    icon: 'ABC',
  },
}

export function IndicatorTypeBadge({ kind, size = 'default' }: IndicatorTypeBadgeProps) {
  const config = kindConfig[kind]
  
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    default: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  }

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} ${sizeClasses[size]} font-medium`}
    >
      {config.label}
    </Badge>
  )
}
