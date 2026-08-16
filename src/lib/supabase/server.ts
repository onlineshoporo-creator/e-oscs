/**
 * Client Supabase Server (Server-side / Route Handlers)
 * 
 * Utilisé dans :
 * - Server Components
 * - Server Actions
 * - Route Handlers (API)
 * - Cookies handling
 * 
 * ⚠️ Ce fichier est maintenant résilient : retourne un client dummy si Supabase n'est pas configuré
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Vérifie si Supabase est correctement configuré
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return !!(
    url && 
    key && 
    url !== 'https://votre-projet.supabase.co' && 
    key !== 'votre-anon-key-ici' &&
    url.startsWith('https://')
  )
}

export async function createClient() {
  // Si Supabase n'est pas configuré, retourner un client dummy
  if (!isSupabaseConfigured()) {
    console.warn('⚠️ Supabase non configuré - Auth fallback activé')
    return createDummyClient()
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you has middleware refreshing sessions.
          }
        },
      },
    }
  )
}

/**
 * Crée un client Supabase dummy qui ne fait rien
 * Permet au code de fonctionner sans crasher quand Supabase n'est pas configuré
 */
function createDummyClient() {
  return {
    auth: {
      signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase non configuré' } }),
      signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase non configuré' } }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      resetPasswordForEmail: async () => ({ error: null }),
      updateUser: async () => ({ data: { user: null }, error: { message: 'Supabase non configuré' } }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
    from: () => ({
      select: () => ({ single: async () => ({ data: null, error: { message: 'Supabase non configuré' } }), eq: () => ({}) }),
      insert: async () => ({ error: null }),
      update: async () => ({ error: null }),
      delete: async () => ({ error: null }),
    }),
  } as any
}
