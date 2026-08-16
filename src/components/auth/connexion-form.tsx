/**
 * Composant ConnexionForm e-OSCS
 * 
 * Formulaire de connexion unifié avec onglets : Connexion | Demande d'accès
 * Ce composant est 'use client' car il utilise useState, useRouter, useSearchParams
 */

'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { useNotification } from '@/hooks/use-notification'
import type { OrgType } from '@/types'

/**
 * Liste des régions de Côte d'Ivoire
 */
const REGIONS_CI = [
  'Abidjan', "Lacs", "Lagune", "Denguele", "Folou", "Gôh-Djiboua",
  "Gôh", "Montagnes", "Sassandra-Marahoué", "Vallee du Bandama",
  "Worodougou", "Zanzan", "Bafing", "Bounkani", "Cavally", "Hambol",
  "Iffou", "Kabadougou", "Moronou", "N'Zi", "San-Pedro", "Tonkpi",
  "Bélier", "Fromager", "Moyen-Cavally", "Sud-Comoé", "Agnéby-Tiassa",
  "Grand-Pont", "Yamoussoukro"
]

/**
 * Types d'onglets disponibles
 */
type AuthTab = 'login' | 'register'

/**
 * Icône SVG Email
 */
function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2"/>
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  )
}

/**
 * Icône SVG Lock
 */
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

/**
 * Icône SVG User
 */
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

/**
 * Icône SVG Building (Organisation)
 */
function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
      <path d="M9 22v-4h6v4"/>
      <path d="M8 6h.01"/>
      <path d="M16 6h.01"/>
      <path d="M12 6h.01"/>
      <path d="M12 10h.01"/>
      <path d="M12 14h.01"/>
      <path d="M16 10h.01"/>
      <path d="M16 14h.01"/>
      <path d="M8 10h.01"/>
      <path d="M8 14h.01"/>
    </svg>
  )
}

/**
 * Icône SVG Phone
 */
function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  )
}

/**
 * Composant principal ConnexionForm
 */
