import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { TrendingUp, TrendingDown, Minus, Eye } from 'lucide-react'
import { IndicatorTypeBadge } from './indicator-type-badge'
import type { Indicator, IndicatorValue } from '@/types'

interface IndicatorCardProps {
  indicator: Indicator
  lastValue?: IndicatorValue
  trend?: 'up' | 'down' | 'stable'
}

// Composant pour l'icône de tendance (défini en dehors du rendu)
function TrendIconComponent({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />
    default:
      return <Minus className="h-4 w-4 text-slate-400" />
  }
}

export function IndicatorCard({ indicator, lastValue, trend }: IndicatorCardProps) {
  // Formater la dernière valeur
  const displayValue = () => {
    if (!lastValue) return '-'
    
    if (lastValue.valeur_numerique !== undefined && lastValue.valeur_numerique !== null) {
      return `${lastValue.valeur_numerique.toLocaleString('fr-FR')}${indicator.unite ? ` ${indicator.unite}` : ''}`
    }
    
    return lastValue.valeur_texte || '-'
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{indicator.nom}</p>
            <p className="text-xs text-muted-foreground mt-0.5 font-mono">{indicator.code}</p>
          </div>
          <IndicatorTypeBadge kind={indicator.kind} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Dernière valeur */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold">{displayValue()}</p>
            {indicator.unite && indicator.kind === 'QUANTITATIF' && (
              <p className="text-xs text-muted-foreground">{indicator.unite}</p>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendIconComponent trend={trend} />
              <span>Tendance</span>
            </div>
          )}
        </div>

        {/* Axe si présent */}
        {indicator.axe && (
          <p className="text-xs text-muted-foreground truncate">
            Axe : {indicator.axe}
          </p>
        )}

        {/* Action */}
        <Link href={`/app/indicateurs/${indicator.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Voir détails
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
