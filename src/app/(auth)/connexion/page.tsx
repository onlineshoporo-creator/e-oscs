/**
 * Page de Connexion e-OSCS
 * 
 * Route : /connexion
 * Page unifiée avec onglets : Connexion | Demande d'accès
 * 
 * Cette page est un composant SERVEUR qui enveloppe le formulaire client dans Suspense.
 * C'est nécessaire car useSearchParams() doit être wrappé dans une boundary Suspense.
 */

import { Suspense } from 'react'
import { ConnexionForm } from '@/components/auth/connexion-form'

/**
 * Loading spinner pour la page de connexion
 */
function ConnexionLoading() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      <div className="flex flex-col items-center gap-4">
        {/* Logo placeholder */}
        <div className="w-20 h-20 bg-white rounded-2xl shadow-lg border border-gray-100 p-3 flex items-center justify-center">
          <img
            src="/logo-eoscs.png"
            alt="e-OSCS"
            className="h-full w-auto object-contain animate-pulse"
          />
        </div>
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  )
}

/**
 * Page par défaut - export du composant avec Suspense
 */
export default function ConnexionPage() {
  return (
    <Suspense fallback={<ConnexionLoading />}>
      <ConnexionForm />
    </Suspense>
  )
}
