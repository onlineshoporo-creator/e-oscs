'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import type { 
  UserProfile, 
  UserFilters, 
  UserStats,
  ExtendedOrgRole,
  Organization 
} from '@/types'

// ===========================================
// STATISTIQUES UTILISATEURS
// ===========================================

export async function getUserStats(): Promise<UserStats> {
  try {
    const [
      totalResult,
      superAdminsResult,
      actifsResult
    ] = await Promise.all([
      // Total des profils
      supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true }),
      
      // Super admins
      supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_super_admin', true),
      
      // Utilisateurs actifs
      supabaseAdmin
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('actif', true)
    ])

    const total = totalResult.count || 0
    const superAdmins = superAdminsResult.count || 0
    const actifs = actifsResult.count || 0

    return {
      total,
      superAdmins,
      actifs,
      inactifs: total - actifs
    }
  } catch (error) {
    console.error('Erreur getUserStats:', error)
    return { total: 0, superAdmins: 0, actifs: 0, inactifs: 0 }
  }
}

// ===========================================
// LISTE DES UTILISATEURS
// ===========================================

export async function getUsers(
  filters: UserFilters = {}
): Promise<{ data: UserProfile[]; total: number; page: number; totalPages: number }> {
  try {
    const page = filters.page || 1
    const limit = filters.limit || 10
    const from = (page - 1) * limit
    const to = from + limit - 1

    // Construction de la requête avec jointures
    let query = supabaseAdmin
      .from('profiles')
      .select(`
        *,
        organization:organization_id(id, nom, type_org)
      `, { count: 'exact' })
      .order('nom_complet', { ascending: true })

    // Filtre par rôle
    if (filters.role) {
      if (filters.role === 'SUPER_ADMIN') {
        query = query.eq('is_super_admin', true)
      } else {
        query = query.eq('org_role', filters.role).eq('is_super_admin', false)
      }
    }

    // Filtre par organisation
    if (filters.organization_id) {
      query = query.eq('organization_id', filters.organization_id)
    }

    // Filtre par statut actif/inactif
    if (filters.actif !== undefined) {
      query = query.eq('actif', filters.actif)
    }

    // Recherche
    if (filters.search) {
      query = query.or(`nom_complet.ilike.%${filters.search}%`)
    }

    const { count, error: countError } = await query
    if (countError) throw countError

    // Requête paginée
    let paginatedQuery = supabaseAdmin
      .from('profiles')
      .select(`
        *,
        organization:organization_id(id, nom, type_org)
      `)
      .order('nom_complet', { ascending: true })
      .range(from, to)

    // Réappliquer les filtres pour la requête paginée
    if (filters.role) {
      if (filters.role === 'SUPER_ADMIN') {
        paginatedQuery = paginatedQuery.eq('is_super_admin', true)
      } else {
        paginatedQuery = paginatedQuery.eq('org_role', filters.role).eq('is_super_admin', false)
      }
    }

    if (filters.organization_id) {
      paginatedQuery = paginatedQuery.eq('organization_id', filters.organization_id)
    }

    if (filters.actif !== undefined) {
      paginatedQuery = paginatedQuery.eq('actif', filters.actif)
    }

    if (filters.search) {
      paginatedQuery = paginatedQuery.or(`nom_complet.ilike.%${filters.search}%`)
    }

    const { data, error } = await paginatedQuery
    if (error) throw error

    // Récupérer les emails depuis auth.users
    const profilesWithEmail = await Promise.all(
      (data || []).map(async (profile) => {
        let email = ''
        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(profile.id)
          email = userData?.user?.email || ''
        } catch (e) {
          // Silently fail
        }
        return { ...profile, email }
      })
    )

    return {
      data: profilesWithEmail as UserProfile[],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    }
  } catch (error) {
    console.error('Erreur getUsers:', error)
    return { data: [], total: 0, page: 1, totalPages: 0 }
  }
}

// ===========================================
// DÉTAIL UTILISATEUR
// ===========================================

