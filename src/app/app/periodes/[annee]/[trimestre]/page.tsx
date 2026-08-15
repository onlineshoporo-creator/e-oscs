'use client'

import React, { useState, useEffect } from 'react'
import {
  ArrowLeft,
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  DollarSign,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

// Données mock pour le bilan
const MOCK_BILAN = {
  annee: 2024,
  trimestre: 2,
  kpis: {
    nbActivites: 15,
    tauxValidation: 87,
    budgetTotal: 6500000,
    budgetDepense: 5200000,
    beneficiairesHommes: 350,
    beneficiairesFemmes: 270,
    beneficiairesTotal: 620,
  },
  activities: [
    {
      id: 'act-1',
      titre: 'Formation des cadres techniques',
      statut: 'VALIDE',
      budget_alloue: 1500000,
      beneficiaires_count: 120,
      date_debut: '2024-04-10',
      date_fin: '2024-04-15',
    },
    {
      id: 'act-2',
      titre: 'Sensibilisation communautaire',
      statut: 'VALIDE',
      budget_alloue: 800000,
      beneficiaires_count: 250,
      date_debut: '2024-05-05',
      date_fin: '2024-05-07',
    },
    {
      id: 'act-3',
      titre: 'Atelier de planification',
      statut: 'VALIDE',
      budget_alloue: 500000,
      beneficiaires_count: 45,
      date_debut: '2024-04-20',
      date_fin: '2024-04-22',
    },
    {
      id: 'act-4',
      titre: 'Campagne de vaccination',
      statut: 'VALIDE',
      budget_alloue: 2000000,
      beneficiaires_count: 180,
      date_debut: '2024-06-01',
      date_fin: '2024-06-30',
    },
    {
      id: 'act-5',
      titre: 'Renforcement des capacités',
      statut: 'REJETE',
      budget_alloue: 700000,
      beneficiaires_count: 25,
      date_debut: '2024-05-15',
      date_fin: '2024-05-18',
    },
  ],
  comparaisonPrecedent: {
    evolutionActivites: 25,
    evolutionBudget: 15,
    evolutionValidation: 8,
  },
}

// Configuration des trimestres
const TRIMESTRES_CONFIG = [
  { trimestre: 1, mois: ['Janvier', 'Février', 'Mars'] },
  { trimestre: 2, mois: ['Avril', 'Mai', 'Juin'] },
  { trimestre: 3, mois: ['Juillet', 'Août', 'Septembre'] },
  { trimestre: 4, mois: ['Octobre', 'Novembre', 'Décembre'] },
]

// Formater le montant en FCFA
function formatMontantFCFA(montant: number): string {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' FCFA'
}

// Formater la date
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
  })
}

// Composant d'évolution
function EvolutionBadge({ value }: { value: number }) {
  const isPositive = value > 0
  const isNeutral = value === 0
  
  return (
    <span className={`flex items-center gap-1 text-sm font-medium ${
      isPositive ? 'text-green-600' : isNeutral ? 'text-slate-500' : 'text-red-600'
    }`}>
      {isPositive ? (
        <TrendingUp className="w-4 h-4" />
      ) : isNeutral ? (
        <Minus className="w-4 h-4" />
      ) : (
        <TrendingDown className="w-4 h-4" />
      )}
      {isPositive ? '+' : ''}{value}%
    </span>
  )
}

interface BilanPageProps {
  params: Promise<{ annee: string; trimestre: string }>
}

