'use client'

import type { IndicatorValue, IndicatorKind } from '@/types'

interface IndicatorChartProps {
  values: IndicatorValue[]
  kind: IndicatorKind
  height?: number
}

/**
 * Mini graphique d'évolution pour un indicateur quantitatif (ligne SVG)
 */
export function IndicatorChart({ values, kind, height = 120 }: IndicatorChartProps) {
  // Pour les indicateurs qualitatifs, afficher une timeline
  if (kind === 'QUALITATIF') {
    return <QualitativeTimeline values={values} />
  }

  // Filtrer les valeurs numériques
  const numericValues = values
    .filter(v => v.valeur_numerique !== null && v.valeur_numerique !== undefined)
    .reverse() // Plus ancien au plus récent

  if (numericValues.length < 2) {
    return (
      <div 
        className="flex items-center justify-center bg-slate-50 rounded-lg border"
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">
          {numericValues.length === 1 ? 'Une seule valeur saisie' : 'Pas assez de données'}
        </p>
      </div>
    )
  }

  // Calculer les points du graphique
  const dataPoints = numericValues.map(v => v.valeur_numerique!)
  const min = Math.min(...dataPoints)
  const max = Math.max(...dataPoints)
  const range = max - min || 1

  const width = 300
  const padding = 20
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  // Générer les points SVG
  const points = dataPoints.map((value, index) => {
    const x = padding + (index / (dataPoints.length - 1)) * chartWidth
    const y = padding + chartHeight - ((value - min) / range) * chartHeight
    return { x, y, value }
  })

  // Créer le path de la ligne
  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Créer l'aire sous la courbe
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`

  return (
    <div className="space-y-2">
      <svg width={width} height={height} className="w-full overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F77F00" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#F77F00" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {/* Grille horizontale */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padding}
            y1={padding + ratio * chartHeight}
            x2={width - padding}
            y2={padding + ratio * chartHeight}
            stroke="#e2e8f0"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        ))}

        {/* Aire sous la courbe */}
        <path d={areaPath} fill="url(#areaGradient)" />

        {/* Ligne */}
        <path d={linePath} fill="none" stroke="#F77F00" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />

        {/* Points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle cx={point.x} cy={point.y} r={4} fill="white" stroke="#F77F00" strokeWidth={2} />
            {i === points.length - 1 && (
              <>
                <circle cx={point.x} cy={point.y} r={6} fill="#F77F00" opacity={0.3}>
                  <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>
                <title>{point.value.toLocaleString('fr-FR')}</title>
              </>
            )}
          </g>
        ))}
      </svg>

      {/* Labels min/max */}
      <div className="flex justify-between text-xs text-muted-foreground px-1">
        <span>{min.toLocaleString('fr-FR')}</span>
        <span>{max.toLocaleString('fr-FR')}</span>
      </div>
    </div>
  )
}

/**
 * Timeline pour indicateurs qualitatifs
 */
function QualitativeTimeline({ values }: { values: IndicatorValue[] }) {
  const qualitativeValues = values
    .filter(v => v.valeur_texte)
    .slice(0, 8)

  if (qualitativeValues.length === 0) {
    return (
      <div className="flex items-center justify-center bg-slate-50 rounded-lg border h-[120px]">
        <p className="text-sm text-muted-foreground">Aucune valeur qualitative</p>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    })
  }

  return (
    <div className="space-y-2 max-h-[150px] overflow-y-auto">
      {qualitativeValues.map((v, i) => (
        <div key={v.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50">
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
            i === 0 ? 'bg-orange-500' : 'bg-slate-300'
          }`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{v.valeur_texte}</p>
            <p className="text-xs text-muted-foreground">{formatDate(v.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
