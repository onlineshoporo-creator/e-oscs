/**
 * Page Réinitialisation du mot de passe e-OSCS
 * 
 * Route : /reset-password
 * Affiche le formulaire pour définir un nouveau mot de passe.
 * Le token est passé automatiquement par Supabase via l'URL (hash fragment).
 */

import { Suspense } from 'react'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

/**
 * Loading spinner
 */
function ResetPasswordLoading() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center" aria-label="Chargement">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center animate-pulse">
          <span className="text-2xl font-bold text-white">e</span>
        </div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <main className="w-full" aria-label="Formulaire de réinitialisation du mot de passe">
        <ResetPasswordForm />
      </main>
    </Suspense>
  )
}
