/**
 * Client Supabase Browser (Client-side)
 * 
 * Utilisé dans les composants Client pour :
 * - Auth (signIn, signUp, signOut)
 * - Récupération données utilisateur
 * - Abonnements temps réel
 */

import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Vérifie si Supabase est configuré côté client
 */
export function isSupabaseClientConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://votre-projet.supabase.co' &&
    supabaseAnonKey !== 'votre-anon-key-ici')
}

export function createClient() {
  if (!isSupabaseClientConfigured()) {
    // Retourner un client dummy si non configuré
    console.warn('⚠️ Supabase client non configuré')
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    ) as any
  }
  
  return createBrowserClient(
    supabaseUrl!,
    supabaseAnonKey!
  )
}

// Lazy initialization - ne crash pas si Supabase n'est pas configuré
let _supabase: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
  if (!_supabase) {
    _supabase = createClient()
  }
  return _supabase
}

/**
 * @deprecated Use getSupabaseClient() for new code
 */
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    const client = getSupabaseClient()
    const value = client[prop as keyof typeof client]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})
