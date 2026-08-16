'use client'

import React, { useState } from 'react'
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
  ChevronDown,
  Shield,
  AlertCircle,
  BarChart3,
  FileText,
  Download,
  TrendingUp,
  LogOut,
  Bell,
  UserCircle,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
  pendingRequestsCount?: number
  unreadNotificationsCount?: number
}

// Navigation sections avec support de collapse
interface NavSection {
  title: string
  items: NavItem[]
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badgeKey?: string
  badgeValue?: number
  badgeColor?: string
}

const mainNavigation: NavSection = {
  title: 'Principal',
  items: [
    {
      title: 'Tableau de bord',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: "Demandes d'abonnement",
      href: '/admin/demandes',
      icon: ClipboardList,
      badgeKey: 'pendingRequests',
      badgeColor: 'bg-red-500',
    },
    {
      title: 'Organisations',
      href: '/admin/organisations',
      icon: Building2,
    },
    {
      title: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
      badgeKey: 'unreadNotifications',
      badgeColor: 'bg-[#F77F00]',
    },
    {
      title: 'Plans & Tarifs',
      href: '/admin/plans',
      icon: Package,
    },
    {
      title: "Codes d'activation",
      href: '/admin/codes-activation',
      icon: Key,
    },
  ]
}

const reportsNavigation: NavSection = {
  title: 'Rapports & Analyses',
  items: [
    {
      title: 'Vue d\'ensemble',
      href: '/admin/rapports',
      icon: BarChart3,
    },
    {
      title: 'Rapport activités',
      href: '/admin/rapports/activites',
      icon: FileText,
    },
    {
      title: 'Export données',
      href: '/admin/rapports/export',
      icon: Download,
    },
    {
      title: 'Statistiques',
      href: '/admin/rapports/statistiques',
      icon: TrendingUp,
    },
  ]
}

const systemNavigation: NavItem[] = [
  {
    title: 'Utilisateurs',
    href: '/admin/utilisateurs',
    icon: Users,
  },
  {
    title: 'Journal d\'activité',
    href: '/admin/logs',
    icon: Activity,
  },
  {
    title: 'Configuration',
    href: '/admin/config',
    icon: Settings,
  },
]

