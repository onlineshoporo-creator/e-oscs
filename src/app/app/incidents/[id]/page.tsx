'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Pencil,
  CheckCircle,
  FileText,
  Download,
  MapPin,
  Calendar,
  Tag,
  Building2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { SeverityBadge } from '@/components/metier/incidents/severity-badge'
import { ImpactSummary } from '@/components/metier/incidents/impact-summary'
import { IncidentTimeline, generateIncidentEvents } from '@/components/metier/incidents/incident-timeline'
import { getIncidentDetail, closeIncident } from '@/lib/actions/incidents'
import type { Incident } from '@/types'

function IncidentDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [incident, setIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    async function fetchIncident() {
      const id = params.id as string
      const data = await getIncidentDetail(id)
      setIncident(data)
      setLoading(false)
    }
    fetchIncident()
  }, [params.id])

  const handleClose = async () => {
    setClosing(true)
    
    try {
      const result = await closeIncident(incident!.id)
      
      if (result.success) {
        toast({
          title: 'Incident clôturé',
          description: 'L\'incident a été clôturé avec succès',
        })
        setIncident(result.incident!)
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Impossible de clôturer cet incident',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      })
    } finally {
      setClosing(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-100 rounded w-64" />
        <div className="h-48 bg-slate-100 rounded" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-32 bg-slate-100 rounded" />
          <div className="h-32 bg-slate-100 rounded" />
        </div>
      </div>
    )
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Incident non trouvé</h2>
        <p className="text-muted-foreground mt-2">Cet incident n'existe pas ou a été supprimé.</p>
        <Link href="/app/incidents" className="mt-4 inline-block">
          <Button>Retour à la liste</Button>
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Générer les événements de timeline
  const timelineEvents = generateIncidentEvents(incident)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/app/incidents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">Incident #{incident.id.slice(0, 8)}</h1>
              <SeverityBadge gravite={incident.gravite} size="lg" />
              <Badge 
                variant="outline"
                className={incident.statut === 'EN_COURS' 
                  ? 'bg-amber-50 text-amber-700 border-amber-300' 
                  : 'bg-green-50 text-green-700 border-green-300'
                }
              >
                {incident.statut === 'EN_COURS' ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                    En cours
                  </>
                ) : (
                  <>✓ Clôturé</>
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Déclaré le {formatDateTime(incident.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {incident.statut === 'EN_COURS' && (
            <>
              <Link href={`/app/incidents/${incident.id}/modifier`}>
                <Button variant="outline">
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </Link>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default" className="bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Clôturer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clôturer l&apos;incident</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir clôturer cet incident ? Cette action est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClose} disabled={closing}>
                      {closing ? 'Clôture en cours...' : 'Confirmer la clôture'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations générales */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoItem icon={Calendar} label="Date" value={formatDate(incident.date)} />
                <InfoItem icon={MapPin} label="Lieu" value={`${incident.lieu}, ${incident.region}`} />
                {incident.departement && (
                  <InfoItem icon={Building2} label="Département" value={incident.departement} />
                )}
                {incident.incident_type && (
                  <InfoItem icon={Tag} label="Type" value={incident.incident_type.nom} />
                )}
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium text-sm mb-2">Nature / Description</h4>
                <p className="text-sm bg-slate-50 p-3 rounded-lg">{incident.nature}</p>
              </div>
              
              {incident.motif_cloture && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium text-sm mb-2 text-green-700">Motif de clôture</h4>
                    <p className="text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      {incident.motif_cloture}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Impact humain */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Impact humain</CardTitle>
            </CardHeader>
            <CardContent>
              <ImpactSummary victimes={incident.victimes} deces={incident.deces} />
            </CardContent>
          </Card>

          {/* Gestion */}
          {(incident.actions_entreprises || (incident.acteurs && incident.acteurs.length > 0)) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Gestion de l&apos;incident</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {incident.actions_entreprises && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Actions entreprises</h4>
                    <p className="text-sm bg-slate-50 p-3 rounded-lg whitespace-pre-wrap">
                      {incident.actions_entreprises}
                    </p>
                  </div>
                )}
                
                {incident.acteurs && incident.acteurs.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm mb-2">Acteurs intervenants</h4>
                    <div className="flex flex-wrap gap-2">
                      {incident.acteurs.map((acteur) => (
                        <Badge key={acteur} variant="secondary">{acteur}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <IncidentTimeline events={timelineEvents} />
        </div>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Carte résumé */}
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Référence</span>
                <span className="font-mono text-xs">{incident.id}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gravité</span>
                <SeverityBadge gravite={incident.gravite} size="sm" />
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Statut</span>
                <Badge variant="outline" className={
                  incident.statut === 'EN_COURS' 
                    ? 'bg-amber-50 text-amber-700 border-amber-300 text-xs'
                    : 'bg-green-50 text-green-700 border-green-300 text-xs'
                }>
                  {incident.statut === 'EN_COURS' ? 'En cours' : 'Clôturé'}
                </Badge>
              </div>
              {incident.cloture_le && (
                <>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Clôturé le</span>
                    <span>{formatDate(incident.cloture_le)}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Composant pour afficher une information
function InfoItem({ 
  icon: Icon, 
  label, 
  value 
}: { 
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string 
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm">{value}</p>
      </div>
    </div>
  )
}

export default function IncidentDetailPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4 p-8">
      <div className="h-8 bg-slate-100 rounded w-64" />
      <div className="h-48 bg-slate-100 rounded" />
    </div>}>
      <IncidentDetailContent />
    </Suspense>
  )
}
