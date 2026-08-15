/**
 * Page d'Activation / Demande d'accès e-OSCS
 * 
 * Route : /activation
 * Affiche le formulaire d'inscription/demande d'accès pour les organisations.
 */

import { SignupForm } from '@/components/auth/signup-form'

export default function ActivationPage() {
  return (
    <main className="w-full" aria-label="Formulaire de demande d'accès">
      <SignupForm />
    </main>
  )
}
