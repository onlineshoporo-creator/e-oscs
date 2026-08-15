import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, CheckCircle, Edit, FileText } from 'lucide-react'

interface TimelineEvent {
  id: string
  type: 'creation' | 'update' | 'closure'
  date: string
  description: string
  user?: string
}

interface IncidentTimelineProps {
  events: TimelineEvent[]
}

export function IncidentTimeline({ events }: IncidentTimelineProps) {
  if (events.length === 0) {
    return null
  }

  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'creation':
        return <FileText className="h-4 w-4 text-blue-500" />
      case 'update':
        return <Edit className="h-4 w-4 text-amber-500" />
      case 'closure':
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getIconBg = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'creation':
        return 'bg-blue-100'
      case 'update':
        return 'bg-amber-100'
      case 'closure':
        return 'bg-green-100'
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Clock className="h-5 w-5 text-muted-foreground" />
          Historique des événements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-16px)] before:w-px before:bg-border">
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-4 pl-2">
              {/* Icône sur la timeline */}
              <div className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${getIconBg(event.type)}`}>
                {getIcon(event.type)}
              </div>
              
              {/* Contenu */}
              <div className="flex-1 pt-1 pb-2">
                <p className="font-medium text-sm">{event.description}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <time dateTime={event.date}>{formatDate(event.date)}</time>
                  {event.user && (
                    <>
                      <span>•</span>
                      <span>{event.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Génère les événements de timeline depuis un incident
 */
export function generateIncidentEvents(incident: any): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // Événement de création
  events.push({
    id: `${incident.id}-creation`,
    type: 'creation',
    date: incident.created_at,
    description: 'Incident déclaré',
    user: incident.created_by,
  })

  // Si clôturé, ajouter l'événement de clôture
  if (incident.statut === 'CLOTURE' && incident.cloture_le) {
    events.push({
      id: `${incident.id}-closure`,
      type: 'closure',
      date: incident.cloture_le,
      description: incident.motif_cloture 
        ? `Incident clôturé: ${incident.motif_cloture}`
        : 'Incident clôturé',
      user: incident.cloture_par,
    })
  }

  // Mise à jour si différente de la création
  if (incident.updated_at && incident.updated_at !== incident.created_at) {
    // Insérer avant la clôture s'il y en a une
    if (incident.statut === 'CLOTURE') {
      events.splice(events.length - 1, 0, {
        id: `${incident.id}-update`,
        type: 'update',
        date: incident.updated_at,
        description: 'Informations mises à jour',
      })
    } else {
      events.push({
        id: `${incident.id}-update`,
        type: 'update',
        date: incident.updated_at,
        description: 'Informations mises à jour',
      })
    }
  }

  return events
}
