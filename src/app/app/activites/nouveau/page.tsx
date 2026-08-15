'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Send,
  FileText,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Upload,
  CheckCircle2
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
import { useToast } from '@/hooks/use-toast'

// Catégories d'activités (seront chargées depuis Supabase)
const CATEGORIES = [
  { id: 'cat-001', nom: 'Formation' },
  { id: 'cat-002', nom: 'Sensibilisation' },
  { id: 'cat-003', nom: 'Atelier' },
  { id: 'cat-004', nom: 'Évaluation' },
  { id: 'cat-005', nom: 'Réunion' },
]

// Types d'activités par catégorie
const TYPES_ACTIVITE = [
  { id: 'type-001', categorie_id: 'cat-001', nom: 'Formation technique' },
  { id: 'type-002', categorie_id: 'cat-001', nom: 'Formation gestionnaire' },
  { id: 'type-003', categorie_id: 'cat-002', nom: 'Campagne de sensibilisation' },
  { id: 'type-004', nom: 'Atelier de planification' },
  { id: 'type-005', nom: 'Évaluation mi-parcours' },
  { id: 'type-006', nom: 'Réunion de coordination' },
]

interface FormData {
  titre: string
  description: string
  categorie_id: string
  type_activite_id: string
  date_debut: string
  date_fin: string
  lieu: string
  budget_alloue: string
  beneficiaires_hommes: string
  beneficiaires_femmes: string
  beneficiaires_jeunes: string
}

interface FormErrors {
  [key: string]: string
}

const initialFormData: FormData = {
  titre: '',
  description: '',
  categorie_id: '',
  type_activite_id: '',
  date_debut: '',
  date_fin: '',
  lieu: '',
  budget_alloue: '',
  beneficiaires_hommes: '0',
  beneficiaires_femmes: '0',
  beneficiaires_jeunes: '0',
}

