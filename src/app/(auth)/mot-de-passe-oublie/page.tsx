/**
 * Page Mot de passe oublié e-OSCS
 * 
 * Route : /mot-de-passe-oublie
 * Affiche le formulaire de demande de réinitialisation du mot de passe.
 */

import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'

export default function MotDePasseOubliePage() {
  return (
    <main className="w-full" aria-label="Formulaire de mot de passe oublié">
      <ForgotPasswordForm />
    </main>
  )
}
