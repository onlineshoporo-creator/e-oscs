'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Key,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  DollarSign,
  Target,
  UserPlus,
  BarChart3,
  PieChart,
  Zap,
  Download,
  FileSearch,
  Shield,
  Calendar,
  MoreHorizontal,
  RefreshCw,
  QrCode,
  ClipboardList,
  CreditCard,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Types pour les stats du dashboard SaaS
interface DashboardStats {
  totalUsers: number
  activeOrganizations: number
  pendingRequests: number
  codesGenerated: number
  monthlyRevenue: number
  conversionRate: number
  newUsersThisMonth: number
  newOrganizationsThisMonth: number
  usersTrend: 'up' | 'down' | 'stable'
  organizationsTrend: 'up' | 'down' | 'stable'
  revenueTrend: 'up' | 'down' | 'stable'
  conversionTrend: 'up' | 'down' | 'stable'
}

interface MonthlyRevenue {
  month: string
  revenue: number
  subscriptions: number
}

interface OrganizationType {
  type: string
  count: number
  percentage: number
}

interface SystemEvent {
  id: string
  action: string
  description: string
  date: string
  type: 'connexion' | 'code' | 'demande' | 'admin' | 'system'
}

// Données mock pour le développement SaaS
const mockStats: DashboardStats = {
  totalUsers: 156,
  activeOrganizations: 24,
  pendingRequests: 12,
  codesGenerated: 89,
  monthlyRevenue: 2850000,
  conversionRate: 68,
  newUsersThisMonth: 23,
  newOrganizationsThisMonth: 4,
  usersTrend: 'up',
  organizationsTrend: 'up',
  revenueTrend: 'up',
  conversionTrend: 'up',
}

const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: 'Sept', revenue: 1850000, subscriptions: 16 },
  { month: 'Oct', revenue: 2100000, subscriptions: 18 },
  { month: 'Nov', revenue: 2250000, subscriptions: 19 },
  { month: 'Déc', revenue: 2450000, subscriptions: 21 },
  { month: 'Jan', revenue: 2680000, subscriptions: 22 },
  { month: 'Fév', revenue: 2850000, subscriptions: 24 },
]

const mockOrgTypes: OrganizationType[] = [
  { type: 'DR (Direction Régionale)', count: 14, percentage: 58 },
  { type: 'DD (Direction Départementale)', count: 10, percentage: 42 },
]

const mockSystemEvents: SystemEvent[] = [
  { id: '1', action: 'Nouvelle inscription', description: 'Un nouvel utilisateur a créé un compte', date: '2025-02-15T10:30:00', type: 'connexion' },
  { id: '2', action: 'Code généré', description: "Code d'activation créé pour PRO", date: '2025-02-15T09:45:00', type: 'code' },
  { id: '3', action: 'Demande reçue', description: 'Nouvelle demande d\'abonnement de DR Lôh-Djiboua', date: '2025-02-15T08:20:00', type: 'demande' },
  { id: '4', action: 'Code activé', description: 'Code ESSENTIEL-789 activé par une organisation', date: '2025-02-14T17:30:00', type: 'code' },
  { id: '5', action: 'Connexion admin', description: 'Super Admin connecté depuis Abidjan', date: '2025-02-14T14:15:00', type: 'admin' },
  { id: '6', action: 'Sauvegarde auto', description: 'Sauvegarde de la base de données réussie', date: '2025-02-14T06:00:00', type: 'system' },
  { id: '7', action: 'Plan modifié', description: 'Tarif plan INSTITUTIONNEL mis à jour', date: '2025-02-13T11:45:00', type: 'admin' },
  { id: '8', action: 'Demande approuvée', description: 'Abonnement approuvé pour DD Yamoussoukro', date: '2025-02-13T10:00:00', type: 'demande' },
]

