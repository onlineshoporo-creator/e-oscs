'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users,
  Building2,
  Activity,
  CheckCircle2,
  Clock,
  Key,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Eye,
  Check,
  X,
  FileText,
  BarChart3,
  PieChart,
  Zap,
  Download,
  FileSearch,
  Shield,
  AlertTriangle,
  Calendar,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  QrCode,
  ClipboardList
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Types pour les stats du dashboard
interface DashboardStats {
  totalUsers: number
  totalOrganizations: number
  monthlyActivities: number
  validationRate: number
  pendingRequests: number
  codesGenerated: number
  usersTrend: 'up' | 'down' | 'stable'
  organizationsTrend: 'up' | 'down' | 'stable'
  activitiesTrend: 'up' | 'down' | 'stable'
  validationTrend: 'up' | 'down' | 'stable'
}

interface RecentActivity {
  id: string
  direction: string
  activity: string
  date: string
  statut: 'VALIDEE' | 'BROUILLON' | 'EN_ATTENTE' | 'REJETEE'
  user: string
}

interface MonthlyData {
  month: string
  activities: number
  validations: number
}

interface TopDirection {
  name: string
  count: number
  percentage: number
}

// Configuration des statuts
const statusConfig: Record<string, { label: string; className: string; dotClass: string }> = {
  VALIDEE: { 
    label: 'Validée', 
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
    dotClass: 'bg-emerald-500' 
  },
  BROUILLON: { 
    label: 'Brouillon', 
    className: 'bg-slate-100 text-slate-600 border-slate-200', 
    dotClass: 'bg-slate-400' 
  },
  EN_ATTENTE: { 
    label: 'En attente', 
    className: 'bg-amber-100 text-amber-700 border-amber-200', 
    dotClass: 'bg-amber-500' 
  },
  REJETEE: { 
    label: 'Rejetée', 
    className: 'bg-red-100 text-red-700 border-red-200', 
    dotClass: 'bg-red-500' 
  },
}

// Données mock pour le développement
const mockStats: DashboardStats = {
  totalUsers: 156,
  totalOrganizations: 24,
  monthlyActivities: 342,
  validationRate: 87,
  pendingRequests: 12,
  codesGenerated: 89,
  usersTrend: 'up',
  organizationsTrend: 'up',
  activitiesTrend: 'up',
  validationTrend: 'up',
}

const mockMonthlyData: MonthlyData[] = [
  { month: 'Sept', activities: 185, validations: 160 },
  { month: 'Oct', activities: 220, validations: 195 },
  { month: 'Nov', activities: 195, validations: 170 },
  { month: 'Déc', activities: 280, validations: 245 },
  { month: 'Jan', activities: 310, validations: 278 },
  { month: 'Fév', activities: 342, validations: 298 },
]

const mockTopDirections: TopDirection[] = [
  { name: 'DR Lagune', count: 67, percentage: 100 },
  { name: 'DR Bas-Sassandra', count: 54, percentage: 81 },
  { name: 'DR Dix-Huit Montagnes', count: 48, percentage: 72 },
  { name: 'DR Vallee Bandama', count: 42, percentage: 63 },
  { name: 'DR Zanzan', count: 35, percentage: 52 },
]

