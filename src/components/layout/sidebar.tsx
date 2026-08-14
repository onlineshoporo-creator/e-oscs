'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard,
  ClipboardList,
  CheckSquare,
  BarChart3,
  FileText,
  Building2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

const navigationItems = [
  {
    title: 'Tableau de bord',
    href: '/app/dashboard',
    icon: LayoutDashboard,
    badge: null
  },
  {
    title: 'Activités',
    href: '/app/activites',
    icon: ClipboardList,
    badge: null
  },
  {
    title: 'Validation',
    href: '/app/validation',
    icon: CheckSquare,
    badge: '5'
  },
  {
    title: 'Analytics',
    href: '/app/analytics',
    icon: BarChart3,
    badge: null
  },
  {
    title: 'Rapports',
    href: '/app/rapports',
    icon: FileText,
    badge: null
  },
]

const bottomItems = [
  {
    title: 'Organisations',
    href: '/app/organisations',
    icon: Building2,
  },
  {
    title: 'Paramètres',
    href: '/app/settings',
    icon: Settings,
  },
]

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-slate-900 text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo / Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          {!collapsed && (
            <Link href="/app/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">e-OSCS</h1>
                <p className="text-[10px] text-slate-400 leading-tight">MCNSLP CI</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/app/dashboard" className="mx-auto">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className={cn(
              "text-slate-400 hover:text-white hover:bg-slate-800",
              collapsed && "absolute -right-3 top-6 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full"
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Menu Principal
            </p>
          )}
          
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            
            const navContent = (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive 
                    ? "bg-orange-500/20 text-orange-400 font-medium" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive && "text-orange-400"
                )} />
                {!collapsed && (
                  <>
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-orange-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {isActive && !collapsed && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-orange-400" />
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    {navContent}
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white">
                    {item.title}
                    {item.badge && <span className="ml-2 text-orange-400">({item.badge})</span>}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navContent
          })}
        </nav>

        {/* Navigation bas */}
        <div className="py-4 px-2 border-t border-slate-700">
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
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white">
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return navContent
          })}
        </div>
      </aside>
    </TooltipProvider>
  )
}
