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
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

// Navigation simplifiée pour l'Agent
const agentNavigation = [
  {
    title: 'Accueil',
    href: '/agent',
    icon: Home,
    description: 'Retour à l\'accueil'
  },
  {
    title: 'Mes activités',
    href: '/agent/activites',
    icon: ClipboardList,
    description: 'Voir toutes mes activités'
  },
  {
    title: 'Nouvelle activité',
    href: '/agent/activites/nouvelle',
    icon: PlusCircle,
    description: 'Créer une nouvelle activité',
    highlight: true
  },
  {
    title: 'Brouillons',
    href: '/agent/brouillons',
    icon: FileEdit,
    description: 'Activités en cours de rédaction'
  },
  {
    title: 'Activités soumises',
    href: '/agent/soumises',
    icon: CheckCircle2,
    description: 'Activités envoyées pour validation'
  },
  {
    title: 'Rapports',
    href: '/agent/rapports',
    icon: BarChart3,
    description: 'Consulter les rapports'
  },
  {
    title: 'Mon profil',
    href: '/agent/profil',
    icon: UserCog,
    description: 'Gérer mon profil'
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
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
              mobile && "text-base",
              item.highlight
                ? "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25 font-semibold"
                : isActive
                  ? "bg-orange-50 text-orange-700 font-medium border border-orange-200"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 flex-shrink-0",
              item.highlight && "text-white"
            )} />
            <span className="flex-1">{item.title}</span>
            {item.highlight && (
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
                Nouveau
              </span>
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
          "hidden lg:flex flex-col w-72 bg-white border-r border-slate-200 min-h-screen sticky top-0",
          className
        )}
      >
        {/* Logo / En-tête */}
        <div className="p-5 border-b border-slate-100">
          <Link href="/agent" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/40 transition-shadow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">e-OSCS</h1>
              <p className="text-xs text-slate-500 font-medium">Espace Agent</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu Principal
          </p>
          {renderNavItems()}
        </div>

        {/* Pied de sidebar */}
        <div className="p-4 border-t border-slate-100">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4">
            <p className="text-sm font-medium text-slate-800">Besoin d'aide ?</p>
            <p className="text-xs text-slate-600 mt-1">
              Contactez votre responsable pour toute question.
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-3 text-orange-600 hover:text-orange-700 hover:bg-orange-100 w-full justify-start"
            >
              Voir le guide utilisateur
            </Button>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile (Sheet) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <Link href="/agent" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-900">e-OSCS</span>
        </Link>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-slate-600">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
            <div className="p-5 border-b border-slate-100">
              <Link href="/agent" className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-900">e-OSCS</h1>
                  <p className="text-xs text-slate-500 font-medium">Espace Agent</p>
                </div>
              </Link>
            </div>
            <div className="p-4">
              <p className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Menu Principal
              </p>
              {renderNavItems(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export { agentNavigation }