export default function BilanTrimestrielPage({ params }: BilanPageProps) {
  const [annee, setAnnee] = useState<number>(2024)
  const [trimestre, setTrimestre] = useState<number>(2)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Récupérer les paramètres d'URL
    params.then(({ annee: a, trimestre: t }) => {
      setAnnee(parseInt(a))
      setTrimestre(parseInt(t))
      setIsLoading(false)
    })
  }, [params])

  const bilan = MOCK_BILAN
  const config = TRIMESTRES_CONFIG.find((t) => t.trimestre === trimestre)!
  const { kpis, activities, comparaisonPrecedent } = bilan

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/app/periodes">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Bilan Trimestriel
            </h1>
            <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              T{trimestre} {annee} - {config.mois.join(' - ')}
            </p>
          </div>
        </div>

        <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
          <Download className="w-4 h-4" />
          Générer rapport
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nb Activités */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Activités</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {kpis.nbActivites}
                </p>
                {comparaisonPrecedent && (
                  <EvolutionBadge value={comparaisonPrecedent.evolutionActivites} />
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taux Validation */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Taux validation</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {kpis.tauxValidation}%
                </p>
                {comparaisonPrecedent && (
                  <EvolutionBadge value={comparaisonPrecedent.evolutionValidation} />
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <Progress value={kpis.tauxValidation} className="mt-3 h-2" />
          </CardContent>
        </Card>

        {/* Budget */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Budget total</p>
                <p className="text-xl font-bold text-slate-900 mt-1">
                  {(kpis.budgetTotal / 1000000).toFixed(1)}M FCFA
                </p>
                {comparaisonPrecedent && (
                  <EvolutionBadge value={comparaisonPrecedent.evolutionBudget} />
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Dépensé</span>
                <span>{formatMontantFCFA(kpis.budgetDepense)}</span>
              </div>
              <Progress 
                value={(kpis.budgetDepense / kpis.budgetTotal) * 100} 
                className="mt-1 h-1.5"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bénéficiaires */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">Bénéficiaires</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">
                  {kpis.beneficiairesTotal.toLocaleString('fr-FR')}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="flex items-center gap-1 text-blue-600">
                    👨 {kpis.beneficiairesHommes}
                  </span>
                  <span className="flex items-center gap-1 text-pink-600">
                    👩 {kpis.beneficiairesFemmes}
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparaison avec trimestre précédent */}
      {comparaisonPrecedent && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Comparaison avec T{trimestre === 1 ? 4 : trimestre - 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Évolution activités</p>
                <EvolutionBadge value={comparaisonPrecedent.evolutionActivites} />
                <p className="text-xs text-slate-400 mt-1">vs trimestre précédent</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Évolution budget</p>
                <EvolutionBadge value={comparaisonPrecedent.evolutionBudget} />
                <p className="text-xs text-slate-400 mt-1">vs trimestre précédent</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Évolution validation</p>
                <EvolutionBadge value={comparaisonPrecedent.evolutionValidation} />
                <p className="text-xs text-slate-400 mt-1">points de %</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Liste des activités du trimestre */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" />
            Activités du trimestre ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {/* Statut */}
                <Badge
                  variant={
                    activity.statut === 'VALIDE'
                      ? 'default'
                      : activity.statut === 'REJETE'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className={
                    activity.statut === 'VALIDE'
                      ? 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200'
                      : ''
                  }
                >
                  {activity.statut === 'VALIDE' && '✓ Validée'}
                  {activity.statut === 'REJETE' && '✗ Rejetée'}
                  {activity.statut === 'SOUMIS' && '⏳ Soumise'}
                  {activity.statut === 'BROUILLON' && '📝 Brouillon'}
                </Badge>

                {/* Infos activité */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">
                    {activity.titre}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {formatDate(activity.date_debut)} - {formatDate(activity.date_fin)}
                  </p>
                </div>

                {/* Budget et bénéficiaires */}
                <div className="hidden sm:flex items-center gap-6 text-sm">
                  <div className="text-right">
                    <p className="font-medium text-slate-700">
                      {(activity.budget_alloue / 1000).toFixed(0)}K FCFA
                    </p>
                    <p className="text-xs text-slate-400">Budget</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-slate-700">
                      {activity.beneficiaires_count}
                    </p>
                    <p className="text-xs text-slate-400">Bénéf.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
