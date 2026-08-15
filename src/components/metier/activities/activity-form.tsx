'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  Save, 
  Send, 
  FileText, 
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Upload,
  Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

// Types
export interface ActivityFormData {
  intitule: string
  description: string
  objectif: string
  category_id?: string
  type_id?: string
  date_activite: string
  region: string
  departement: string
  sous_prefecture: string
  structure_responsable: string
  responsables: string[]
  budget_alloue: string
  // Bénéficiaires
  hommes: string
  femmes: string
  enfants: string
  adultes: string
  personnes_agees: string
  vulnerables: string
  // Résultats
  resultats: string
  difficultes: string
  recommandations: string
  perspectives: string
  observations: string
}

interface FormErrors {
  [key: string]: string
}

interface ActivityFormProps {
  initialData?: Partial<ActivityFormData>
  categories?: { id: string; nom: string }[]
  types?: { id: string; nom: string; categorie_id?: string }[]
  regions?: string[]
  onSubmit: (data: ActivityFormData, action: 'draft' | 'submit') => Promise<void>
  isSubmitting?: boolean
  submitLabel?: string
  draftLabel?: string
  showSubmitButton?: boolean
  readOnly?: boolean
}

// Catégories par défaut (seront remplacées par les données Supabase)
const DEFAULT_CATEGORIES = [
  { id: 'cat-001', nom: 'Formation' },
  { id: 'cat-002', nom: 'Sensibilisation' },
  { id: 'cat-003', nom: 'Atelier' },
  { id: 'cat-004', nom: 'Évaluation' },
  { id: 'cat-005', nom: 'Réunion' },
]

// Types par défaut
const DEFAULT_TYPES = [
  { id: 'type-001', nom: 'Formation technique', categorie_id: 'cat-001' },
  { id: 'type-002', nom: 'Formation gestionnaire', categorie_id: 'cat-001' },
  { id: 'type-003', nom: 'Campagne de sensibilisation', categorie_id: 'cat-002' },
  { id: 'type-004', nom: 'Atelier de planification' },
  { id: 'type-005', nom: 'Évaluation mi-parcours' },
  { id: 'type-006', nom: 'Réunion de coordination' },
]

// Régions CI (échantillon)
const DEFAULT_REGIONS = [
  'Abidjan', 'Yamoussoukro', 'Bouaké', 'Daloa', 'San-Pédro',
  'Korhogo', 'Man', 'Gagnoa', 'Denguele', 'Lacs',
]

const initialFormData: ActivityFormData = {
  intitule: '',
  description: '',
  objectif: '',
  category_id: '',
  type_id: '',
  date_activite: '',
  region: '',
  departement: '',
  sous_prefecture: '',
  structure_responsable: '',
  responsables: [],
  budget_alloue: '',
  // Bénéficiaires
  hommes: '0',
  femmes: '0',
  enfants: '0',
  adultes: '0',
  personnes_agees: '0',
  vulnerables: '0',
  // Résultats
  resultats: '',
  difficultes: '',
  recommandations: '',
  perspectives: '',
  observations: '',
}

