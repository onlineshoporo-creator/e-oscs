'use client'

import React from 'react'
import { Bell } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface NotificationBadgeProps {
  count: number
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  showZero?: boolean
}

const SIZE_STYLES = {
  sm: { button: 'h-8 w-8', icon: 'w-4 h-4', badge: 'w-4 h-4 text-[9px]' },
  md: { button: 'h-9 w-9', icon: 'w-5 h-5', badge: 'w-5 h-5 text-[10px]' },
  lg: { button: 'h-10 w-10', icon: 'w-5 h-5', badge: 'w-5.5 h-5.5 text-xs' },
}

export function NotificationBadge({
  count,
  onClick,
  size = 'md',
  showZero = false,
}: NotificationBadgeProps) {
  const styles = SIZE_STYLES[size]
  const displayCount = count > 99 ? '99+' : count

  // Ne pas afficher si count = 0 et showZero = false
  if (count === 0 && !showZero) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`${styles.button} relative text-slate-500 hover:text-slate-700 hover:bg-slate-100`}
        onClick={onClick}
      >
        <Bell className={styles.icon} />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`${styles.button} relative text-slate-500 hover:text-slate-700 hover:bg-slate-100`}
      onClick={onClick}
    >
      <Bell className={styles.icon} />
      
      {/* Badge compteur */}
      {count > 0 && (
        <span
          className={`absolute -top-0.5 -right-0.5 ${styles.badge} bg-orange-500 text-white font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse-once`}
        >
          {displayCount}
        </span>
      )}
    </Button>
  )
}
