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
  Activity
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
  colorClass
}: {
  title: string
  value: string | number
  description: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: React.ElementType
  colorClass: string
}) {
  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <div className="flex items-center justify-between mb-3">
          <div className={`p-2 rounded-lg ${colorClass}`}>
            <Icon className={`w-5 h-5`} />
          </div>
          {change && (
            <Badge variant={changeType === 'positive' ? 'default' : 'destructive'} className="gap-1">
              {changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {change}
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </CardContent>
    </Card>
  )
}

// Graphique barres simplifié (CSS)
function SimpleBarChart({ data }: { data: { label: string; value: number; max: number }[] }) {
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="text-xs text-slate-600 w-16 flex-shrink-0">{item.label}</span>
          <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
              style={{ width: `${(item.value / item.max) * 100}%` }}
            >
              <span className="text-xs font-medium text-white">{item.value}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Graphique ligne simplifié (CSS)
function MiniTrendChart({ data }: { data: number[] }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  // Créer un path SVG simple
  const width = 300
  const height = 80
  const points = data.map((value, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - ((value - min) / range) * height
  }))
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20">
      {/* Zone sous la courbe */}
      <path
        d={`${pathD} L${width},${height} L0,${height} Z`}
        fill="url(#gradient)"
        opacity={0.3}
      />
      {/* Ligne */}
      <path d={pathD} fill="none" stroke="#F77F00" strokeWidth="2" />
      {/* Points */}
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill="#F77F00" />
      ))}
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F77F00" stopOpacity={0.5} />
          <stop offset="100%" stopColor="#F77F00" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
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
    max: 100
  }))

  const budgetData = statsMensuelles.map(s => ({
    label: s.mois.substring(0, 3),
    value: Math.round((s.budgetDepense / s.budgetAlloue) * 100),
    max: 100
  }))

  const trendData = statsMensuelles.map(s => s.tauxExecution)

  // Répartition par statut
  const repartitionStatut = Object.entries(STATUT_CONFIG).map(([key, config]) => ({
    statut: key,
    label: config.label,
    count: activites.filter(a => a.statut === key).length,
    color: config.dotColor.replace('bg-', '')
  })).filter(r => r.count > 0)

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
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Statistiques</h1>
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
          colorClass="bg-green-100 text-green-600"
        />
        <AnalyticsKPI
          title="Budget consommé"
          value={formatMontant(budgetDepense)}
          description={`Sur ${formatMontant(budgetTotal)} alloué`}
          change={`${Math.round((budgetDepense/budgetTotal)*100)}%`}
          changeType="neutral"
          icon={DollarSign}
          colorClass="bg-blue-100 text-blue-600"
        />
        <AnalyticsKPI
          title="Bénéficiaires"
          value={beneficiairesTotal.toLocaleString('fr-FR')}
          description="Personnes atteintes"
          change="+18%"
          changeType="positive"
          icon={Users}
          colorClass="bg-purple-100 text-purple-600"
        />
        <AnalyticsKPI
          title="Activités actives"
          value={activites.filter(a => a.statut === 'en_cours').length.toString()}
          description={`Sur ${totalActivites} totales`}
          change="-2"
          changeType="negative"
          icon={Activity}
          colorClass="bg-orange-100 text-orange-600"
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
            <Target className="w-4 h-4" />
            Organisations
          </TabsTrigger>
        </TabsList>

        {/* Onglet Exécution */}
        <TabsContent value="execution" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Taux d'exécution mensuel</CardTitle>
                <CardDescription>Évolution sur les derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <MiniTrendChart data={trendData} />
                <SimpleBarChart data={executionData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance globale</CardTitle>
                <CardDescription>Synthèse des indicateurs clés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Taux de réalisation</span>
                    <span className="text-sm text-slate-500">{tauxExecutionGlobal}%</span>
                  </div>
                  <Progress value={tauxExecutionGlobal} className="h-3" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Utilisation budgétaire</span>
                    <span className="text-sm text-slate-500">{Math.round((budgetDepense/budgetTotal)*100)}%</span>
                  </div>
                  <Progress value={(budgetDepense/budgetTotal)*100} className="h-3" />
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Couverture bénéficiaires</span>
                    <span className="text-sm text-slate-500">78%</span>
                  </div>
                  <Progress value={78} className="h-3" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {activites.filter(a => a.statut === 'termine' || a.statut === 'valide').length}
                    </p>
                    <p className="text-xs text-slate-500">Réussies</p>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">
                      {activites.filter(a => a.statut === 'rejete').length}
                    </p>
                    <p className="text-xs text-slate-500">Rejetées</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Budget */}
        <TabsContent value="budget" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Consommation budgétaire</CardTitle>
                <CardDescription>Taux d'utilisation par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <SimpleBarChart data={budgetData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Répartition du budget</CardTitle>
                <CardDescription>Par catégorie d'activité</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Formation', 'Atelier', 'Sensibilisation', 'Évaluation', 'Autre'].map(cat => {
                    const catActivites = activites.filter(a => a.categorie === cat)
                    const totalCatBudget = catActivites.reduce((sum, a) => sum + a.budgetAlloue, 0)
                    const pct = Math.round((totalCatBudget / budgetTotal) * 100)
                    
                    return (
                      <div key={cat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{cat}</span>
                          <span className="text-slate-500">{pct}% ({formatMontant(totalCatBudget)})</span>
                        </div>
                        <Progress value={pct} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Statuts */}
        <TabsContent value="statuts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Répartition par statut</CardTitle>
              <CardDescription>Distribution des activités selon leur état</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {repartitionStatut.map(item => (
                  <div key={item.statut} className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-4 h-4 rounded-full bg-${item.color}`} />
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance par organisation</CardTitle>
              <CardDescription>Taux d'exécution et nombre d'activités</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repartitionOrg.map((org, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{org.nom}</p>
                      <p className="text-sm text-slate-500">{org.count} activité(s)</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
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