// Composant Sparkline CSS
function Sparkline({ data, color = '#F77F00', trend }: { data: number[]; color?: string; trend?: 'up' | 'down' | 'stable' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')
  
  return (
    <svg viewBox="0 0 100 40" className="w-full h-10 overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="100" cy={100 - ((data[data.length - 1] - min) / range) * 100} r="3" fill={color} />
    </svg>
  )
}

// Composant KPI Card enrichi
interface KPICardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: 'up' | 'down' | 'stable'
  trendValue?: string
  description?: string
  colorClass: string
  iconBgClass: string
  sparkData?: number[]
  sparkColor?: string
  hasAlert?: boolean
  alertCount?: number
  prefix?: string
  suffix?: string
}

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
  iconBgClass,
  sparkData,
  sparkColor = '#F77F00',
  hasAlert = false,
  alertCount = 0,
  prefix = '',
  suffix = '',
}: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  
  // Determine gradient for accent bar
  const getAccentGradient = () => {
    if (iconBgClass.includes('orange')) return 'bg-gradient-to-r from-orange-500 to-amber-500'
    if (iconBgClass.includes('green') || iconBgClass.includes('emerald')) return 'bg-gradient-to-r from-green-500 to-emerald-500'
    if (iconBgClass.includes('blue')) return 'bg-gradient-to-r from-blue-500 to-cyan-500'
    if (iconBgClass.includes('purple')) return 'bg-gradient-to-r from-purple-500 to-pink-500'
    if (iconBgClass.includes('amber')) return 'bg-gradient-to-r from-amber-500 to-yellow-500'
    if (iconBgClass.includes('slate')) return 'bg-gradient-to-r from-slate-400 to-slate-500'
    return 'bg-gradient-to-r from-[#F77F00] to-amber-500'
  }
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200/80 hover:border-slate-300 bg-white/80 backdrop-blur-sm overflow-hidden relative">
      {/* Accent bar top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${getAccentGradient()}`} />
      
      <CardContent className="p-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
              {hasAlert && alertCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold animate-pulse">
                  {alertCount > 99 ? '99+' : alertCount}
                </span>
              )}
            </div>
            
            <div className="flex items-baseline gap-2 flex-wrap">
              <p className="text-3xl font-black text-slate-900 tracking-tight">
                {prefix}{value}{suffix}
              </p>
              {trend && (
                <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full ${
                  trend === 'up' ? 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-600/20' :
                  trend === 'down' ? 'text-red-700 bg-red-50 ring-1 ring-red-600/20' :
                  'text-slate-600 bg-slate-100 ring-1 ring-slate-300'
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {trendValue}
                </span>
              )}
            </div>
            
            {description && (
              <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
            )}
            
            {/* Sparkline */}
            {sparkData && sparkData.length > 0 && (
              <div className="w-24 h-10 -ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <Sparkline data={sparkData} color={sparkColor} trend={trend} />
              </div>
            )}
          </div>
          
          <div className={`p-3 rounded-2xl ${iconBgClass} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Composant Bar Chart Horizontal (Revenus mensuels)
function RevenueBarChart({ data }: { data: MonthlyRevenue[] }) {
  const maxValue = Math.max(...data.map(d => d.revenue))
  
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`
    }
    return `${(amount / 1000).toFixed(0)}K`
  }
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.month} className="group flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 w-9 text-right">{item.month}</span>
          <div className="flex-1 relative h-8 bg-slate-100/80 rounded-lg overflow-hidden">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex">
              {[25, 50, 75].map((percent) => (
                <div key={percent} className="h-full border-l border-slate-200/50" style={{ left: `${percent}%` }} />
              ))}
            </div>
            {/* Bar animation */}
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#009E60] to-[#34D399] rounded-lg transition-all duration-700 ease-out group-hover:from-[#008C55] group-hover:to-[#009E60] shadow-sm"
              style={{ 
                width: `${(item.revenue / maxValue) * 100}%`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-lg" />
            </div>
            {/* Value label */}
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-700">
              {formatCurrency(item.revenue)} FCFA
            </span>
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-[#009E60] to-[#34D399]" />
          <span className="text-xs text-slate-500">Revenus d'abonnements</span>
        </div>
        <span className="text-xs font-medium text-slate-600">
          Total: {formatCurrency(data.reduce((a, b) => a + b.revenue, 0))} FCFA
        </span>
      </div>
    </div>
  )
}

// Composant Donut Chart CSS (Répartition par type d'organisation)
function OrganizationTypeDonut() {
  const data = [
    { label: 'Directions Régionales (DR)', count: 14, color: '#F77F00', percentage: 58 },
    { label: 'Directions Départementales (DD)', count: 10, color: '#009E60', percentage: 42 },
  ]
  
  let cumulativePercentage = 0
  const radius = 45
  const circumference = 2 * Math.PI * radius
  
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Donut SVG */}
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((segment) => {
            const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`
            const strokeDashoffset = -(cumulativePercentage / 100) * circumference
            cumulativePercentage += segment.percentage
            
            return (
              <circle
                key={segment.label}
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-500 hover:opacity-80"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                }}
              />
            )
          })}
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-900">24</span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Total</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-2 w-full">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{item.label}</p>
              <p className="text-[10px] text-slate-400">{item.count} ({item.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Composant Timeline Événements Système
function SystemTimeline({ events }: { events: SystemEvent[] }) {
  const eventTypeConfig = {
    connexion: { icon: Users, bgClass: 'bg-blue-100 text-blue-600 ring-blue-200' },
    code: { icon: Key, bgClass: 'bg-cyan-100 text-cyan-600 ring-cyan-200' },
    demande: { icon: ClipboardList, bgClass: 'bg-orange-100 text-orange-600 ring-orange-200' },
    admin: { icon: Shield, bgClass: 'bg-purple-100 text-purple-600 ring-purple-200' },
    system: { icon: Activity, bgClass: 'bg-green-100 text-green-600 ring-green-200' },
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    
    if (diffHours < 1) return 'À l\'instant'
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffHours < 48) return 'Hier'
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }
  
  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />
      
      {events.slice(0, 5).map((event) => {
        const config = eventTypeConfig[event.type]
        const EventIcon = config.icon
        
        return (
          <div key={event.id} className="relative flex gap-4 pb-5 last:pb-0 group">
            {/* Timeline dot */}
            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${config.bgClass} ring-2`}>
              <EventIcon className="w-3.5 h-3.5" />
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-[#F77F00] transition-colors">
                    {event.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{event.description}</p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                  {formatDate(event.date)}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch existing stats API
        const statsRes = await fetch('/api/admin/stats')
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats({
            totalUsers: statsData.totalUsers || mockStats.totalUsers,
            activeOrganizations: statsData.activeOrganizations || mockStats.activeOrganizations,
            pendingRequests: statsData.pendingRequests || mockStats.pendingRequests,
            codesGenerated: statsData.codesGenerated || mockStats.codesGenerated,
            monthlyRevenue: statsData.monthlyRevenue || mockStats.monthlyRevenue,
            conversionRate: statsData.conversionRate || mockStats.conversionRate,
            newUsersThisMonth: statsData.newUsersThisMonth || mockStats.newUsersThisMonth,
            newOrganizationsThisMonth: statsData.newOrganizationsThisMonth || mockStats.newOrganizationsThisMonth,
            usersTrend: statsData.usersTrend || mockStats.usersTrend,
            organizationsTrend: statsData.organizationsTrend || mockStats.organizationsTrend,
            revenueTrend: statsData.revenueTrend || mockStats.revenueTrend,
            conversionTrend: statsData.conversionTrend || mockStats.conversionTrend,
          })
        } else {
          setStats(mockStats)
        }

        // Use mock events for now (API can be connected later)
        setSystemEvents(mockSystemEvents)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        // Fallback to mock data
        setStats(mockStats)
        setSystemEvents(mockSystemEvents)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  // Sparkline data for each KPI
  const usersSparkData = [120, 132, 138, 145, 150, 156]
  const orgsSparkData = [18, 19, 20, 21, 22, 24]
  const revenueSparkData = [1850, 2100, 2250, 2450, 2680, 2850]
  const pendingSparkData = [18, 16, 15, 14, 13, 12]
  const codesSparkData = [45, 52, 58, 68, 78, 89]
  const conversionSparkData = [55, 58, 62, 64, 66, 68]

  // Format currency helper
  const formatRevenue = (revenue: number) => {
    if (revenue >= 1000000) {
      return `${(revenue / 1000000).toFixed(1)}M`
    }
    return `${(revenue / 1000).toFixed(0)}K`
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Tableau de bord Super Admin
          </h1>
          <p className="text-slate-500 text-sm">
            Gestion de votre plateforme e-OSCS — Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="gap-2 text-slate-600 border-slate-200 hover:bg-slate-50">
            <RefreshCw className="w-4 h-4" />
            Actualiser
          </Button>
          <Button size="sm" asChild className="gap-2 bg-gradient-to-r from-[#F77F00] to-[#FFA940] hover:from-[#e67300] hover:to-[#F77F00] text-white shadow-lg shadow-orange-500/25">
            <Link href="/admin/demandes">
              <PlusIcon className="w-4 h-4" />
              Voir demandes
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid - 6 cards SaaS Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total utilisateurs"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={stats?.usersTrend}
          trendValue="+8.3%"
          description={`${stats?.newUsersThisMonth || 0} ce mois`}
          iconBgClass="bg-blue-100 text-blue-600"
          sparkData={usersSparkData}
          sparkColor="#3B82F6"
        />
        
        <KPICard
          title="Organisations actives"
          value={stats?.activeOrganizations || 0}
          icon={Building2}
          trend={stats?.organizationsTrend}
          trendValue="+9.1%"
          description={`${stats?.newOrganizationsThisMonth || 0} nouvelles`}
          iconBgClass="bg-orange-100 text-[#F77F00]"
          sparkData={orgsSparkData}
          sparkColor="#F77F00"
        />
        
        <KPICard
          title="Revenus mensuels"
          value={formatRevenue(stats?.monthlyRevenue || 0)}
          prefix=""
          suffix=" FCFA"
          icon={DollarSign}
          trend={stats?.revenueTrend}
          trendValue="+7.8%"
          description="abonnements actifs"
          iconBgClass="bg-emerald-100 text-[#009E60]"
          sparkData={revenueSparkData}
          sparkColor="#009E60"
        />
        
        <KPICard
          title="Taux conversion"
          value={`${stats?.conversionRate || 0}%`}
          icon={Target}
          trend={stats?.conversionTrend}
          trendValue="+3.2%"
          description="demandes → abonnés"
          iconBgClass="bg-purple-100 text-purple-600"
          sparkData={conversionSparkData}
          sparkColor="#8B5CF6"
        />
        
        <KPICard
          title="Demandes en attente"
          value={stats?.pendingRequests || 0}
          icon={Clock}
          trend="down"
          trendValue="-7.7%"
          description="à traiter"
          iconBgClass="bg-amber-100 text-amber-600"
          sparkData={pendingSparkData}
          sparkColor="#F59E0B"
          hasAlert={(stats?.pendingRequests || 0) > 0}
          alertCount={stats?.pendingRequests}
        />
        
        <KPICard
          title="Codes générés"
          value={stats?.codesGenerated || 0}
          icon={Key}
          trend="up"
          trendValue="+14.1%"
          description="ce trimestre"
          iconBgClass="bg-cyan-100 text-cyan-600"
          sparkData={codesSparkData}
          sparkColor="#06B6D4"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Charts (2/3 width on XL) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Row: Revenue Chart + Organization Type Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Bar Chart */}
            <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#009E60]" />
                  Revenus mensuels
                </CardTitle>
                <CardDescription>Évolution des abonnements sur 6 mois</CardDescription>
              </CardHeader>
              <CardContent>
                <RevenueBarChart data={mockMonthlyRevenue} />
              </CardContent>
            </Card>

            {/* Organization Type Donut Chart */}
            <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#F77F00]" />
                  Types d&apos;organisations
                </CardTitle>
                <CardDescription>Répartition des abonnés</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <OrganizationTypeDonut />
              </CardContent>
            </Card>
          </div>

          {/* Growth Stats Row */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#009E60]" />
                    Croissance de la plateforme
                  </CardTitle>
                  <CardDescription>Statistiques de croissance ce mois</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-[#F77F00] hover:text-[#e67300] gap-1">
                  <Link href="/admin/rapports/statistiques">
                    Voir détails
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Nouveaux utilisateurs</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">{stats?.newUsersThisMonth || 0}</p>
                  <p className="text-xs text-blue-600 mt-1">+15% vs mois dernier</p>
                </div>
                
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">Nouvelles organisations</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-900">{stats?.newOrganizationsThisMonth || 0}</p>
                  <p className="text-xs text-orange-600 mt-1">+33% vs mois dernier</p>
                </div>
                
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-800">Codes activés</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-900">8</p>
                  <p className="text-xs text-emerald-600 mt-1">Ce mois-ci</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Plans Overview */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#F77F00]" />
                    Popularité des plans
                  </CardTitle>
                  <CardDescription>Répartition des abonnés par plan tarifaire</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild className="text-[#F77F00] hover:text-[#e67300] gap-1">
                  <Link href="/admin/plans">
                    Gérer les plans
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'PRO', price: '25 000 FCFA/mois', subscribers: 12, percentage: 50, color: '#F77F00' },
                  { name: 'INSTITUTIONNEL', price: '50 000 FCFA/mois', subscribers: 8, percentage: 33, color: '#009E60' },
                  { name: 'ESSENTIEL', price: '10 000 FCFA/mois', subscribers: 4, percentage: 17, color: '#64748B' },
                ].map((plan) => (
                  <div key={plan.name} className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: plan.color }} />
                        <span className="text-sm font-medium text-slate-700">{plan.name}</span>
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-100">
                          {plan.price}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-slate-900">{plan.subscribers} abonnés</span>
                        <span className="text-xs text-slate-500 w-10 text-right">{plan.percentage}%</span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                        style={{ 
                          width: `${plan.percentage}%`,
                          backgroundColor: plan.color 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="text-slate-500">Total revenu potentiel mensuel</span>
                <span className="font-bold text-slate-900">700 000 FCFA</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on XL) */}
        <div className="space-y-6">
          
          {/* System Events Timeline */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F77F00]" />
                  Activités système
                </CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-[#F77F00] hover:text-[#e67300] gap-1 text-xs">
                  <Link href="/admin/logs">
                    Voir tout
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </Button>
              </div>
              <CardDescription>Dernières actions sur la plateforme</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemTimeline events={mockSystemEvents} />
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="border-slate-200/80 bg-gradient-to-br from-[#0F172A] to-slate-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F77F00]" />
                Actions rapides
              </CardTitle>
              <CardDescription className="text-slate-400">Gestion de votre SaaS</CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-2">
              <QuickActionButton
                icon={QrCode}
                label="Générer un code"
                href="/admin/codes-activation"
                badge="+ nouveau"
                color="orange"
              />
              <QuickActionButton
                icon={ClipboardList}
                label="Voir les demandes"
                href="/admin/demandes?statut=NOUVELLE"
                badge={`${stats?.pendingRequests || 0} en attente`}
                badgeVariant={stats?.pendingRequests ? 'warning' : 'default'}
                color="blue"
              />
              <QuickActionButton
                icon={BarChart3}
                label="Rapports SaaS"
                href="/admin/rapports"
                color="green"
              />
              <QuickActionButton
                icon={FileSearch}
                label="Logs système"
                href="/admin/logs"
                color="purple"
              />
            </CardContent>
          </Card>

          {/* System Health Card */}
          <Card className="border-slate-200/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Santé du système
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <HealthItem label="API Status" status="operational" value="99.9%" />
              <HealthItem label="Base de données" status="operational" value="Normal" />
              <HealthItem label="Stockage" status="warning" value="78%" />
              <HealthItem label="Dernière sauvegarde" status="operational" value="Il y a 2h" />
              
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Version</span>
                  <span className="font-mono text-slate-700">v2.4.1</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-slate-500">Environnement</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">Production</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Sub-components

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14" /><path d="M12 5v14" />
    </svg>
  )
}

interface QuickActionButtonProps {
  icon: React.ElementType
  label: string
  href: string
  badge?: string
  badgeVariant?: 'default' | 'warning'
  color: 'orange' | 'blue' | 'green' | 'purple'
}

function QuickActionButton({ icon: Icon, label, href, badge, badgeVariant = 'default', color }: QuickActionButtonProps) {
  const colorClasses = {
    orange: 'text-orange-400 hover:bg-orange-500/10 hover:text-orange-300',
    blue: 'text-blue-400 hover:bg-blue-500/10 hover:text-blue-300',
    green: 'text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300',
    purple: 'text-purple-400 hover:bg-purple-500/10 hover:text-purple-300',
  }
  
  const badgeClasses = {
    default: 'bg-slate-700 text-slate-300',
    warning: 'bg-amber-500/20 text-amber-300',
  }

  return (
    <Button
      variant="ghost"
      className={`w-full justify-start gap-3 h-auto py-2.5 px-3 ${colorClasses[color]}`}
      asChild
    >
      <Link href={href}>
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="flex-1 text-left text-sm">{label}</span>
        {badge && (
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 ${badgeClasses[badgeVariant]}`}>
            {badge}
          </Badge>
        )}
      </Link>
    </Button>
  )
}

interface HealthItemProps {
  label: string
  status: 'operational' | 'warning' | 'error'
  value: string
}

function HealthItem({ label, status, value }: HealthItemProps) {
  const statusConfig = {
    operational: { dotClass: 'bg-emerald-500', textClass: 'text-emerald-600' },
    warning: { dotClass: 'bg-amber-500', textClass: 'text-amber-600' },
    error: { dotClass: 'bg-red-500', textClass: 'text-red-600' },
  }
  
  const config = statusConfig[status]

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${config.dotClass} ${status === 'operational' ? 'animate-pulse' : ''}`} />
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <span className={`text-sm font-medium ${config.textClass}`}>{value}</span>
    </div>
  )
}
