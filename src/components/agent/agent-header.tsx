'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bell, User, LogOut, Settings, Building2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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

interface UserData {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  organization?: string | null
  organizationId?: string | null
}

// Notifications mockées pour l'agent (seront remplacées par l'API)
const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'VALIDATION',
    titre: 'Activité validée',
    message: 'Votre activité "Sensibilisation communautaire" a été validée.',
    lue: false,
    date: 'Il y a 10 min',
  },
  {
    id: 'notif-2',
    type: 'INFO',
    titre: 'Rappel mensuel',
    message: 'N\'oubliez pas de saisir vos activités du mois.',
    lue: false,
    date: 'Il y a 2h',
  },
]

interface AgentHeaderProps {
  user: UserData
}

export function AgentHeader({ user }: AgentHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFICATIONS.filter(n => !n.lue).length)
  const router = useRouter()
  const supabase = createClient()

  // Générer les initiales pour l'avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

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

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 lg:ml-0">
      {/* Espace vide à gauche pour équilibrer le layout */}
      <div className="flex-1" />

      {/* Actions droite */}
      <div className="flex items-center gap-2">
        {/* Notifications simplifiées */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-10 w-10"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse-once">
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
            
            <div className="max-h-64 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((notification) => (
                <div
                  key={notification.id}
                  className={`block px-4 py-3 border-b border-slate-50 ${
                    !notification.lue ? 'bg-orange-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!notification.lue && (
                      <span className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${
                        !notification.lue ? 'font-medium text-slate-900' : 'text-slate-700'
                      }`}>
                        {notification.titre}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {notification.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="px-4 py-2 border-t border-slate-100">
              <Link
                href="/agent/profil"
                className="block text-sm text-orange-600 hover:text-orange-700 font-medium text-center"
              >
                Voir toutes les notifications →
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profil utilisateur simplifié */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-slate-100 h-10">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700 text-sm font-medium">
                  {getInitials(user.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                <span className="text-xs text-slate-500">{user.role}</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
                {user.organization && (
                  <Badge variant="secondary" className="w-fit text-xs mt-1">
                    <Building2 className="w-3 h-3 mr-1" />
                    {user.organization}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/agent/profil" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/agent/profil" className="flex items-center">
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
