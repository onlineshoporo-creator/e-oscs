/**
 * Client Supabase Admin (Service Role)
 * 
 * ⚠️ À UTILISER UNIQUEMENT DANS :
 * - Server Actions
 * Route Handlers (API)
 * 
 * Ce client contourne RLS et possède tous les privilèges.
 * Ne JAMAIS l'exposer au client (browser).
 */

import 'server-only'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Variables NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquantes')
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

/**
 * Exécute une requête SQL brute avec les privilèges admin
 * @param sql Requête SQL à exécuter
 * @returns Résultat de la requête
 */
export async function executeSQL<T = any>(sql: string): Promise<{ data: T[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabaseAdmin.rpc('exec_sql', { query_sql: sql })
    if (error) return { data: null, error }
    return { data: data as T[], error: null }
  } catch (e) {
    return { data: null, error: e as Error }
  }
}
