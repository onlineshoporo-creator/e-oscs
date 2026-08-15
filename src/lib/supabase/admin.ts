/**
 * Client Supabase Admin (Service Role)
 * 
 * ⚠️ À UTILISER UNIQUEMENT DANS :
 * - Server Actions
 * - Route Handlers (API)
 * 
 * Ce client contourne RLS et possède tous les privilèges.
 * Ne JAMAIS l'exposer au client (browser).
 */

import 'server-only'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

/**
 * Vérifie si Supabase est correctement configuré
 */
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && serviceRoleKey && 
    supabaseUrl !== 'https://votre-projet.supabase.co' &&
    serviceRoleKey !== 'votre-anon-key-ici' &&
    serviceRoleKey !== 'votre-service-role-key-ici')
}

/**
 * Client Supabase Admin (lazy initialization)
 * Ne crash pas au build time si Supabase n'est pas configuré
 */
let _supabaseAdmin: ReturnType<typeof createClient> | null = null

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    if (!isSupabaseConfigured()) {
      console.warn('⚠️ Supabase non configuré - certaines fonctionnalités seront désactivées')
      // Retourner un client dummy qui lance des erreurs explicites
      _supabaseAdmin = createClient(
        'https://placeholder.supabase.co',
        'placeholder-key',
        {
          auth: { autoRefreshToken: false, persistSession: false },
        }
      ) as any
    } else {
      _supabaseAdmin = createClient(supabaseUrl!, serviceRoleKey!, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    }
  }
  return _supabaseAdmin
}

/**
 * @deprecated Use getSupabaseAdmin() instead for better error handling
 * Cette propriété est gardée pour compatibilité avec le code existant
 */
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    const client = getSupabaseAdmin()
    const value = client[prop as keyof typeof client]
    if (typeof value === 'function') {
      return value.bind(client)
    }
    return value
  }
})

/**
 * Exécute une requête SQL brute avec les privilèges admin
 * @param sql Requête SQL à exécuter
 * @returns Résultat de la requête
 */
export async function executeSQL<T = any>(sql: string): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    const { data, error } = await getSupabaseAdmin().rpc('exec_sql', { query_sql: sql })
    if (error) return { data: null, error }
    return { data: data as T[], error: null }
  } catch (e) {
    return { data: null, error: e as Error }
  }
}
