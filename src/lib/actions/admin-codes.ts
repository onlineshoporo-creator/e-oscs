'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import type { 
  ActivationCode, 
  CodeStatus, 
  CodeFilters, 
  CodeStats,
  SubscriptionPlan 
} from '@/types'

/**
 * Caractères autorisés pour les codes (exclusion de 0/O/I/1 pour éviter confusion)
 */
const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

/**
 * Génère un code alphanumérique au format EOSCS-XXXX-XXXX
 */
function generateActivationCode(): string {
  const segment = (): string => {
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length))
    }
    return result
  }
  return `EOSCS-${segment()}-${segment()}`
}

// ===========================================
// STATISTIQUES CODES D'ACTIVATION
// ===========================================

export async function getCodeStats(): Promise<CodeStats> {
  try {
    const now = new Date().toISOString()

    const [
      totalResult,
      utilisesResult,
      expiresResult
    ] = await Promise.all([
      // Total des codes
      supabaseAdmin
        .from('activation_codes')
        .select('*', { count: 'exact', head: true }),
      
      // Codes utilisés
      supabaseAdmin
        .from('activation_codes')
        .select('*', { count: 'exact', head: true })
        .eq('utilise', true),
      
      // Codes expirés (non utilisés mais date dépassée)
      supabaseAdmin
        .from('activation_codes')
        .select('*', { count: 'exact', head: true })
        .eq('utilise', false)
        .lt('expire_le', now)
    ])

    const total = totalResult.count || 0
    const utilises = utilisesResult.count || 0
    const expires = expiresResult.count || 0
    const disponibles = total - utilises - expires

    return {
      total,
      utilises,
      expires,
      disponibles: Math.max(0, disponibles)
    }
  } catch (error) {
    console.error('Erreur getCodeStats:', error)
    return { total: 0, utilises: 0, expires: 0, disponibles: 0 }
  }
}

// ===========================================
// LISTE DES CODES D'ACTIVATION
// ===========================================

