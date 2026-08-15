'use client'

import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { 
  activites, 
  statsMensuelles, 
  indicateurs,
  formatMontant,
  organisations,
  STATUT_CONFIG
} from '@/lib/mock/activites'

// Composant de carte KPI pour analytics
function AnalyticsKPI({
  title,
  value,
  description,
  change,
  changeType = 'positive',
  icon: Icon,
  colorClass,
  iconBg
}: {
  title: string
  value: string | number
  description: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
  colorClass: string
  iconBg: string
}) {
  return (
    <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:border-slate-300">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`w-5 h-5 ${colorClass}`} />
          </div>
          {change && (
            <Badge 
              variant={changeType === 'positive' ? 'default' : changeType === 'negative' ? 'destructive' : 'secondary'} 
              className="gap-1"
            >
              {changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : 
               changeType === 'negative' ? <TrendingDown className="w-3 h-3" /> : null}
              {change}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900 tracking-tight">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

// Graphique barres horizontal CSS amélioré
function HorizontalBarChart({ 
  data, 
  showValues = true,
  colorClass = "from-orange-500 to-orange-400"
}: { 
  data: { label: string; value: number; max: number; sublabel?: string }[] 
  showValues?: boolean
  colorClass?: string
}) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="group">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-slate-700 truncate">{item.label}</span>
              {item.sublabel && (
                <span className="text-xs text-slate-400 hidden sm:inline">{item.sublabel}</span>
              )}
            </div>
            {showValues && (
              <span className="text-sm font-bold text-slate-900 tabular-nums ml-2 flex-shrink-0">
                {item.value}%
              </span>
            )}
          </div>
          <div className="relative h-7 bg-slate-100 rounded-lg overflow-hidden">
            <div 
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colorClass} rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2.5 group-hover:brightness-110`}
              style={{ width: `${(item.value / item.max) * 100}%` }}
            >
              {(item.value / item.max) * 100 > 25 && (
                <span className="text-xs font-semibold text-white/90 drop-shadow-sm">
                  {item.value}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Graphique ligne SVG amélioré
function LineChartSVG({ 
  data, 
  labels, 
  height = 120,
  color = '#F77F00',
  showArea = true 
}: { 
  data: number[] 
  labels?: string[]
  height?: number
  color?: string
  showArea?: boolean
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const width = 400
  const padding = { top: 20, right: 20, bottom: 30, left: 40 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom
  
  const points = data.map((value, index) => ({
    x: padding.left + (index / (data.length - 1)) * chartWidth,
    y: padding.top + chartHeight * (1 - (value - min) / range)
  }))
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaD = `${pathD} L${points[points.length - 1].x},${height - padding.bottom} L${padding.left},${height - padding.bottom} Z`

  // Lignes de grille horizontales
  const gridLines = [0, 25, 50, 75, 100].map(val => {
    const y = padding.top + chartHeight * (1 - val / 100)
    return (
      <g key={val}>
        <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="4" />
        <text x={padding.left - 8} y={y + 4} textAnchor="end" className="fill-slate-400" fontSize="10">{val}</text>
      </g>
    )
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet" style={{ height }}>
      <defs>
        <linearGradient id={`areaGradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={`glow-${color.replace('#', '')}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Grille */}
      {gridLines}

      {/* Zone sous la courbe */}
      {showArea && (
        <path d={areaD} fill={`url(#areaGradient-${color.replace('#', '')})`} />
      )}

      {/* Ligne principale */}
      <path 
        d={pathD} 
        fill="none" 
        stroke={color} 
        strokeWidth="3" 
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#glow-${color.replace('#', '')})`}
      />

      {/* Points de données */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill="white" stroke={color} strokeWidth="2.5" />
          <circle cx={p.x} cy={p.y} r="3" fill={color} />
          
          {/* Labels des valeurs */}
          <text 
            x={p.x} 
            y={p.y - 14} 
            textAnchor="middle" 
            className="fill-slate-700 font-semibold"
            fontSize="11"
          >
            {data[i]}%
          </text>

          {/* Labels de l'axe X */}
          {labels && (
            <text 
              x={p.x} 
              y={height - 8} 
              textAnchor="middle" 
              className="fill-slate-500"
              fontSize="10"
            >
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  )
}

// Graphique donut CSS simplifié
function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  
  // Calculer les offsets cumulatifs avant le rendu pour éviter la réassignation
  const itemsWithOffset = data.map((item) => {
    const percentage = (item.value / total) * 100
    return {
      ...item,
      percentage,
    }
  }).reduce((acc: { items: typeof data & { percentage: number }[], cumsum: number }, item) => ({
    items: [...acc.items, { ...item, offset: acc.cumsum }],
    cumsum: acc.cumsum + item.percentage,
  }), { items: [], cumsum: 0 })
  
  return (
    <div className="flex items-center justify-center gap-6">
      {/* Donut SVG */}
      <div className="relative w-40 h-40">
        <svg viewBox="0 0 42 42" className="w-full h-full -rotate-90">
          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
          {itemsWithOffset.items.map((item, index) => (
            <circle
              key={index}
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={item.color}
              strokeWidth="3"
              strokeDasharray={`${item.percentage * 2.53} ${(100 - item.percentage) * 2.53}`}
              strokeDashoffset={-(item.offset * 2.53)}
              className="transition-all duration-500"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-slate-900">{total}</p>
            <p className="text-xs text-slate-500">total</p>
          </div>
        </div>
      </div>
      
      {/* Légende */}
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-slate-600">{item.label}</span>
            <span className="text-sm font-medium text-slate-900 ml-auto">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [periode, setPeriode] = useState('mois')
  const [annee, setAnnee] = useState('2026')

  // Calculs pour les KPIs
  const totalActivites = activites.length
  const tauxExecutionGlobal = Math.round(
    (activites.filter(a => a.statut === 'termine' || a.statut === 'valide').length / totalActivites) * 100
  )
  const budgetTotal = activites.reduce((sum, a) => sum + a.budgetAlloue, 0)
  const budgetDepense = activites.reduce((sum, a) => sum + a.budgetDepense, 0)
  const beneficiairesTotal = activites.reduce((sum, a) => sum + a.beneficiairesCount, 0)

  // Données pour les graphiques
  const executionData = statsMensuelles.map(s => ({
    label: s.mois.substring(0, 3),
    value: s.tauxExecution,
    max: 100,
    sublabel: `${s.activitesRealisees}/${s.activitesPlanifiees}`
  }))

  const budgetData = statsMensuelles.map(s => ({
    label: s.mois.substring(0, 3),
    value: Math.round((s.budgetDepense / s.budgetAlloue) * 100),
    max: 100
  }))

  const trendData = statsMensuelles.map(s => s.tauxExecution)
  const trendLabels = statsMensuelles.map(s => s.mois.substring(0, 3))

  // Répartition par statut pour donut
  const repartitionStatut = Object.entries(STATUT_CONFIG)
    .map(([key, config]) => ({
      label: config.label,
      count: activites.filter(a => a.statut === key).length,
      color: key === 'termine' || key === 'valide' ? '#22c55e' :
             key === 'en_cours' || key === 'en_attente' ? '#f97316' :
             key === 'rejete' ? '#ef4444' : '#94a3b8'
    }))
    .filter(r => r.count > 0)

  // Top 5 activités par budget
  const topBudget = [...activites]
    .sort((a, b) => b.budgetAlloue - a.budgetAlloue)
    .slice(0, 5)

  // Répartition par organisation
  const repartitionOrg = organisations.slice(0, 5).map(org => ({
    nom: org.nom.replace('Ministère ', '').replace('Direction ', '').replace('Service ', ''),
    count: org.activitesCount,
    taux: org.tauxExecution
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Statistiques</h1>
          <p className="text-slate-500 mt-1">
            Analyse approfondie des performances et tendances
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={periode} onValueChange={setPeriode}>
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semaine">Semaine</SelectItem>
              <SelectItem value="mois">Mois</SelectItem>
              <SelectItem value="trimestre">Trimestre</SelectItem>
              <SelectItem value="annee">Année</SelectItem>
            </SelectContent>
          </Select>
          <Select value={annee} onValueChange={setAnnee}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Calendar className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* KPIs principaux */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsKPI
          title="Taux d'exécution"
          value={`${tauxExecutionGlobal}%`}
          description="Objectif: 85%"
          change="+5.2%"
          changeType="positive"
          icon={Target}
          colorClass="text-green-600"
          iconBg="bg-green-100"
        />
        <AnalyticsKPI
          title="Budget consommé"
          value={formatMontant(budgetDepense)}
          description={`Sur ${formatMontant(budgetTotal)} alloué`}
          change={`${Math.round((budgetDepense/budgetTotal)*100)}%`}
          changeType="neutral"
          icon={DollarSign}
          colorClass="text-blue-600"
          iconBg="bg-blue-100"
        />
        <AnalyticsKPI
          title="Bénéficiaires"
          value={beneficiairesTotal.toLocaleString('fr-FR')}
          description="Personnes atteintes"
          change="+18%"
          changeType="positive"
          icon={Users}
          colorClass="text-purple-600"
          iconBg="bg-purple-100"
        />
        <AnalyticsKPI
          title="Activités actives"
          value={activites.filter(a => a.statut === 'en_cours').length.toString()}
          description={`Sur ${totalActivites} totales`}
          change="-2"
          changeType="negative"
          icon={Activity}
          colorClass="text-orange-600"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Graphiques principaux */}
      <Tabs defaultValue="execution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="execution" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Exécution
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-2">
            <DollarSign className="w-4 h-4" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="statuts" className="gap-2">
            <PieChart className="w-4 h-4" />
            Statuts
          </TabsTrigger>
          <TabsTrigger value="organisations" className="gap-2">
            <Award className="w-4 h-4" />
            Organisations
          </TabsTrigger>
        </TabsList>

        {/* Onglet Exécution */}
        <TabsContent value="execution" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Taux d&apos;exécution mensuel</CardTitle>
                <CardDescription>Évolution sur les derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChartSVG 
                  data={trendData} 
                  labels={trendLabels}
                  height={140}
                />
                <HorizontalBarChart data={executionData} />
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Performance globale</CardTitle>
                <CardDescription>Synthèse des indicateurs clés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Taux de réalisation</span>
                    <span className="text-sm font-bold text-slate-900">{tauxExecutionGlobal}%</span>
                  </div>
                  <Progress value={tauxExecutionGlobal} className="h-3 [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-green-400" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Utilisation budgétaire</span>
                    <span className="text-sm font-bold text-slate-900">{Math.round((budgetDepense/budgetTotal)*100)}%</span>
                  </div>
                  <Progress value={(budgetDepense/budgetTotal)*100} className="h-3 [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-400" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Couverture bénéficiaires</span>
                    <span className="text-sm font-bold text-slate-900">78%</span>
                  </div>
                  <Progress value={78} className="h-3 [&>div]:rounded-full [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-purple-400" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                    <Zap className="w-6 h-6 mx-auto mb-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">
                      {activites.filter(a => a.statut === 'termine' || a.statut === 'valide').length}
                    </p>
                    <p className="text-xs text-green-600/70 mt-1">Réussies</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-xl border border-red-100">
                    <XCircle className="w-6 h-6 mx-auto mb-2 text-red-600" />
                    <p className="text-2xl font-bold text-red-600">
                      {activites.filter(a => a.statut === 'rejete').length}
                    </p>
                    <p className="text-xs text-red-600/70 mt-1">Rejetées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Budget */}
        <TabsContent value="budget" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Consommation budgétaire</CardTitle>
                <CardDescription>Taux d&apos;utilisation par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <HorizontalBarChart 
                  data={budgetData} 
                  colorClass="from-blue-500 to-blue-400"
                />
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Top 5 Activités Budget</CardTitle>
                <CardDescription>Les activités avec le plus gros budget</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topBudget.map((act, idx) => (
                    <div key={act.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                        idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                        idx === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        idx === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-slate-400 to-slate-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{act.nom}</p>
                        <p className="text-xs text-slate-500">{act.organisationNom}</p>
                      </div>
                      <span className="font-bold text-slate-900 text-sm">
                        {formatMontant(act.budgetAlloue)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Statuts */}
        <TabsContent value="statuts" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Répartition par statut</CardTitle>
              <CardDescription>Distribution des activités selon leur état</CardDescription>
            </CardHeader>
            <CardContent>
              <DonutChart data={repartitionStatut} />
              
              <Separator className="my-6" />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repartitionStatut.map(item => (
                  <div key={item.label} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="font-medium text-slate-700">{item.label}</span>
                    </div>
                    <p className="text-3xl font-bold text-slate-900">{item.count}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {Math.round((item.count / totalActivites) * 100)}% du total
                    </p>
                    <Progress 
                      value={(item.count / totalActivites) * 100} 
                      className="mt-2 h-1.5" 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Organisations */}
        <TabsContent value="organisations" className="space-y-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Performance par organisation</CardTitle>
              <CardDescription>Taux d&apos;exécution et nombre d&apos;activités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repartitionOrg.map((org, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-200">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 truncate">{org.nom}</p>
                      <p className="text-sm text-slate-500">{org.count} activité(s)</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-xl ${
                        org.taux >= 80 ? 'text-green-600' : org.taux >= 60 ? 'text-orange-600' : 'text-red-600'
                      }`}>
                        {org.taux}%
                      </p>
                      <p className="text-xs text-slate-500">exécution</p>
                    </div>
                    <Progress value={org.taux} className="w-24 hidden sm:block" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import manuel pour XCircle utilisé dans le composant
function XCircle(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  )
}
