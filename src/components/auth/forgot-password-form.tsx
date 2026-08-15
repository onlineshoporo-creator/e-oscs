/**
 * Composant ForgotPasswordForm e-OSCS
 * 
 * Formulaire de demande de réinitialisation du mot de passe.
 * Envoie un email avec un lien de réinitialisation.
 */

'use client'

import React, { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AuthCard, AuthLink } from './auth-card'
import { resetPasswordAction } from '@/lib/actions/auth'
import { toast } from 'sonner'

/**
 * Formulaire de demande de mot de passe oublié
 */
export function ForgotPasswordForm() {
  // États du formulaire
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isEmailSent, setIsEmailSent] = useState(false)

  /**
   * Soumission du formulaire
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation client
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('L\'email est invalide.')
      return
    }

    startTransition(async () => {
      const result = await resetPasswordAction(email)
      
      if (result.success) {
        toast.success(result.message || 'Email envoyé !')
        setIsEmailSent(true)
      } else {
        toast.error(result.error || 'Erreur lors de l\'envoi.')
      }
    })
  }

  // État après envoi - afficher le message de confirmation
  if (isEmailSent) {
    return (
      <AuthCard
        title="Vérifiez votre email"
        description="Un lien de réinitialisation a été envoyé."
      >
        <div className="text-center space-y-4 py-6">
          {/* Icône d'email */}
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-primary" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
          
          <p className="text-muted-foreground text-sm">
            Si un compte existe avec l&apos;adresse <strong>{email}</strong>, vous recevrez un email
            avec les instructions pour réinitialiser votre mot de passe.
          </p>
          
          <div className="space-y-2 pt-4">
            <Button
              onClick={() => {
                setIsEmailSent(false)
                setEmail('')
              }}
              variant="outline"
              className="w-full"
            >
              Renvoyer l&apos;email
            </Button>
            
            <AuthLink href="/connexion" className="block text-center">
              Retour à la connexion
            </AuthLink>
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Mot de passe oublié ?"
      description="Entrez votre email pour recevoir un lien de réinitialisation."
      footer={
        <div className="text-center text-sm text-muted-foreground">
          Vous vous souvenez de votre mot de passe ?{' '}
          <AuthLink href="/connexion" className="text-primary font-medium">
            Se connecter
          </AuthLink>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Champ Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Adresse email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="votre.email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            autoComplete="email"
            required
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Nous enverrons un lien à cette adresse pour réinitialiser votre mot de passe.
          </p>
        </div>

        {/* Bouton d'envoi */}
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
            'Envoyer le lien'
          )}
        </Button>
      </form>
    </AuthCard>
  )
}

export default ForgotPasswordForm
