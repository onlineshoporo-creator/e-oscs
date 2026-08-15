/**
 * Composant SignupForm e-OSCS
 * 
 * Formulaire de demande d'activation / inscription organisation.
 * Collecte les informations de l'utilisateur et de son organisation
 * pour créer une demande d'accès dans subscription_requests.
 */

'use client'

import React, { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AuthCard, AuthLink } from './auth-card'
import { requestAccessAction } from '@/lib/actions/auth'
import type { OrgType } from '@/types'
import { toast } from 'sonner'

/**
 * Liste des régions de Côte d'Ivoire (principales)
 */
const REGIONS_CI = [
  'Abidjan',
  "Lacs",
  "Lagune",
  "Denguele",
  "Folou",
  "Gôh-Djiboua",
  "Gôh",
  "Montagnes",
  "Sassandra-Marahoué",
  "Vallee du Bandama",
  "Worodougou",
  "Zanzan",
  "Bafing",
  "Bounkani",
  "Cavally",
  "Hambol",
  "Iffou",
  "Kabadougou",
  "Moronou",
  "N'Zi",
  "San-Pedro",
  "Tonkpi",
  "Bélier",
  "Fromager",
  "Moyen-Cavally",
  "Sud-Comoé",
  "Agnéby-Tiassa",
  "Grand-Pont",
  "Yamoussoukro"
]

/**
 * Formulaire de demande d'accès
 */
export function SignupForm() {
  const router = useRouter()
  
  // États du formulaire
  const [formData, setFormData] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    nom_organisation: '',
    type_org: '' as OrgType | '',
    region: '',
    departement: '',
    message: '',
  })
  const [isPending, startTransition] = useTransition()
  const [isSuccess, setIsSuccess] = useState(false)

  /**
   * Mise à jour d'un champ du formulaire
   */
  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /**
   * Validation du formulaire avant soumission
   */
  const validateForm = (): string | null => {
    if (!formData.nom_complet.trim()) return 'Le nom complet est requis.'
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return 'L\'email est invalide.'
    }
    if (!formData.telephone.trim()) return 'Le numéro de téléphone est requis.'
    if (!formData.nom_organisation.trim()) return 'Le nom de l\'organisation est requis.'
    if (!formData.type_org) return 'Veuillez sélectionner le type d\'organisation.'
    if (!formData.region) return 'Veuillez sélectionner la région.'
    return null
  }

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation client
    const validationError = validateForm()
    if (validationError) {
      toast.error(validationError)
      return
    }

    startTransition(async () => {
      const result = await requestAccessAction({
        nom_complet: formData.nom_complet,
        email: formData.email,
        telephone: formData.telephone,
        nom_organisation: formData.nom_organisation,
        type_org: formData.type_org as OrgType,
        region: formData.region,
        departement: formData.departement || undefined,
        message: formData.message || undefined,
      })

      if (result.success) {
        toast.success(result.message || 'Demande envoyée avec succès !')
        setIsSuccess(true)
      } else {
        toast.error(result.error || 'Erreur lors de la soumission.')
      }
    })
  }

  // État de succès - afficher un message au lieu du formulaire
  if (isSuccess) {
    return (
      <AuthCard
        title="Demande envoyée !"
        description="Votre demande a été enregistrée avec succès."
      >
        <div className="text-center space-y-4 py-6">
          {/* Icône de succès */}
          <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-success" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          <p className="text-muted-foreground">
            Nous traiterons votre demande sous <strong>48 heures ouvrées</strong>.
            Vous recevrez un email avec vos identifiants de connexion.
          </p>
          
          <Button
            onClick={() => router.push('/connexion')}
            variant="outline"
            className="mt-4"
          >
            Retour à la connexion
          </Button>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Demander un accès"
      description="Remplissez ce formulaire pour demander l'accès à e-OSCS"
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <AuthLink href="/connexion" className="text-primary font-medium">
            Se connecter
          </AuthLink>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        
        {/* === Section Informations personnelles === */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Informations personnelles
          </h3>
          
          {/* Nom complet */}
          <div className="space-y-2">
            <Label htmlFor="nom_complet" className="text-sm font-medium">
              Nom complet *
            </Label>
            <Input
              id="nom_complet"
              placeholder="Ex: Jean Kouamé"
              value={formData.nom_complet}
              onChange={(e) => updateField('nom_complet', e.target.value)}
              disabled={isPending}
              autoComplete="name"
              required
              className="h-11"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Adresse email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre.email@example.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={isPending}
              autoComplete="email"
              required
              className="h-11"
            />
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label htmlFor="telephone" className="text-sm font-medium">
              Numéro de téléphone *
            </Label>
            <Input
              id="telephone"
              type="tel"
              placeholder="Ex: +225 07 00 000 000"
              value={formData.telephone}
              onChange={(e) => updateField('telephone', e.target.value)}
              disabled={isPending}
              autoComplete="tel"
              required
              className="h-11"
            />
          </div>
        </div>

        {/* Séparateur */}
        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
            Organisation
          </h3>
        </div>

        {/* === Section Organisation === */}
        <div className="space-y-4">
          {/* Nom de l'organisation */}
          <div className="space-y-2">
            <Label htmlFor="nom_organisation" className="text-sm font-medium">
              Nom de l&apos;organisation *
            </Label>
            <Input
              id="nom_organisation"
              placeholder="Ex: DR Solidarité Abidjan"
              value={formData.nom_organisation}
              onChange={(e) => updateField('nom_organisation', e.target.value)}
              disabled={isPending}
              required
              className="h-11"
            />
          </div>

          {/* Type d'organisation + Région sur la même ligne (desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Type d'organisation */}
            <div className="space-y-2">
              <Label htmlFor="type_org" className="text-sm font-medium">
                Type *
              </Label>
              <Select
                value={formData.type_org}
                onValueChange={(value) => updateField('type_org', value)}
                disabled={isPending}
              >
                <SelectTrigger className="h-11" id="type_org">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DR">Direction Régionale (DR)</SelectItem>
                  <SelectItem value="DD">Direction Départementale (DD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Région */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium">
                Région *
              </Label>
              <Select
                value={formData.region}
                onValueChange={(value) => updateField('region', value)}
                disabled={isPending}
              >
                <SelectTrigger className="h-11" id="region">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS_CI.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Département (optionnel) */}
          <div className="space-y-2">
            <Label htmlFor="departement" className="text-sm font-medium">
              Département
            </Label>
            <Input
              id="departement"
              placeholder="Ex: Abidjan, Bouaké..."
              value={formData.departement}
              onChange={(e) => updateField('departement', e.target.value)}
              disabled={isPending}
              className="h-11"
            />
          </div>
        </div>

        {/* Message optionnel */}
        <div className="space-y-2">
          <Label htmlFor="message" className="text-sm font-medium">
            Message complémentaire
          </Label>
          <Textarea
            id="message"
            placeholder="Précisez votre besoin ou toute information utile..."
            value={formData.message}
            onChange={(e) => updateField('message', e.target.value)}
            disabled={isPending}
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Bouton de soumission */}
        <Button
          type="submit"
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          disabled={isPending}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg 
                className="animate-spin h-4 w-4" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Envoi en cours...
            </span>
          ) : (
            'Envoyer ma demande'
          )}
        </Button>
      </form>
    </AuthCard>
  )
}

export default SignupForm
