'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, User, LogOut, Settings, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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

const notifications = [
  {
    id: 1,
    title: 'Nouvelle activité à valider',
    description: 'Formation des cadres - Direction Technique',
    time: 'Il y a 5 min',
    unread: true,
  },
  {
    id: 2,
    title: 'Rapport mensuel disponible',
    description: 'Le rapport de janvier est prêt pour téléchargement',
    time: 'Il y a 1h',
    unread: true,
  },
  {
    id: 3,
    title: 'Activité mise à jour',
    description: 'Atelier de planification - Statut changé',
    time: 'Il y a 3h',
    unread: false,
  },
]

export function Header({ user }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  
  const unreadCount = notifications.filter(n => n.unread).length

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
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-slate-100 px-4 py-3">
              <h4 className="font-semibold text-slate-900">Notifications</h4>
              <p className="text-xs text-slate-500">{unreadCount} non lue(s)</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${
                    notification.unread ? 'bg-orange-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {notification.unread && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    )}
                    {!notification.unread && <span className="w-2 h-2 mt-2 flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${notification.unread ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{notification.description}</p>
                      <p className="text-xs text-slate-400 mt-1">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2 border-t border-slate-100">
              <button className="text-sm text-orange-600 hover:text-orange-700 font-medium w-text-center w-full">
                Voir toutes les notifications
              </button>
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
              <LogOut className="mr-2 h-4 w-4" />
              {isLoggingOut ? 'Déconnexion...' : 'Déconnexion'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
