'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Home,
  ClipboardList,
  PlusCircle,
  FileEdit,
  CheckCircle2,
  BarChart3,
  UserCog,
  Menu,
  X,
  Shield,
  Bell,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

// Navigation simplifiée pour l'Agent avec badges
const agentNavigation = [
  {
    title: 'Accueil',
    href: '/agent',
    icon: Home,
    description: 'Retour à l\'accueil',
    badge: null,
  },
  {
    title: 'Mes activités',
    href: '/agent/activites',
    icon: ClipboardList,
    description: 'Voir toutes mes activités',
    badge: null,
  },
  {
    title: 'Nouvelle activité',
    href: '/agent/activites/nouvelle',
    icon: PlusCircle,
    description: 'Créer une nouvelle activité',
    highlight: true,
    badge: null,
  },
  {
    title: 'Brouillons',
    href: '/agent/brouillons',
    icon: FileEdit,
    description: 'Activités en cours de rédaction',
    badge: { count: 2, variant: 'default' as const },
  },
  {
    title: 'Activités soumises',
    href: '/agent/soumises',
    icon: CheckCircle2,
    description: 'Activités envoyées pour validation',
    badge: { count: 1, variant: 'warning' as const },
  },
  {
    title: 'Rapports',
    href: '/agent/rapports',
    icon: BarChart3,
    description: 'Consulter les rapports',
    badge: null,
  },
  {
    title: 'Mon profil',
    href: '/agent/profil',
    icon: UserCog,
    description: 'Gérer mon profil',
    badge: null,
  }
]

interface AgentSidebarProps {
  className?: string
}

export function AgentSidebar({ className }: AgentSidebarProps) {
  const pathname = usePathname()

  const renderNavItems = (mobile?: boolean) => (
    <nav className={cn("space-y-1", mobile && "py-4")}>
      {agentNavigation.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/agent' && pathname?.startsWith(item.href))
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
              mobile && "text-base",
              item.highlight
                ? "bg-gradient-to-r from-[#F77F00] to-[#E67300] text-white hover:from-[#E67300] hover:to-[#d46800] shadow-lg shadow-orange-500/25 font-semibold"
                : isActive
                  ? "bg-[#F77F00]/10 text-[#F77F00] font-medium border border-[#F77F00]/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110",
              item.highlight && "text-white"
            )} />
            <span className="flex-1">{item.title}</span>
            
            {/* Badge notification */}
            {item.badge && (
              <Badge 
                variant={item.badge.variant === 'warning' ? 'secondary' : 'default'}
                className={cn(
                  "h-5 min-w-5 px-1.5 text-xs justify-center",
                  item.badge.variant === 'warning' && "bg-orange-100 text-orange-700 border-orange-200",
                  !item.highlight && isActive && "bg-[#F77F00] text-white border-transparent"
                )}
              >
                {item.badge.count}
              </Badge>
            )}
            
            {item.highlight && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs animate-pulse">
                Nouveau
              </span>
            )}
            
            {/* Indicateur actif */}
            {isActive && !item.highlight && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#F77F00] rounded-r-full" />
            )}
          </Link>
        )
      })}
    </nav>
  )

  // Version Desktop
  return (
    <>
      {/* Sidebar Desktop */}
      <aside 
        className={cn(
          "hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 min-h-screen sticky top-0 z-20",
          className
        )}
      >
        {/* Logo / En-tête */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/agent" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F77F00] to-[#E67300] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">e-OSCS</h1>
              <p className="text-xs text-slate-500 font-medium">Espace Agent</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu Principal
          </p>
          {renderNavItems()}
        </div>

        {/* Pied de sidebar avec utilisateur */}
        <div className="p-4 border-t border-slate-100 space-y-4">
          {/* Carte aide */}
          <div className="bg-gradient-to-r from-[#F77F00]/10 via-orange-50 to-[#009E60]/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Bell className="w-5 h-5 text-[#F77F00]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">Besoin d&apos;aide ?</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  Contactez votre responsable pour toute question.
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 w-full text-[#F77F00] hover:text-[#E67300] hover:bg-[#F77F00]/10 justify-start gap-2"
            >
              Voir le guide utilisateur
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </Button>
          </div>

          {/* Mini profil */}
          <Link href="/agent/profil" className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <Avatar className="h-9 w-9 ring-2 ring-orange-100">
              <AvatarImage src="" alt="User" />
              <AvatarFallback className="bg-[#F77F00] text-white text-sm font-medium">
                JB
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">Kouamé J.B.</p>
              <p className="text-xs text-slate-500 truncate">Agent</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* Sidebar Mobile (Sheet) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href="/agent" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#E67300] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">e-OSCS</span>
          
          {/* Badges notifications sur mobile */}
          <div className="flex items-center gap-1 ml-2">
            <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-orange-500 text-white">2</Badge>
            <Badge className="h-5 min-w-5 px-1.5 text-[10px] bg-yellow-500 text-white">1</Badge>
          </div>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-600 h-10 w-10">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            
            {/* Header du sheet */}
            <div className="p-5 border-b border-slate-100">
              <Link href="/agent" className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#F77F00] to-[#E67300] flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">e-OSCS</h1>
                  <p className="text-xs text-slate-500 font-medium">Espace Agent</p>
                </div>
              </Link>
              
              {/* Profil rapide dans le menu mobile */}
              <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#F77F00] text-white text-sm font-medium">
                    JB
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900">Kouamé Jean-Baptiste</p>
                  <p className="text-xs text-slate-500">jean-baptiste.k@exemple.ci</p>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Menu Principal
              </p>
              {renderNavItems(true)}
            </div>

            {/* Footer du sheet */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-white">
              <Link 
                href="/connexion" 
                className="flex items-center justify-center gap-2 py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Déconnexion
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export { agentNavigation }
