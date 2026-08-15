'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Building2, 
  Loader2,
  Search,
  X,
  Command,
  FileText,
  Users,
  ClipboardList,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
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
    type: 'VALIDATION' as const,
    titre: 'Activité validée',
    message: 'Votre activité "Sensibilisation communautaire" a été validée.',
    lue: false,
    date: 'Il y a 10 min',
    link: '/agent/soumises',
  },
  {
    id: 'notif-2',
    type: 'INFO' as const,
    titre: 'Rappel mensuel',
    message: 'N\'oubliez pas de saisir vos activités du mois.',
    lue: false,
    date: 'Il y a 2h',
    link: null,
  },
  {
    id: 'notif-3',
    type: 'REJET' as const,
    titre: 'Activité à corriger',
    message: 'Votre activité "Réunion de coordination" nécessite des corrections.',
    lue: true,
    date: 'Hier',
    link: '/agent/soumises',
  },
  {
    id: 'notif-4',
    type: 'SYSTEME' as const,
    titre: 'Nouvelle fonctionnalité',
    message: 'Découvrez le nouveau tableau de bord avec statistiques.',
    lue: true,
    date: 'Il y a 3 jours',
    link: null,
  },
]

// Résultats de recherche mockés
const MOCK_SEARCH_RESULTS = [
  { type: 'activity', title: 'Sensibilisation hygiène communautaire', href: '/agent/activites', icon: ClipboardList },
  { type: 'activity', title: 'Distribution kits scolaires', href: '/agent/activites', icon: FileText },
  { type: 'page', title: 'Mes rapports', href: '/agent/rapports', icon: BarChart3 },
  { type: 'page', title: 'Mon profil', href: '/agent/profil', icon: User },
  { type: 'action', title: 'Créer une nouvelle activité', href: '/agent/activites/nouvelle', icon: Search },
]

// Import BarChart3 pour les résultats de recherche
function BarChart3(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  )
}

interface AgentHeaderProps {
  user: UserData
}