export function ConnexionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { success: showSuccess, error: showError } = useNotification()

  // Onglet actif
  const [activeTab, setActiveTab] = useState<AuthTab>('login')
  
  // États formulaire de connexion
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [isLoginPending, setIsLoginPending] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // States for registration form
  const [regData, setRegData] = useState({
    nom_complet: '',
    email: '',
    telephone: '',
    nom_organisation: '',
    type_org: '' as OrgType | '',
    region: '',
    departement: '',
    message: ''
  })
  const [isRegPending, setIsRegPending] = useState(false)
  const [isRegSuccess, setIsRegSuccess] = useState(false)

  // Récupérer l'URL de redirection
  const redirectTo = searchParams.get('redirect') || '/app/dashboard'
  
  // Erreur depuis l'URL
  const urlError = searchParams.get('error')

  /**
   * Soumission du formulaire de connexion
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!loginEmail.trim()) {
      showError('Champ requis', 'Veuillez entrer votre email.')
      return
    }
    if (!loginPassword) {
      showError('Champ requis', 'Veuillez entrer votre mot de passe.')
      return
    }

    setIsLoginPending(true)
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email: loginEmail, password: loginPassword })
      })
      
      const result = await response.json()
      
      if (result.success) {
        showSuccess('Connexion réussie !', 'Bienvenue sur e-OSCS. Redirection...', { duration: 3000 })
        // Utiliser le redirectTo retourné par l'API ou celui par défaut
        const redirectUrl = result.data?.redirectTo || redirectTo
        setTimeout(() => {
          router.push(redirectUrl)
          router.refresh()
        }, 500)
      } else {
        showError('Échec de la connexion', result.error || 'Email ou mot de passe incorrect.')
      }
    } catch (err) {
      showError('Erreur réseau', 'Impossible de contacter le serveur. Veuillez réessayer.')
    } finally {
      setIsLoginPending(false)
    }
  }

  /**
   * Mise à jour champ inscription
   */
  const updateRegField = (field: string, value: string) => {
    setRegData(prev => ({ ...prev, [field]: value }))
  }

  /**
   * Validation formulaire inscription
   */
  const validateRegForm = (): string | null => {
    if (!regData.nom_complet.trim()) return 'Le nom complet est requis.'
    if (!regData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email)) {
      return "L'email est invalide."
    }
    if (!regData.telephone.trim()) return 'Le numéro de téléphone est requis.'
    if (!regData.nom_organisation.trim()) return "Le nom de l'organisation est requis."
    if (!regData.type_org) return 'Veuillez sélectionner le type d\'organisation.'
    if (!regData.region) return 'Veuillez sélectionner la région.'
    return null
  }

  /**
   * Soumission formulaire inscription
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const validationError = validateRegForm()
    if (validationError) {
      showError('Formulaire incomplet', validationError)
      return
    }

    setIsRegPending(true)
    
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request_access',
          nom_complet: regData.nom_complet,
          email: regData.email,
          telephone: regData.telephone,
          nom_organisation: regData.nom_organisation,
          type_org: regData.type_org,
          region: regData.region,
          departement: regData.departement || undefined,
          message: regData.message || undefined
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        showSuccess('Demande envoyée !', 'Votre demande a été enregistrée avec succès.', { duration: 5000 })
        setIsRegSuccess(true)
      } else {
        showError('Erreur', result.error || 'Erreur lors de la soumission.')
      }
    } catch (err) {
      showError('Erreur réseau', 'Impossible de contacter le serveur.')
    } finally {
      setIsRegPending(false)
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50/30 px-4 py-8 relative overflow-hidden">
      {/* === Décorations de fond === */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cercle orange */}
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ backgroundColor: '#F77F00' }}
        />
        {/* Cercle vert */}
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.04]"
          style={{ backgroundColor: '#009E60' }}
        />
        {/* Grille subtile */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(#F77F00 1px, transparent 1px), linear-gradient(90deg, #F77F00 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* === Contenu principal === */}
      <div className="relative z-10 w-full max-w-lg mx-auto">
        
        {/* Logo e-OSCS */}
        <div className="flex justify-center mb-8">
          <div className="relative group cursor-pointer" onClick={() => router.push('/')}>
            <div className="absolute -inset-3 bg-gradient-to-br from-[#F77F00] via-transparent to-[#009E60] rounded-3xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
            <div className="relative bg-white rounded-2xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
              <img
                src="/logo-eoscs.png"
                alt="e-OSCS - MCNSLP Côte d'Ivoire"
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          
          {/* Liseré tricolore CI */}
          <div className="h-1.5 bg-gradient-to-r from-[#F77F00] via-white to-[#009E60]" />

          <div className="p-8">
            
            {/* Titre principal */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Bienvenue sur <span className="bg-gradient-to-r from-[#F77F00] to-[#009E60] bg-clip-text text-transparent">e-OSCS</span>
              </h1>
              <p className="text-sm text-muted-foreground">
                Plateforme de gestion du MCNSLP Côte d&apos;Ivoire
              </p>
            </div>

            {/* === ONGLETS === */}
            <div className="flex mb-8 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <LockIcon className="w-4 h-4" />
                  Connexion
                </span>
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <UserIcon className="w-4 h-4" />
                  Demander l&apos;accès
                </span>
              </button>
            </div>

            {/* === MESSAGE D'ERREUR URL === */}
            {urlError && activeTab === 'login' && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm text-center">
                {urlError === 'oauth_failed' && 'La connexion OAuth a échoué.'}
                {urlError === 'server_error' && 'Erreur serveur. Veuillez réessayer.'}
                {!['oauth_failed', 'server_error'].includes(urlError) && urlError}
              </div>
            )}

            {/* ======== ONGLET CONNEXION ======== */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                
                {/* Champ Email */}
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium text-gray-700">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoginPending}
                      autoComplete="email"
                      required
                      className="h-12 pl-11 bg-gray-50/50 border-gray-200 focus:border-[#F77F00] focus:ring-[#F77F00]/20"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-sm font-medium text-gray-700">
                      Mot de passe
                    </Label>
                    <button
                      type="button"
                      onClick={() => router.push('/mot-de-passe-oublie')}
                      className="text-xs text-[#F77F00] hover:text-[#F77F00]/80 transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoginPending}
                      autoComplete="current-password"
                      required
                      className="h-12 pl-11 pr-11 bg-gray-50/50 border-gray-200 focus:border-[#F77F00] focus:ring-[#F77F00]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bouton Connexion */}
                <Button
                  type="submit"
                  disabled={isLoginPending}
                  className="w-full h-12 bg-gradient-to-r from-[#F77F00] to-[#E67E00] hover:from-[#E67E00] hover:to-[#F77F00] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  {isLoginPending ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Connexion en cours...
                    </span>
                  ) : (
                    'Se connecter'
                  )}
                </Button>

                {/* Lien vers demande d'accès */}
                <div className="text-center pt-2">
                  <p className="text-sm text-gray-500">
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setActiveTab('register')}
                      className="text-[#009E60] hover:text-[#009E60]/80 font-medium transition-colors"
                    >
                      Demander un accès
                    </button>
                  </p>
                </div>
              </form>
            )}

            {/* ======== ONGLET DEMANDE D'ACCÈS ======== */}
            {activeTab === 'register' && (
              <>
                {isRegSuccess ? (
                  /* État de succès */
                  <div className="text-center space-y-5 py-8">
                    <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-[#009E60]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Demande envoyée !</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Votre demande a été enregistrée avec succès.<br />
                        Nous la traiterons sous <strong className="text-gray-700">48 heures ouvrées</strong>.<br />
                        Vous recevrez un email avec vos identifiants.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setActiveTab('login')
                        setIsRegSuccess(false)
                      }}
                      variant="outline"
                      className="mt-4 border-[#009E60] text-[#009E60] hover:bg-[#009E60] hover:text-white"
                    >
                      Retour à la connexion
                    </Button>
                  </div>
                ) : (
                  /* Formulaire de demande */
                  <form onSubmit={handleRegister} className="space-y-5" noValidate>
                    
                    {/* Section Informations personnelles */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <UserIcon className="w-4 h-4 text-[#F77F00]" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Informations personnelles
                        </span>
                      </div>
                      
                      {/* Nom complet */}
                      <div className="space-y-2">
                        <Label htmlFor="reg-nom" className="text-sm font-medium text-gray-700">
                          Nom complet *
                        </Label>
                        <Input
                          id="reg-nom"
                          placeholder="Ex: Jean Kouamé"
                          value={regData.nom_complet}
                          onChange={(e) => updateRegField('nom_complet', e.target.value)}
                          disabled={isRegPending}
                          autoComplete="name"
                          required
                          className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20"
                        />
                      </div>

                      {/* Email + Téléphone sur même ligne */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reg-email" className="text-sm font-medium text-gray-700">
                            Email *
                          </Label>
                          <div className="relative">
                            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="reg-email"
                              type="email"
                              placeholder="votre@email.com"
                              value={regData.email}
                              onChange={(e) => updateRegField('email', e.target.value)}
                              disabled={isRegPending}
                              autoComplete="email"
                              required
                              className="h-11 pl-10 bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reg-tel" className="text-sm font-medium text-gray-700">
                            Téléphone *
                          </Label>
                          <div className="relative">
                            <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                              id="reg-tel"
                              type="tel"
                              placeholder="+225 07 XX XX XX XX"
                              value={regData.telephone}
                              onChange={(e) => updateRegField('telephone', e.target.value)}
                              disabled={isRegPending}
                              autoComplete="tel"
                              required
                              className="h-11 pl-10 bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <BuildingIcon className="w-4 h-4 text-[#009E60]" />
                        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Organisation
                        </span>
                      </div>
                    </div>

                    {/* Section Organisation */}
                    <div className="space-y-4">
                      {/* Nom organisation */}
                      <div className="space-y-2">
                        <Label htmlFor="reg-org" className="text-sm font-medium text-gray-700">
                          Nom de l&apos;organisation *
                        </Label>
                        <Input
                          id="reg-org"
                          placeholder="Ex: DR Solidarité Abidjan"
                          value={regData.nom_organisation}
                          onChange={(e) => updateRegField('nom_organisation', e.target.value)}
                          disabled={isRegPending}
                          required
                          className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20"
                        />
                      </div>

                      {/* Type + Région */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="reg-type" className="text-sm font-medium text-gray-700">
                            Type *
                          </Label>
                          <Select
                            value={regData.type_org}
                            onValueChange={(value) => updateRegField('type_org', value)}
                            disabled={isRegPending}
                          >
                            <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20" id="reg-type">
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="DR">Direction Régionale (DR)</SelectItem>
                              <SelectItem value="DD">Direction Départementale (DD)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="reg-region" className="text-sm font-medium text-gray-700">
                            Région *
                          </Label>
                          <Select
                            value={regData.region}
                            onValueChange={(value) => updateRegField('region', value)}
                            disabled={isRegPending}
                          >
                            <SelectTrigger className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20" id="reg-region">
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
                        <Label htmlFor="reg-dept" className="text-sm font-medium text-gray-700">
                          Département
                        </Label>
                        <Input
                          id="reg-dept"
                          placeholder="Ex: Abidjan, Bouaké..."
                          value={regData.departement}
                          onChange={(e) => updateRegField('departement', e.target.value)}
                          disabled={isRegPending}
                          className="h-11 bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20"
                        />
                      </div>
                    </div>

                    {/* Message optionnel */}
                    <div className="space-y-2">
                      <Label htmlFor="reg-msg" className="text-sm font-medium text-gray-700">
                        Message complémentaire
                      </Label>
                      <Textarea
                        id="reg-msg"
                        placeholder="Précisez votre besoin ou toute information utile..."
                        value={regData.message}
                        onChange={(e) => updateRegField('message', e.target.value)}
                        disabled={isRegPending}
                        rows={3}
                        className="resize-none bg-gray-50/50 border-gray-200 focus:border-[#009E60] focus:ring-[#009E60]/20"
                      />
                    </div>

                    {/* Bouton soumission */}
                    <Button
                      type="submit"
                      disabled={isRegPending}
                      className="w-full h-12 bg-gradient-to-r from-[#009E60] to-[#007A4D] hover:from-[#007A4D] hover:to-[#009E60] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    >
                      {isRegPending ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : (
                        'Envoyer ma demande'
                      )}
                    </Button>

                    {/* Lien vers connexion */}
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-500">
                        Déjà un compte ?{' '}
                        <button
                          type="button"
                          onClick={() => setActiveTab('login')}
                          className="text-[#F77F00] hover:text-[#F77F00]/80 font-medium transition-colors"
                        >
                          Se connecter
                        </button>
                      </p>
                    </div>
                  </form>
                )}
              </>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 space-y-3">
          <p className="text-xs text-gray-400">
            En vous connectant, vous acceptez nos{' '}
            <a href="/conditions" className="text-[#F77F00] hover:underline">Conditions d&apos;utilisation</a>
            {' '}et notre{' '}
            <a href="/confidentialite" className="text-[#F77F00] hover:underline">Politique de confidentialité</a>
          </p>
          <p className="text-xs text-gray-400/70">
            © {new Date().getFullYear()} e-OSCS — MCNSLP Côte d&apos;Ivoire
          </p>
        </div>

      </div>
    </div>
  )
}

export default ConnexionForm
