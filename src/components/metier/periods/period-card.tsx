'use client'

import React from 'react'
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Unlock,
  TrendingUp,
  FileText,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Periode, PeriodeStats, TRIMESTRES_CONFIG } from '@/lib/actions/periods'

interface PeriodCardProps {
  periode: Periode
  stats?: PeriodeStats
  isCurrentTrimestre: boolean
  onViewActivities?: (annee: number, trimestre: number) => void
  onViewBilan?: (annee: number, trimestre: number) => void
  onClosePeriod?: (annee: number, trimestre: number) => void
  onReopenPeriod?: (annee: number, trimestre: number) => void
}

// Obtenir la config du trimestre
function getTrimestreConfig(trimestre: number) {
  return TRIMESTRES_CONFIG.find((t) => t.trimestre === trimestre)!
}

// Formater la date
function formatDate(dateStr: string | null): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function PeriodCard({
  periode,
  stats,
  isCurrentTrimestre,
  onViewActivities,
  onViewBilan,
  onClosePeriod,
  onReopenPeriod,
}: PeriodCardProps) {
  const config = getTrimestreConfig(periode.trimestre)
  const isOuvert = periode.statut === 'OUVERT'

  return (
    <Card
      className={`relative transition-all duration-200 ${
        isCurrentTrimestre
          ? 'border-2 border-orange-500 shadow-lg shadow-orange-100'
          : 'hover:shadow-md'
      } ${!isOuvert ? 'opacity-90' : ''}`}
    >
      {/* Badge trimestre courant */}
      {isCurrentTrimestre && (
        <Badge className="absolute -top-2 left-4 bg-orange-500 text-white text-xs">
          📅 Trimestre actuel
        </Badge>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-amber-50 flex items-center justify-center font-bold text-orange-700">
              {config.abbreviation}
            </span>
            <div>
              <p>Trimestre {periode.trimestre}</p>
              <p className="text-sm font-normal text-slate-500">
                {config.mois.join(' - ')}
              </p>
            </div>
          </CardTitle>

          <Badge
            variant={isOuvert ? 'default' : 'secondary'}
            className={
              isOuvert
                ? 'bg-green-100 text-green-700 hover:bg-green-100 border border-green-200'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-100 border border-slate-200'
            }
          >
            {isOuvert ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Ouvert
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 mr-1" />
                Clôturé
              </>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dates */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Année {periode.annee}
          </span>
          {!isOuvert && periode.cloture_le && (
            <span className="flex items-center gap-1 text-red-600">
              <Lock className="w-3 h-3" />
              Clôturé le {formatDate(periode.cloture_le)}
            </span>
          )}
          {!isOuvert && periode.rouverte_le && (
            <span className="flex items-center gap-1 text-blue-600">
              <Unlock className="w-3 h-3" />
                Rouvert le {formatDate(periode.rouverte_le)}
            </span>
          )}
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-slate-800">{stats.totalActivites}</p>
              <p className="text-xs text-slate-500">Activités saisies</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.activitesValidees}</p>
              <p className="text-xs text-slate-500">Validées</p>
            </div>
            
            {/* Progression validation */}
            <div className="col-span-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Taux de validation</span>
                <span className="font-medium text-slate-800">{stats.tauxValidation}%</span>
              </div>
              <Progress value={stats.tauxValidation} className="h-2" />
              
              {/* Détail par statut */}
              <div className="flex gap-2 mt-2">
                {stats.activitesBrouillon > 0 && (
                  <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                    {stats.activitesBrouillon} brouillon{stats.activitesBrouillon > 1 ? 's' : ''}
                  </Badge>
                )}
                {stats.activitesSoumises > 0 && (
                  <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                    {stats.activitesSoumises} en attente
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Budget et bénéficiaires */}
        {stats && (stats.budgetTotal > 0 || stats.beneficiairesTotal > 0) && (
          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
            {stats.budgetTotal > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium">{stats.budgetTotal.toLocaleString('fr-FR')} FCFA</span>
                <span className="text-slate-500">budget</span>
              </div>
            )}
            {stats.beneficiairesTotal > 0 && (
              <div className="flex items-center gap-1 text-sm">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="font-medium">{stats.beneficiairesTotal.toLocaleString('fr-FR')}</span>
                <span className="text-slate-500">bénéficiaires</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {isOuvert ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewActivities?.(periode.annee, periode.trimestre)}
                className="flex-1 min-w-[140px]"
              >
                <Eye className="w-4 h-4 mr-1" />
                Voir les activités
              </Button>
              {onClosePeriod && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onClosePeriod?.(periode.annee, periode.trimestre)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Lock className="w-4 h-4 mr-1" />
                  Clôturer
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewBilan?.(periode.annee, periode.trimestre)}
                className="flex-1 min-w-[140px]"
              >
                <FileText className="w-4 h-4 mr-1" />
                Voir le bilan
              </Button>
              {onReopenPeriod && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReopenPeriod?.(periode.annee, periode.trimestre)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200"
                >
                  <Unlock className="w-4 h-4 mr-1" />
                  Rouvrir
                </Button>
              )}
            </>
          )}
        </div>

        {/* Motif de réouverture */}
        {!isOuvert && periode.motif_reouverture && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              <strong>Motif de réouverture :</strong>{' '}
              {periode.motif_reouverture}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
