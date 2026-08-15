'use client'

import React from 'react'
import { CheckCircle2, Lock, Unlock, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Periode, TRIMESTRES_CONFIG } from '@/lib/actions/periods'

interface PeriodTimelineProps {
  periods: Periode[]
  currentTrimestre: { annee: number; trimestre: number }
  onSelectPeriod?: (annee: number, trimestre: number) => void
  selectedAnnee?: number
}

export function PeriodTimeline({
  periods,
  currentTrimestre,
  onSelectPeriod,
  selectedAnnee,
}: PeriodTimelineProps) {
  // Filtrer les périodes pour l'année sélectionnée ou utiliser toutes
  const filteredPeriods = selectedAnnee
    ? periods.filter((p) => p.annee === selectedAnnee)
    : periods

  // Grouper par année
  const groupedByYear = filteredPeriods.reduce(
    (acc, periode) => {
      if (!acc[periode.annee]) {
        acc[periode.annee] = []
      }
      acc[periode.annee].push(periode)
      return acc
    },
    {} as Record<number, Periode[]>
  )

  // Trier les années
  const years = Object.keys(groupedByYear)
    .map(Number)
    .sort((a, b) => b - a)

  if (years.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p>Aucune période disponible</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year} className="relative">
          {/* En-tête année */}
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-slate-800">{year}</h3>
            {year === new Date().getFullYear() && (
              <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                Année en cours
              </Badge>
            )}
          </div>

          {/* Timeline des trimestres */}
          <div className="flex items-start gap-4">
            {/* Ligne verticale */}
            <div className="flex flex-col items-center">
              {groupedByYear[year].map((periode, idx) => {
                const config = TRIMESTRES_CONFIG.find(
                  (t) => t.trimestre === periode.trimestre
                )!
                const isOuvert = periode.statut === 'OUVERT'
                const isCurrent =
                  year === currentTrimestre.annee &&
                  periode.trimestre === currentTrimestre.trimestre

                return (
                  <React.Fragment key={periode.id}>
                    {/* Point timeline */}
                    <button
                      onClick={() =>
                        onSelectPeriod?.(periode.annee, periode.trimestre)
                      }
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-110'
                          : isOuvert
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                      title={`${config.abbreviation} - ${isOuvert ? 'Ouvert' : 'Clôturé'}`}
                    >
                      {isOuvert ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Lock className="w-5 h-5" />
                      )}
                    </button>

                    {/* Ligne de connexion */}
                    {idx < groupedByYear[year].length - 1 && (
                      <div className="w-0.5 h-8 bg-slate-200" />
                    )}
                  </React.Fragment>
                )
              })}
            </div>

            {/* Contenu des trimestres */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
              {groupedByYear[year].map((periode) => {
                const config = TRIMESTRES_CONFIG.find(
                  (t) => t.trimestre === periode.trimestre
                )!
                const isOuvert = periode.statut === 'OUVERT'
                const isCurrent =
                  year === currentTrimestre.annee &&
                  periode.trimestre === currentTrimestre.trimestre

                return (
                  <button
                    key={periode.id}
                    onClick={() =>
                      onSelectPeriod?.(periode.annee, periode.trimestre)
                    }
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isCurrent
                        ? 'border-orange-300 bg-orange-50'
                        : isOuvert
                        ? 'border-green-200 bg-green-50/50 hover:border-green-300 hover:bg-green-50'
                        : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isCurrent ? 'text-orange-700' : 'text-slate-700'
                      }`}>
                        {config.abbreviation}
                      </span>
                      {isOuvert ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      {config.mois.join(' - ')}
                    </p>
                    <Badge
                      variant={isOuvert ? 'default' : 'secondary'}
                      className={`mt-2 text-xs ${
                        isOuvert
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : ''
                      }`}
                    >
                      {isOuvert ? 'Ouvert' : 'Clôturé'}
                    </Badge>
                    
                    {!isOuvert && periode.cloture_le && (
                      <p className="text-xs text-slate-400 mt-1">
                        Clôturé le{' '}
                        {new Date(periode.cloture_le).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
