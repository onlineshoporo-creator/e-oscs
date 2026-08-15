'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  ArrowRight,
  Calendar,
  BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  activites, 
  statsMensuelles, 
  formatMontant, 
  STATUT_CONFIG,
  type Activite 
} from '@/lib/mock/activites'

// Configuration des statuts avec couleurs e-OSCS
const STATUT_COLORS: Record<string, { label: string; color: string; bgColor: string; dotColor: string }> = {
  BROUILLON: { label: 'Brouillon', color: 'bg-slate-100 text-slate-700', bgColor: 'bg-slate-50', dotColor: 'bg-slate-400' },
  SOUMIS: { label: 'Soumis', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-50', dotColor: 'bg-blue-500' },
  EN_VERIFICATION: { label: 'En vérification', color: 'bg-amber-100 text-amber-700', bgColor: 'bg-amber-50', dotColor: 'bg-amber-500' },
  VALIDE: { label: 'Validé', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-50', dotColor: 'bg-green-500' },
  REJETE: { label: 'Rejeté', color: 'bg-red-100 text-red-700', bgColor: 'bg-red-50', dotColor: 'bg-red-500' },
  CORRECTION: { label: 'Correction', color: 'bg-orange-100 text-orange-700', bgColor: 'bg-orange-50', dotColor: 'bg-orange-500' },
  // Legacy statuts pour compatibilité mock
  en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-700', bgColor: 'bg-blue-50', dotColor: 'bg-blue-500' },
  en_attente: { label: 'En attente', color: 'bg-orange-100 text-orange-700', bgColor: 'bg-orange-50', dotColor: 'bg-orange-500' },
  termine: { label: 'Terminé', color: 'bg-green-100 text-green-700', bgColor: 'bg-green-50', dotColor: 'bg-green-500' },
  valide: { label: 'Validée', color: 'bg-emerald-100 text-emerald-700', bgColor: 'bg-emerald-50', dotColor: 'bg-emerald-500' },
  rejete: { label: 'Rejetée', color: 'bg-red-100 text-red-700', bgColor: 'bg-red-50', dotColor: 'bg-red-500' },
  planifie: { label: 'Planifiée', color: 'bg-slate-100 text-slate-700', bgColor: 'bg-slate-50', dotColor: 'bg-slate-400' },
}

// KPI Cards améliorés
function KPICards() {
  const totalActivites = activites.length
  const activitesEnCours = activites.filter(a => ['en_cours', 'EN_VERIFICATION'].includes(a.statut)).length
  const activitesEnAttente = activites.filter(a => ['en_attente', 'SOUMIS'].includes(a.statut)).length
  const activitesTerminees = activites.filter(a => ['termine', 'valide', 'VALIDE'].includes(a.statut)).length
  const tauxExecution = Math.round((activitesTerminees / totalActivites) * 100)
  const budgetTotal = activites.reduce((sum, a) => sum + a.budgetAlloue, 0)
  const budgetDepense = activites.reduce((sum, a) => sum + a.budgetDepense, 0)
  const beneficiairesTotal = activites.reduce((sum, a) => sum + a.beneficiairesCount, 0)

  const kpis = [
    {
      title: 'Total Activités',
      value: totalActivites.toString(),
      description: `${activitesEnAttente} en attente de validation`,
      icon: ClipboardList,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Taux Exécution',
      value: `${tauxExecution}%`,
      description: `${activitesTerminees} terminées sur ${totalActivites}`,
      icon: Target,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      trend: '+5.2%',
      trendUp: true,
    },
    {
      title: 'En Cours',
      value: activitesEnCours.toString(),
      description: 'Activités actuellement actives',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      iconBg: 'bg-orange-100',
      trend: '-2',
      trendUp: false,
    },
    {
      title: 'Bénéficiaires',
      value: beneficiairesTotal.toLocaleString('fr-FR'),
      description: 'Personnes atteintes',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      trend: '+18%',
      trendUp: true,
    },
    {
      title: 'Budget Total',
      value: formatMontant(budgetTotal),
      description: `Dépensé: ${formatMontant(budgetDepense)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      iconBg: 'bg-emerald-100',
      trend: `${Math.round((budgetDepense / budgetTotal) * 100)}% utilisé`,
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="hover:shadow-lg transition-all duration-300 border-slate-200 group hover:border-orange-200">
          <CardContent className="p-4 lg:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-xl ${kpi.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className={`text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-full ${
                kpi.trendUp ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
              }`}>
                <TrendingUp className={`w-3 h-3 ${!kpi.trendUp ? 'rotate-180' : ''}`} />
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 tracking-tight">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{kpi.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Graphique barres CSS pour exécution mensuelle
function ExecutionChart() {
  const maxVal = Math.max(...statsMensuelles.map(s => s.tauxExecution))
  
  return (
    <div className="space-y-4">
      {statsMensuelles.map((stat, idx) => (
        <div key={idx} className="group">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700">{stat.mois}</span>
            <span className="text-sm font-bold text-slate-900">{stat.tauxExecution}%</span>
          </div>
          <div className="relative h-8 bg-slate-100 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-lg transition-all duration-700 ease-out flex items-center justify-end pr-2"
              style={{ width: `${(stat.tauxExecution / 100) * 100}%` }}
            >
              {(stat.tauxExecution / 100) * 100 > 20 && (
                <span className="text-xs font-semibold text-white opacity-80">{stat.activitesRealisees}/{stat.activitesPlanifiees}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Mini graphique ligne SVG
function TrendLineChart() {
  const data = statsMensuelles.map(s => s.tauxExecution)
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  
  const width = 350
  const height = 100
  const padding = 10
  
  const points = data.map((value, index) => ({
    x: padding + (index / (data.length - 1)) * (width - 2 * padding),
    y: padding + (height - 2 * padding) * (1 - (value - min) / range)
  }))
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const areaD = `${pathD} L${points[points.length - 1].x},${height - padding} L${padding},${height - padding} Z`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F77F00" stopOpacity={0.3} />
          <stop offset="100%" stopColor="#F77F00" stopOpacity={0} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Zone sous la courbe */}
      <path d={areaD} fill="url(#lineGradient)" />
      
      {/* Ligne principale */}
      <path 
        d={pathD} 
        fill="none" 
        stroke="#F77F00" 
        strokeWidth="3" 
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />
      
      {/* Points de données */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="6" fill="white" stroke="#F77F00" strokeWidth="2" />
          <circle cx={p.x} cy={p.y} r="3" fill="#F77F00" />
          {/* Label */}
          <text 
            x={p.x} 
            y={p.y - 15} 
            textAnchor="middle" 
            className="text-xs font-semibold fill-slate-700"
            fontSize="11"
          >
            {data[i]}%
          </text>
        </g>
      ))}
    </svg>
  )
}

// Statuts des activités
function StatutRepartition() {
  const repartition = Object.entries(STATUT_CONFIG).map(([key, config]) => ({
    statut: key as keyof typeof STATUT_CONFIG,
    ...config,
    count: activites.filter(a => a.statut === key).length,
  })).filter(r => r.count > 0)

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-500" />
          Répartition par statut
        </CardTitle>
        <CardDescription>État des activités</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repartition.map((item) => (
            <div key={item.statut} className="group">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-3 h-3 rounded-full ${item.dotColor} flex-shrink-0 ring-2 ring-offset-1 ${item.dotColor.replace('bg-', 'ring-')}`} />
                <span className="text-sm font-medium text-slate-700 w-28">{item.label}</span>
                <Progress 
                  value={(item.count / activites.length) * 100} 
                  className="flex-1 h-2 [&>div]:rounded-full" 
                />
                <span className="text-sm font-bold text-slate-900 w-8 text-right tabular-nums">{item.count}</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Légende du total */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
          <span className="text-slate-500">Total</span>
          <span className="font-bold text-slate-900">{activites.length} activités</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Activités récentes
function ActivitesRecentes() {
  const recentes = [...activites]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Activités récentes</CardTitle>
            <CardDescription>Dernières activités ajoutées</CardDescription>
          </div>
          <Link href="/app/activites">
            <Button variant="ghost" size="sm" className="gap-1.5 text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {recentes.map((activite) => {
            const statutConfig = STATUT_COLORS[activite.statut] || STATUT_COLORS.BROUILLON
            return (
              <Link 
                key={activite.id}
                href={`/app/activites/${activite.id}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${statutConfig.dotColor} ring-2 ring-offset-1 ${statutConfig.dotColor.replace('bg-', 'ring-')}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-orange-600 transition-colors">
                    {activite.nom}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge variant="secondary" className={`${statutConfig.color} text-xs px-2 py-0.5 font-medium`}>
                      {STATUT_CONFIG[activite.statut]?.label || activite.statut}
                    </Badge>
                    <span className="text-xs text-slate-500">{activite.organisationNom}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap flex-shrink-0">
                  {new Date(activite.dateActivite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// En attente de validation
function EnAttenteValidation() {
  const enAttente = activites
    .filter(a => a.statut === 'en_attente')
    .slice(0, 4)

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50/50 to-white hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100">
              <AlertCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">En attente de validation</CardTitle>
              <CardDescription>{enAttente.length} activité(s)</CardDescription>
            </div>
          </div>
          <Link href="/app/validation">
            <Button size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200">
              Valider
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {enAttente.map((activite) => (
            <div 
              key={activite.id}
              className="flex items-center justify-between p-3 bg-white rounded-xl border border-orange-100 hover:border-orange-200 transition-colors shadow-sm"
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {activite.nom}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activite.organisationNom} • {new Date(activite.dateActivite).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <Badge variant="outline" className="border-orange-300 text-orange-700 whitespace-nowrap font-medium bg-orange-50">
                {formatMontant(activite.budgetAlloue)}
              </Badge>
            </div>
          ))}
          
          {enAttente.length === 0 && (
            <div className="text-center py-6 text-slate-500">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <p className="text-sm">Aucune activité en attente</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Tendances mensuelles avec graphique
function TendancesMensuelles() {
  const dernierMois = statsMensuelles[statsMensuelles.length - 1]

  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              Performance du mois
            </CardTitle>
            <CardDescription>{dernierMois?.mois} {dernierMois?.annee}</CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
            +{dernierMois?.tauxExecution || 0}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {dernierMois && (
          <>
            {/* Graphique tendance */}
            <div className="mb-4 p-3 bg-slate-50 rounded-xl">
              <TrendLineChart />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                <p className="text-xs text-green-600 font-medium mb-1">Exécution</p>
                <p className="text-xl font-bold text-green-700">{dernierMois.tauxExecution}%</p>
                <p className="text-xs text-green-600/70">{dernierMois.activitesRealisees}/{dernierMois.activitesPlanifiees} activités</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1">Budget consommé</p>
                <p className="text-xl font-bold text-blue-700">
                  {Math.round((dernierMois.budgetDepense / dernierMois.budgetAlloue) * 100)}%
                </p>
                <p className="text-xs text-blue-600/70">{formatMontant(dernierMois.budgetDepense)}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-purple-600 font-medium mb-1">Bénéficiaires atteints</p>
                    <p className="text-xl font-bold text-purple-700">
                      {dernierMois.beneficiairesAtteints.toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-purple-600 font-medium mb-1">Objectif</p>
                    <p className="text-lg font-bold text-purple-500">+15%</p>
                  </div>
                </div>
                <Progress value={75} className="mt-2 h-2 [&>div]:bg-purple-500" />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

// Graphique d'exécution mensuel (nouvelle section)
function ExecutionMensuelleSection() {
  return (
    <Card className="border-slate-200 hover:shadow-md transition-shadow lg:col-span-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-500" />
              Taux d&apos;exécution mensuel
            </CardTitle>
            <CardDescription>Évolution sur les derniers mois</CardDescription>
          </div>
          <Badge variant="outline" className="border-green-200 text-green-700">
            Moyenne: {Math.round(statsMensuelles.reduce((s, m) => s + m.tauxExecution, 0) / statsMensuelles.length)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ExecutionChart />
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">
            Bienvenue ! Voici un aperçu de vos activités.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/rapports">
            <Button variant="outline" className="gap-2 border-slate-200 hover:bg-slate-50">
              <ClipboardList className="w-4 h-4" />
              Rapports
            </Button>
          </Link>
          <Link href="/app/activites/nouveau">
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200">
              <CheckCircle2 className="w-4 h-4" />
              Nouvelle activité
            </Button>
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <KPICards />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Colonne gauche - Plus large */}
        <div className="lg:col-span-2 space-y-6">
          <EnAttenteValidation />
          <ActivitesRecentes />
          <ExecutionMensuelleSection />
        </div>

        {/* Colonne droite */}
        <div className="space-y-6">
          <StatutRepartition />
          <TendancesMensuelles />
        </div>
      </div>
    </div>
  )
}
