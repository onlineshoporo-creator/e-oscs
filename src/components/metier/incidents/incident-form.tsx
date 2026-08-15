'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CalendarIcon, Save, Send, Plus, X, AlertCircle } from 'lucide-react'
import { SeverityBadge } from './severity-badge'
import type { IncidentGravite, IncidentFormData, IncidentType } from '@/types'

interface IncidentFormProps {
  initialData?: Partial<IncidentFormData>
  incidentTypes?: IncidentType[]
  onSubmit: (data: IncidentFormData, isDraft?: boolean) => Promise<{ success: boolean; error?: string }>
  submitLabel?: string
  draftLabel?: string
  isEditing?: boolean
}

const GRAVITE_OPTIONS: { value: IncidentGravite; label: string; description: string }[] = [
  { value: 'FAIBLE', label: 'Faible', description: 'Impact limité, gestion locale' },
  { value: 'MOYENNE', label: 'Moyenne', description: 'Impact modéré, coordination nécessaire' },
  { value: 'ELEVEE', label: 'Élevée', description: 'Impact significatif, renforts requis' },
  { value: 'CRITIQUE', label: 'Critique', description: 'Impact majeur, urgence absolue' },
]

const REGIONS_CI = [
  'Abidjan', 'Lagunes', 'Denguele', 'Montagnes', 'Sassandra-Marahoue', 'Woroba',
  'Zanzan', 'Vallee du Bandama', 'Djougou', 'Lacs', 'Comoe', 'Agneby-Tiassa',
  'Gbekke', 'Bounkani', 'Folou', 'Iffou', 'Moronou', 'Nawa', 'San-Pedro',
  'Tonkpi', 'Bafing', 'Belier', 'Canne', 'Haut-Sassandra', 'Indenie-Djuablin',
  'Kabadougou', 'Poro', 'Tchologo', 'Yamoussoukro', 'Goh-Djiboua', 'District Autonome d\'Abidjan'
]

