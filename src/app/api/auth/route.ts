/**
 * API Route Auth e-OSCS
 * 
 * Système d'authentification utilisant Supabase Auth.
 * Compatible Vercel (serverless) et développement local.
 * 
 * Actions supportées :
 * - signin : Connexion avec email/mot de passe
 * - signup : Inscription nouvel utilisateur
 * - signout : Déconnexion
 * - request_access : Demande d'accès organisation
 * - reset_password : Demande de réinitialisation mot de passe
 * - get_session : Récupérer la session actuelle
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// ============================================
// CONFIGURATION SUPABASE
// ============================================

function getSupabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || null
}

function getSupabaseAnonKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || null
}

function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl()
  const key = getSupabaseAnonKey()
  
  return !!(
    url && 
    key && 
    url !== 'https://votre-projet.supabase.co' && 
    key !== 'votre-anon-key-ici' &&
    url.startsWith('https://')
  )
}

/**
 * Crée un client Supabase pour les opérations serveur
 */
async function createSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null
  }
  
  const { createClient } = await import('@supabase/supabase-js')
  const cookieStore = await cookies()
  
  return createClient(
    getSupabaseUrl()!,
    getSupabaseAnonKey()!,
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
            // Ignore en cas d'erreur
          }
        },
      },
    }
  )
}

// ============================================
// TYPES
// ============================================

interface AuthResult {
  success: boolean
  error?: string
  message?: string
  data?: Record<string, unknown>
}

// ============================================
// UTILITAIRES POUR SUPER ADMIN (HARDCODED POUR LE DÉPLOIEMENT)
// ============================================

/**
 * Identifiants du Super Admin (à remplacer par Supabase quand configuré)
 * 
 * ⚠️ En production, ces identifiants doivent être stockés dans Supabase Auth
 * Cette solution temporaire permet le déploiement immédiat sur Vercel
 */
const SUPER_ADMIN_CREDENTIALS = {
  email: 'omouitsi@gmail.com',
  password: 'Ogou1987',
  nomComplet: 'Super Administrateur',
  role: 'super_admin'
}

// Stockage en mémoire des utilisateurs (pour Vercel serverless)
// ⚠️ Ceci est une solution temporaire! En production, utilisez Supabase
const inMemoryUsers = new Map<string, {
  id: string
  email: string
  passwordHash: string
  nomComplet: string | null
  role: string
  createdAt: Date
}>()

// Initialiser le super admin en mémoire
function ensureSuperAdminExists() {
  const { createHash } = require('crypto')
  const passwordHash = createHash('sha256').update(SUPER_ADMIN_CREDENTIALS.password).digest('hex')
  
  if (!inMemoryUsers.has(SUPER_ADMIN_CREDENTIALS.email)) {
    inMemoryUsers.set(SUPER_ADMIN_CREDENTIALS.email, {
      id: 'super-admin-001',
      email: SUPER_ADMIN_CREDENTIALS.email,
      passwordHash,
      nomComplet: SUPER_ADMIN_CREDENTIALS.nomComplet,
      role: SUPER_ADMIN_CREDENTIALS.role,
      createdAt: new Date()
    })
    console.log('✅ Super admin initialisé en mémoire')
  }
}

// ============================================
// HANDLERS D'AUTHENTIFICATION
// ============================================

/**
 * Connexion utilisateur
 */
async function handleSignIn(email: string, password: string): Promise<AuthResult> {
  try {
    // 1. Essayer Supabase Auth si configuré
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseClient()
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase().trim(),
          password
        })
        
        if (error) {
          console.error('❌ Erreur Supabase signIn:', error.message)
          return { success: false, error: error.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect.' : error.message }
        }
        
        if (data.user) {
          console.log(`✅ Connexion Supabase réussie: ${data.user.email}`)
          return {
            success: true,
            message: 'Connexion réussie !',
            data: {
              user: {
                id: data.user.id,
                email: data.user.email!,
                nomComplet: data.user.user_metadata?.nom_complet || data.user.user_metadata?.full_name || null,
                role: data.user.user_metadata?.role || 'user',
                isSuperAdmin: data.user.user_metadata?.role === 'super_admin'
              },
              redirectTo: getUserRedirectUrl(data.user.user_metadata?.role || 'user')
            }
          }
        }
      }
    }
    
    // 2. Fallback: Authentification en mémoire (pour déploiement rapide)
    ensureSuperAdminExists()
    
    const normalizedEmail = email.toLowerCase().trim()
    const user = inMemoryUsers.get(normalizedEmail)
    
    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect.' }
    }
    
    // Vérifier le mot de passe avec SHA256
    const { createHash } = require('crypto')
    const passwordHash = createHash('sha256').update(password).digest('hex')
    
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Email ou mot de passe incorrect.' }
    }
    
    // Créer la session via cookie
    const cookieStore = await cookies()
    const sessionData = JSON.stringify({
      userId: user.id,
      email: user.email,
      nomComplet: user.nomComplet,
      role: user.role,
      isSuperAdmin: user.role === 'super_admin'
    })
    
    cookieStore.set('eoscs-session', sessionData, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/'
    })
    
    console.log(`✅ Connexion réussie (mémoire): ${user.email} (role: ${user.role})`)
    
    return {
      success: true,
      message: 'Connexion réussie !',
      data: {
        user: {
          id: user.id,
          email: user.email,
          nomComplet: user.nomComplet,
          role: user.role,
          isSuperAdmin: user.role === 'super_admin'
        },
        redirectTo: getUserRedirectUrl(user.role)
      }
    }
  } catch (error) {
    console.error('Erreur handleSignIn:', error)
    return { success: false, error: 'Une erreur est survenue lors de la connexion.' }
  }
}

