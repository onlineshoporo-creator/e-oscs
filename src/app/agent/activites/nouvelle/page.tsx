'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Info,
  FileText,
  Users,
  Image,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  AlertCircle,
  Upload,
  X,
  Calendar as CalendarIcon,
  MapPin,
  Target,
  Award,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Types pour le formulaire
interface ActivityFormData {
  // Étape 1: Informations générales
  intitule: string
  dateActivite: string
  lieu: string
  typeActivite: string
  
  // Étape 2: Description
  objectif: string
  description: string
  resultats: string
  
  // Étape 3: Bénéficiaires
  totalBeneficiaires: string
  hommes: string
  femmes: string
  enfants: string
  personnesHandicapees: string
  
  // Étape 4: Documents (simulé)
  documents: File[]
}

// Configuration des étapes
const steps = [
  {
    id: 1,
    title: 'Informations',
    description: 'Détails de base',
    icon: Info,
  },
  {
    id: 2,
    title: 'Description',
    description: 'Objectifs et résultats',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Bénéficiaires',
    description: 'Public concerné',
    icon: Users,
  },
  {
    id: 4,
    title: 'Documents',
    description: 'Photos et pièces',
    icon: Image,
  },
]

// Types d'activité disponibles
const typesActivite = [
  { value: 'SENSIBILISATION', label: 'Sensibilisation' },
  { value: 'FORMATION', label: 'Formation' },
  { value: 'DISTRIBUTION', label: 'Distribution' },
  { value: 'VISITE', label: 'Visite' },
  { value: 'REUNION', label: 'Réunion' },
  { value: 'ATELIER', label: 'Atelier' },
  { value: 'CAMPAGNE', label: 'Campagne' },
  { value: 'AUTRE', label: 'Autre' },
]

// Formulaire initial vide
const initialFormData: ActivityFormData = {
  intitule: '',
  dateActivite: '',
  lieu: '',
  typeActivite: '',
  objectif: '',
  description: '',
  resultats: '',
  totalBeneficiaires: '',
  hommes: '',
  femmes: '',
  enfants: '',
  personnesHandicapees: '',
  documents: [],
}

