'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, User, LogOut, Settings, Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggleCompact } from '@/components/ui/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { createClient } from '@/lib/supabase/client'
import { NotificationBadge, NotificationTypeIcon } from '@/components/metier/notifications'
import type { Notification as NotifType } from '@/lib/actions/notifications'

interface HeaderProps {
  user?: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
    organization?: string | null
    organizationId?: string | null
  }
}

// Données mock pour les notifications (seront remplacées par l'API)
const MOCK_NOTIFICATIONS: NotifType[] = [
  {
    id: 'notif-1',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'ACTIVITE_SOUMISE',
    titre: 'Nouvelle activité soumise',
    message: 'L\'activité "Formation des cadres techniques" a été soumise.',
    lien: '/app/validation',
    lue: false,
    created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'ACTIVITE_VALIDEE',
    titre: 'Activité validée',
    message: 'L\'activité "Sensibilisation communautaire" a été validée.',
    lien: '/app/activites',
    lue: false,
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    organization_id: 'org-1',
    user_id: 'user-1',
    type: 'RAPPORT_DISPONIBLE',
    titre: 'Rapport disponible',
    message: 'Le rapport mensuel est prêt pour téléchargement.',
    lien: '/app/rapports',
    lue: true,
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
]

// Formater la date relative
function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `Il y a ${diffMins}min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export function Header({ user }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<NotifType[]>(MOCK_NOTIFICATIONS)
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Charger le compteur de notifications non lues
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        // En production, utiliser l'API réelle:
        // const response = await fetch('/api/app/notifications/unread-count')
        // const data = await response.json()
        // setUnreadCount(data.count)
        
        // Pour l'instant, utiliser les données mock
        const count = MOCK_NOTIFICATIONS.filter(n => !n.lue).length
        setUnreadCount(count)
      } catch (error) {
        console.error('Erreur chargement notifications:', error)
      }
    }

    fetchUnreadCount()
    
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await supabase.auth.signOut()
      router.push('/connexion')
      router.refresh()
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Marquer une notification comme lue
  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, lue: true } : n)
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
    
    // En production:
    // await fetch(`/api/app/notifications/${id}/read`, { method: 'PATCH', body: JSON.stringify({ lue: true }) })
  }

  // Tout marquer comme lu
  const handleMarkAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, lue: true })))
    setUnreadCount(0)
    
    // En production:
    // await fetch('/api/app/notifications', { method: 'PATCH', body: JSON.stringify({ action: 'mark-all-read' }) })
  }

  // Générer les initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Recherche */}
      <div className="flex items-center flex-1 max-w-md">
        {searchOpen ? (
          <div className="relative w-full animate-in fade-in slide-in-from-top-2 duration-200">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher une activité, un rapport..."
              className="pl-10 pr-10 bg-slate-50 border-slate-200 focus:bg-white"
              autoFocus
              onBlur={() => setSearchOpen(false)}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => setSearchOpen(false)}
            >
              ✕
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 gap-2"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Rechercher...</span>
            <kbd className="hidden md:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400">
              ⌘K
            </kbd>
          </Button>
        )}
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-2">
        {/* Toggle Dark/Light Mode */}
        <ThemeToggleCompact />
        
        {/* Notifications avec Badge intégré */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-once">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Notifications</h4>
                <p className="text-xs text-slate-500">{unreadCount} non lue(s)</p>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                  Tout lire
                </button>
              )}
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune notification</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <Link
                    key={notification.id}
                    href={notification.lien || '#'}
                    onClick={(e) => {
                      if (!notification.lue) handleMarkAsRead(notification.id)
                    }}
                    className={`block px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                      !notification.lue ? 'bg-orange-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <NotificationTypeIcon type={notification.type} size="sm" />
                      {!notification.lue && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      )}
                      {notification.lue && (
                        <span className="w-2 h-2 mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm truncate ${
                          !notification.lue ? 'font-medium text-slate-900' : 'text-slate-700'
                        }`}>
                          {notification.titre}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {formatRelativeDate(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            <div className="px-4 py-2 border-t border-slate-100">
              <Link
                href="/app/notifications"
                className="block text-sm text-orange-600 hover:text-orange-700 font-medium text-center"
              >
                Voir toutes les notifications →
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profil utilisateur */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-100">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-medium">
                  {getInitials(user?.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-700">{user?.name || 'Utilisateur'}</span>
                {user?.organization && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {user.organization}
                  </span>
                )}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || 'Utilisateur'}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
                {user?.organization && (
                  <Badge variant="secondary" className="w-fit text-xs mt-1">
                    {user.role}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/settings" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/app/settings" className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Déconnexion...
                </>
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