/**
 * Déterminer l'URL de redirection selon le rôle
 */
function getUserRedirectUrl(role: string): string {
  switch (role) {
    case 'super_admin':
      return '/admin'
    case 'admin':
      return '/app/dashboard'
    case 'user':
    default:
      return '/agent'
  }
}

/**
 * Inscription nouvel utilisateur
 */
async function handleSignUp(
  email: string, 
  password: string, 
  metadata?: Record<string, string>
): Promise<AuthResult> {
  try {
    // 1. Essayer Supabase si configuré
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseClient()
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: {
              nom_complet: metadata?.nom_complet || metadata?.full_name || null,
              telephone: metadata?.telephone || null,
              role: 'user'
            }
          }
        })
        
        if (error) {
          return { success: false, error: error.message }
        }
        
        return {
          success: true,
          message: 'Compte créé ! Vérifiez votre email pour confirmer.',
          data: { user: { id: data.user?.id, email: data.user?.email } }
        }
      }
    }
    
    // Fallback: Création en mémoire (limité)
    const normalizedEmail = email.toLowerCase().trim()
    
    if (password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
    }
    
    const { createHash } = require('crypto')
    const passwordHash = createHash('sha256').update(password).digest('hex')
    const userId = `user-${Date.now()}`
    
    inMemoryUsers.set(normalizedEmail, {
      id: userId,
      email: normalizedEmail,
      passwordHash,
      nomComplet: metadata?.nom_complet || metadata?.full_name || null,
      role: 'user',
      createdAt: new Date()
    })
    
    console.log(`✅ Nouvel utilisateur créé (mémoire): ${normalizedEmail}`)
    
    return {
      success: true,
      message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.',
      data: { user: { id: userId, email: normalizedEmail } }
    }
  } catch (error) {
    console.error('Erreur handleSignUp:', error)
    return { success: false, error: "Une erreur est survenue lors de l'inscription." }
  }
}

/**
 * Déconnexion utilisateur
 */
async function handleSignOut(): Promise<AuthResult> {
  try {
    // Si Supabase configuré, déconnecter aussi là-bas
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseClient()
      if (supabase) {
        await supabase.auth.signOut()
      }
    }
    
    // Toujours supprimer le cookie local
    const cookieStore = await cookies()
    cookieStore.delete('eoscs-session')
    
    return { success: true, message: 'Déconnexion réussie.' }
  } catch (error) {
    console.error('Erreur handleSignOut:', error)
    return { success: false, error: 'Une erreur est survenue lors de la déconnexion.' }
  }
}

/**
 * Demande d'accès / inscription organisation
 */
async function handleRequestAccess(data: Record<string, unknown>): Promise<AuthResult> {
  try {
    const {
      nom_complet,
      email,
      telephone,
      nom_organisation,
      type_org,
      region,
      departement,
      message
    } = data as {
      nom_complet?: string
      email?: string
      telephone?: string
      nom_organisation?: string
      type_org?: string
      region?: string
      departement?: string
      message?: string
    }

    // Validation des champs requis
    if (!nom_complet?.trim()) {
      return { success: false, error: 'Le nom complet est requis.' }
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "L'email est invalide." }
    }
    if (!telephone?.trim()) {
      return { success: false, error: 'Le numéro de téléphone est requis.' }
    }
    if (!nom_organisation?.trim()) {
      return { success: false, error: "Le nom de l'organisation est requis." }
    }
    if (!type_org || !['DR', 'DD'].includes(type_org)) {
      return { success: false, error: "Le type d'organisation doit être DR ou DD." }
    }
    if (!region?.trim()) {
      return { success: false, error: 'La région est requise.' }
    }

    // Log la demande (en production, sauvegarder dans Supabase/DB)
    console.log(`📋 Nouvelle demande d'accès: ${email} (${nom_organisation})`)
    console.log(`   Type: ${type_org}, Région: ${region}`)

    // Simuler une création réussie
    const demandeId = `demande-${Date.now()}`

    return {
      success: true,
      message: 'Votre demande a été enregistrée avec succès ! Nous vous contacterons sous 48 heures ouvrées.',
      data: { demandeId }
    }
  } catch (error) {
    console.error('Erreur handleRequestAccess:', error)
    return { success: false, error: 'Une erreur est survenue lors de la soumission.' }
  }
}