export function AdminSidebar({ collapsed, onToggle, pendingRequestsCount = 0, unreadNotificationsCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname()
  const [reportsExpanded, setReportsExpanded] = useState(false)
  
  // Check if any reports item is active
  const isReportsActive = reportsNavigation.items.some(item => 
    pathname === item.href || pathname?.startsWith(item.href + '/')
  )

  // Get badge value for an item
  const getBadgeValue = (item: NavItem) => {
    if (item.badgeKey === 'pendingRequests') return pendingRequestsCount
    if (item.badgeKey === 'unreadNotifications') return unreadNotificationsCount
    return item.badgeValue || 0
  }

  // Render navigation item
  const renderNavItem = (item: NavItem, sectionTitle?: string) => {
    const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href))
    const badgeValue = getBadgeValue(item)

    const navContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
          isActive 
            ? "bg-gradient-to-r from-[#F77F00]/20 to-[#F77F00]/10 text-[#F77F00] font-medium border-l-2 border-[#F77F00]" 
            : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
        )}
      >
        <item.icon className={cn(
          "w-5 h-5 flex-shrink-0 transition-colors",
          isActive ? "text-[#F77F00]" : "text-slate-400 group-hover:text-white"
        )} />
        
        {!collapsed && (
          <>
            <span className="flex-1 truncate">{item.title}</span>
            {badgeValue > 0 && (
              <Badge 
                variant="destructive" 
                className={cn(
                  "h-5 min-w-5 px-1.5 text-[10px] font-bold",
                  item.badgeColor || "bg-red-500 hover:bg-red-600"
                )}
              >
                {badgeValue > 99 ? '99+' : badgeValue}
              </Badge>
            )}
          </>
        )}
        
        {isActive && !collapsed && (
          <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#F77F00] animate-pulse" />
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
            {badgeValue > 0 && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
                {badgeValue}
              </span>
            )}
          </TooltipContent>
        </Tooltip>
      )
    }

    return navContent
  }

  return (
    <TooltipProvider delayDuration={0}>
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white transition-all duration-300 flex flex-col shadow-xl shadow-black/20",
        collapsed ? "w-16" : "w-72"
      )}>
        {/* Logo / Header Admin */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F77F00] to-red-600 flex items-center justify-center shadow-lg shadow-[#F77F00]/30 group-hover:shadow-[#F77F00]/50 transition-shadow">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight text-white tracking-tight">e-OSCS</h1>
                <p className="text-[10px] font-semibold text-[#F77F00] uppercase tracking-widest">Administration</p>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin" className="mx-auto">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F77F00] to-red-600 flex items-center justify-center shadow-lg">
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
              collapsed && "absolute -right-3 top-6 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full z-50 shadow-lg"
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        {/* Super Admin Badge */}
        {!collapsed && (
          <div className="mx-4 mt-4 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#F77F00]/15 to-red-600/10 border border-[#F77F00]/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-[#F77F00]/20">
                <AlertCircle className="w-3.5 h-3.5 text-[#F77F00]" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-[#FFA940] block">Mode Super Admin</span>
                <span className="text-[10px] text-slate-400">Accès complet</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 py-4 space-y-6 px-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          
          {/* Principal Section */}
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F77F00]" />
                {mainNavigation.title}
              </p>
            )}
            
            <div className="space-y-1">
              {mainNavigation.items.map((item) => (
                <div key={item.href}>{renderNavItem(item)}</div>
              ))}
            </div>
          </div>

          {/* Reports Section (Collapsible) */}
          <div>
            {!collapsed ? (
              <>
                <button
                  onClick={() => setReportsExpanded(!reportsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 transition-colors group"
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${isReportsActive ? 'bg-[#009E60]' : 'bg-[#009E60]/50'}`} />
                    Rapports & Analyses
                  </span>
                  <ChevronDown className={cn(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    reportsExpanded && "rotate-180"
                  )} />
                </button>
                
                <div className={cn(
                  "space-y-1 overflow-hidden transition-all duration-300",
                  reportsExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                  {reportsNavigation.items.map((item) => (
                    <div key={item.href}>{renderNavItem(item)}</div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/admin/rapports"
                      className={cn(
                        "flex items-center justify-center px-3 py-2.5 rounded-lg transition-all duration-200 mx-auto w-10",
                        isReportsActive
                          ? "bg-gradient-to-r from-[#009E60]/20 to-[#009E60]/10 text-[#009E60]"
                          : "text-slate-400 hover:bg-slate-800/80 hover:text-white"
                      )}
                    >
                      <BarChart3 className="w-5 h-5" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-slate-800 border-slate-700 text-white font-medium">
                    Rapports & Analyses
                  </TooltipContent>
                </Tooltip>
                
                <div className="w-8 h-px bg-slate-800 mx-auto my-2" />
              </>
            )}
          </div>

          {/* System Section */}
          <div>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                Système
              </p>
            )}
            
            <div className="space-y-1">
              {systemNavigation.map((item) => (
                <div key={item.href}>{renderNavItem(item)}</div>
              ))}
            </div>
          </div>
        </nav>

        {/* User Info Section */}
        <div className="py-3 px-3 border-t border-slate-800/80 space-y-3">
          {/* Notification summary when not collapsed */}
          {!collapsed && pendingRequestsCount > 0 && (
            <Link 
              href="/admin/demandes?statut=NOUVELLE"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition-colors group"
            >
              <div className="relative">
                <Bell className="w-4 h-4 text-red-400" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-red-300">{pendingRequestsCount} demande(s) en attente</p>
                <p className="text-[10px] text-red-400/70">Cliquez pour traiter</p>
              </div>
              <ChevronRight className="w-4 h-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}

          {/* User Profile Card */}
          <div className={cn(
            "rounded-xl transition-all duration-200",
            collapsed ? "flex justify-center py-2" : "bg-slate-800/50 border border-slate-700/30 p-3"
          )}>
            {collapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-9 w-9 ring-2 ring-[#F77F00]/50 cursor-pointer hover:ring-[#F77F00] transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-[#F77F00] to-red-600 text-white text-sm font-bold">
                      SA
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-slate-800 border-slate-700">
                  <div className="text-center">
                    <p className="font-medium">Super Admin</p>
                    <p className="text-xs text-slate-400">admin@mcnslp.ci</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-[#F77F00]/50 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-[#F77F00] to-red-600 text-white text-sm font-bold">
                    SA
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">Super Administrateur</p>
                  <p className="text-[11px] text-slate-400 truncate">admin@mcnslp.ci</p>
                </div>
                <DropdownMenuButton />
              </div>
            )}
          </div>

          {/* Version info */}
          {!collapsed && (
            <div className="px-2 pt-2">
              <p className="text-[10px] text-slate-600 text-center font-mono">
                e-OSCS v2.4.1 — MCNSLP CI
              </p>
            </div>
          )}
        </div>
      </aside>
      
      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
      `}</style>
    </TooltipProvider>
  )
}

// Dropdown menu button for user actions
function DropdownMenuButton() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-2 border-b border-slate-700">
              <p className="text-xs font-semibold text-white px-2 py-1">Compte</p>
            </div>
            <div className="p-1">
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <UserCircle className="w-4 h-4" />
                Mon profil
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4" />
                Paramètres
              </Link>
            </div>
            <div className="border-t border-slate-700 p-1">
              <button
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <LogOut className="w-4 h-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
