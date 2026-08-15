'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { IndicatorValueForm } from '@/components/metier/indicators/indicator-value-form'
import { getIndicators } from '@/lib/actions/indicators'
import { getActivities } from '@/lib/actions/app'
import { saveIndicatorValues } from '@/lib/actions/indicators'
import type { Indicator, Activity } from '@/types'

export default function SaisieIndicateursPage() {
  const router = useRouter()
  const { toast } = useToast()
  
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [selectedActivityId, setSelectedActivityId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      // Récupérer l'organisation
      const { getCurrentUserWithOrg } = await import('@/lib/actions/app')
      const userWithOrg = await getCurrentUserWithOrg()
      const orgId = userWithOrg?.profile?.organization_id

      if (!orgId) {
        setLoading(false)
        return
      }

      const [indicatorsResult, activitiesResult] = await Promise.all([
        getIndicators({ organization_id: orgId }),
        getActivities(orgId),
      ])

      setIndicators(indicatorsResult.indicators)
      setActivities(activitiesResult.activities)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSubmit = async (values: { indicator_id: string; valeur_numerique?: number; valeur_texte?: string }[]) => {
    if (!selectedActivityId) {
      toast({
        title: 'Erreur',
        description: 'Veuillez sélectionner une activité',
        variant: 'destructive',
      })
      return { success: false, error: 'Activité non sélectionnée' }
    }

    setSubmitting(true)

    try {
      const result = await saveIndicatorValues({
        activity_id: selectedActivityId,
        values,
      })

      if (result.success) {
        toast({
          title: 'Succès',
          description: `${values.length} valeur(s) enregistrée(s) avec succès`,
        })
        
        // Optionnel : rester sur la page pour continuer la saisie
        // router.push('/app/indicateurs')
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Une erreur est survenue lors de la sauvegarde',
          variant: 'destructive',
        })
      }

      return result
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      })
      return { success: false, error: 'Erreur inattendue' }
    } finally {
      setSubmitting(false)
    }
  }

  // Filtrer les activités valides (pas brouillon)
  const validActivities = activities.filter(a => 
    a.statut !== 'BROUILLON' && a.statut !== 'REJETE'
  )

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/indicateurs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Saisie des Indicateurs</h1>
          <p className="text-muted-foreground">Enregistrez les valeurs pour vos indicateurs</p>
        </div>
      </div>

      {/* Sélection activité */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Étape 1 : Sélectionner l&apos;activité
          </CardTitle>
          <CardDescription>
            Choisissez l&apos;activité pour laquelle vous souhaitez saisir les valeurs d&apos;indicateurs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedActivityId} onValueChange={setSelectedActivityId}>
            <SelectTrigger className={selectedActivityId ? 'border-green-300 bg-green-50' : ''}>
              <SelectValue placeholder="Sélectionner une activité..." />
            </SelectTrigger>
            <SelectContent>
              {validActivities.length === 0 ? (
                <SelectItem value="_empty" disabled>
                  Aucune activité disponible
                </SelectItem>
              ) : (
                validActivities.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    <span className="flex items-center gap-2">
                      {activity.titre}
                      <Badge variant="outline" className="text-xs ml-2">
                        {activity.statut}
                      </Badge>
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {activities.length > 0 && validActivities.length === 0 && (
            <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Aucune activité valide disponible pour la saisie. Les activités doivent être soumises ou validées.
            </p>
          )}

          {selectedActivityId && (
            <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-700 font-medium">
                ✓ Activité sélectionnée : {validActivities.find(a => a.id === selectedActivityId)?.titre}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Formulaire de saisie */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-20 bg-slate-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !selectedActivityId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg">Sélectionnez d&apos;abord une activité</h3>
            <p className="text-muted-foreground mt-1">
              Le formulaire de saisie apparaîtra après avoir choisi une activité.
            </p>
          </CardContent>
        </Card>
      ) : indicators.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg">Aucun indicateur disponible</h3>
            <p className="text-muted-foreground mt-1">
              Aucun indicateur n&apos;est configuré pour votre organisation.
            </p>
            <Link href="/app/indicateurs/nouveau" className="mt-4 inline-block">
              <Button>
                Créer un indicateur
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base flex items-center gap-2">
              <Save className="h-5 w-5 text-primary" />
              Étape 2 : Saisir les valeurs ({indicators.length} indicateur{indicators.length > 1 ? 's' : ''})
            </CardTitle>
            <CardDescription>
              Remplissez les champs ci-dessous puis cliquez sur &quot;Enregistrer&quot;.
              Les indicateurs quantitatifs attendent des nombres, les qualitatifs du texte libre.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IndicatorValueForm
              indicators={indicators}
              onSubmit={handleSubmit}
              submitLabel={submitting ? 'Enregistrement...' : 'Enregistrer les valeurs'}
            />
          </CardContent>
        </Card>
      )}

      {/* Info */}
      <Card className="bg-slate-50 border-dashed">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Conseil :</strong> Vous pouvez effectuer plusieurs saisies successives pour différentes activités.</p>
              <p>Les valeurs sont sauvegardées immédiatement et peuvent être modifiées ultérieurement depuis le détail de chaque indicateur.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
