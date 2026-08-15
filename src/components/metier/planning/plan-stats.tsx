'use client'

import React from 'react'
import { Calendar, Target, TrendingUp, DollarSign, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Types
interface PlanActivity {
  id: string
  budget?: number
  realise: boolean
}

interface PlanStatsProps {
  annee: number
  titre: string
  statut: 'OUVERT' | 'CLOTURE'
  activities: PlanActivity[]
}

export function PlanStats({ annee, titre, statut, activities }: PlanStatsProps) {
  // Calculer les statistiques
  const totalActivities = activities.length
  const realisedActivities = activities.filter(a => a.realise).length
  const pendingActivities = totalActivities - realisedActivities
  
  const totalBudget = activities.reduce((sum, a) => sum + (a.budget || 0), 0)
  
  // Budget des activités réalisées (estimation)
  const realisedBudget = activities
    .filter(a => a.realise)
    .reduce((sum, a) => sum + (a.budget || 0), 0)
  
  const progressPercent = totalActivities > 0 ? Math.round((realisedActivities / totalActivities) * 100) : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Carte Année et Statut */}
      <Card className="border-slate-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${statut === 'OUVERT' ? 'bg-green-50' : 'bg-slate-100'}`}>
              <Calendar className={`w-5 h-5 ${statut === 'OUVERT' ? 'text-green-600' : 'text-slate-500'}`} />
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              statut === 'OUVERT' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-slate-100 text-slate-600'
            }`}>
              {statut === 'OUVERT' ? 'Ouvert' : 'Clôturé'}
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-900">{annee}</p>
          <p className="text-sm text-slate-500 truncate">{titre || `Plan annuel ${annee}`}</p>
        </CardContent>
      </Card>

      {/* Carte Activités */}
      <Card className="border-slate-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-blue-50">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalActivities}</p>
          <p className="text-sm text-slate-500">Activités planifiées</p>
          
          {/* Mini progression */}
          {totalActivities > 0 && (
            <div className="mt-3 space-y-1">
              <Progress value={progressPercent} className="h-1.5" />
              <div className="flex justify-between text-xs text-slate-500">
                <span>{realisedActivities} réalisées</span>
                <span>{pendingActivities} restantes</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Carte Budget */}
      <Card className="border-slate-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg bg-purple-50">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">
            {formatBudget(totalBudget)}
          </p>
          <p className="text-sm text-slate-500">Budget total planifié</p>
          
          {realisedBudget > 0 && (
            <p className="text-xs text-green-600 mt-1">
              {formatBudget(realisedBudget)} réalisé
            </p>
          )}
        </CardContent>
      </Card>

      {/* Carte Progression */}
      <Card className="border-slate-200 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${
              progressPercent === 100 ? 'bg-green-50' : 
              progressPercent >= 50 ? 'bg-blue-50' : 'bg-amber-50'
            }`}>
              <TrendingUp className={`w-5 h-5 ${
                progressPercent === 100 ? 'text-green-600' : 
                progressPercent >= 50 ? 'text-blue-600' : 'text-amber-600'
              }`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{progressPercent}%</p>
          <p className="text-sm text-slate-500">Taux de réalisation</p>
          
          <div className="flex items-center gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {realisedActivities}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {pendingActivities}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Utilitaire de formatage du budget
function formatBudget(amount: number): string {
  if (!amount) return '- FCFA'
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M FCFA`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(0)}K FCFA`
  }
  return `${amount.toLocaleString('fr-FR')} FCFA`
}
