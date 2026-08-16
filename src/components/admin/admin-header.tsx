'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Bell, Search, User, LogOut, Settings, Menu, Shield, CheckCircle2, XCircle, AlertCircle, Clock, Building2, CreditCard } from 'lucide-react'
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
import { toast } from 'sonner'

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

// Types pour les notifications
interface Notification {
  id: string
  type: 'demande_abonnement' | 'organisation_activee' | 'paiement_recu' | 'systeme'
  titre: string
  description: string
  lue: boolean
  created_at: string
  lien?: string
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loadingNotifs, setLoadingNotifs] = useState(true)

  // Charger les notifications depuis l'API
  const fetchNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/notifications?limit=10')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.data || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Erreur chargement notifications:', error)
    } finally {
      setLoadingNotifs(false)
    }
  }, [])

  // Charger au montage et rafraîchir périodiquement
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60000) // Toutes les 60s
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Marquer une notification comme lue
  const markAsRead = async (notifId: string) => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notifId })
      })
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notifId ? { ...n, lue: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Erreur marquer comme lu:', error)
    }
  }

  // Tout marquer comme lu
  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, lue: true })))
        setUnreadCount(0)
        toast.success('Toutes les notifications ont été marquées comme lues')
      }
    } catch (error) {
      console.error('Erreur tout marquer lu:', error)
    }
  }

  // Naviguer vers le lien de la notification
  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.lue) {
      await markAsRead(notification.id)
    }
    
    if (notification.lien) {
      window.location.href = notification.lien
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'demande_abonnement':
        return <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <Clock className="w-4 h-4 text-orange-600" />
        </div>
      case 'organisation_activee':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-green-600" />
        </div>
      case 'paiement_recu':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <CreditCard className="w-4 h-4 text-blue-600" />
        </div>
      default:
        return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-4 h-4 text-slate-600" />
        </div>
    }
  }

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays === 1) return 'Hier'
    return `Il y a ${diffDays}j`
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Toggle sidebar mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-slate-500 hover:text-slate-700 hover:bg-slate-100"
          onClick={onToggleSidebar}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Recherche */}
        <div className="flex items-center flex-1 max-w-md">
          {searchOpen ? (
            <div className="relative w-full animate-in fade-in slide-in-from-top-2 duration-200">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher organisations, demandes..."
                className="pl-10 pr-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-orange-300 focus:ring-orange-500/20"
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
              className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 gap-2 hidden sm:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="w-4 h-4" />
              <span className="text-sm">Rechercher...</span>
              <kbd className="hidden md:inline-flex pointer-events-none h-5 select-none items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-400">
                ⌘K
              </kbd>
            </Button>
          )}
        </div>
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-2">
        {/* Toggle Dark/Light Mode */}
        <ThemeToggleCompact />
        
        {/* Badge admin */}
        <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 border-orange-200 text-orange-700 bg-orange-50">
          <Shield className="w-3.5 h-3.5" />
          <span className="text-xs font-medium">Super Admin</span>
        </Badge>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0 shadow-xl border-slate-200">
            <div className="border-b border-slate-100 px-4 py-3 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">Notifications</h4>
                  <p className="text-xs text-slate-500">{unreadCount} non lue(s)</p>
                </div>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-orange-600 hover:text-orange-700 h-7"
                    onClick={markAllAsRead}
                  >
                    Tout marquer lu
                  </Button>
                )}
              </div>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {loadingNotifs ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                  <p className="text-sm text-slate-500">Chargement...</p>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !notification.lue ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.lue ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notification.titre}
                        </p>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{notification.description}</p>
                        <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(notification.created_at)}</p>
                      </div>
                      {!notification.lue && (
                        <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle2 className="w-8 h-8 text-green-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">Aucune notification</p>
                  <p className="text-xs text-slate-400">Vous êtes à jour !</p>
                </div>
              )}
            </div>

            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
              <button 
                onClick={() => window.location.href = '/admin/demandes'}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium w-text-center w-full"
              >
                Voir toutes les notifications →
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Séparateur */}
        <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block" />

        {/* Profil super admin */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-slate-100">
              <Avatar className="h-9 w-9 ring-2 ring-orange-100">
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-600 text-white text-sm font-bold">
                  SA
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-slate-800">Super Admin</span>
                <span className="text-xs text-slate-500">admin@mcnslp.ci</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="normal-case">
              <div className="flex flex-col">
                <span className="font-semibold">Super Administrateur</span>
                <span className="text-xs text-slate-500 font-normal">admin@mcnslp.ci</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Mon profil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres du compte
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={async () => {
                try {
                  await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'signout' })
                  })
                  window.location.href = '/(auth)/connexion'
                } catch (error) {
                  console.error('Erreur déconnexion:', error)
                }
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