export function AgentHeader({ user }: AgentHeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [unreadCount, setUnreadCount] = useState(MOCK_NOTIFICATIONS.filter(n => !n.lue).length)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [showSearchShortcuts, setShowSearchShortcuts] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Raccourci clavier pour la recherche
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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

  // Filtrer les résultats de recherche
  const filteredResults = searchQuery.trim() === '' 
    ? [] 
    : MOCK_SEARCH_RESULTS.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
      )

  // Marquer comme lu
  const markAsRead = (id: string) => {
    // En production: appel API
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  // Marquer tout comme lu
  const markAllAsRead = () => {
    setUnreadCount(0)
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-slate-200 px-4 lg:px-6 flex items-center justify-between gap-4 lg:ml-0">
      {/* Recherche globale */}
      <div className="flex-1 max-w-xl">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox"
              aria-expanded={searchOpen}
              className="w-full justify-between text-left font-normal h-10 bg-slate-50 border-slate-200 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2 text-slate-400">
                <Search className="w-4 h-4" />
                Rechercher...
              </span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[420px] p-0">
            {/* Input de recherche */}
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <Input
                placeholder="Rechercher des activités, pages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 focus-visible:ring-0 h-11"
                autoFocus
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="rounded-full p-1 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Résultats */}
            <div className="max-h-[300px] overflow-y-auto">
              {filteredResults.length > 0 ? (
                <div className="p-2">
                  <p className="px-2 py-1.5 text-xs font-medium text-slate-500">Résultats</p>
                  {filteredResults.map((result, index) => (
                    <Link
                      key={index}
                      href={result.href}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                        <result.icon className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900">{result.title}</p>
                        <p className="text-xs text-slate-500 capitalize">{result.type}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="py-8 text-center">
                  <Search className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-500">Aucun résultat trouvé</p>
                  <p className="text-xs text-slate-400 mt-1">Essayez d&apos;autres mots-clés</p>
                </div>
              ) : showSearchShortcuts ? (
                <div className="p-4 space-y-3">
                  <p className="px-2 py-1.5 text-xs font-medium text-slate-500">Actions rapides</p>
                  
                  <Link 
                    href="/agent/activites/nouvelle" 
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-orange-50 transition-colors group"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F77F00]/10 group-hover:bg-[#F77F00] transition-colors">
                      <Search className="h-4 w-4 text-[#F77F00] group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Nouvelle activité</p>
                      <p className="text-xs text-slate-500">Démarrer une saisie</p>
                    </div>
                  </Link>

                  <Link 
                    href="/agent/activites" 
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                      <ClipboardList className="h-4 w-4 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Voir mes activités</p>
                      <p className="text-xs text-slate-500">Consulter la liste complète</p>
                    </div>
                  </Link>

                  <Link 
                    href="/agent/rapports" 
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">Mes rapports</p>
                      <p className="text-xs text-slate-500">Statistiques et export</p>
                    </div>
                  </Link>
                </div>
              ) : null}
            </div>

            {/* Footer */}
            <div className="border-t p-2">
              <div className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-400">
                <span>Recherche rapide</span>
                <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-white px-1.5 font-mono text-[10px]">
                  ↑↓ naviguer
                </kbd>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Actions droite */}
      <div className="flex items-center gap-2">
        {/* Notifications améliorées */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100 h-10 w-10"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-5 h-5 bg-gradient-to-r from-[#F77F00] to-[#E67300] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg animate-pulse-once">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-96 p-0">
            {/* Header notifications */}
            <div className="border-b border-slate-100 px-4 py-3 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-slate-900">Notifications</h4>
                <p className="text-xs text-slate-500">{unreadCount} non lue(s)</p>
              </div>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs text-[#F77F00] hover:text-[#E67300]"
                  onClick={markAllAsRead}
                >
                  Tout marquer comme lu
                </Button>
              )}
            </div>
            
            {/* Liste des notifications */}
            <div className="max-h-80 overflow-y-auto">
              {MOCK_NOTIFICATIONS.map((notification) => (
                <div
                  key={notification.id}
                  className={`block px-4 py-3 border-b border-slate-50 last:border-0 transition-colors ${
                    !notification.lue ? 'bg-orange-50/30 hover:bg-orange-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <Link 
                    href={notification.link || '#'} 
                    className="block"
                    onClick={() => !notification.lue && markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.lue && (
                        <span className="w-2 h-2 rounded-full bg-[#F77F00] mt-2 flex-shrink-0 ring-4 ring-orange-100" />
                      )}
                      {notification.lue && (
                        <span className="w-2 h-2 rounded-full bg-slate-300 mt-2 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm leading-tight ${
                            !notification.lue ? 'font-semibold text-slate-900' : 'text-slate-700'
                          }`}>
                            {notification.titre}
                          </p>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap">
                            {notification.date}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 line-clamp-2 ${
                          !notification.lue ? 'text-slate-600' : 'text-slate-500'
                        }`}>
                          {notification.message}
                        </p>
                        
                        {/* Badge type notification */}
                        <div className="mt-2">
                          {notification.type === 'VALIDATION' && (
                            <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] px-1.5 py-0">
                              ✓ Validé
                            </Badge>
                          )}
                          {notification.type === 'REJET' && (
                            <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0">
                              ✗ À corriger
                            </Badge>
                          )}
                          {notification.type === 'INFO' && (
                            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px] px-1.5 py-0">
                              ℹ Info
                            </Badge>
                          )}
                          {notification.type === 'SYSTEME' && (
                            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px] px-1.5 py-0">
                              ⚙ Système
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100">
              <Link
                href="/agent/profil?tab=notifications"
                className="block text-sm text-[#F77F00] hover:text-[#E67300] font-medium text-center"
              >
                Voir toutes les notifications →
              </Link>
            </div>
          </PopoverContent>
        </Popover>

        {/* Profil utilisateur amélioré */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-3 hover:bg-slate-100 h-10">
              <Avatar className="h-8 w-8 ring-2 ring-orange-100">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-[#F77F00] to-[#E67300] text-white text-sm font-medium">
                  {getInitials(user.name || 'U')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {user.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            {/* Info utilisateur */}
            <DropdownMenuLabel className="pb-2">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-orange-100">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#F77F00] to-[#E67300] text-white font-medium">
                      {getInitials(user.name || 'U')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                
                {user.organization && (
                  <Badge variant="secondary" className="w-fit text-xs bg-slate-100">
                    <Building2 className="w-3 h-3 mr-1" />
                    {user.organization}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator />
            
            {/* Liens rapides */}
            <DropdownMenuItem asChild>
              <Link href="/agent/profil" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuItem asChild>
              <Link href="/agent/profil?tab=preferences" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            {/* Déconnexion */}
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
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
