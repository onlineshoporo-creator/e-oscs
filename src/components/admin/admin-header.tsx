'use client'

import React, { useState } from 'react'
import { Bell, Search, User, LogOut, Settings, Menu, Shield } from 'lucide-react'
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

interface AdminHeaderProps {
  onToggleSidebar?: () => void
}

const adminNotifications = [
  {
    id: 1,
    title: 'Nouvelle demande d\'abonnement',
    description: 'DR Lagune - Abidjan souhaite rejoindre la plateforme',
    time: 'Il y a 5 min',
    unread: true,
    type: 'request' as const
  },
  {
    id: 2,
    title: 'Organisation activée',
    description: 'DR DÉMO Abidjan est maintenant active',
    time: 'Il y a 1h',
    unread: true,
    type: 'success' as const
  },
  {
    id: 3,
    title: 'Paiement reçu',
    description: 'Plan Pro - DR Bas-Sassandra (25 000 FCFA)',
    time: 'Il y a 3h',
    unread: false,
    type: 'payment' as const
  },
  {
    id: 4,
    title: 'Système mis à jour',
    description: 'Migration de base de données terminée avec succès',
    time: 'Hier',
    unread: false,
    type: 'system' as const
  },
]

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const unreadCount = adminNotifications.filter(n => n.unread).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request':
        return <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-orange-600">📋</span>
        </div>
      case 'success':
        return <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-green-600">✓</span>
        </div>
      case 'payment':
        return <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-blue-600">💰</span>
        </div>
      default:
        return <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-slate-600">⚙️</span>
        </div>
    }
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
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
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
                <Button variant="ghost" size="sm" className="text-xs text-orange-600 hover:text-orange-700 h-7">
                  Tout marquer lu
                </Button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {adminNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                    notification.unread ? 'bg-orange-50/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.unread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{notification.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                    </div>
                    {notification.unread && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium w-text-center w-full">
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
            <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
