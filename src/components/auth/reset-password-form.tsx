/**
 * Composant ResetPasswordForm e-OSCS
 * 
 * Formulaire de nouveau mot de passe (après clic sur le lien de réinitialisation).
 * Le token est géré automatiquement par Supabase via les cookies.
 */

'use client'

import React, { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { AuthCard, AuthLink } from './auth-card'
import { updatePasswordAction } from '@/lib/actions/auth'
import { toast } from 'sonner'

/**
 * Formulaire de réinitialisation du mot de passe
 */
export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // États du formulaire
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPending, startTransition] = useTransition()

  /**
   * Validation du formulaire avant soumission
   */
  const validateForm = (): string | null => {
    if (!password) return 'Le nouveau mot de passe est requis.'
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères.'
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas.'
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
      const result = await updatePasswordAction(password)
      
      if (result.success) {
        toast.success(result.message || 'Mot de passe mis à jour !')
        // Rediriger vers la page de connexion après un court délai
        setTimeout(() => {
          router.push('/connexion')
        }, 1500)
      } else {
        toast.error(result.error || 'Erreur lors de la mise à jour.')
      }
    })
  }

  return (
    <AuthCard
      title="Nouveau mot de passe"
      description="Entrez votre nouveau mot de passe."
      footer={
        <div className="text-center text-sm text-muted-foreground">
          <AuthLink href="/connexion">Retour à la connexion</AuthLink>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Nouveau mot de passe */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Nouveau mot de passe *
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Minimum 6 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            autoComplete="new-password"
            required
            minLength={6}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">
            Au moins 6 caractères recommandés.
          </p>
        </div>

        {/* Confirmation du mot de passe */}
        <div className="space-y-2">
          <Label htmlFor="confirm_password" className="text-sm font-medium">
            Confirmer le mot de passe *
          </Label>
          <Input
            id="confirm_password"
            type="password"
            placeholder="Répétez le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={isPending}
            autoComplete="new-password"
            required
            className="h-11"
          />
        </div>

        {/* Indicateur de force du mot de passe */}
        {password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < getStrengthLevel(password)
                      ? password.length >= 8
                        ? 'bg-success'
                        : password.length >= 6
                          ? 'bg-warning'
                          : 'bg-danger'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {getStrengthMessage(password)}
            </p>
          </div>
        )}

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
              Mise à jour...
            </span>
          ) : (
            'Mettre à jour le mot de passe'
          )}
        </Button>
      </form>
    </AuthCard>
  )
}

/**
 * Calcule le niveau de force du mot de passe (1-4)
 */
function getStrengthLevel(password: string): number {
  let strength = 0
  if (password.length >= 6) strength++
  if (password.length >= 8) strength++
  if (/[A-Z]/.test(password)) strength++
  if (/[0-9!@#$%^&*]/.test(password)) strength++
  return Math.min(strength, 4)
}

/**
 * Message de force du mot de passe
 */
function getStrengthMessage(password: string): string {
  const level = getStrengthLevel(password)
  switch (level) {
    case 0:
    case 1:
      return 'Mot de passe faible'
    case 2:
      return 'Mot de passe moyen'
    case 3:
      return 'Bon mot de passe'
    case 4:
      return 'Excellent mot de passe !'
    default:
      return ''
  }
}

export default ResetPasswordForm
