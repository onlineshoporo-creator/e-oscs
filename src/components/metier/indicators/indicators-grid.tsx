'use client'

import { IndicatorCard } from './indicator-card'
import type { Indicator, IndicatorValue } from '@/types'

interface IndicatorsGridProps {
  indicators: Indicator[]
  valuesMap?: Record<string, IndicatorValue>
  trendsMap?: Record<string, 'up' | 'down' | 'stable'>
  columns?: number
}

export function IndicatorsGrid({
  indicators,
  valuesMap = {},
  trendsMap = {},
  columns = 3,
}: IndicatorsGridProps) {
  if (indicators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Aucun indicateur trouvé</p>
      </div>
    )
  }

  const gridCols: Record<number, string> = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns] || gridCols[3]} gap-4`}>
      {indicators.map((indicator) => (
        <IndicatorCard
          key={indicator.id}
          indicator={indicator}
          lastValue={valuesMap[indicator.id]}
          trend={trendsMap[indicator.id]}
        />
      ))}
    </div>
  )
}
