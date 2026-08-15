'use client'

import React, { useState, useEffect, useCallback } from 'react'
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
  Eye,
  Clock,
  Sparkles,
  Camera,
  Trash2,
  Loader2,
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
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'

// Types pour le formulaire
interface ActivityFormData {
  // Étape 1: Informations générales
  intitule: string
  dateActivite: string
  heureDebut: string
  heureFin: string
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
  documentPreviews: string[]
}

interface FormErrors {
  [key: string]: string
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
    description: 'Objectifs & résultats',
    icon: FileText,
  },
  {
    id: 3,
    title: 'Bénéficiaires',
    description: 'Public touché',
    icon: Users,
  },
  {
    id: 4,
    title: 'Documents',
    description: 'Photos & pièces jointes',
    icon: Image,
  },
]

// Types d'activité disponibles
const typesActivite = [
  { value: 'SENSIBILISATION', label: 'Sensibilisation', emoji: '📢' },
  { value: 'FORMATION', label: 'Formation', emoji: '🎓' },
  { value: 'DISTRIBUTION', label: 'Distribution', emoji: '📦' },
  { value: 'VISITE', label: 'Visite', emoji: '🏠' },
  { value: 'ATELIER', label: 'Atelier', emoji: '🔧' },
  { value: 'REUNION', label: 'Réunion', emoji: '👥' },
  { value: 'CAMPAGNE', label: 'Campagne', emoji: '📣' },
]

// Données initiales du formulaire
const initialFormData: ActivityFormData = {
  intitule: '',
  dateActivite: '',
  heureDebut: '',
  heureFin: '',
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
  documentPreviews: [],
}

