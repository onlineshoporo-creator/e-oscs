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
  Calendar
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

// KPI Cards
function KPICards() {
  const totalActivites = activites.length
  const activitesEnCours = activites.filter(a => a.statut === 'en_cours').length
  const activitesEnAttente = activites.filter(a => a.statut === 'en_attente').length
  const activitesTerminees = activites.filter(a => a.statut === 'termine' || a.statut === 'valide').length
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
      trend: `${Math.round((budgetDepense / budgetTotal) * 100)}% utilisé`,
      trendUp: false,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <span className={`text-xs font-medium flex items-center gap-1 ${
                kpi.trendUp ? 'text-green-600' : 'text-orange-600'
              }`}>
                <TrendingUp className={`w-3 h-3 ${!kpi.trendUp ? 'rotate-180' : ''}`} />
                {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-500 mt-1">{kpi.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
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
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Répartition par statut</CardTitle>
        <CardDescription>État des activités</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {repartition.map((item) => (
            <div key={item.statut} className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.dotColor} flex-shrink-0`} />
              <span className="text-sm text-slate-600 w-28">{item.label}</span>
              <Progress 
                value={(item.count / activites.length) * 100} 
                className="flex-1 h-2" 
              />
              <span className="text-sm font-medium text-slate-900 w-8 text-right">{item.count}</span>
            </div>
          ))}
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Activités récentes</CardTitle>
            <CardDescription>Dernières activités ajoutées</CardDescription>
          </div>
          <Link href="/app/activites">
            <Button variant="ghost" size="sm" className="gap-1">
              Voir tout
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentes.map((activite) => (
            <Link 
              key={activite.id}
              href={`/app/activites/${activite.id}`}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                STATUT_CONFIG[activite.statut]?.dotColor || 'bg-slate-400'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {activite.nom}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs px-1.5 py-0">
                    {STATUT_CONFIG[activite.statut]?.label || activite.statut}
                  </Badge>
                  <span className="text-xs text-slate-500">{activite.organisationNom}</span>
                </div>
              </div>
              <span className="text-xs text-slate-400 whitespace-nowrap">
                {new Date(activite.dateActivite).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
              </span>
            </Link>
          ))}
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
    <Card className="border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            <div>
              <CardTitle className="text-base">En attente de validation</CardTitle>
              <CardDescription>{enAttente.length} activité(s)</CardDescription>
            </div>
          </div>
          <Link href="/app/validation">
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
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
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-100"
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {activite.nom}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activite.organisationNom} • {new Date(activite.dateActivite).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <Badge variant="outline" className="border-orange-300 text-orange-700 whitespace-nowrap">
                {formatMontant(activite.budgetAlloue)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Tendances mensuelles (simplifié sans chart pour l'instant)
function TendancesMensuelles() {
  const dernierMois = statsMensuelles[statsMensuelles.length - 1]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Performance du mois</CardTitle>
            <CardDescription>{dernierMois?.mois} {dernierMois?.annee}</CardDescription>
          </div>
          <Calendar className="w-5 h-5 text-slate-400" />
        </div>
      </CardHeader>
      <CardContent>
        {dernierMois && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Exécution</p>
              <p className="text-xl font-bold text-green-600">{dernierMois.tauxExecution}%</p>
              <p className="text-xs text-slate-400">{dernierMois.activitesRealisees}/{dernierMois.activitesPlanifiees} activités</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-slate-500 mb-1">Budget consommé</p>
              <p className="text-xl font-bold text-blue-600">
                {Math.round((dernierMois.budgetDepense / dernierMois.budgetAlloue) * 100)}%
              </p>
              <p className="text-xs text-slate-400">{formatMontant(dernierMois.budgetDepense)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg col-span-2">
              <p className="text-xs text-slate-500 mb-1">Bénéficiaires atteints</p>
              <p className="text-xl font-bold text-purple-600">
                {dernierMois.beneficiairesAtteints.toLocaleString('fr-FR')}
              </p>
              <Progress value={75} className="mt-2 h-1.5" />
            </div>
          </div>
        )}
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
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 mt-1">
            Bienvenue ! Voici un aperçu de vos activités.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/rapports">
            <Button variant="outline" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              Rapports
            </Button>
          </Link>
          <Link href="/app/activites/nouveau">
            <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
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