export function ActivityForm({
  initialData,
  categories = DEFAULT_CATEGORIES,
  types = DEFAULT_TYPES,
  regions = DEFAULT_REGIONS,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Soumettre pour validation',
  draftLabel = 'Sauvegarder brouillon',
  showSubmitButton = true,
  readOnly = false,
}: ActivityFormProps) {
  const [formData, setFormData] = useState<ActivityFormData>({
    ...initialFormData,
    ...initialData,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [newResponsable, setNewResponsable] = useState('')

  // Calculer les types filtrés avec useMemo
  const filteredTypes = useMemo(() => {
    if (formData.category_id) {
      return types.filter(
        t => !t.categorie_id || t.categorie_id === formData.category_id
      )
    }
    return types
  }, [formData.category_id, types])

  // Type ID à utiliser (réinitialisé si pas dans la liste filtrée)
  const effectiveTypeId = useMemo(() => {
    if (formData.type_id && !filteredTypes.find(t => t.id === formData.type_id)) {
      return ''
    }
    return formData.type_id
  }, [formData.type_id, filteredTypes])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.intitule.trim()) {
      newErrors.intitule = "L'intitulé est obligatoire"
    } else if (formData.intitule.length < 5) {
      newErrors.intitule = "L'intitulé doit contenir au moins 5 caractères"
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire'
    }

    if (!formData.date_activite) {
      newErrors.date_activite = "La date d'activité est obligatoire"
    }

    if (!formData.region) {
      newErrors.region = 'La région est obligatoire'
    }

    if (formData.budget_alloue && parseFloat(formData.budget_alloue) < 0) {
      newErrors.budget_alloue = 'Le budget doit être positif'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof ActivityFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleAddResponsable = () => {
    if (newResponsable.trim() && !formData.responsables.includes(newResponsable.trim())) {
      handleInputChange('responsables', [...formData.responsables, newResponsable.trim()])
      setNewResponsable('')
    }
  }

  const handleRemoveResponsable = (index: number) => {
    const updated = [...formData.responsables]
    updated.splice(index, 1)
    handleInputChange('responsables', updated)
  }

  const handleSubmit = async (action: 'draft' | 'submit') => {
    if (action === 'submit' && !validateForm()) return
    
    await onSubmit(formData, action)
  }

  const totalBeneficiaires = 
    parseInt(formData.hommes) || 0 + 
    parseInt(formData.femmes) || 0 + 
    parseInt(formData.enfants) || 0

  return (
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      {/* Informations générales */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-500" />
            Informations générales
          </CardTitle>
          <CardDescription>Informations principales de l&apos;activité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Intitulé */}
          <div className="space-y-2">
            <Label htmlFor="intitule">
              Intitulé de l&apos;activité <span className="text-red-500">*</span>
            </Label>
            <Input
              id="intitule"
              placeholder="Ex: Formation des cadres sur e-OSCS"
              value={formData.intitule}
              onChange={(e) => handleInputChange('intitule', e.target.value)}
              disabled={readOnly}
              className={errors.intitule ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors.intitule && (
              <p className="text-sm text-red-500">{errors.intitule}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Décrivez l'activité en détail..."
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={readOnly}
              className={errors.description ? 'border-red-300 focus:border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Objectif */}
          <div className="space-y-2">
            <Label htmlFor="objectif">Objectif de l&apos;activité</Label>
            <Textarea
              id="objectif"
              placeholder="Quel est l'objectif visé par cette activité ?"
              rows={2}
              value={formData.objectif}
              onChange={(e) => handleInputChange('objectif', e.target.value)}
              disabled={readOnly}
            />
          </div>

          {/* Catégorie et Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Catégorie</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(value) => handleInputChange('category_id', value)}
                disabled={readOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type d&apos;activité</Label>
              <Select 
                value={effectiveTypeId} 
                onValueChange={(value) => handleInputChange('type_id', value)}
                disabled={readOnly || !formData.category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    formData.category_id ? 'Sélectionner un type' : "D'abord choisir une catégorie"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {filteredTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.nom}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates et Lieu */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Date et localisation
          </CardTitle>
          <CardDescription>Période et lieu de l&apos;activité</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_activite">
                Date d&apos;activité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date_activite"
                type="date"
                value={formData.date_activite}
                onChange={(e) => handleInputChange('date_activite', e.target.value)}
                disabled={readOnly}
                className={errors.date_activite ? 'border-red-300' : ''}
              />
              {errors.date_activite && (
                <p className="text-sm text-red-500">{errors.date_activite}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">
                Région <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.region} 
                onValueChange={(value) => handleInputChange('region', value)}
                disabled={readOnly}
              >
                <SelectTrigger className={errors.region ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departement">Département</Label>
              <Input
                id="departement"
                placeholder="Ex: Abidjan"
                value={formData.departement}
                onChange={(e) => handleInputChange('departement', e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sous_prefecture">Sous-préfecture</Label>
            <Input
              id="sous_prefecture"
              placeholder="Ex: Plateau"
              value={formData.sous_prefecture}
              onChange={(e) => handleInputChange('sous_prefecture', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Responsables */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Responsables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nom du responsable"
              value={newResponsable}
              onChange={(e) => setNewResponsable(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResponsable())}
              disabled={readOnly}
            />
            {!readOnly && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAddResponsable}
                disabled={!newResponsable.trim()}
              >
                Ajouter
              </Button>
            )}
          </div>

          {formData.responsables.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.responsables.map((resp, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="gap-1.5 py-1.5 px-3"
                >
                  {resp}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveResponsable(index)}
                      className="ml-1 text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="structure_responsable">Structure responsable</Label>
            <Input
              id="structure_responsable"
              placeholder="Ex: Direction Régionale d'Abidjan"
              value={formData.structure_responsable}
              onChange={(e) => handleInputChange('structure_responsable', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Budget et Bénéficiaires */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Budget et bénéficiaires
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Budget */}
          <div className="space-y-2">
            <Label htmlFor="budget_alloue">
              Budget alloué (FCFA)
            </Label>
            <Input
              id="budget_alloue"
              type="number"
              placeholder="Ex: 2500000"
              value={formData.budget_alloue}
              onChange={(e) => handleInputChange('budget_alloue', e.target.value)}
              min="0"
              step="100000"
              disabled={readOnly}
              className={errors.budget_alloue ? 'border-red-300' : ''}
            />
            {errors.budget_alloue && (
              <p className="text-sm text-red-500">{errors.budget_alloue}</p>
            )}
          </div>

          <Separator />

          {/* Bénéficiaires */}
          <div className="space-y-4">
            <Label>Bénéficiaires estimés</Label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { key: 'hommes', label: 'Hommes' },
                { key: 'femmes', label: 'Femmes' },
                { key: 'enfants', label: 'Enfants' },
                { key: 'adultes', label: 'Adultes' },
                { key: 'persones_agees', label: 'Pers. âgées' },
                { key: 'vulnerables', label: 'Vulnérables' },
              ].map(({ key, label }) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-xs text-slate-600">{label}</Label>
                  <Input
                    id={key}
                    type="number"
                    value={formData[key as keyof ActivityFormData] as string || '0'}
                    onChange={(e) => handleInputChange(key as keyof ActivityFormData, e.target.value)}
                    min="0"
                    disabled={readOnly}
                  />
                </div>
              ))}
            </div>

            {/* Total bénéficiaires */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium text-slate-700">Total bénéficiaires</span>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-lg px-3 py-1">
                {totalBeneficiaires.toLocaleString('fr-FR')}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultats et Observations */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Résultats et observations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resultats">Résultats obtenus</Label>
              <Textarea
                id="resultats"
                placeholder="Quels sont les résultats de cette activité ?"
                rows={3}
                value={formData.resultats}
                onChange={(e) => handleInputChange('resultats', e.target.value)}
                disabled={readOnly}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficultes">Difficultés rencontrées</Label>
              <Textarea
                id="difficultes"
                placeholder="Y a-t-il eu des difficultés ?"
                rows={3}
                value={formData.difficultes}
                onChange={(e) => handleInputChange('difficultes', e.target.value)}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recommandations">Recommandations</Label>
            <Textarea
              id="recommandations"
              placeholder="Recommandations suite à cette activité..."
              rows={2}
              value={formData.recommandations}
              onChange={(e) => handleInputChange('recommandations', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="perspectives">Perspectives</Label>
            <Textarea
              id="perspectives"
              placeholder="Perspectives futures..."
              rows={2}
              value={formData.perspectives}
              onChange={(e) => handleInputChange('perspectives', e.target.value)}
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observations générales</Label>
            <Textarea
              id="observations"
              placeholder="Autres observations..."
              rows={2}
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* Pièces jointes */}
      <Card className="border-slate-200 border-dashed">
        <CardHeader>
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-500" />
            Pièces jointes
          </CardTitle>
          <CardDescription>Documents optionnels à joindre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">
              Glissez vos fichiers ici ou cliquez pour parcourir
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PDF, Word, Excel • Max 10MB par fichier
            </p>
            {!readOnly && (
              <Button variant="outline" size="sm" className="mt-4">
                Choisir un fichier
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {!readOnly && (
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 print:hidden">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {draftLabel}
              </>
            )}
          </Button>

          {showSubmitButton && (
            <Button 
              className="gap-2 bg-green-600 hover:bg-green-700 shadow-sm"
              onClick={() => handleSubmit('submit')}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white/70" />
                  Soumission...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  {submitLabel}
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </form>
  )
}