/**
 * Réinitialisation du mot de passe
 */
async function handleResetPassword(email: string): Promise<AuthResult> {
  try {
    // Si Supabase configuré, utiliser leur système
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseClient()
      if (supabase) {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) {
          return { success: false, error: error.message }
        }
        return {
          success: true,
          message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
        }
      }
    }

    // Message générique pour sécurité
    console.log(`📧 Demande de reset password pour: ${email}`)
    
    return {
      success: true,
      message: 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé.'
    }
  } catch (error) {
    console.error('Erreur handleResetPassword:', error)
    return { success: false, error: 'Une erreur est survenue.' }
  }
}

/**
 * Récupérer la session actuelle
 */
async function handleGetSession(): Promise<AuthResult> {
  try {
    // 1. Essayer Supabase session
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseClient()
      if (supabase) {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!error && session?.user) {
          return {
            success: true,
            data: {
              user: {
                id: session.user.id,
                email: session.user.email!,
                nomComplet: session.user.user_metadata?.nom_complet || null,
                role: session.user.user_metadata?.role || 'user',
                isSuperAdmin: session.user.user_metadata?.role === 'super_admin'
              }
            }
          }
        }
      }
    }
    
    // 2. Fallback: Cookie local
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('eoscs-session')

    if (!sessionCookie?.value) {
      return { success: false, error: 'Non authentifié' }
    }

    const sessionData = JSON.parse(sessionCookie.value)
    
    return {
      success: true,
      data: { user: sessionData }
    }
  } catch (error) {
    return { success: false, error: 'Session invalide' }
  }
}

// ============================================
// MAPPING DES ACTIONS
// ============================================

const actionHandlers: Record<string, (body: Record<string, unknown>) => Promise<AuthResult>> = {
  signin: async (body) => {
    const { email, password } = body as { email?: string; password?: string }
    if (!email || !password) {
      return { success: false, error: 'Email et mot de passe requis.' }
    }
    return handleSignIn(email, password)
  },

  signup: async (body) => {
    const { email, password, metadata } = body as { email?: string; password?: string; metadata?: Record<string, string> }
    if (!email || !password) {
      return { success: false, error: 'Email et mot de passe requis.' }
    }
    return handleSignUp(email, password, metadata)
  },

  signout: async () => {
    return handleSignOut()
  },

  request_access: async (body) => {
    return handleRequestAccess(body)
  },

  reset_password: async (body) => {
    const { email } = body as { email?: string }
    if (!email) {
      return { success: false, error: 'Email requis.' }
    }
    return handleResetPassword(email)
  },

  get_session: async () => {
    return handleGetSession()
  },
}

// ============================================
// HANDLER PRINCIPAL
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body as { action?: string }

    // Log pour debug
    console.log(`🔐 API Auth - Action: ${action}, Mode: ${isSupabaseConfigured() ? 'Supabase' : 'Mémoire (fallback)'}`)

    // Vérifier que l'action est fournie
    if (!action || typeof action !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Action manquante ou invalide.' },
        { status: 400 }
      )
    }

    // Vérifier que l'action existe
    const handler = actionHandlers[action]
    if (!handler) {
      return NextResponse.json(
        { success: false, error: `Action "${action}" non reconnue.` },
        { status: 400 }
      )
    }

    // Exécuter l'action
    const result = await handler(body)

    // Retourner la réponse avec le code HTTP approprié
    const statusCode = result.success ? 200 : 401
    return NextResponse.json(result, { status: statusCode })
  } catch (error) {
    console.error('❌ Erreur API /api/auth:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur serveur interne.' },
      { status: 500 }
    )
  }
}

// Méthode GET pour vérifier le statut de l'API
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'e-OSCS Auth API',
    version: '3.0.0',
    mode: isSupabaseConfigured() ? 'supabase' : 'memory-fallback',
    supabaseConfigured: isSupabaseConfigured(),
    actions: Object.keys(actionHandlers),
    timestamp: new Date().toISOString()
  })
}
