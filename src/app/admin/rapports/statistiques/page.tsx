'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Clock,
  RefreshCw,
  Award,
  Building2,
  Timer,
  Target,
  Zap,
  Users,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Données mock pour les statistiques plateforme
const platformStats = {
  // Temps moyen d'activation des codes
  avgCodeActivationTime: {
    value: 2.3,
    unit: 'jours',
    trend: 'down', // down = good (faster)
    trendValue: '-12%',
    description: 'Plus c\'est rapide, mieux c\'est',
  },
  
  // Taux de renouvellement
  renewalRate: {
    value: 87.5,
    unit: '%',
    trend: 'up',
    trendValue: '+5.2%',
    description: 'Des abonnés qui se réabonnent',
  },
  
  // Taux de churn mensuel
  churnRate: {
    value: 4.2,
    unit: '%',
    trend: 'down',
    trendValue: '-0.8%',
    description: 'Abonnés perdus ce mois',
  },
  
  // Lifetime Value (LTV)
  lifetimeValue: {
    value: 2840000,
    unit: 'FCFA',
    formatted: '2.84M FCFA',
    trend: 'up',
    trendValue: '+8.1%',
    description: 'Valeur moyenne par client',
  },
  
  // Customer Acquisition Cost (CAC)
  cac: {
    value: 450000,
    unit: 'FCFA',
    formatted: '450K FCFA',
    trend: 'down',
    trendValue: '-15%',
    description: 'Coût d\'acquisition client',
  },
  
  // LTV/CAC Ratio
  ltvCacRatio: {
    value: 6.3,
    unit: '',
    trend: 'up',
    trendValue: '+0.4',
    description: 'Ratio idéal > 3',
  },
}

// Organisation la plus active (nom seulement, pas de détails métier)
const topOrganizations = [
  { rank: 1, name: 'Organisation #1', activityScore: 98, growth: '+12%' },
  { rank: 2, name: 'Organisation #2', activityScore: 94, growth: '+8%' },
  { rank: 3, name: 'Organisation #3', activityScore: 89, growth: '+15%' },
  { rank: 4, name: 'Organisation #4', activityScore: 85, growth: '+5%' },
  { rank: 5, name: 'Organisation #5', activityScore: 82, growth: '+22%' },
]

// Évolution du taux d'activation
const activationTimeEvolution = [
  { month: 'Sept', days: 4.2 },
  { month: 'Oct', days: 3.8 },
  { month: 'Nov', days: 3.5 },
  { month: 'Déc', days: 3.1 },
  { month: 'Jan', days: 2.7 },
  { month: 'Fév', days: 2.3 },
]

// Taux de renouvellement par plan
const renewalByPlan = [
  { plan: 'ESSENTIEL', rate: 92, subscribers: 4 },
  { plan: 'PRO', rate: 88, subscribers: 12 },
  { plan: 'INSTITUTIONNEL', rate: 83, subscribers: 8 },
]

// Métriques de santé plateforme
const healthMetrics = [
  { 
    label: 'Temps de réponse API', 
    value: '145ms', 
    status: 'good' as const,
    target: '< 200ms' 
  },
  { 
    label: 'Uptime ce mois', 
    value: '99.97%', 
    status: 'good' as const,
    target: '> 99.9%' 
  },
  { 
    label: 'Taux d\'erreur', 
    value: '0.03%', 
    status: 'good' as const,
    target: '< 0.1%' 
  },
  { 
    label: 'Utilisation stockage', 
    value: '78%', 
    status: 'warning' as const,
    target: '< 80%' 
  },
  { 
    label: 'Connexions simultanées max', 
    value: '47', 
    status: 'good' as const,
    target: '< 100' 
  },
]