const mockRecentActivities: RecentActivity[] = [
  { id: '1', direction: 'DR Lagune - Abidjan', activity: 'Formation continue en gestion', date: '2025-02-15', statut: 'VALIDEE', user: 'Kouadio Jean' },
  { id: '2', direction: 'DR Bas-Sassandra', activity: 'Atelier planification Q1', date: '2025-02-14', statut: 'EN_ATTENTE', user: 'Yao Marie' },
  { id: '3', direction: 'DR Dix-Huit Montagnes', activity: 'Réunion coordination mensuelle', date: '2025-02-14', statut: 'BROUILLON', user: 'Kone Alassane' },
  { id: '4', direction: 'DR Vallee Bandama', activity: 'Audit interne qualité', date: '2025-02-13', statut: 'VALIDEE', user: 'Touré Fatou' },
  { id: '5', direction: 'DR Zanzan', activity: 'Programme sensibilisation', date: '2025-02-13', statut: 'REJETEE', user: 'Diallo Ibrahim' },
  { id: '6', direction: 'DR Lagune - Abidjan', activity: 'Evaluation performance', date: '2025-02-12', statut: 'VALIDEE', user: 'Baffet Amoin' },
  { id: '7', direction: 'DR Sassandra-Marahoué', activity: 'Plan action annuel', date: '2025-02-12', statut: 'EN_ATTENTE', user: 'N\'Goran Paul' },
  { id: '8', direction: 'DR Worodougou', activity: 'Session coaching équipe', date: '2025-02-11', statut: 'VALIDEE', user: 'Coulibaly Aminata' },
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
      {/* Area fill */}
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${color.replace('#', '')})`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Last point dot */}
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
}

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  description,
  colorClass,
  iconBgClass,
  sparkData,
  sparkColor = '#F77F00',
  hasAlert = false,
  alertCount = 0,
}: KPICardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
  
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200/80 hover:border-slate-300 bg-white/80 backdrop-blur-sm overflow-hidden relative">
      {/* Accent bar top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${iconBgClass.split(' ')[1]?.includes('orange') ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 
        iconBgClass.includes('green') ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
        iconBgClass.includes('blue') ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
        iconBgClass.includes('purple') ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
        iconBgClass.includes('red') ? 'bg-gradient-to-r from-red-500 to-rose-500' :
        'bg-gradient-to-r from-slate-400 to-slate-500'
      }`} />
      
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
              <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
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

// Composant Bar Chart Horizontal (Activités par mois)
function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  const maxValue = Math.max(...data.map(d => d.activities))
  
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
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#F77F00] to-[#FFA940] rounded-lg transition-all duration-700 ease-out group-hover:from-[#e67300] group-hover:to-[#F77F00] shadow-sm"
              style={{ 
                width: `${(item.activities / maxValue) * 100}%`,
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="absolute inset-0 bg-white/10 rounded-lg" />
            </div>
            {/* Value label */}
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-700">
              {item.activities}
            </span>
          </div>
        </div>
      ))}
      
      {/* Legend */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-3">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-to-r from-[#F77F00] to-[#FFA940]" />
          <span className="text-xs text-slate-500">Activités saisies</span>
        </div>
        <span className="text-xs font-medium text-slate-600">
          Total: {data.reduce((a, b) => a + b.activities, 0).toLocaleString()}
        </span>
      </div>
    </div>
  )
}

// Composant Donut Chart CSS (Répartition par statut)
function StatusDonutChart() {
  const data = [
    { label: 'Validées', value: 298, color: '#009E60', percentage: 87 },
    { label: 'En attente', value: 28, color: '#F59E0B', percentage: 8 },
    { label: 'Brouillons', value: 12, color: '#94A3B8', percentage: 3 },
    { label: 'Rejetées', value: 4, color: '#EF4444', percentage: 1 },
  ]
  
  // Calcul pour le donut SVG
  let cumulativePercentage = 0
  const radius = 45
  const circumference = 2 * Math.PI * radius
  
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Donut SVG */}
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((segment, index) => {
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
          <span className="text-2xl font-black text-slate-900">87%</span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Validation</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{item.label}</p>
              <p className="text-[10px] text-slate-400">{item.value} ({item.percentage}%)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Composant Bar Chart Vertical (Top Directions)
function TopDirectionsChart({ data }: { data: TopDirection[] }) {
  const maxValue = Math.max(...data.map(d => d.count))
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.name} className="group flex items-center gap-3">
          <span className="text-xs font-medium text-slate-600 w-28 truncate text-right" title={item.name}>
            {item.name.replace('DR ', '')}
          </span>
          <div className="flex-1 h-7 bg-slate-100/80 rounded-md overflow-hidden relative">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-t from-[#009E60] to-[#34D399] rounded-md transition-all duration-500 ease-out group-hover:from-[#008C55] group-hover:to-[#009E60]"
              style={{ 
                width: `${(item.count / maxValue) * 100}%`,
                animationDelay: `${index * 80}ms`
              }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700 w-8 text-right">{item.count}</span>
        </div>
      ))}
    </div>
  )
}

