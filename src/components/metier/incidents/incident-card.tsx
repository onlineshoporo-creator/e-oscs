import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Eye } from 'lucide-react'
import { SeverityBadge } from './severity-badge'
import type { Incident } from '@/types'

interface IncidentCardProps {
  incident: Incident
}

export function IncidentCard({ incident }: IncidentCardProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{incident.nature}</p>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {incident.lieu}, {incident.region}
            </p>
          </div>
          <SeverityBadge gravite={incident.gravite} size="sm" />
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        {/* Date et statut */}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(incident.date)}
          </span>
          <StatusBadge statut={incident.statut} />
        </div>

        {/* Impact */}
        {(incident.victimes > 0 || incident.deces > 0) && (
          <div className="flex items-center gap-4 text-sm">
            {incident.victimes > 0 && (
              <span className="text-orange-600 font-medium">
                {incident.victimes} victime{incident.victimes > 1 ? 's' : ''}
              </span>
            )}
            {incident.deces > 0 && (
              <span className="text-red-600 font-medium">
                {incident.deces} décès
              </span>
            )}
          </div>
        )}

        {/* Action */}
        <Link href={`/app/incidents/${incident.id}`}>
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Voir détails
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

// Badge de statut interne
function StatusBadge({ statut }: { statut: 'EN_COURS' | 'CLOTURE' }) {
  if (statut === 'EN_COURS') {
    return (
      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
        En cours
      </Badge>
    )
  }
  
  return (
    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
      ✓ Clôturé
    </Badge>
  )
}
