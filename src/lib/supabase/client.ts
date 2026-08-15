/**
 * Client Supabase Browser (Client-side)
 * 
 * Utilisé dans les composants Client pour :
 * - Auth (signIn, signUp, signOut)
 * - Récupération données utilisateur
 * - Abonnements temps réel
 */

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const supabase = createClient()
