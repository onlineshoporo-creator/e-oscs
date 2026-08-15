'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  ClipboardList,
  Building2,
  Package,
  Users,
  Settings,
  Key,
  ChevronLeft,
  ChevronRight,
  Shield,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
  pendingRequestsCount?: number
}

const navigationItems = [
  {
    title: 'Tableau de bord',
    href: '/admin',
    icon: LayoutDashboard,
    badge: null,
    section: 'principal' as const
  },
  {
    title: 'Demandes d\'abonnement',
    href: '/admin/demandes',
    icon: ClipboardList,
    badgeKey: 'pendingRequests' as const,
    section: 'principal' as const
  },
  {
    title: 'Organisations',
    href: '/admin/organisations',
    icon: Building2,
    badge: null,
    section: 'principal' as const
  },
  {
    title: 'Plans & Tarifs',
    href: '/admin/plans',
    icon: Package,
    badge: null,
    section: 'principal' as const
  },
  {
    title: 'Codes d\'activation',
    href: '/admin/codes-activation',
    icon: Key,
    badge: null,
    section: 'principal' as const
  },
]

const bottomItems = [
  {
    title: 'Utilisateurs',
    href: '/admin/utilisateurs',
    icon: Users,
  },
  {
    title: 'Configuration',
    href: '/admin/config',
    icon: Settings,
  },
]

export function AdminSidebar({ collapsed, onToggle, pendingRequestsCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col shadow-xl",
        collapsed ? "w-16" : "w-72"
      )}>
        {/* Logo / Header Admin */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/50">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight text-white">e-OSCS</h1>
                <p className="text-[10px] font-medium text-orange-400 uppercase tracking-wider">Administration</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
              collapsed && "absolute -right-3 top-6 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full z-50"
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Badge Super Admin */}
        {!collapsed && (
          <div className="mx-4 mt-4 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-medium text-orange-300">Mode Super Administrateur</span>
            </div>
          </div>
        )}

        {/* Navigation principale */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto overflow-x-hidden">
          {!collapsed && (
            <p className="px-3 mb-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Gestion
            </p>
          )}
          
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
            const badgeValue = item.badgeKey === 'pendingRequests' ? pendingRequestsCount : item.badge
            
            const navContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 font-medium border-l-2 border-orange-500" 
                    : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  isActive ? "text-orange-400" : "text-slate-400 group-hover:text-white"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>
                    {badgeValue !== null && badgeValue !== undefined && Number(badgeValue) > 0 && (
                      <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-[10px] font-bold bg-red-500 hover:bg-red-600">
                        {badgeValue > 99 ? '99+' : badgeValue}
                      </Badge>
                    )}
                  </>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {navContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white font-medium">
                    {item.title}
                    {badgeValue !== null && badgeValue !== undefined && Number(badgeValue) > 0 && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">{badgeValue}</span>
                    )}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navContent
          })}
        </nav>

        {/* Navigation bas */}
        <div className="py-3 px-2 border-t border-slate-700/50">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Système
            </p>
          )}
          
          {bottomItems.map((item) => {
            const isActive = pathname === item.href
            
            const navContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  isActive 
                    ? "bg-slate-800 text-white font-medium" 
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {navContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white font-medium">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navContent
          })}
        </div>

        {/* Footer info */}
        {!collapsed && (
          <div className="p-4 mx-2 mb-3 rounded-lg bg-slate-800/50 border border-slate-700/30">
            <p className="text-[10px] text-slate-500 text-center">
              e-OSCS v1.0 — MCNSLP CI
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  )
}
