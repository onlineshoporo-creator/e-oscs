/**
 * Composant LoginForm e-OSCS
 * 
 * Formulaire de connexion avec email et mot de passe.
 * Inclut la gestion des erreurs, loading state et redirection.
 */

'use client'

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AuthCard, AuthLink } from './auth-card'
import { signInAction } from '@/lib/actions/auth'
import { toast } from 'sonner'

/**
 * Formulaire de connexion
 */
export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // États du formulaire
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  
  // Récupérer l'URL de redirection si présente
  const redirectTo = searchParams.get('redirect') || '/app/dashboard'
  
  // Vérifier s'il y a une erreur dans l'URL (ex: OAuth failed)
  const urlError = searchParams.get('error')

  /**
   * Soumission du formulaire de connexion
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation client
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email.')
      return
    }
    if (!password) {
      toast.error('Veuillez entrer votre mot de passe.')
      return
    }

    startTransition(async () => {
      const result = await signInAction(email, password)
      
      if (result.success) {
        toast.success(result.message || 'Connexion réussie !')
        // Rediriger vers la page demandée ou le dashboard
        router.push(redirectTo)
        router.refresh()
      } else {
        toast.error(result.error || 'Erreur de connexion.')
      }
    })
  }

  return (
    <AuthCard
      title="Connexion"
      description="Accédez à votre espace e-OSCS"
      footer={
        <div className="space-y-3 text-center">
          <div>
            <AuthLink href="/mot-de-passe-oublie">
              Mot de passe oublié ?
            </AuthLink>
          </div>
          <div className="text-sm text-muted-foreground">
            Pas encore de compte ?{' '}
            <AuthLink href="/activation" className="text-primary font-medium">
              Demander un accès
            </AuthLink>
          </div>
        </div>
      }
    >
      {/* Message d'erreur depuis l'URL */}
      {urlError && (
        <div className="p-3 rounded-lg bg-danger/10 text-danger text-sm text-center">
          {urlError === 'oauth_failed' && 'La connexion OAuth a échoué.'}
          {urlError === 'server_error' && 'Erreur serveur. Veuillez réessayer.'}
          {!['oauth_failed', 'server_error'].includes(urlError) && urlError}
        </div>
      )}
      
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
        </div>

        {/* Champ Mot de passe */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Mot de passe
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            autoComplete="current-password"
            required
            className="h-11"
          />
        </div>

        {/* Bouton de connexion */}
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
              Connexion en cours...
            </span>
          ) : (
            'Se connecter'
          )}
        </Button>
      </form>
    </AuthCard>
  )
}

export default LoginForm
