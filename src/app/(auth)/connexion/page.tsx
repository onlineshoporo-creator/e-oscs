/**
 * Page de Connexion e-OSCS
 * 
 * Route : /connexion
 * Affiche le formulaire de connexion avec email et mot de passe.
 */

import { Suspense } from 'react'
import { LoginForm } from '@/components/auth/login-form'

/**
 * Loading spinner pour la page de connexion
 */
function ConnexionLoading() {
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

export default function ConnexionPage() {
  return (
    <Suspense fallback={<ConnexionLoading />}>
      <main className="w-full" aria-label="Formulaire de connexion">
        <LoginForm />
      </main>
    </Suspense>
  )
}
