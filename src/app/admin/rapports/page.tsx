'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Building2,
  ArrowRight,
  Download,
  FileText,
  Activity,
  PieChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Données mock pour les rapports SaaS
const mockReportStats = {
  totalRevenue: 16800000,
  monthlyGrowth: 12.5,
  activeSubscriptions: 24,
  avgRevenuePerUser: 117500,
  churnRate: 4.2,
  lifetimeValue: 2820000,
}

const monthlyRevenueData = [
  { month: 'Septembre', revenue: 1850000, newSubs: 3 },
  { month: 'Octobre', revenue: 2100000, newSubs: 2 },
  { month: 'Novembre', revenue: 2250000, newSubs: 1 },
  { month: 'Décembre', revenue: 2450000, newSubs: 2 },
  { month: 'Janvier', revenue: 2680000, newSubs: 1 },
  { month: 'Février', revenue: 2850000, newSubs: 4 },
]

const subscriptionGrowthData = [
  { month: 'Sept', total: 16, dr: 10, dd: 6 },
  { month: 'Oct', total: 18, dr: 11, dd: 7 },
  { month: 'Nov', total: 19, dr: 11, dd: 8 },
  { month: 'Déc', total: 21, dr: 12, dd: 9 },
  { month: 'Jan', total: 22, dr: 13, dd: 9 },
  { month: 'Fév', total: 24, dr: 14, dd: 10 },
]

const planPopularity = [
  { name: 'PRO', subscribers: 12, percentage: 50, color: '#F77F00' },
  { name: 'INSTITUTIONNEL', subscribers: 8, percentage: 33, color: '#009E60' },
  { name: 'ESSENTIEL', subscribers: 4, percentage: 17, color: '#64748B' },
]

