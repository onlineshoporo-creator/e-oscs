'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import type { 
  SubscriptionRequest, 
  Organization, 
  Subscription,
  RequestStatus,
  OrgType
} from '@/types'

/**
 * Types pour les filtres
 */
interface RequestFilters {
  statut?: string
  region?: string
  search?: string
  page?: number
  limit?: number
}

interface OrganizationFilters {
  search?: string
  type_org?: 'DR' | 'DD'
  region?: string
  actif?: boolean
  page?: number
  limit?: number
}

interface DashboardStats {
  totalOrganizations: number
  pendingRequests: number
  activeSubscriptions: number
  monthlyRevenue: number
  revenueTrend: 'up' | 'down' | 'stable'
  organizationsTrend: 'up' | 'down' | 'stable'
}

// ===========================================
// STATISTIQUES DASHBOARD
// ===========================================

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      orgsResult,
      pendingResult,
      activeSubsResult,
      revenueResult
    ] = await Promise.all([
      supabaseAdmin.from('organizations').select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('subscription_requests')
        .select('*', { count: 'exact', head: true })
        .in('statut', ['NOUVELLE', 'EN_CONTACT']),
      supabaseAdmin.from('subscriptions').select('*', { count: 'exact', head: true }).eq('statut', 'ACTIF'),
      supabaseAdmin.from('subscriptions').select('montant').eq('statut', 'ACTIF')
    ])

    const monthlyRevenue = revenueResult.data?.reduce((sum, sub) => sum + (sub.montant || 0), 0) || 0

    return {
      totalOrganizations: orgsResult.count || 0,
      pendingRequests: pendingResult.count || 0,
      activeSubscriptions: activeSubsResult.count || 0,
      monthlyRevenue,
      revenueTrend: 'up',
      organizationsTrend: 'up'
    }
  } catch (error) {
    console.error('Erreur getDashboardStats:', error)
    return {
      totalOrganizations: 0,
      pendingRequests: 0,
      activeSubscriptions: 0,
      monthlyRevenue: 0,
      revenueTrend: 'stable',
      organizationsTrend: 'stable'
    }
  }
}

// ===========================================
// DEMANDES D'ABONNEMENT
// ===========================================

