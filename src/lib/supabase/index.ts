import { createClient as createBrowserClient } from './client'
import { createClient as createServerClient } from './server'

// Réexportation des clients
export { createBrowserClient, createServerClient }

// Helper pour obtenir le client côté client (composants React)
export function getSupabaseClient() {
  return createBrowserClient()
}

// Helper pour obtenir le côté serveur (Server Components, API Routes)
export async function getSupabaseServer() {
  return createServerClient()
}

// Vérifier si l'utilisateur est authentifié (côté serveur)
export async function getCurrentUser() {
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Erreur récupération utilisateur:', error.message)
    return null
  }
  
  return user
}

// Récupérer le profil utilisateur complet (avec jointure organizations)
export async function getUserProfile() {
  const supabase = await createServerClient()
  const user = await getCurrentUser()
  
  if (!user) return null
  
  const { data: profile, error } = await supabase
    .from('users')
    .select(`
      *,
      organization:organizations(*)
    `)
    .eq('id', user.id)
    .single()
  
  if (error) {
    console.error('Erreur récupération profil:', error.message)
    return null
  }
  
  return profile
}

// Types exportés
export type {
  Organization,
  User,
  Activity,
  ActivityCategory,
  Beneficiary,
  Indicator,
  IndicatorValue,
  Incident,
  PlanActivity,
  UserProfile,
} from './types'