export default function StatistiquesPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '1y'>('90d')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/rapports">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="w-7 h-7 text-[#009E60]" />
                Statistiques plateforme
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                KPIs avancés et métriques de performance SaaS
              </p>
            </div>
          </div>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1">
          {[
            { value: '30d', label: '30 jours' },
            { value: '90d', label: '90 jours' },
            { value: '1y', label: '1 an' },
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
      </div>

      {/* Main KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        
        {/* Code Activation Time */}
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Activation code</span>
              <div className="p-1.5 rounded-lg bg-cyan-100 text-cyan-600">
                <Timer className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformStats.avgCodeActivationTime.value} {platformStats.avgCodeActivationTime.unit}</p>
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 ${
              platformStats.avgCodeActivationTime.trend === 'down' ? 'text-emerald-700 bg-emerald-50' : 'text-red-700 bg-red-50'
            }`}>
              <TrendingUp className={`w-2.5 h-2.5 ${platformStats.avgCodeActivationTime.trend === 'down' ? 'rotate-180' : ''}`} />
              {platformStats.avgCodeActivationTime.trendValue}
            </span>
          </CardContent>
        </Card>

        {/* Renewal Rate */}
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Renouvellement</span>
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformStats.renewalRate.value}{platformStats.renewalRate.unit}</p>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 text-emerald-700 bg-emerald-50">
              <TrendingUp className="w-2.5 h-2.5" />
              {platformStats.renewalRate.trendValue}
            </span>
          </CardContent>
        </Card>

        {/* Churn Rate */}
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-rose-500" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Churn</span>
              <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformStats.churnRate.value}{platformStats.churnRate.unit}</p>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 text-emerald-700 bg-emerald-50">
              <TrendingUp className="w-2.5 h-2.5 rotate-180" />
              {platformStats.churnRate.trendValue}
            </span>
          </CardContent>
        </Card>

        {/* LTV */}
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F77F00] to-amber-500" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">LTV</span>
              <div className="p-1.5 rounded-lg bg-orange-100 text-[#F77F00]">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformStats.lifetimeValue.formatted}</p>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 text-emerald-700 bg-emerald-50">
              <TrendingUp className="w-2.5 h-2.5" />
              {platformStats.lifetimeValue.trendValue}
            </span>
          </CardContent>
        </Card>

        {/* CAC */}
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">CAC</span>
              <div className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                <Target className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformStats.cac.formatted}</p>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 text-emerald-700 bg-emerald-50">
              <TrendingUp className="w-2.5 h-2.5 rotate-180" />
              {platformStats.cac.trendValue}
            </span>
          </CardContent>
        </Card>

        {/* LTV/CAC Ratio */}
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
          <CardContent className="p-4 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">LTV/CAC</span>
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600">
                <Zap className="w-3.5 h-3.5" />
              </div>
            </div>
            <p className="text-xl font-bold text-slate-900">{platformStats.ltvCacRatio.value}:1</p>
            <Badge variant="secondary" className="text-[10px] mt-1 bg-emerald-50 text-emerald-700 border-emerald-200">
              Excellent (&gt;3)
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* Activation Time Evolution */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Timer className="w-5 h-5 text-cyan-600" />
                Temps d&apos;activation des codes
              </CardTitle>
              <CardDescription>Évolution du délai entre la génération et l&apos;activation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activationTimeEvolution.map((data, index) => {
                  const maxDays = Math.max(...activationTimeEvolution.map(d => d.days))
                  return (
                    <div key={data.month} className="group flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-500 w-10 text-right">{data.month}</span>
                      <div className="flex-1 relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg transition-all duration-500 group-hover:from-cyan-600 group-hover:to-blue-600"
                          style={{ width: `${(data.days / maxDays) * 100}%` }}
                        >
                          <div className="absolute inset-0 bg-white/10 rounded-lg" />
                        </div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-bold text-white drop-shadow-sm">
                          {data.days}j
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-600" />
                <p className="text-sm text-cyan-800">
                  Amélioration de <strong>45%</strong> sur les 6 derniers mois !
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Renewal by Plan */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-600" />
                Taux de renouvellement par plan
              </CardTitle>
              <CardDescription>Fidélité des abonnés selon leur forfait</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {renewalByPlan.map((plan) => (
                  <div key={plan.plan}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          plan.plan === 'ESSENTIEL' ? 'border-slate-300 text-slate-700' :
                          plan.plan === 'PRO' ? 'border-orange-300 text-orange-700' :
                          'border-emerald-300 text-emerald-700'
                        }>
                          {plan.plan}
                        </Badge>
                        <span className="text-sm text-slate-500">{plan.subscribers} abonnés</span>
                      </div>
                      <span className="text-lg font-bold text-slate-900">{plan.rate}%</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          plan.rate >= 90 ? 'bg-gradient-to-r from-emerald-500 to-green-400' :
                          plan.rate >= 85 ? 'bg-gradient-to-r from-[#F77F00] to-amber-400' :
                          'bg-gradient-to-r from-red-500 to-rose-400'
                        }`}
                        style={{ width: `${plan.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" />
                <p className="text-sm text-emerald-800">
                  Le plan <strong>ESSENTIEL</strong> a le meilleur taux de rétention ({renewalByPlan[0].rate}%)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Top Organizations (Anonymous) */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#F77F00]" />
                Organisations les plus actives
              </CardTitle>
              <CardDescription>Basé sur le score d&apos;activité (noms anonymisés)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topOrganizations.map((org) => (
                  <div 
                    key={org.rank}
                    className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      org.rank <= 3 
                        ? 'bg-gradient-to-br from-[#F77F00] to-amber-400 text-white' 
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {org.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{org.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-slate-900">{org.activityScore}/100</p>
                      <p className={`text-xs font-medium flex items-center justify-end gap-0.5 ${
                        org.growth.startsWith('+') ? 'text-emerald-600' : 'text-red-600'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${!org.growth.startsWith('+') ? 'rotate-180' : ''}`} />
                        {org.growth}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100 flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Les noms sont anonymisés pour protéger la vie privée des organisations. 
                  Seul le classement et le score sont affichés.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3) */}
        <div className="space-y-6">
          
          {/* Platform Health */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-500" />
                Santé technique
              </CardTitle>
              <CardDescription>Métriques de performance système</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-sm text-slate-700 truncate">{metric.label}</p>
                    <p className="text-[10px] text-slate-400">Target: {metric.target}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold ${
                      metric.status === 'good' ? 'text-emerald-600' :
                      metric.status === 'warning' ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {metric.value}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${
                      metric.status === 'good' ? 'bg-emerald-500 animate-pulse' :
                      metric.status === 'warning' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`} />
                  </div>
                </div>
              ))}
              
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Statut global</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-200 bg-emerald-50">
                    Excellent
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <Card className="border-slate-200/80 bg-gradient-to-br from-[#0F172A] to-slate-800 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#009E60]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardHeader className="pb-3 relative">
              <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#009E60]" />
                Insights clés
              </CardTitle>
            </CardHeader>
            <CardContent className="relative space-y-3">
              <InsightItem
                icon={<TrendingUp className="w-4 h-4" />}
                text="Le ratio LTV/CAC de 6.3:1 est excellent"
                type="positive"
              />
              <InsightItem
                icon={<Timer className="w-4 h-4" />}
                text="Le temps d'activation a diminué de 45%"
                type="positive"
              />
              <InsightItem
                icon={<RefreshCw className="w-4 h-4" />}
                text="Taux de rétention global à 87.5%"
                type="positive"
              />
              <InsightItem
                icon={<Activity className="w-4 h-4" />}
                text="Stockage à 78% - surveiller la croissance"
                type="warning"
              />
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-slate-200/80">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#F77F00]" />
                Actions recommandées
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ActionLink 
                title="Optimiser le CAC" 
                description="Analyser les canaux d'acquisition"
                href="#"
              />
              <ActionLink 
                title="Réduire le churn" 
                description="Programme de fidélisation"
                href="/admin/plans"
              />
              <ActionLink 
                title="Surveiller le stockage" 
                description="Prévoir l'extension"
                href="#"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Sub-components

interface InsightItemProps {
  icon: React.ReactNode
  text: string
  type: 'positive' | 'warning' | 'negative'
}

function InsightItem({ icon, text, type }: InsightItemProps) {
  const colors = {
    positive: 'text-emerald-400 bg-emerald-500/10',
    warning: 'text-amber-400 bg-amber-500/10',
    negative: 'text-red-400 bg-red-500/10',
  }

  return (
    <div className="flex items-start gap-3 p-2.5 rounded-lg bg-white/5">
      <div className={`p-1.5 rounded-md ${colors[type]}`}>
        {icon}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
    </div>
  )
}

interface ActionLinkProps {
  title: string
  description: string
  href: string
}

function ActionLink({ title, description, href }: ActionLinkProps) {
  return (
    <Link 
      href={href}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors group"
    >
      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#F77F00] mt-0.5 shrink-0 transition-colors" />
      <div>
        <p className="text-sm font-medium text-slate-700 group-hover:text-[#F77F00] transition-colors">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </Link>
  )
}