export default function NouvelleActivitePage() {
  const router = useRouter()
  const { toast } = useToast()
  
  // États du formulaire
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ActivityFormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Calculer la progression globale
  const calculateProgress = (): number => {
    let filledFields = 0
    let totalFields = 0
    
    // Champs obligatoires à vérifier
    const fieldsToCheck = [
      formData.intitule,
      formData.dateActivite,
      formData.lieu,
      formData.typeActivite,
      formData.objectif,
      formData.description,
      formData.totalBeneficiaires,
    ]
    
    totalFields = fieldsToCheck.length
    filledFields = fieldsToCheck.filter(f => f && f.trim().length > 0).length
    
    return Math.round((filledFields / totalFields) * 100)
  }
  
  const progress = calculateProgress()

  // Auto-save toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      if (formData.intitule || formData.description) {
        saveDraft()
      }
    }, 30000)
    
    return () => clearInterval(interval)
  }, [formData])

  // Sauvegarder le brouillon
  const saveDraft = useCallback(() => {
    // Simuler la sauvegarde (en production: appel API)
    localStorage.setItem('activity_draft', JSON.stringify({
      ...formData,
      savedAt: new Date().toISOString(),
    }))
    setLastSaved(new Date())
    
    toast({
      title: 'Brouillon sauvegardé',
      description: 'Votre progression a été enregistrée.',
    })
  }, [formData, toast])

  // Charger un brouillon existant au montage
  useEffect(() => {
    const savedDraft = localStorage.getItem('activity_draft')
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft)
        if (draft.savedAt) {
          setLastSaved(new Date(draft.savedAt))
          toast({
            title: 'Brouillon récupéré',
            description: 'Voulez-vous reprendre votre activité en cours ?',
            action: (
              <Button 
                size="sm" 
                onClick={() => {
                  setFormData({ ...initialFormData, ...draft })
                  toast({ title: 'Brouillon restauré' })
                }}
              >
                Restaurer
              </Button>
            ),
          })
        }
      } catch (e) {
        console.error('Erreur lors du chargement du brouillon')
      }
    }
  }, [])

  // Validation temps réel
  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'intitule':
        if (!value.trim()) return "L'intitulé est obligatoire"
        if (value.trim().length < 5) return "L'intitulé doit contenir au moins 5 caractères"
        if (value.trim().length > 200) return "L'intitulé ne doit pas dépasser 200 caractères"
        break
      case 'dateActivite':
        if (!value) return "La date est obligatoire"
        const selectedDate = new Date(value)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate > today) return "La date ne peut pas être dans le futur"
        break
      case 'lieu':
        if (!value.trim()) return "Le lieu est obligatoire"
        break
      case 'typeActivite':
        if (!value) return "Le type d'activité est obligatoire"
        break
      case 'objectif':
        if (!value.trim()) return "L'objectif est obligatoire"
        break
      case 'description':
        if (!value.trim()) return "La description est obligatoire"
        if (value.trim().length < 20) return "La description doit contenir au moins 20 caractères"
        break
      case 'totalBeneficiaires':
        if (!value) return "Le nombre de bénéficiaires est obligatoire"
        const num = parseInt(value)
        if (isNaN(num) || num < 1) return "Entrez un nombre valide"
        if (num > 10000) return "Le nombre semble trop élevé"
        break
    }
    return null
  }

  // Gérer les changements avec validation temps réel
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validation temps réel
    const error = validateField(field, value)
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error }
      } else {
        const next = { ...prev }
        delete next[field]
        return next
      }
    })
  }

  // Valider l'étape actuelle
  const validateCurrentStep = (): boolean => {
    const newErrors: FormErrors = {}
    
    switch (currentStep) {
      case 1:
        const step1Fields = ['intitule', 'dateActivite', 'lieu', 'typeActivite']
        step1Fields.forEach(field => {
          const error = validateField(field, (formData as any)[field])
          if (error) newErrors[field] = error
        })
        break
      case 2:
        const step2Fields = ['objectif', 'description']
        step2Fields.forEach(field => {
          const error = validateField(field, (formData as any)[field])
          if (error) newErrors[field] = error
        })
        break
      case 3:
        const error = validateField('totalBeneficiaires', formData.totalBeneficiaires)
        if (error) newErrors.totalBeneficiaires = error
        break
      case 4:
        // Pas de champs obligatoires pour les documents
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Navigation entre étapes
  const nextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } else {
      toast({
        title: 'Champs manquants',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive',
      })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Gestion des fichiers (drag & drop)
  const handleFileUpload = (files: FileList | null) => {
    if (!files) return
    
    const newFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    )
    
    if (newFiles.length !== files.length) {
      toast({
        title: 'Fichiers ignorés',
        description: 'Seules les images de moins de 5MB sont acceptées.',
        variant: 'destructive',
      })
    }
    
    newFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          documents: [...prev.documents, file],
          documentPreviews: [...prev.documentPreviews, e.target?.result as string],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
      documentPreviews: prev.documentPreviews.filter((_, i) => i !== index),
    }))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  // Soumission finale
  const handleSubmit = async () => {
    if (!validateCurrentStep()) return
    
    setIsSubmitting(true)
    
    try {
      // Simuler l'envoi API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Nettoyer le brouillon
      localStorage.removeItem('activity_draft')
      
      toast({
        title: 'Activité soumise avec succès ! 🎉',
        description: 'Votre activité a été envoyée pour validation.',
      })
      
      router.push('/agent/soumises')
    } catch (error) {
      toast({
        title: 'Erreur lors de la soumission',
        description: 'Une erreur est survenue. Veuillez réessayer.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Rendu de chaque étape
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Intitulé */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="intitule" className="text-base font-medium flex items-center gap-2">
                  Intitulé de l&apos;activité <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="intitule"
                  placeholder="Ex: Sensibilisation sur l'hygiène communautaire"
                  value={formData.intitule}
                  onChange={(e) => handleChange('intitule', e.target.value)}
                  className={`h-12 ${errors.intitule ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.intitule && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.intitule}
                  </p>
                )}
                <p className="text-xs text-slate-400">{formData.intitule.length}/200 caractères</p>
              </div>

              {/* Type d'activité */}
              <div className="space-y-2">
                <Label className="text-base font-medium flex items-center gap-2">
                  Type d&apos;activité <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.typeActivite} onValueChange={(v) => handleChange('typeActivite', v)}>
                  <SelectTrigger className={`h-12 ${errors.typeActivite ? 'border-red-500' : ''}`}>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typesActivite.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <span className="flex items-center gap-2">
                          <span>{type.emoji}</span>
                          {type.label}
                        </span>
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

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="dateActivite" className="text-base font-medium flex items-center gap-2">
                  Date de l&apos;activité <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateActivite"
                  type="date"
                  value={formData.dateActivite}
                  onChange={(e) => handleChange('dateActivite', e.target.value)}
                  className={`h-12 ${errors.dateActivite ? 'border-red-500' : ''}`}
                  max={new Date().toISOString().split('T')[0]}
                />
                {errors.dateActivite && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.dateActivite}
                  </p>
                )}
              </div>

              {/* Heures */}
              <div className="space-y-2">
                <Label htmlFor="heureDebut" className="text-base font-medium">Heure de début</Label>
                <Input
                  id="heureDebut"
                  type="time"
                  value={formData.heureDebut}
                  onChange={(e) => handleChange('heureDebut', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heureFin" className="text-base font-medium">Heure de fin</Label>
                <Input
                  id="heureFin"
                  type="time"
                  value={formData.heureFin}
                  onChange={(e) => handleChange('heureFin', e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Lieu */}
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="lieu" className="text-base font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#F77F00]" />
                  Lieu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lieu"
                  placeholder="Ex: Abidjan, Yopougon - Salle communautaire"
                  value={formData.lieu}
                  onChange={(e) => handleChange('lieu', e.target.value)}
                  className={`h-12 ${errors.lieu ? 'border-red-500' : ''}`}
                />
                {errors.lieu && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.lieu}
                  </p>
                )}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Objectif */}
            <div className="space-y-2">
              <Label htmlFor="objectif" className="text-base font-medium flex items-center gap-2">
                <Target className="w-4 h-4 text-[#F77F00]" />
                Objectif principal <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="objectif"
                placeholder="Décrivez l'objectif principal de cette activité..."
                value={formData.objectif}
                onChange={(e) => handleChange('objectif', e.target.value)}
                rows={3}
                className={`resize-none ${errors.objectif ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.objectif && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.objectif}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#F77F00]" />
                Description détaillée <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Décrivez en détail le déroulement de l'activité, les sujets abordés, les méthodes utilisées..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={5}
                className={`resize-none ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              />
              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.description}
                </p>
              )}
              <p className="text-xs text-slate-400">{formData.description.length} caractères (minimum 20)</p>
            </div>

            {/* Résultats */}
            <div className="space-y-2">
              <Label htmlFor="resultats" className="text-base font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-[#009E60]" />
                Résultats obtenus
              </Label>
              <Textarea
                id="resultats"
                placeholder="Quels sont les résultats concrets obtenus ? (optionnel)"
                value={formData.resultats}
                onChange={(e) => handleChange('resultats', e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card className="bg-[#F77F00]/5 border-[#F77F00]/20">
              <CardContent className="p-4 flex items-start gap-3">
                <Users className="w-5 h-5 text-[#F77F00] mt-0.5" />
                <div>
                  <p className="font-medium text-sm text-[#F77F00]">Information bénéficiaires</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Indiquez le nombre de personnes ayant bénéficié de cette activité. 
                    Le total se calculera automatiquement.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Total */}
              <div className="space-y-2">
                <Label htmlFor="totalBeneficiaires" className="text-base font-medium flex items-center gap-1">
                  Total <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalBeneficiaires"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={formData.totalBeneficiaires}
                  onChange={(e) => handleChange('totalBeneficiaires', e.target.value)}
                  className={`h-12 text-lg font-semibold ${errors.totalBeneficiaires ? 'border-red-500' : ''}`}
                />
                {errors.totalBeneficiaires && (
                  <p className="text-sm text-red-500">{errors.totalBeneficiaires}</p>
                )}
              </div>

              {/* Hommes */}
              <div className="space-y-2">
                <Label htmlFor="hommes" className="text-base font-medium text-blue-600">Hommes</Label>
                <Input
                  id="hommes"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.hommes}
                  onChange={(e) => handleChange('hommes', e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Femmes */}
              <div className="space-y-2">
                <Label htmlFor="femmes" className="text-base font-medium text-pink-600">Femmes</Label>
                <Input
                  id="femmes"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.femmes}
                  onChange={(e) => handleChange('femmes', e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Enfants */}
              <div className="space-y-2">
                <Label htmlFor="enfants" className="text-base font-medium text-green-600">Enfants</Label>
                <Input
                  id="enfants"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={formData.enfants}
                  onChange={(e) => handleChange('enfants', e.target.value)}
                  className="h-12"
                />
              </div>
            </div>

            {/* Personnes handicapées */}
            <div className="space-y-2">
              <Label htmlFor="personnesHandicapees" className="text-base font-medium text-purple-600">
                Personnes en situation de handicap
              </Label>
              <Input
                id="personnesHandicapees"
                type="number"
                min="0"
                placeholder="0 (optionnel)"
                value={formData.personnesHandicapees}
                onChange={(e) => handleChange('personnesHandicapees', e.target.value)}
                className="h-12 max-w-xs"
              />
            </div>

            {/* Indicateur de répartition */}
            {(parseInt(formData.hommes) || parseInt(formData.femmes) || parseInt(formData.enfants)) && (
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm font-medium text-slate-700 mb-3">Répartition</p>
                <div className="flex h-4 rounded-full overflow-hidden bg-slate-200">
                  {parseInt(formData.hommes) > 0 && (
                    <div 
                      className="bg-blue-500 transition-all duration-300"
                      style={{ width: `${(parseInt(formData.hommes) / parseInt(formData.totalBeneficiares || '1')) * 100}%` }}
                      title={`Hommes: ${formData.hommes}`}
                    />
                  )}
                  {parseInt(formData.femmes) > 0 && (
                    <div 
                      className="bg-pink-500 transition-all duration-300"
                      style={{ width: `${(parseInt(formData.femmes) / parseInt(formData.totalBeneficiares || '1')) * 100}%` }}
                      title={`Femmes: ${formData.femmes}`}
                    />
                  )}
                  {parseInt(formData.enfants) > 0 && (
                    <div 
                      className="bg-green-500 transition-all duration-300"
                      style={{ width: `${(parseInt(formData.enfants) / parseInt(formData.totalBeneficiares || '1')) * 100}%` }}
                      title={`Enfants: ${formData.enfants}`}
                    />
                  )}
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Hommes: {formData.hommes || '0'}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Femmes: {formData.femmes || '0'}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Enfants: {formData.enfants || '0'}</span>
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {/* Zone de drop */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
                isDragging 
                  ? 'border-[#F77F00] bg-orange-50 scale-[1.02]' 
                  : 'border-slate-300 hover:border-[#F77F00]/50 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F77F00]/10 flex items-center justify-center mb-4">
                  {isDragging ? (
                    <Upload className="w-8 h-8 text-[#F77F00] animate-bounce" />
                  ) : (
                    <Camera className="w-8 h-8 text-[#F77F00]" />
                  )}
                </div>
                
                <p className="text-lg font-medium text-slate-700">
                  {isDragging ? 'Déposez vos images ici' : 'Glissez vos photos ici'}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  ou cliquez pour parcourir
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  PNG, JPG jusqu'à 5MB · Maximum 10 images
                </p>
              </label>
            </div>

            {/* Prévisualisation des images */}
            {formData.documentPreviews.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  Images sélectionnées ({formData.documents.length}/10)
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.documentPreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={preview}
                        alt={`Document ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => removeDocument(index)}
                          className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {/* Badge index */}
                      <Badge className="absolute top-2 left-2 bg-black/70 text-white text-xs">
                        {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Info optionnel */}
            <Card className="bg-slate-50 border-slate-200">
              <CardContent className="p-4">
                <p className="text-sm text-slate-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  L&apos;ajout de photos est optionnel mais fortement recommandé. 
                  Elles permettent de valoriser votre travail et facilitent la validation.
                </p>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  // Rendu du preview
  const renderPreview = () => (
    <div className="space-y-6">
      <Card className="border-[#009E60]/30 bg-gradient-to-br from-green-50/50 to-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#009E60]">
            <Eye className="w-5 h-5" />
            Aperçu avant soumission
          </CardTitle>
          <CardDescription>
            Vérifiez les informations avant d&apos;envoyer votre activité.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Informations principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-500">Intitulé</p>
              <p className="font-semibold text-slate-900">{formData.intitule}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Type</p>
              <Badge variant="secondary">
                {typesActivite.find(t => t.value === formData.typeActivite)?.emoji}{' '}
                {typesActivite.find(t => t.value === formData.typeActivite)?.label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium text-slate-900 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#F77F00]" />
                {formatDate(formData.dateActivite)}
                {formData.heureDebut && ` à ${formData.heureDebut}`}
                {formData.heureFin && ` - ${formData.heureFin}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Lieu</p>
              <p className="font-medium text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F77F00]" />
                {formData.lieu}
              </p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <p className="text-sm text-slate-500 mb-2">Objectif</p>
            <p className="text-slate-800 whitespace-pre-wrap">{formData.objectif}</p>
          </div>
          
          <div>
            <p className="text-sm text-slate-500 mb-2">Description</p>
            <p className="text-slate-800 whitespace-pre-wrap">{formData.description}</p>
          </div>

          {formData.resultats && (
            <div>
              <p className="text-sm text-slate-500 mb-2">Résultats</p>
              <p className="text-slate-800 whitespace-pre-wrap">{formData.resultats}</p>
            </div>
          )}

          <Separator />

          {/* Bénéficiaires */}
          <div>
            <p className="text-sm text-slate-500 mb-3">Bénéficiaires</p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-2xl font-bold text-blue-700">{formData.totalBeneficiaires}</p>
                <p className="text-xs text-blue-600">Total</p>
              </div>
              {formData.hommes && (
                <div className="bg-slate-100 px-4 py-2 rounded-lg">
                  <p className="text-xl font-bold text-slate-700">{formData.hommes}</p>
                  <p className="text-xs text-slate-600">Hommes</p>
                </div>
              )}
              {formData.femmes && (
                <div className="bg-slate-100 px-4 py-2 rounded-lg">
                  <p className="text-xl font-bold text-slate-700">{formData.femmes}</p>
                  <p className="text-xs text-slate-600">Femmes</p>
                </div>
              )}
              {formData.enfants && (
                <div className="bg-slate-100 px-4 py-2 rounded-lg">
                  <p className="text-xl font-bold text-slate-700">{formData.enfants}</p>
                  <p className="text-xs text-slate-600">Enfants</p>
                </div>
              )}
            </div>
          </div>

          {/* Documents */}
          {formData.documentPreviews.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-slate-500 mb-3">Documents joints ({formData.documents.length})</p>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {formData.documentPreviews.map((preview, i) => (
                    <img
                      key={i}
                      src={preview}
                      alt={`Doc ${i+1}`}
                      className="w-24 h-24 object-cover rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )

  // Helper pour formater la date
  function formatDate(dateStr: string): string {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-[#F77F00]" />
            Nouvelle activité
          </h1>
          <p className="text-slate-500 mt-1">
            Remplissez le formulaire étape par étape.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={saveDraft}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Sauvegarder
          </Button>
          
          {lastSaved && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Sauvé à {lastSaved.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* Barre de progression */}
      <Card className="border-slate-200 overflow-hidden">
        <CardContent className="p-4">
          {/* Steps indicators */}
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => {
                    if (step.id <= currentStep || validateCurrentStep()) {
                      setCurrentStep(step.id)
                    }
                  }}
                  className={`flex flex-col items-center gap-1 transition-all ${
                    currentStep >= step.id ? 'text-[#F77F00]' : 'text-slate-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    currentStep > step.id 
                      ? 'bg-[#009E60] text-white' 
                      : currentStep === step.id 
                        ? 'bg-[#F77F00] text-white shadow-lg shadow-orange-500/30' 
                        : 'bg-slate-100 text-slate-500'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </button>
                
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-[#009E60]' : 'bg-slate-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Progression générale</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-[#F77F00] [&>div]:to-[#009E60]" />
          </div>
        </CardContent>
      </Card>

      {/* Contenu de l'étape actuelle ou preview */}
      {!showPreview ? (
        <Card className="border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                currentStep === steps.findIndex(s => s.id === currentStep) + 1 
                  ? 'bg-[#F77F00]/10' 
                  : 'bg-slate-100'
              }`}>
                {React.createElement(steps[currentStep - 1].icon, { 
                  className: `w-5 h-5 ${currentStep === steps[currentStep - 1].id ? 'text-[#F77F00]' : 'text-slate-500'}` 
                })}
              </div>
              <div>
                <CardTitle className="text-lg">
                  Étape {currentStep} : {steps[currentStep - 1].title}
                </CardTitle>
                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>
      ) : (
        renderPreview()
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <div>
          {currentStep > 1 && !showPreview && (
            <Button variant="outline" onClick={prevStep} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
          )}
          {showPreview && (
            <Button variant="outline" onClick={() => setShowPreview(false)} className="gap-2">
              Modifier
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!showPreview ? (
            <>
              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="bg-[#F77F00] hover:bg-[#E67300] gap-2">
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  onClick={() => setShowPreview(true)} 
                  className="bg-[#009E60] hover:bg-green-700 gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Prévisualiser
                </Button>
              )}
            </>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-[#009E60] hover:bg-green-700 gap-2 px-8"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Soumission en cours...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Soumettre l&apos;activité
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Lien annulation */}
      <div className="text-center pt-4">
        <Link href="/agent" className="text-sm text-slate-500 hover:text-[#F77F00] underline">
          Annuler et revenir au tableau de bord
        </Link>
      </div>
    </div>
  )
}