export default function NouvelleActivitePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [typesFiltres, setTypesFiltres] = TYPES_ACTIVITE

  // Filtrer les types quand la catégorie change
  useEffect(() => {
    if (formData.categorie_id) {
      const filtres = TYPES_ACTIVITE.filter(
        t => t.categorie_id === formData.categorie_id || !t.categorie_id
      )
      setTypesFiltres(filtres)
      
      // Réinitialiser le type si pas dans la liste filtrée
      if (formData.type_activite_id && !filtres.find(t => t.id === formData.type_activite_id)) {
        setFormData(prev => ({ ...prev, type_activite_id: '' }))
      }
    } else {
      setTypesFiltres(TYPES_ACTIVITE)
    }
  }, [formData.categorie_id])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est obligatoire'
    } else if (formData.titre.length < 5) {
      newErrors.titre = 'Le titre doit contenir au moins 5 caractères'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est obligatoire'
    }

    if (!formData.categorie_id) {
      newErrors.categorie_id = 'Veuillez sélectionner une catégorie'
    }

    if (!formData.type_activite_id) {
      newErrors.type_activite_id = 'Veuillez sélectionner un type d\'activité'
    }

    if (!formData.date_debut) {
      newErrors.date_debut = 'La date de début est obligatoire'
    }

    if (!formData.date_fin) {
      newErrors.date_fin = 'La date de fin est obligatoire'
    } else if (formData.date_debut && formData.date_fin <= formData.date_debut) {
      newErrors.date_fin = 'La date de fin doit être après la date de début'
    }

    if (formData.budget_alloue && parseFloat(formData.budget_alloue) < 0) {
      newErrors.budget_alloue = 'Le budget doit être positif'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSaveDraft = async () => {
    setIsSavingDraft(true)
    
    try {
      // Simuler la sauvegarde (remplacer par appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Brouillon sauvegardé',
        description: 'L\'activité a été sauvegardée en tant que brouillon.',
      })
      
      router.push('/app/activites')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde.',
        variant: 'destructive',
      })
    } finally {
      setIsSavingDraft(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Formulaire incomplet',
        description: 'Veuillez corriger les erreurs dans le formulaire.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simuler la soumission (remplacer par appel API réel)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: 'Activité soumise',
        description: 'L\'activité a été soumise pour validation.',
      })
      
      router.push('/app/activites')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la soumission.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalBeneficiaires = 
    (parseInt(formData.beneficiaires_hommes) || 0) + 
    (parseInt(formData.beneficiaires_femmes) || 0) + 
    (parseInt(formData.beneficiaires_jeunes) || 0)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/activites">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nouvelle activité</h1>
          <p className="text-slate-500 mt-1">
            Remplissez les informations pour créer une nouvelle activité
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
            {/* Titre */}
            <div className="space-y-2">
              <Label htmlFor="titre">
                Titre de l&apos;activité <span className="text-red-500">*</span>
              </Label>
              <Input
                id="titre"
                placeholder="Ex: Formation des cadres sur e-OSCS"
                value={formData.titre}
                onChange={(e) => handleInputChange('titre', e.target.value)}
                className={errors.titre ? 'border-red-300 focus:border-red-500' : ''}
              />
              {errors.titre && (
                <p className="text-sm text-red-500">{errors.titre}</p>
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
                className={errors.description ? 'border-red-300 focus:border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Catégorie et Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Catégorie <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.categorie_id} 
                  onValueChange={(value) => handleInputChange('categorie_id', value)}
                >
                  <SelectTrigger className={errors.categorie_id ? 'border-red-300' : ''}>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categorie_id && (
                  <p className="text-sm text-red-500">{errors.categorie_id}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Type d&apos;activité <span className="text-red-500">*</span></Label>
                <Select 
                  value={formData.type_activite_id} 
                  onValueChange={(value) => handleInputChange('type_activite_id', value)}
                  disabled={!formData.categorie_id}
                >
                  <SelectTrigger className={errors.type_activite_id ? 'border-red-300' : ''}>
                    <SelectValue placeholder={
                      formData.categorie_id ? 'Sélectionner un type' : 'D\'abord choisir une catégorie'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {typesFiltres.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.nom}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.type_activite_id && (
                  <p className="text-sm text-red-500">{errors.type_activite_id}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dates et Lieu */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Dates et lieu
            </CardTitle>
            <CardDescription>Période et localisation de l&apos;activité</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date_debut">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date_debut"
                  type="date"
                  value={formData.date_debut}
                  onChange={(e) => handleInputChange('date_debut', e.target.value)}
                  className={errors.date_debut ? 'border-red-300' : ''}
                />
                {errors.date_debut && (
                  <p className="text-sm text-red-500">{errors.date_debut}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date_fin">
                  Date de fin <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date_fin"
                  type="date"
                  value={formData.date_fin}
                  onChange={(e) => handleInputChange('date_fin', e.target.value)}
                  min={formData.date_debut}
                  className={errors.date_fin ? 'border-red-300' : ''}
                />
                {errors.date_fin && (
                  <p className="text-sm text-red-500">{errors.date_fin}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lieu">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  Lieu
                </span>
              </Label>
              <Input
                id="lieu"
                placeholder="Ex: Salle de conférence MCNSLP, Abidjan-Plateau"
                value={formData.lieu}
                onChange={(e) => handleInputChange('lieu', e.target.value)}
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
            <CardDescription>Ressources financières et humaines</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  Budget alloué (FCFA)
                </span>
              </Label>
              <Input
                id="budget"
                type="number"
                placeholder="Ex: 2500000"
                value={formData.budget_alloue}
                onChange={(e) => handleInputChange('budget_alloue', e.target.value)}
                min="0"
                step="100000"
                className={errors.budget_alloue ? 'border-red-300' : ''}
              />
              {errors.budget_alloue && (
                <p className="text-sm text-red-500">{errors.budget_alloue}</p>
              )}
            </div>

            <Separator />

            {/* Bénéficiaires */}
            <div className="space-y-4">
              <Label className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                Bénéficiaires estimés
              </Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hommes" className="text-sm text-slate-600">Hommes</Label>
                  <Input
                    id="hommes"
                    type="number"
                    value={formData.beneficiaires_hommes}
                    onChange={(e) => handleInputChange('beneficiaires_hommes', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="femmes" className="text-sm text-slate-600">Femmes</Label>
                  <Input
                    id="femmes"
                    type="number"
                    value={formData.beneficiaires_femmes}
                    onChange={(e) => handleInputChange('beneficiaires_femmes', e.target.value)}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jeunes" className="text-sm text-slate-600">Jeunes (-25 ans)</Label>
                  <Input
                    id="jeunes"
                    type="number"
                    value={formData.beneficiaires_jeunes}
                    onChange={(e) => handleInputChange('beneficiaires_jeunes', e.target.value)}
                    min="0"
                  />
                </div>
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
              <Button variant="outline" size="sm" className="mt-4">
                Choisir un fichier
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200">
          <Link href="/app/activites">
            <Button variant="outline" className="gap-2">
              Annuler
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Sauvegarder brouillon
              </>
            )}
          </Button>

          <Button 
            className="gap-2 bg-green-600 hover:bg-green-700 shadow-sm"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Soumission...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Soumettre pour validation
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