export async function getUserDetail(
  userId: string
): Promise<UserProfile | null> {
  try {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        organization:organization_id(*)
      `)
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    // Récupérer l'email depuis auth.users
    let email = ''
    try {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId)
      email = userData?.user?.email || ''
    } catch (e) {
      // Silently fail
    }

    return { ...(profile as UserProfile), email }
  } catch (error) {
    console.error('Erreur getUserDetail:', error)
    return null
  }
}

// ===========================================
// INVITATION UTILISATEUR
// ===========================================

interface InviteUserData {
  email: string
  nom_complet: string
  organization_id?: string
  role: 'PROPRIETAIRE' | 'AGENT' | 'LECTEUR'
  message_accueil?: string
  invitedBy: string
}

export async function inviteUser(
  data: InviteUserData
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return { success: false, error: 'Format d\'email invalide' }
    }

    // Vérifier si l'utilisateur existe déjà dans auth.users
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1,
      page: 1,
      filter: `email.eq.${data.email}`
    })

    if (existingUsers.users.length > 0) {
      return { success: false, error: 'Un utilisateur avec cet email existe déjà' }
    }

    // Créer l'utilisateur dans Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      email_confirm: false,
      user_metadata: {
        full_name: data.nom_complet,
        invited_by: data.invitedBy
      },
      sendInvitation: true // Envoi email d'invitation
    })

    if (createError || !newUser.user) {
      console.error('Erreur création utilisateur:', createError)
      return { success: false, error: 'Erreur lors de la création du compte utilisateur' }
    }

    // Créer le profil
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        nom_complet: data.nom_complet,
        organization_id: data.organization_id || null,
        org_role: data.role,
        is_super_admin: false,
        actif: true
      })
      .select(`
        *,
        organization:organization_id(*)
      `)
      .single()

    if (profileError) {
      // Rollback: supprimer l'utilisateur créé
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      throw profileError
    }

    return { success: true, user: profile as UserProfile }
  } catch (error) {
    console.error('Erreur inviteUser:', error)
    return { success: false, error: 'Erreur lors de l\'invitation de l\'utilisateur' }
  }
}

// ===========================================
// MISE À JOUR UTILISATEUR
// ===========================================

interface UpdateUserData {
  nom_complet?: string
  telephone?: string
  organization_id?: string | null
  role?: ExtendedOrgRole
  actif?: boolean
}

export async function updateUser(
  userId: string,
  data: UpdateUserData
): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  try {
    const updateData: Record<string, unknown> = {}

    if (data.nom_complet !== undefined) updateData.nom_complet = data.nom_complet
    if (data.telephone !== undefined) updateData.telephone = data.telephone
    if (data.organization_id !== undefined) updateData.organization_id = data.organization_id
    if (data.actif !== undefined) updateData.actif = data.actif
    
    if (data.role !== undefined) {
      if (data.role === 'SUPER_ADMIN') {
        updateData.is_super_admin = true
        updateData.org_role = 'PROPRIETAIRE'
      } else {
        updateData.is_super_admin = false
        updateData.org_role = data.role
      }
    }

    updateData.updated_at = new Date().toISOString()

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select(`
        *,
        organization:organization_id(*)
      `)
      .single()

    if (error) throw error

    return { success: true, user: profile as UserProfile }
  } catch (error) {
    console.error('Erreur updateUser:', error)
    return { success: false, error: 'Erreur lors de la mise à jour de l\'utilisateur' }
  }
}

// ===========================================
// TOGGLE STATUT ACTIF/INACTIF
// ===========================================

export async function toggleUserStatus(
  userId: string
): Promise<{ success: boolean; actif?: boolean; error?: string }> {
  try {
    // Récupérer le statut actuel
    const { data: current, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('actif')
      .eq('id', userId)
      .single()

    if (fetchError || !current) {
      return { success: false, error: 'Utilisateur non trouvé' }
    }

    const newStatus = !current.actif

    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ 
        actif: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (updateError) throw updateError

    return { success: true, actif: newStatus }
  } catch (error) {
    console.error('Erreur toggleUserStatus:', error)
    return { success: false, error: 'Erreur lors du changement de statut' }
  }
}

// ===========================================
// RÉINITIALISATION MOT DE PASSE
// ===========================================

export async function resetUserPassword(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Récupérer l'email de l'utilisateur
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (!userData?.user?.email) {
      return { success: false, error: 'Email utilisateur non trouvé' }
    }

    // Envoyer un email de réinitialisation via Supabase
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: userData.user.email
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erreur resetUserPassword:', error)
    return { success: false, error: 'Erreur lors de la réinitialisation du mot de passe' }
  }
}

// ===========================================
// SUPPRESSION UTILISATEUR (SOFT DELETE)
// ===========================================

export async function deleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Vérifier que ce n'est pas un super admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('is_super_admin')
      .eq('id', userId)
      .single()

    if (profile?.is_super_admin) {
      return { success: false, error: 'Impossible de supprimer un super administrateur' }
    }

    // Soft delete : désactiver et marquer
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ 
        actif: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erreur deleteUser:', error)
    return { success: false, error: 'Erreur lors de la suppression de l\'utilisateur' }
  }
}

// ===========================================
// RÉCUPÉRATION DES ORGANISATIONS (pour dropdown)
// ===========================================

export async function getOrganizationsForUsers(): Promise<Organization[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('actif', true)
      .order('nom', { ascending: true })

    if (error) throw error
    return (data as Organization[]) || []
  } catch (error) {
    console.error('Erreur getOrganizationsForUsers:', error)
    return []
  }
}