export function IncidentForm({
  initialData,
  incidentTypes = [],
  onSubmit,
  submitLabel = 'Déclarer l\'incident',
  draftLabel = 'Sauvegarder brouillon',
  isEditing = false,
}: IncidentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState<Partial<IncidentFormData>>({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    lieu: initialData?.lieu || '',
    region: initialData?.region || '',
    departement: initialData?.departement || '',
    nature: initialData?.nature || '',
    incident_type_id: initialData?.incident_type_id || '',
    gravite: initialData?.gravite || 'MOYENNE',
    victimes: initialData?.victimes || 0,
    deces: initialData?.deces || 0,
    actions_entreprises: initialData?.actions_entreprises || '',
    acteurs: initialData?.acteurs || [],
  })

  const [newActeur, setNewActeur] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.date) newErrors.date = 'La date est obligatoire'
    if (!formData.lieu?.trim()) newErrors.lieu = 'Le lieu est obligatoire'
    if (!formData.region) newErrors.region = 'La région est obligatoire'
    if (!formData.nature?.trim()) newErrors.nature = 'La nature est obligatoire'
    if (!formData.gravite) newErrors.gravite = 'La gravité est obligatoire'

    if (formData.victimes !== undefined && formData.victimes < 0) {
      newErrors.victimes = 'Le nombre ne peut pas être négatif'
    }
    if (formData.deces !== undefined && formData.deces < 0) {
      newErrors.deces = 'Le nombre ne peut pas être négatif'
    }
    if (formData.deces && formData.victimes && formData.deces > formData.victimes) {
      newErrors.deces = 'Les décès ne peuvent pas dépasser le nombre de victimes'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (isDraft = false) => {
    if (!isDraft && !validate()) {
      toast({
        title: 'Erreur de validation',
        description: 'Veuillez corriger les erreurs dans le formulaire',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await onSubmit(formData as IncidentFormData, isDraft)
      
      if (result.success) {
        toast({
          title: isDraft ? 'Brouillon sauvegardé' : (isEditing ? 'Incident mis à jour' : 'Incident déclaré'),
          description: isDraft 
            ? 'Vous pourrez compléter plus tard' 
            : 'L\'incident a été enregistré avec succès',
        })
        router.push('/app/incidents')
        router.refresh()
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Une erreur est survenue',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addActeur = () => {
    if (newActeur.trim() && !formData.acteurs?.includes(newActeur.trim())) {
      setFormData(prev => ({
        ...prev,
        acteurs: [...(prev.acteurs || []), newActeur.trim()],
      }))
      setNewActeur('')
    }
  }

  const removeActeur = (acteur: string) => {
    setFormData(prev => ({
      ...prev,
      acteurs: prev.acteurs?.filter(a => a !== acteur) || [],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Informations générales</CardTitle>
          <CardDescription>Détails de l'incident ou du sinistre</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Date et Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date de l'incident *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.date}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type d'incident</Label>
              <Select
                value={formData.incident_type_id || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, incident_type_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lieu */}
          <div className="space-y-2">
            <Label htmlFor="lieu">Lieu exact *</Label>
            <Input
              id="lieu"
              placeholder="Ex: Carrefour de la réconciliation, Adjamé"
              value={formData.lieu}
              onChange={(e) => setFormData(prev => ({ ...prev, lieu: e.target.value }))}
              className={errors.lieu ? 'border-red-500' : ''}
            />
            {errors.lieu && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.lieu}
              </p>
            )}
          </div>

          {/* Région et Département */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Région *</Label>
              <Select
                value={formData.region || ''}
                onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner une région" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS_CI.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.region}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              <Input
                id="departement"
                placeholder="Ex: Abidjan, Bouaké..."
                value={formData.departement}
                onChange={(e) => setFormData(prev => ({ ...prev, departement: e.target.value }))}
              />
            </div>
          </div>

          {/* Nature / Description */}
          <div className="space-y-2">
            <Label htmlFor="nature">Nature / Description *</Label>
            <Textarea
              id="nature"
              placeholder="Décrivez l'incident en détail (causes, circonstances...)"
              rows={4}
              value={formData.nature}
              onChange={(e) => setFormData(prev => ({ ...prev, nature: e.target.value }))}
              className={errors.nature ? 'border-red-500' : ''}
            />
            {errors.nature && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.nature}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Gravité et Impact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gravité et impact humain</CardTitle>
          <CardDescription>Évaluez la sévérité de l'incident</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection gravité */}
          <div className="space-y-3">
            <Label>Niveau de gravité *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {GRAVITE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, gravite: option.value }))}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    formData.gravite === option.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <SeverityBadge gravite={option.value} size="sm" />
                  <p className="mt-2 text-xs text-muted-foreground">{option.description}</p>
                </button>
              ))}
            </div>
            {errors.gravite && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.gravite}
              </p>
            )}
          </div>

          <Separator />

          {/* Impact humain */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="victimes">Nombre de victimes</Label>
              <Input
                id="victimes"
                type="number"
                min={0}
                placeholder="0"
                value={formData.victimes ?? ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  victimes: parseInt(e.target.value) || 0 
                }))}
                className={errors.victimes ? 'border-red-500' : ''}
              />
              {errors.victimes && (
                <p className="text-sm text-red-500">{errors.victimes}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deces">Nombre de décès</Label>
              <Input
                id="deces"
                type="number"
                min={0}
                placeholder="0"
                value={formData.deces ?? ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  deces: parseInt(e.target.value) || 0 
                }))}
                className={errors.deces ? 'border-red-500' : ''}
              />
              {errors.deces && (
                <p className="text-sm text-red-500">{errors.deces}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gestion de l'incident</CardTitle>
          <CardDescription>Actions entreprises et acteurs intervenants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Actions entreprises */}
          <div className="space-y-2">
            <Label htmlFor="actions">Actions entreprises</Label>
            <Textarea
              id="actions"
              placeholder="Décrivez les actions déjà entreprises pour gérer cette situation..."
              rows={3}
              value={formData.actions_entreprises}
              onChange={(e) => setFormData(prev => ({ ...prev, actions_entreprises: e.target.value }))}
            />
          </div>

          {/* Acteurs intervenants */}
          <div className="space-y-2">
            <Label>Acteurs intervenants</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Nom de l'acteur (ex: Sapeurs-pompiers, Croix-Rouge...)"
                value={newActeur}
                onChange={(e) => setNewActeur(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addActeur())}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addActeur}
                disabled={!newActeur.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Liste des acteurs */}
            {formData.acteurs && formData.acteurs.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.acteurs.map((acteur) => (
                  <Badge key={acteur} variant="secondary" className="gap-1">
                    {acteur}
                    <button
                      type="button"
                      onClick={() => removeActeur(acteur)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="order-last sm:order-first"
          >
            <Save className="h-4 w-4 mr-2" />
            {draftLabel}
          </Button>
        )}
        
        <Button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={isSubmitting}
          className="flex-1"
        >
          <Send className="h-4 w-4 mr-2" />
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