export async function getActivationCodes(
  filters: CodeFilters = {}
): Promise<{ data: ActivationCode[]; total: number; page: number; totalPages: number }> {
  try {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1
    const now = new Date().toISOString()

    // Construction de la requête avec jointures
    let query = supabaseAdmin
      .from('activation_codes')
      .select(`
        *,
        plan:plan_id(id, code, nom, prix_mensuel),
        organization:organization_id(id, nom, type_org)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })

    // Filtre par statut
    if (filters.statut) {
      switch (filters.statut) {
        case 'DISPONIBLE':
          query = query.eq('utilise', false).gt('expire_le', now)
          break
        case 'UTILISE':
          query = query.eq('utilise', true)
          break
        case 'EXPIRE':
          query = query.eq('utilise', false).lt('expire_le', now)
          break
        case 'EN_ATTENTE':
          query = query.eq('utilise', false).gt('expire_le', now)
          break
        case 'REVOQUE':
          // Les codes révoqués ont un statut spécifique ou sont marqués
          break
      }
    }

    // Recherche
    if (filters.search) {
      query = query.or(`code.ilike.%${filters.search}%,email_proprietaire.ilike.%${filters.search}%`)
    }

    const { count, error: countError } = await query
    if (countError) throw countError

    // Requête paginée
    let paginatedQuery = supabaseAdmin
      .from('activation_codes')
      .select(`
        *,
        plan:plan_id(id, code, nom, prix_mensuel),
        organization:organization_id(id, nom, type_org)
      `)
      .order('created_at', { ascending: false })
      .range(from, to)

    // Réappliquer les filtres pour la requête paginée
    if (filters.statut) {
      switch (filters.statut) {
        case 'DISPONIBLE':
          paginatedQuery = paginatedQuery.eq('utilise', false).gt('expire_le', now)
          break
        case 'UTILISE':
          paginatedQuery = paginatedQuery.eq('utilise', true)
          break
        case 'EXPIRE':
          paginatedQuery = paginatedQuery.eq('utilise', false).lt('expire_le', now)
          break
        case 'EN_ATTENTE':
          paginatedQuery = paginatedQuery.eq('utilise', false).gt('expire_le', now)
          break
      }
    }

    if (filters.search) {
      paginatedQuery = paginatedQuery.or(`code.ilike.%${filters.search}%,email_proprietaire.ilike.%${filters.search}%`)
    }

    const { data, error } = await paginatedQuery
    if (error) throw error

    return {
      data: (data as ActivationCode[]) || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Erreur getActivationCodes:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

// ===========================================
// GÉNÉRATION D'UN NOUVEAU CODE
// ===========================================

interface GenerateCodeData {
  email_proprietaire: string
  plan_id?: string
  duree_mois: number
  expire_le?: string
  cree_par: string
}

export async function generateCode(
  data: GenerateCodeData
): Promise<{ success: boolean; code?: ActivationCode; error?: string }> {
  try {
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email_proprietaire)) {
      return { success: false, error: 'Format d\'email invalide' }
    }

    // Calcul date d'expiration si non fournie
    const expireLe = data.expire_le || (() => {
      const date = new Date()
      date.setDate(date.getDate() + 30) // 30 jours par défaut
      return date.toISOString()
    })()

    // Générer un code unique
    let newCode = generateActivationCode()
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const { count } = await supabaseAdmin
        .from('activation_codes')
        .select('*', { count: 'exact', head: true })
        .eq('code', newCode)

      if ((count || 0) === 0) break
      
      newCode = generateActivationCode()
      attempts++
    }

    if (attempts >= maxAttempts) {
      return { success: false, error: 'Impossible de générer un code unique' }
    }

    // Insertion du code
    const { data: code, error } = await supabaseAdmin
      .from('activation_codes')
      .insert({
        code: newCode,
        plan_id: data.plan_id,
        email_proprietaire: data.email_proprietaire,
        duree_mois: data.duree_mois,
        expire_le: expireLe,
        utilise: false,
        cree_par: data.cree_par
      })
      .select(`
        *,
        plan:plan_id(id, code, nom, prix_mensuel)
      `)
      .single()

    if (error) throw error

    return { success: true, code: code as ActivationCode }
  } catch (error) {
    console.error('Erreur generateCode:', error)
    return { success: false, error: 'Erreur lors de la génération du code' }
  }
}

// ===========================================
// DÉTAILS D'UN CODE
// ===========================================

export async function getCodeDetail(
  codeValue: string
): Promise<ActivationCode | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('activation_codes')
      .select(`
        *,
        plan:plan_id(id, code, nom, prix_mensuel, features, storage_gb, max_users),
        organization:organization_id(*)
      `)
      .eq('code', codeValue)
      .single()

    if (error) throw error
    return data as ActivationCode | null
  } catch (error) {
    console.error('Erreur getCodeDetail:', error)
    return null
  }
}

export async function getCodeById(
  id: string
): Promise<ActivationCode | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('activation_codes')
      .select(`
        *,
        plan:plan_id(id, code, nom, prix_mensuel, features, storage_gb, max_users),
        organization:organization_id(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as ActivationCode | null
  } catch (error) {
    console.error('Erreur getCodeById:', error)
    return null
  }
}

// ===========================================
// RÉVOCATION D'UN CODE
// ===========================================

export async function revokeCode(
  codeValue: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que le code existe et n'est pas utilisé
    const { data: existingCode, error: fetchError } = await supabaseAdmin
      .from('activation_codes')
      .select('*')
      .eq('code', codeValue)
      .single()

    if (fetchError || !existingCode) {
      return { success: false, error: 'Code non trouvé' }
    }

    if (existingCode.utilise) {
      return { success: false, error: 'Impossible de révoquer un code déjà utilisé' }
    }

    // Marquer le code comme expiré (révoqué)
    const { error } = await supabaseAdmin
      .from('activation_codes')
      .update({ 
        expire_le: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('code', codeValue)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erreur revokeCode:', error)
    return { success: false, error: 'Erreur lors de la révocation du code' }
  }
}

// ===========================================
// ENVOI EMAIL CODE (PLACEHOLDER)
// ===========================================

export async function sendCodeEmail(
  codeValue: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: code, error: fetchError } = await supabaseAdmin
      .from('activation_codes')
      .select('*')
      .eq('code', codeValue)
      .single()

    if (fetchError || !code) {
      return { success: false, error: 'Code non trouvé' }
    }

    // TODO: Implémenter l'envoi d'email réel via Supabase Auth ou service email
    // Pour l'instant, on simule l'envoi
    console.log(`📧 Email envoyé à ${code.email_proprietaire} avec le code ${code.code}`)

    return { success: true }
  } catch (error) {
    console.error('Erreur sendCodeEmail:', error)
    return { success: false, error: 'Erreur lors de l\'envoi de l\'email' }
  }
}

// ===========================================
// RÉCUPÉRATION DES PLANS (pour dropdown)
// ===========================================

export async function getPlansForCodes(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .eq('actif', true)
      .order('ordre', { ascending: true })

    if (error) throw error
    return (data as SubscriptionPlan[]) || []
  } catch (error) {
    console.error('Erreur getPlansForCodes:', error)
    return []
  }
}