export async function getSubscriptionRequests(
  filters: RequestFilters = {}
): Promise<{ data: SubscriptionRequest[]; total: number; page: number; totalPages: number }> {
  try {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin
      .from('subscription_requests')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (filters.statut) query = query.eq('statut', filters.statut)
    if (filters.region) query = query.ilike('region', `%${filters.region}%`)
    if (filters.search) {
      query = query.or(
        `nom_complet.ilike.%${filters.search}%,email.ilike.%${filters.search}%,nom_organisation.ilike.%${filters.search}%`
      )
    }

    const { count, error: countError } = await query
    if (countError) throw countError

    // Paginated query
    let paginatedQuery = supabaseAdmin
      .from('subscription_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (filters.statut) paginatedQuery = paginatedQuery.eq('statut', filters.statut)
    if (filters.region) paginatedQuery = paginatedQuery.ilike('region', `%${filters.region}%`)
    if (filters.search) {
      paginatedQuery = paginatedQuery.or(
        `nom_complet.ilike.%${filters.search}%,email.ilike.%${filters.search}%,nom_organisation.ilike.%${filters.search}%`
      )
    }

    const { data, error } = await paginatedQuery
    if (error) throw error

    return {
      data: (data as SubscriptionRequest[]) || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Erreur getSubscriptionRequests:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
  notes?: string
): Promise<SubscriptionRequest | null> {
  try {
    const validStatuses: RequestStatus[] = ['NOUVELLE', 'EN_CONTACT', 'EN_ATTENTE_PAIEMENT', 'AYEE', 'REFUSEE', 'CLOTUREE']
    
    if (!validStatuses.includes(status)) {
      throw new Error(`Statut invalide: ${status}`)
    }

    const updateData: Record<string, unknown> = { statut: status }
    if (notes !== undefined) updateData.notes_admin = notes

    const { data, error } = await supabaseAdmin
      .from('subscription_requests')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as SubscriptionRequest
  } catch (error) {
    console.error('Erreur updateRequestStatus:', error)
    return null
  }
}

export async function approveRequest(
  requestId: string
): Promise<{ organization: Organization; subscription: Subscription } | null> {
  try {
    // Get request details
    const { data: request, error: fetchError } = await supabaseAdmin
      .from('subscription_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError || !request) throw new Error('Demande non trouvée')
    if (request.statut === 'AYEE') throw new Error('Déjà approuvée')

    // Get default plan
    const { data: plan, error: planError } = await supabaseAdmin
      .from('subscription_plans')
      .select('*')
      .or('code.eq.ESSENTIEL,ordre.eq.1')
      .eq('actif', true)
      .limit(1)
      .single()

    if (planError || !plan) throw new Error('Aucun plan disponible')

    // Create organization
    const { data: org, error: orgError } = await supabaseAdmin
      .from('organizations')
      .insert({
        nom: request.nom_organisation,
        type_org: request.type_org as OrgType,
        region: request.region,
        departement: request.departement,
        telephone: request.telephone,
        email: request.email,
        actif: true
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Create subscription
    const dateDebut = new Date()
    const dateFin = new Date()
    dateFin.setMonth(dateFin.getMonth() + 1)

    const { data: sub, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        organization_id: org.id,
        plan_id: plan.id,
        date_debut: dateDebut.toISOString(),
        date_fin: dateFin.toISOString(),
        duree_mois: 1,
        statut: 'ACTIF',
        montant: plan.prix_mensuel,
        confirme_le: new Date().toISOString(),
        notes: `Créé depuis demande #${requestId.slice(0, 8)}`
      })
      .select()
      .single()

    if (subError) throw subError

    // Update request status
    await supabaseAdmin
      .from('subscription_requests')
      .update({
        statut: 'AYEE',
        notes_admin: `Approuvée le ${new Date().toLocaleDateString('fr-FR')}. Org: ${org.id}`
      })
      .eq('id', requestId)

    return { organization: org as Organization, subscription: sub as Subscription }
  } catch (error) {
    console.error('Erreur approveRequest:', error)
    return null
  }
}

// ===========================================
// ORGANISATIONS
// ===========================================

export async function getOrganizations(
  filters: OrganizationFilters = {}
): Promise<{ data: Organization[]; total: number; page: number; totalPages: number }> {
  try {
    const page = filters.page || 1
    const limit = filters.limit || 12
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin
      .from('organizations')
      .select('*', { count: 'exact' })
      .order('nom', { ascending: true })

    if (filters.search) query = query.or(`nom.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    if (filters.type_org) query = query.eq('type_org', filters.type_org)
    if (filters.region) query = query.ilike('region', `%${filters.region}%`)
    if (filters.actif !== undefined) query = query.eq('actif', filters.actif)

    const { count, error: countError } = await query
    if (countError) throw countError

    // Paginated query
    let paginatedQuery = supabaseAdmin
      .from('organizations')
      .select('*')
      .order('nom', { ascending: true })
      .range(from, to)

    if (filters.search) paginatedQuery = paginatedQuery.or(`nom.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
    if (filters.type_org) paginatedQuery = paginatedQuery.eq('type_org', filters.type_org)
    if (filters.region) paginatedQuery = paginatedQuery.ilike('region', `%${filters.region}%`)
    if (filters.actif !== undefined) paginatedQuery = paginatedQuery.eq('actif', filters.actif)

    const { data, error } = await paginatedQuery
    if (error) throw error

    return {
      data: (data as Organization[]) || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Erreur getOrganizations:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

export async function toggleOrganizationStatus(
  id: string
): Promise<{ success: boolean; actif: boolean }> {
  try {
    // Get current status
    const { data: org, error: fetchError } = await supabaseAdmin
      .from('organizations')
      .select('actif')
      .eq('id', id)
      .single()

    if (fetchError || !org) throw new Error('Organisation non trouvée')

    const newStatus = !org.actif

    // Update status
    const { error: updateError } = await supabaseAdmin
      .from('organizations')
      .update({ actif: newStatus, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (updateError) throw updateError

    // If deactivating, suspend subscriptions
    if (!newStatus) {
      await supabaseAdmin
        .from('subscriptions')
        .update({ statut: 'SUSPENDU' })
        .eq('organization_id', id)
        .eq('statut', 'ACTIF')
    }

    return { success: true, actif: newStatus }
  } catch (error) {
    console.error('Erreur toggleOrganizationStatus:', error)
    return { success: false, actif: false }
  }
}
