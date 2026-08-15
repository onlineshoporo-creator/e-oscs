/**
 * API Route - Initialisation du Super Admin
 * 
 * POST /api/setup/super-admin
 * 
 * Cette route crée le compte Super Admin par défaut s'il n'existe pas.
 * À utiliser uniquement pour l'initialisation initiale du système.
 * 
 * Identifiants par défaut :
 * - Email: omouitsi@gmail.com
 * - Mot de passe: Ogou1987
 */

import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

// Configuration du Super Admin par défaut
const SUPER_ADMIN_CONFIG = {
  email: 'omouitsi@gmail.com',
  password: 'Ogou1987',
  nom_complet: 'Super Administrateur',
  telephone: '+2250576103277'
}

export async function POST() {
  try {
    // 1. Vérifier si le super admin existe déjà
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1,
      page: 1,
      filter: `email.eq.${SUPER_ADMIN_CONFIG.email}`
    })

    if (existingUsers.users.length > 0) {
      const existingUser = existingUsers.users[0]
      
      // Vérifier si le profil existe et est super admin
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('is_super_admin, actif')
        .eq('id', existingUser.id)
        .single()

      if (profile?.is_super_admin) {
        return NextResponse.json({
          success: true,
          message: 'Super Admin existe déjà',
          user: {
            id: existingUser.id,
            email: existingUser.email,
            is_super_admin: profile.is_super_admin,
            actif: profile.actif
          }
        })
      }
    }

    // 2. Créer l'utilisateur dans Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: SUPER_ADMIN_CONFIG.email,
      password: SUPER_ADMIN_CONFIG.password,
      email_confirm: true, // Email confirmé automatiquement
      user_metadata: {
        full_name: SUPER_ADMIN_CONFIG.nom_complet,
        role: 'super_admin'
      }
    })

    if (createError || !newUser.user) {
      console.error('Erreur création super admin:', createError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création du Super Admin' },
        { status: 500 }
      )
    }

    // 3. Créer le profil Super Admin
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: newUser.user.id,
        nom_complet: SUPER_ADMIN_CONFIG.nom_complet,
        telephone: SUPER_ADMIN_CONFIG.telephone,
        organization_id: null, // Pas d'organisation pour le super admin
        org_role: 'PROPRIETAIRE',
        is_super_admin: true,
        actif: true
      })

    if (profileError) {
      // Rollback: supprimer l'utilisateur créé
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      console.error('Erreur création profil:', profileError)
      return NextResponse.json(
        { success: false, error: 'Erreur lors de la création du profil' },
        { status: 500 }
      )
    }

    // 4. Logger la création (audit)
    console.log(`✅ Super Admin créé: ${SUPER_ADMIN_CONFIG.email} (ID: ${newUser.user.id})`)

    return NextResponse.json({
      success: true,
      message: 'Super Admin créé avec succès',
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        nom_complet: SUPER_ADMIN_CONFIG.nom_complet,
        is_super_admin: true,
        actif: true
      },
      credentials: {
        email: SUPER_ADMIN_CONFIG.email,
        note: 'Mot de passe défini lors de l\'initialisation'
      }
    })

  } catch (error) {
    console.error('Erreur setup super admin:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// GET pour vérifier le statut du super admin
export async function GET() {
  try {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1,
      page: 1,
      filter: `email.eq.${SUPER_ADMIN_CONFIG.email}`
    })

    if (users.users.length === 0) {
      return NextResponse.json({
        exists: false,
        message: 'Super Admin non encore initialisé'
      })
    }

    const user = users.users[0]
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      exists: true,
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    })

  } catch (error) {
    return NextResponse.json(
      { exists: false, error: 'Erreur vérification' },
      { status: 500 }
    )
  }
}