// Helper pour formater la monnaie
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-CI', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function RapportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'6m' | '1y' | 'all'>('6m')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Rapports SaaS
          </h1>
          <p className="text-slate-500 text-sm">
            Analyse des performances de votre plateforme e-OSCS
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-1">
            {[
              { value: '6m', label: '6 mois' },
              { value: '1y', label: '1 an' },
              { value: 'all', label: 'Tout' },
            ].map((period) => (
              <button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value as typeof selectedPeriod)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  selectedPeriod === period.value
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-2" asChild>
            <Link href="/admin/rapports/export">
              <Download className="w-4 h-4" />
              Exporter
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Revenus totaux</span>
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(mockReportStats.totalRevenue)}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span className="text-xs font-medium text-emerald-600">+{mockReportStats.monthlyGrowth}%</span>
              <span className="text-xs text-slate-400">vs période précédente</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Abonnements actifs</span>
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{mockReportStats.activeSubscriptions}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-orange-600" />
              <span className="text-xs font-medium text-orange-600">+4 ce mois</span>
              <span className="text-xs text-slate-400">nouvelles organisations</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Revenu/utilisateur</span>
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{formatCurrency(mockReportStats.avgRevenuePerUser)}</p>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">+5.2%</span>
              <span className="text-xs text-slate-400">ARPU mensuel</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Taux de rétention</span>
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <PieChart className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{(100 - mockReportStats.churnRate).toFixed(0)}%</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs font-medium text-slate-600">Churn:</span>
              <span className="text-xs font-medium text-red-500">{mockReportStats.churnRate}%</span>
              <span className="text-xs text-slate-400">mensuel</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column - Charts (2/3 width) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Revenue Chart */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#009E60]" />
                Revenus mensuels
              </CardTitle>
              <CardDescription>Évolution des revenus d&apos;abonnements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyRevenueData.map((data, index) => {
                  const maxRevenue = Math.max(...monthlyRevenueData.map(d => d.revenue))
                  return (
                    <div key={data.month} className="group flex items-center gap-4">
                      <span className="text-sm font-medium text-slate-600 w-24 text-right">{data.month}</span>
                      <div className="flex-1 relative h-10 bg-slate-100 rounded-lg overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#009E60] to-[#34D399] rounded-lg transition-all duration-500 group-hover:from-[#008C55] group-hover:to-[#009E60]"
                          style={{ 
                            width: `${(data.revenue / maxRevenue) * 100}%`,
                          }}
                        >
                          <div className="absolute inset-0 bg-white/10 rounded-lg" />
                        </div>
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold text-white drop-shadow-sm">
                          {formatCurrency(data.revenue)}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 shrink-0">
                        +{data.newSubs} abonnés
                      </Badge>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm text-slate-500">Total sur la période</span>
                <span className="font-bold text-slate-900">{formatCurrency(monthlyRevenueData.reduce((a, b) => a + b.revenue, 0))}</span>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Growth Chart */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F77F00]" />
                Croissance des abonnements
              </CardTitle>
              <CardDescription>Évolution par type d&apos;organisation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">Mois</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3 px-4">Total</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3 px-4">DR</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3 pl-4">DD</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3 pl-4">Progression</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptionGrowthData.map((row, index) => (
                      <tr key={row.month} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 pr-4 text-sm font-medium text-slate-700">{row.month}</td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-900 text-right">{row.total}</td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                            {row.dr}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                            {row.dd}
                          </Badge>
                        </td>
                        <td className="py-3 pl-4">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#F77F00] to-[#FFA940] rounded-full"
                                style={{ width: `${(row.total / 24) * 100}%` }}
                              />
                            </div>
                            {index > 0 && (
                              <span className="text-xs text-emerald-600 font-medium">
                                +{row.total - subscriptionGrowthData[index - 1].total}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Organization Type Distribution */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F77F00]" />
                Répartition par type d&apos;organisation
              </CardTitle>
              <CardDescription>DR vs DD dans votre base d&apos;abonnés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual representation */}
                <div className="space-y-4">
                  <div className="relative pt-4">
                    {/* DR bar */}
                    <div className="mb-3">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700">Directions Régionales (DR)</span>
                        <span className="text-sm font-bold text-slate-900">14 (58%)</span>
                      </div>
                      <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#F77F00] to-[#FFA940] rounded-lg flex items-center justify-end pr-3"
                          style={{ width: '58%' }}
                        >
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* DD bar */}
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-slate-700">Directions Départementales (DD)</span>
                        <span className="text-sm font-bold text-slate-900">10 (42%)</span>
                      </div>
                      <div className="h-8 bg-slate-100 rounded-lg overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#009E60] to-[#34D399] rounded-lg flex items-center justify-end pr-3"
                          style={{ width: '42%' }}
                        >
                          <Users className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Total organisations</span>
                      <span className="font-bold text-slate-900">24</span>
                    </div>
                  </div>
                </div>
                
                {/* Stats by type */}
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <h4 className="text-sm font-semibold text-orange-800 mb-3">Directions Régionales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-600">Revenus générés</span>
                        <span className="font-medium text-orange-900">{formatCurrency(1750000)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-600">Plan populaire</span>
                        <span className="font-medium text-orange-900">PRO</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-orange-600">Utilisateurs totaux</span>
                        <span className="font-medium text-orange-900">98</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                    <h4 className="text-sm font-semibold text-green-800 mb-3">Directions Départementales</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Revenus générés</span>
                        <span className="font-medium text-green-900">{formatCurrency(1100000)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Plan populaire</span>
                        <span className="font-medium text-green-900">ESSENTIEL</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600">Utilisateurs totaux</span>
                        <span className="font-medium text-green-900">58</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          
          {/* Popular Plans */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#F77F00]" />
                Plans populaires
              </CardTitle>
              <CardDescription>Répartition par plan tarifaire</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {planPopularity.map((plan) => (
                  <div key={plan.name} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: plan.color }} />
                        <span className="text-sm font-semibold text-slate-800">{plan.name}</span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">{plan.subscribers}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${plan.percentage}%`,
                          backgroundColor: plan.color 
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{plan.percentage}% des abonnés</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button variant="outline" className="w-full gap-2" asChild>
                  <Link href="/admin/plans">
                    Gérer les plans
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links to other reports */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-600" />
                Autres rapports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ReportLink
                icon={Activity}
                title="Statistiques d'utilisation"
                description="Données agrégées anonymes"
                href="/admin/rapports/activites"
              />
              <ReportLink
                icon={Download}
                title="Export de données"
                description="Export CSV/Excel"
                href="/admin/rapports/export"
              />
              <ReportLink
                icon={BarChart3}
                title="Statistiques plateforme"
                description="KPIs avancés"
                href="/admin/rapports/statistiques"
              />
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="border-slate-200/80 bg-gradient-to-br from-[#0F172A] to-slate-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#F77F00]" />
                Résumé du mois
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <SummaryItem label="Nouveaux abonnés" value="+4" trend="positive" />
              <SummaryItem label="Revenus générés" value={formatCurrency(2850000)} trend="positive" />
              <SummaryItem label="Codes activés" value="8" trend="positive" />
              <SummaryItem label="Demandes traitées" value="7" trend="neutral" />
              <SummaryItem label="Taux conversion" value="68%" trend="positive" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Sub-components

interface ReportLinkProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
}

function ReportLink({ icon: Icon, title, description, href }: ReportLinkProps) {
  return (
    <Link 
      href={href}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
    >
      <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-[#F77F00]/10 group-hover:text-[#F77F00] transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-700 group-hover:text-[#F77F00] transition-colors">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#F77F00] transition-colors mt-1" />
    </Link>
  )
}

interface SummaryItemProps {
  label: string
  value: string
  trend: 'positive' | 'negative' | 'neutral'
}

function SummaryItem({ label, value, trend }: SummaryItemProps) {
  const trendColors = {
    positive: 'text-emerald-400',
    negative: 'text-red-400',
    neutral: 'text-slate-400',
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`text-sm font-bold ${trendColors[trend]}`}>{value}</span>
    </div>
  )
}