export default function NouvelleActivitePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ActivityFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSavingDraft, setIsSavingDraft] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  // Validation par étape
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.intitule.trim()) newErrors.intitule = "L'intitulé est obligatoire"
        if (!formData.dateActivite) newErrors.dateActivite = 'La date est obligatoire'
        if (!formData.lieu.trim()) newErrors.lieu = 'Le lieu est obligatoire'
        if (!formData.typeActivite) newErrors.typeActivite = 'Le type d\'activité est obligatoire'
        break
      case 2:
        if (!formData.objectif.trim()) newErrors.objectif = "L'objectif est obligatoire"
        if (!formData.description.trim()) newErrors.description = 'La description est obligatoire'
        break
      case 3:
        if (!formData.totalBeneficiaires) newErrors.totalBeneficiaires = 'Le nombre de bénéficiaires est obligatoire'
        break
      case 4:
        // Les documents sont optionnels
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation entre étapes
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
    setShowSummary(false)
  }

  // Mise à jour du formulaire
  const updateField = (field: keyof ActivityFormData, value: string | File[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Gestion des fichiers uploadés
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  // Sauvegarder brouillon
  const saveDraft = async () => {
    setIsSavingDraft(true)
    try {
      // Simuler la sauvegarde - en production, appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('✅ Brouillon sauvegardé avec succès !')
      router.push('/agent/brouillons')
    } catch (error) {
      alert('❌ Erreur lors de la sauvegarde du brouillon.')
    } finally {
      setIsSavingDraft(false)
    }
  }

  // Soumettre l'activité
  const submitActivity = async () => {
    if (!validateStep(currentStep)) return
    
    setIsSubmitting(true)
    try {
      // Simuler la soumission - en production, appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      alert('🎉 Activité soumise avec succès ! Elle sera examinée par votre responsable.')
      router.push('/agent/soumises')
    } catch (error) {
      alert('❌ Erreur lors de la soumission de l\'activité.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Afficher le résumé avant soumission
  const showFinalSummary = () => {
    if (validateStep(4)) {
      setShowSummary(true)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-6">
        <Link 
          href="/agent" 
          className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 mb-3 inline-block"
        >
          ← Retour à l'accueil
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
          Nouvelle activité
        </h1>
        <p className="text-slate-500 mt-1">
          Remplissez ce formulaire étape par étape pour déclarer une activité.
        </p>
      </div>

      {/* Stepper visuel */}
      <Card className="mb-6 border-slate-200 overflow-hidden">
        <CardContent className="p-4 lg:p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                {/* Step item */}
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      if (step.id <= currentStep || validateStep(currentStep)) {
                        setCurrentStep(step.id)
                        setShowSummary(false)
                      }
                    }}
                    className={`flex items-center gap-2 lg:gap-3 ${
                  step.id <= currentStep ? 'cursor-pointer' : 'cursor-default'
                }`}
                  >
                    <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300
                    ${currentStep === step.id 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 scale-110' 
                      : step.id < currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-slate-100 text-slate-400'
                    }
                  `}>
                      {step.id < currentStep ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        step.id
                      )}
                    </div>
                    
                    {/* Labels visibles sur desktop uniquement */}
                    <div className="hidden sm:block text-left">
                      <p className={`text-sm font-medium ${
                        currentStep === step.id ? 'text-orange-600' : 'text-slate-700'
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-xs text-slate-400 hidden lg:block">
                        {step.description}
                      </p>
                    </div>
                  </button>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-0.5 mx-2 lg:mx-4 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenu du formulaire selon l'étape */}
      {!showSummary ? (
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              {React.createElement(steps[currentStep - 1].icon, { 
                className: 'w-6 h-6 text-orange-500' 
              })}
              Étape {currentStep} : {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* ÉTAPE 1: Informations générales */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="intitule" className="text-base font-medium">
                    Intitulé de l'activité <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="intitule"
                    placeholder="Ex: Sensibilisation sur l'hygiène communautaire"
                    value={formData.intitule}
                    onChange={(e) => updateField('intitule', e.target.value)}
                    className={`h-12 text-base ${errors.intitule ? 'border-red-300 bg-red-50' : ''}`}
                  />
                  {errors.intitule && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.intitule}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateActivite" className="text-base font-medium">
                      Date de l'activité <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="dateActivite"
                      type="date"
                      value={formData.dateActivite}
                      onChange={(e) => updateField('dateActivite', e.target.value)}
                      className={`h-12 text-base ${errors.dateActivite ? 'border-red-300 bg-red-50' : ''}`}
                    />
                    {errors.dateActivite && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.dateActivite}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="typeActivite" className="text-base font-medium">
                      Type d'activité <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.typeActivite}
                      onValueChange={(value) => updateField('typeActivite', value)}
                    >
                      <SelectTrigger className={`h-12 text-base ${errors.typeActivite ? 'border-red-300 bg-red-50' : ''}`}>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {typesActivite.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.typeActivite && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.typeActivite}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lieu" className="text-base font-medium">
                    Lieu de l'activité <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="lieu"
                      placeholder="Ex: Abidjan, Yopougon - Quartier Rouge"
                      value={formData.lieu}
                      onChange={(e) => updateField('lieu', e.target.value)}
                      className={`h-12 pl-11 text-base ${errors.lieu ? 'border-red-300 bg-red-50' : ''}`}
                    />
                  </div>
                  {errors.lieu && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lieu}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* ÉTAPE 2: Description */}
            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="objectif" className="text-base font-medium">
                    Objectif de l'activité <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Textarea
                      id="objectif"
                      placeholder="Décrivez l'objectif principal de cette activité..."
                      value={formData.objectif}
                      onChange={(e) => updateField('objectif', e.target.value)}
                      rows={3}
                      className={`pl-11 text-base resize-none ${errors.objectif ? 'border-red-300 bg-red-50' : ''}`}
                    />
                  </div>
                  {errors.objectif && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.objectif}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-base font-medium">
                    Description détaillée <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Décrivez en détail le déroulement de l'activité, les actions menées..."
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={5}
                    className={`text-base resize-none ${errors.description ? 'border-red-300 bg-red-50' : ''}`}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resultats" className="text-base font-medium">
                    Résultats obtenus
                  </Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Textarea
                      id="resultats"
                      placeholder="Quels sont les résultats concrets de cette activité ? (optionnel)"
                      value={formData.resultats}
                      onChange={(e) => updateField('resultats', e.target.value)}
                      rows={3}
                      className="pl-11 text-base resize-none"
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Décrivez les résultats mesurables si possible.
                  </p>
                </div>
              </>
            )}

            {/* ÉTAPE 3: Bénéficiaires */}
            {currentStep === 3 && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-blue-700">
                    <strong>💡 Conseil :</strong> Comptez précisément le nombre de personnes 
                    ayant bénéficié directement de cette activité.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalBeneficiaires" className="text-base font-medium">
                      Total bénéficiaires <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="totalBeneficiaires"
                      type="number"
                      min="0"
                      placeholder="Ex: 50"
                      value={formData.totalBeneficiaires}
                      onChange={(e) => updateField('totalBeneficiaires', e.target.value)}
                      className={`h-12 text-base ${errors.totalBeneficiaires ? 'border-red-300 bg-red-50' : ''}`}
                    />
                    {errors.totalBeneficiaires && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.totalBeneficiaires}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hommes" className="text-base font-medium">
                      Hommes
                    </Label>
                    <Input
                      id="hommes"
                      type="number"
                      min="0"
                      placeholder="Ex: 20"
                      value={formData.hommes}
                      onChange={(e) => updateField('hommes', e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="femmes" className="text-base font-medium">
                      Femmes
                    </Label>
                    <Input
                      id="femmes"
                      type="number"
                      min="0"
                      placeholder="Ex: 25"
                      value={formData.femmes}
                      onChange={(e) => updateField('femmes', e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="enfants" className="text-base font-medium">
                      Enfants (-18 ans)
                    </Label>
                    <Input
                      id="enfants"
                      type="number"
                      min="0"
                      placeholder="Ex: 15"
                      value={formData.enfants}
                      onChange={(e) => updateField('enfants', e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="personnesHandicapees" className="text-base font-medium">
                      Personnes en situation de handicap
                    </Label>
                    <Input
                      id="personnesHandicapees"
                      type="number"
                      min="0"
                      placeholder="Ex: 3 (optionnel)"
                      value={formData.personnesHandicapees}
                      onChange={(e) => updateField('personnesHandicapees', e.target.value)}
                      className="h-12 text-base"
                    />
                  </div>
                </div>
              </>
            )}

            {/* ÉTAPE 4: Documents */}
            {currentStep === 4 && (
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-amber-700">
                    <strong>📷 Photos et documents :</strong> Ajoutez des photos ou documents 
                    qui illustrent votre activité. Formats acceptés : JPG, PNG, PDF (max 5Mo chacun).
                  </p>
                </div>

                {/* Zone d'upload */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-400 hover:bg-orange-50/30 transition-colors">
                  <input
                    type="file"
                    id="documents"
                    multiple
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                    <p className="text-base font-medium text-slate-700">
                      Cliquez pour ajouter des fichiers
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      ou glissez-déposez ici
                    </p>
                  </label>
                </div>

                {/* Liste des fichiers uploadés */}
                {formData.documents.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-sm font-medium text-slate-700">
                      Fichiers sélectionnés ({formData.documents.length})
                    </p>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {formData.documents.map((file, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Image className="w-8 h-8 text-slate-400" />
                            <div className="text-left">
                              <p className="text-sm font-medium text-slate-700 truncate max-w-[200px]">
                                {file.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {(file.size / 1024 / 1024).toFixed(2)} Mo
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDocument(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-slate-400 mt-4 text-center">
                  L'ajout de photos est facultatif mais recommandé pour une meilleure traçabilité.
                </p>
              </>
            )}

            {/* Boutons de navigation */}
            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="order-2 sm:order-1"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Précédent
              </Button>

              <div className="flex items-center gap-3 order-1 sm:order-2">
                {/* Bouton Brouillon (visible à toutes les étapes sauf résumé) */}
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isSavingDraft}
                  className="text-slate-600 border-slate-300 hover:bg-slate-50"
                >
                  {isSavingDraft ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Enregistrer brouillon
                    </>
                  )}
                </Button>

                {/* Bouton Suivant ou Résumé */}
                {currentStep < steps.length ? (
                  <Button
                    onClick={nextStep}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                  >
                    Étape suivante
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={showFinalSummary}
                    className="bg-green-600 hover:bg-green-700 text-white px-6"
                  >
                    Voir le résumé
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* RÉSUMÉ FINAL AVANT SOUMISSION */
        <Card className="border-orange-200 bg-gradient-to-b from-orange-50/50 to-white">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl text-orange-800">
              <CheckCircle2 className="w-7 h-7 text-orange-500" />
              Résumé de votre activité
            </CardTitle>
            <CardDescription>
              Vérifiez toutes les informations avant de soumettre votre activité.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Section Informations */}
            <section>
              <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-500" />
                Informations générales
              </h3>
              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Intitulé :</span>
                  <span className="font-medium text-slate-900">{formData.intitule}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Date :</span>
                  <span className="font-medium">{new Date(formData.dateActivite).toLocaleDateString('fr-FR')}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Lieu :</span>
                  <span className="font-medium">{formData.lieu}</span>
                </div>
                <Separator />
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Type :</span>
                  <Badge variant="secondary">
                    {typesActivite.find(t => t.value === formData.typeActivite)?.label || formData.typeActivite}
                  </Badge>
                </div>
              </div>
            </section>

            {/* Section Description */}
            <section>
              <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                Description
              </h3>
              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Objectif :</p>
                  <p className="text-slate-900">{formData.objectif}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-slate-500 mb-1">Description :</p>
                  <p className="text-slate-900 whitespace-pre-wrap">{formData.description}</p>
                </div>
                {formData.resultats && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Résultats :</p>
                      <p className="text-slate-900">{formData.resultats}</p>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Section Bénéficiaires */}
            <section>
              <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                Bénéficiaires
              </h3>
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{formData.totalBeneficiaires || 0}</p>
                    <p className="text-sm text-slate-600">Total</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{formData.hommes || 0}</p>
                    <p className="text-sm text-slate-600">Hommes</p>
                  </div>
                  <div className="text-center p-3 bg-pink-50 rounded-lg">
                    <p className="text-2xl font-bold text-pink-600">{formData.femmes || 0}</p>
                    <p className="text-sm text-slate-600">Femmes</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{formData.enfants || 0}</p>
                    <p className="text-sm text-slate-600">Enfants</p>
                  </div>
                </div>
                {formData.personnesHandicapees && (
                  <p className="text-sm text-slate-500 mt-3 text-center">
                    + {formData.personnesHandicapees} personne(s) en situation de handicap
                  </p>
                )}
              </div>
            </section>

            {/* Section Documents */}
            {formData.documents.length > 0 && (
              <section>
                <h3 className="font-semibold text-lg text-slate-900 mb-3 flex items-center gap-2">
                  <Image className="w-5 h-5 text-orange-500" />
                  Documents joints ({formData.documents.length})
                </h3>
                <div className="bg-white rounded-lg border border-slate-200 p-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.documents.map((file, index) => (
                      <Badge key={index} variant="secondary" className="py-2 px-3">
                        📎 {file.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Actions finales */}
            <Separator />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowSummary(false)}
                className="order-2 sm:order-1"
              >
                Modifier le formulaire
              </Button>

              <div className="flex items-center gap-3 order-1 sm:order-2">
                <Button
                  variant="outline"
                  onClick={saveDraft}
                  disabled={isSavingDraft}
                  className="text-slate-600"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder brouillon
                </Button>

                <Button
                  onClick={submitActivity}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-green-500/30"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Soumission en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Soumettre l'activité
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="text-xs text-slate-400 text-center pt-2">
              En soumettant cette activité, vous certifiez que les informations fournies sont exactes.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
