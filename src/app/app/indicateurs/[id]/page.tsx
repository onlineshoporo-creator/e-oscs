'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  TrendingUp,
  Hash,
  Target,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { IndicatorTypeBadge } from '@/components/metier/indicators/indicator-type-badge'
import { IndicatorChart } from '@/components/metier/indicators/indicator-chart'
import { getIndicatorDetail, deleteIndicator, getIndicatorStats } from '@/lib/actions/indicators'
import type { Indicator, IndicatorValue, IndicatorStats } from '@/types'

function IndicatorDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const [indicator, setIndicator] = useState<Indicator | null>(null)
  const [values, setValues] = useState<IndicatorValue[]>([])
  const [stats, setStats] = useState<IndicatorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const id = params.id as string
      const [detailData, statsData] = await Promise.all([
        getIndicatorDetail(id),
        getIndicatorStats(id),
      ])
      
      setIndicator(detailData.indicator)
      setValues(detailData.values)
      setStats(statsData)
      setLoading(false)
    }
    fetchData()
  }, [params.id])

  const handleDelete = async () => {
    if (!indicator?.organization_id) return
    
    setDeleting(true)
    
    try {
      // Récupérer l'org
      const { getCurrentUserWithOrg } = await import('@/lib/actions/app')
      const userWithOrg = await getCurrentUserWithOrg()
      
      if (!userWithOrg?.profile?.organization_id) {
        toast({ title: 'Erreur', description: 'Organisation non trouvée', variant: 'destructive' })
        return
      }

      const result = await deleteIndicator(indicator.id, userWithOrg.profile.organization_id)
      
      if (result.success) {
        toast({
          title: 'Indicateur supprimé',
          description: 'L\'indicateur a été supprimé avec succès',
        })
        router.push('/app/indicateurs')
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Impossible de supprimer cet indicateur',
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
      setDeleting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
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

  if (!indicator) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold">Indicateur non trouvé</h2>
        <p className="text-muted-foreground mt-2">Cet indicateur n'existe pas ou a été supprimé.</p>
        <Link href="/app/indicateurs" className="mt-4 inline-block">
          <Button>Retour à la liste</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/app/indicateurs">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold">{indicator.nom}</h1>
              <span className="font-mono text-sm text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                {indicator.code}
              </span>
              <IndicatorTypeBadge kind={indicator.kind} size="lg" />
              {indicator.unite && (
                <Badge variant="outline">{indicator.unite}</Badge>
              )}
            </div>
            {indicator.axe && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Target className="h-4 w-4" />
                Axe stratégique : {indicator.axe}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/app/indicateurs/${indicator.id}/modifier`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          </Link>
          
          {indicator.organization_id && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer l&apos;indicateur</AlertDialogTitle>
                  <AlertDialogDescription>
                    Êtes-vous sûr de vouloir supprimer cet indicateur ? Toutes les valeurs associées seront également supprimées.
                    Cette action est irréversible.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                    {deleting ? 'Suppression...' : 'Confirmer'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {indicator.description && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{indicator.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Graphique d'évolution */}
          {values.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                  Évolution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <IndicatorChart values={values} kind={indicator.kind} height={180} />
              </CardContent>
            </Card>
          )}

          {/* Valeurs saisies */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  Valeurs saisies ({values.length})
                </span>
                <Link href="/app/indicateurs/saisie">
                  <Button variant="outline" size="sm">
                    Saisir une valeur
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              {values.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">Aucune valeur saisie pour le moment.</p>
                  <Link href="/app/indicateurs/saisie" className="mt-2 inline-block">
                    <Button size="sm">Saisir des valeurs</Button>
                  </Link>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Activité</TableHead>
                      <TableHead>Valeur</TableHead>
                      <TableHead>Saisi le</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {values.map((value) => (
                      <TableRow key={value.id}>
                        <TableCell>
                          {value.activity ? (
                            <Link href={`/app/activites/${value.activity.id}`} className="font-medium hover:underline">
                              {value.activity.titre}
                            </Link>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {value.valeur_numerique !== undefined && value.valeur_numerique !== null ? (
                            <span className="font-medium">
                              {value.valeur_numerique.toLocaleString('fr-FR')}
                              {indicator.unite && ` ${indicator.unite}`}
                            </span>
                          ) : (
                            <span>{value.valeur_texte || '-'}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDateTime(value.created_at)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Colonne latérale - Stats */}
        <div className="space-y-6">
          {/* Statistiques */}
          <Card className="sticky top-20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats && stats.nombre_valeurs > 0 ? (
                <>
                  <StatItem 
                    label="Nombre de valeurs" 
                    value={stats.nombre_valeurs.toString()} 
                  />
                  
                  {indicator.kind === 'QUANTITATIF' && stats.moyenne !== undefined && (
                    <>
                      <Separator />
                      <StatItem 
                        label="Moyenne" 
                        value={`${stats.moyenne.toFixed(2)}${indicator.unite ? ` ${indicator.unite}` : ''}`} 
                        highlight
                      />
                      
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Minimum</p>
                          <p className="font-semibold text-green-600">
                            {stats.min?.toLocaleString('fr-FR')}{indicator.unite ? ` ${indicator.unite}` : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Maximum</p>
                          <p className="font-semibold text-orange-600">
                            {stats.max?.toLocaleString('fr-FR')}{indicator.unite ? ` ${indicator.unite}` : ''}
                          </p>
                        </div>
                      </div>
                      
                      <Separator />
                      <StatItem 
                        label="Dernière valeur" 
                        value={
                          stats.derniere_valeur 
                            ? `${stats.derniere_valeur}${indicator.unite ? ` ${indicator.unite}` : ''}`
                            : '-'
                        } 
                      />
                    </>
                  )}
                  
                  {indicator.kind === 'QUALITATIF' && stats.derniere_valeur && (
                    <>
                      <Separator />
                      <StatItem 
                        label="Dernière évaluation" 
                        value={stats.derniere_valeur} 
                      />
                    </>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Pas assez de données pour calculer les statistiques
                </p>
              )}
              
              {indicator.objectif !== undefined && indicator.objectif !== null && (
                <>
                  <Separator />
                  <StatItem 
                    label="Objectif" 
                    value={`${indicator.objectif.toLocaleString('fr-FR')}${indicator.unite ? ` ${indicator.unite}` : ''}`}
                    target
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/app/indicateurs/saisie" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Saisir une valeur
                </Button>
              </Link>
              <Link href={`/app/indicateurs/${indicator.id}/modifier`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier l'indicateur
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatItem({ 
  label, 
  value, 
  highlight,
  target 
}: { 
  label: string
  value: string
  highlight?: boolean
  target?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`font-medium ${highlight ? 'text-lg text-primary' : ''} ${target ? 'text-green-600' : ''}`}>
        {value}
      </span>
    </div>
  )
}

export default function IndicatorDetailPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4 p-8">
      <div className="h-8 bg-slate-100 rounded w-64" />
      <div className="h-48 bg-slate-100 rounded" />
    </div>}>
      <IndicatorDetailContent />
    </Suspense>
  )
}
