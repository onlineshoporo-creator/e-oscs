'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  ClipboardList, 
  CheckCircle2, 
  TrendingUp,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  Eye,
  Plus,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

// Types pour les stats du dashboard
interface DashboardStats {
  totalOrganizations: number
  pendingRequests: number
  activeSubscriptions: number
  monthlyRevenue: number
  revenueTrend: 'up' | 'down' | 'stable'
  organizationsTrend: 'up' | 'down' | 'stable'
}

interface RecentRequest {
  id: string
  nom_complet: string
  nom_organisation: string
  type_org: string
  region: string
  statut: string
  created_at: string
  email: string
  telephone: string
}

interface ActivityData {
  month: string
  requests: number
  organizations: number
}

const statusConfig: Record<string, { label: string; className: string }> = {
  NOUVELLE: { label: 'Nouvelle', className: 'bg-slate-100 text-slate-700 border-slate-200' },
  EN_CONTACT: { label: 'En contact', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  EN_ATTENTE_PAIEMENT: { label: 'Attente paiement', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  AYEE: { label: 'Approuvée', className: 'bg-green-100 text-green-700 border-green-200' },
  REFUSEE: { label: 'Refusée', className: 'bg-red-100 text-red-700 border-red-200' },
  CLOTUREE: { label: 'Clôturée', className: 'bg-slate-100 text-slate-500 border-slate-200' },
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([])
  const [activityData, setActivityData] = useState<ActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/admin/stats')
        if (statsRes.ok) {
          const statsData = await statsRes.json()
          setStats({
            totalOrganizations: statsData.totalOrganizations || 0,
            pendingRequests: statsData.pendingRequests || 0,
            activeSubscriptions: statsData.activeSubscriptions || 0,
            monthlyRevenue: statsData.monthlyRevenue || 0,
            revenueTrend: statsData.revenueTrend || 'up',
            organizationsTrend: statsData.organizationsTrend || 'up',
          })
        }

        // Fetch recent requests
        const requestsRes = await fetch('/api/admin/demandes?limit=5')
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json()
          setRecentRequests(requestsData.data || [])
        }

        // Generate mock activity data for chart
        setActivityData([
          { month: 'Sep', requests: 12, organizations: 3 },
          { month: 'Oct', requests: 19, organizations: 5 },
          { month: 'Nov', requests: 15, organizations: 4 },
          { month: 'Déc', requests: 22, organizations: 6 },
          { month: 'Jan', requests: 28, organizations: 8 },
          { month: 'Fév', requests: 18, organizations: 4 },
        ])
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // KPI Cards Component
  const KPICard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    trendValue, 
    description,
    colorClass 
  }: {
    title: string
    value: string | number
    icon: React.ElementType
    trend?: 'up' | 'down' | 'stable'
    trendValue?: string
    description?: string
    colorClass: string
  }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-slate-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-slate-900">{value}</p>
              {trend && (
                <span className={`flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full ${
                  trend === 'up' ? 'text-green-700 bg-green-50' :
                  trend === 'down' ? 'text-red-700 bg-red-50' :
                  'text-slate-600 bg-slate-100'
                }`}>
                  {trend === 'up' && '↑'}
                  {trend === 'down' && '↓'}
                  {trend === 'stable' && '→'}
                  {trendValue}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-slate-400">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClass} group-hover:scale-110 transition-transform`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">Vue d&apos;ensemble de la plateforme e-OSCS</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/demandes" className="gap-2">
              <Eye className="w-4 h-4" />
              Voir les demandes
            </Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25">
            <Link href="/admin/demandes" className="gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle organisation
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-10 w-20 mb-2" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <KPICard
            title="Total Organisations"
            value={stats?.totalOrganizations || 0}
            icon={Building2}
            trend={stats?.organizationsTrend}
            trendValue="+12%"
            description="Ce mois-ci"
            colorClass="bg-orange-100 text-orange-600"
          />
          <KPICard
            title="Demandes en attente"
            value={stats?.pendingRequests || 0}
            icon={ClipboardList}
            trend="up"
            trendValue="+3"
            description="Nouvelles ce jour"
            colorClass="bg-amber-100 text-amber-600"
          />
          <KPICard
            title="Abonnements actifs"
            value={stats?.activeSubscriptions || 0}
            icon={CheckCircle2}
            trend="up"
            trendValue="+5%"
            description="Taux de rétention: 94%"
            colorClass="bg-green-100 text-green-600"
          />
          <KPICard
            title="Revenu mensuel"
            value={formatCurrency(stats?.monthlyRevenue || 0)}
            icon={TrendingUp}
            trend={stats?.revenueTrend}
            trendValue="+18%"
            description="vs mois dernier"
            colorClass="bg-blue-100 text-blue-600"
          />
        </div>
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <Card className="xl:col-span-2 border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-orange-500" />
                  Dernières demandes
                </CardTitle>
                <CardDescription>Les 5 demandes d&apos;abonnement les plus récentes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="text-orange-600 hover:text-orange-700">
                <Link href="/admin/demandes" className="gap-1">
                  Voir tout
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((request) => {
                  const status = statusConfig[request.statut] || statusConfig.NOUVELLE
                  return (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 truncate">{request.nom_organisation}</p>
                            <Badge variant="outline" className={`text-[10px] ${status.className}`}>
                              {status.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <span className="font-medium">{request.nom_complet}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {request.region}
                            </span>
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              {request.type_org}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-4">
                        <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:block">
                          {formatDate(request.created_at)}
                        </span>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Eye className="w-4 h-4 text-slate-400" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Aucune demande pour le moment</p>
                <p className="text-sm text-slate-400 mt-1">Les nouvelles demandes apparaîtront ici</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Activity Chart / Quick Actions */}
        <div className="space-y-6">
          {/* Activity Overview */}
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Activité récente
              </CardTitle>
              <CardDescription>Derniers 6 mois</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityData.map((item, index) => (
                  <div key={item.month} className="flex items-center gap-3">
                    <span className="text-xs text-slate-500 w-8">{item.month}</span>
                    <div className="flex-1 flex items-center gap-2">
                      <div className="flex-1 h-6 bg-slate-100 rounded overflow-hidden flex">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-500"
                          style={{ width: `${(item.requests / Math.max(...activityData.map(d => d.requests))) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600 w-6 text-right">{item.requests}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-orange-400 to-orange-500" />
                  <span className="text-slate-500">Demandes reçues</span>
                </div>
                <span className="text-slate-500">
                  Moyenne: {Math.round(activityData.reduce((a, b) => a + b.requests, 0) / activityData.length)}/mois
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                Actions rapides
              </h3>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10 gap-3"
                  asChild
                >
                  <Link href="/admin/demandes?statut=NOUVELLE">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    Traiter les nouvelles demandes
                    <Badge variant="secondary" className="ml-auto bg-amber-500/20 text-amber-300 hover:bg-amber-500/30">
                      {stats?.pendingRequests || 0}
                    </Badge>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10 gap-3"
                  asChild
                >
                  <Link href="/admin/organisations">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Gérer les organisations
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10 gap-3"
                  asChild
                >
                  <Link href="/admin/plans">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    Modifier les tarifs
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