// Composant Timeline Activités Récentes
function ActivityTimeline({ activities }: { activities: RecentActivity[] }) {
  return (
    <div className="relative space-y-0">
      {/* Vertical line */}
      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />
      
      {activities.slice(0, 5).map((activity, index) => {
        const status = statusConfig[activity.statut]
        return (
          <div key={activity.id} className="relative flex gap-4 pb-5 last:pb-0 group">
            {/* Timeline dot */}
            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              activity.statut === 'VALIDEE' ? 'bg-emerald-100 ring-2 ring-emerald-200' :
              activity.statut === 'EN_ATTENTE' ? 'bg-amber-100 ring-2 ring-amber-200' :
              activity.statut === 'REJETEE' ? 'bg-red-100 ring-2 ring-red-200' :
              'bg-slate-100 ring-2 ring-slate-200'
            }`}>
              {activity.statut === 'VALIDEE' && <Check className="w-3.5 h-3.5 text-emerald-600" />}
              {activity.statut === 'EN_ATTENTE' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
              {activity.statut === 'REJETEE' && <X className="w-3.5 h-3.5 text-red-600" />}
              {activity.statut === 'BROUILLON' && <FileText className="w-3.5 h-3.5 text-slate-500" />}
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-[#F77F00] transition-colors">
                    {activity.activity}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">{activity.direction}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${status?.className}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1 ${status?.dotClass}`} />
                      {status?.label}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{activity.user}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap flex-shrink-0">
                  {new Date(activity.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
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
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch existing stats API
        const statsRes = await fetch('/api/admin/stats')
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats({
            totalUsers: statsData.totalUsers || mockStats.totalUsers,
            totalOrganizations: statsData.totalOrganizations || mockStats.totalOrganizations,
            monthlyActivities: statsData.monthlyActivities || mockStats.monthlyActivities,
            validationRate: statsData.validationRate || mockStats.validationRate,
            pendingRequests: statsData.pendingRequests || mockStats.pendingRequests,
            codesGenerated: statsData.codesGenerated || mockStats.codesGenerated,
            usersTrend: statsData.usersTrend || mockStats.usersTrend,
            organizationsTrend: statsData.organizationsTrend || mockStats.organizationsTrend,
            activitiesTrend: statsData.activitiesTrend || mockStats.activitiesTrend,
            validationTrend: statsData.validationTrend || mockStats.validationTrend,
          })
        } else {
          setStats(mockStats)
        }

        // Use mock data for now (API can be connected later)
        setRecentActivities(mockRecentActivities)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
        // Fallback to mock data
        setStats(mockStats)
        setRecentActivities(mockRecentActivities)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  // Pagination logic
  const totalPages = Math.ceil(recentActivities.length / itemsPerPage)
  const paginatedActivities = recentActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Sparkline data for each KPI
  const usersSparkData = [120, 132, 138, 145, 150, 156]
  const orgsSparkData = [18, 19, 20, 21, 22, 24]
  const activitiesSparkData = [220, 245, 268, 290, 315, 342]
  const validationSparkData = [82, 83, 84, 85, 86, 87]
  const pendingSparkData = [18, 16, 15, 14, 13, 12]
  const codesSparkData = [45, 52, 58, 68, 78, 89]

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
            Tableau de bord
          </h1>
          <p className="text-slate-500 text-sm">
            Vue d&apos;ensemble de la plateforme e-OSCS — Dernière mise à jour: {new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
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
              Nouvelle demande
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid - 6 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total utilisateurs"
          value={stats?.totalUsers || 0}
          icon={Users}
          trend={stats?.usersTrend}
          trendValue="+8.3%"
          description="vs mois dernier"
          colorClass="text-blue-600"
          iconBgClass="bg-blue-100 text-blue-600"
          sparkData={usersSparkData}
          sparkColor="#3B82F6"
        />
        
        <KPICard
          title="Organisations actives"
          value={stats?.totalOrganizations || 0}
          icon={Building2}
          trend={stats?.organizationsTrend}
          trendValue="+9.1%"
          description="directions connectées"
          colorClass="text-[#F77F00]"
          iconBgClass="bg-orange-100 text-[#F77F00]"
          sparkData={orgsSparkData}
          sparkColor="#F77F00"
        />
        
        <KPICard
          title="Activités ce mois"
          value={stats?.monthlyActivities?.toLocaleString() || 0}
          icon={Activity}
          trend={stats?.activitiesTrend}
          trendValue="+10.4%"
          description="total saisies"
          colorClass="text-[#009E60]"
          iconBgClass="bg-emerald-100 text-[#009E60]"
          sparkData={activitiesSparkData}
          sparkColor="#009E60"
        />
        
        <KPICard
          title="Taux validation"
          value={`${stats?.validationRate || 0}%`}
          icon={CheckCircle2}
          trend={stats?.validationTrend}
          trendValue="+2.1%"
          description="objectif: 90%"
          colorClass="text-purple-600"
          iconBgClass="bg-purple-100 text-purple-600"
          sparkData={validationSparkData}
          sparkColor="#8B5CF6"
        />
        
        <KPICard
          title="Demandes en attente"
          value={stats?.pendingRequests || 0}
          icon={Clock}
          trend="down"
          trendValue="-7.7%"
          description="à traiter"
          colorClass="text-amber-600"
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
          colorClass="text-cyan-600"
          iconBgClass="bg-cyan-100 text-cyan-600"
          sparkData={codesSparkData}
          sparkColor="#06B6D4"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Charts (2/3 width on XL) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Row: Monthly Activities + Status Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Bar Chart */}
            <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#F77F00]" />
                  Activités par mois
                </CardTitle>
                <CardDescription>Évolution sur les 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyBarChart data={mockMonthlyData} />
              </CardContent>
            </Card>

            {/* Status Donut Chart */}
            <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-[#009E60]" />
                  Répartition par statut
                </CardTitle>
                <CardDescription>Ce mois-ci</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <StatusDonutChart />
              </CardContent>
            </Card>
          </div>

          {/* Top Directions Chart */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#009E60]" />
                    Top directions les plus actives
                  </CardTitle>
                  <CardDescription>Basé sur les activités ce mois</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-[#F77F00] hover:text-[#e67300] gap-1">
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TopDirectionsChart data={mockTopDirections} />
            </CardContent>
          </Card>

          {/* Recent Activities Table */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-[#F77F00]" />
                    Activités récentes
                  </CardTitle>
                  <CardDescription>Liste des dernières activités saisies</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-[#F77F00] hover:text-[#e67300] gap-1">
                  Exporter
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {paginatedActivities.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-slate-200">
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase">Direction</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase">Activité</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase hidden md:table-cell">Utilisateur</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-xs font-semibold text-slate-500 uppercase">Statut</TableHead>
                        <TableHead className="text-right text-xs font-semibold text-slate-500 uppercase">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedActivities.map((activity) => {
                        const status = statusConfig[activity.statut]
                        return (
                          <TableRow key={activity.id} className="group hover:bg-slate-50/50">
                            <TableCell className="font-medium text-sm text-slate-900 max-w-[150px] truncate">
                              {activity.direction.replace('DR ', '')}
                            </TableCell>
                            <TableCell className="text-sm text-slate-600 max-w-[180px] truncate">
                              {activity.activity}
                            </TableCell>
                            <TableCell className="text-sm text-slate-500 hidden md:table-cell">
                              {activity.user}
                            </TableCell>
                            <TableCell className="text-sm text-slate-500 hidden sm:table-cell">
                              {new Date(activity.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`text-[11px] ${status?.className}`}>
                                {status?.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {activity.statut === 'EN_ATTENTE' && (
                                  <>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600">
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-500">
                        Affichage {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, recentActivities.length)} sur {recentActivities.length}
                      </p>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="icon"
                            className={`h-8 w-8 ${currentPage === page ? 'bg-[#F77F00] hover:bg-[#e67300]' : ''}`}
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">Aucune activité pour le moment</p>
                  <p className="text-sm text-slate-400 mt-1">Les nouvelles activités apparaîtront ici</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width on XL) */}
        <div className="space-y-6">
          
          {/* Activity Timeline */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#F77F00]" />
                  Timeline récent
                </CardTitle>
                <Button variant="ghost" size="sm" className="text-[#F77F00] hover:text-[#e67300] gap-1 text-xs">
                  Voir tout
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
              <CardDescription>Les 5 dernières activités</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={mockRecentActivities} />
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <Card className="border-slate-200/80 bg-gradient-to-br from-[#0F172A] to-slate-800 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F77F00]" />
                Actions rapides
              </CardTitle>
              <CardDescription className="text-slate-400">Accès rapide aux fonctionnalités</CardDescription>
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
                icon={Download}
                label="Exporter les données"
                href="#"
                color="green"
              />
              <QuickActionButton
                icon={FileSearch}
                label="Voir les logs système"
                href="/admin/config"
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
