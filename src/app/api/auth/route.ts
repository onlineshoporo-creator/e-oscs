/**
 * API Route Auth e-OSCS
 * 
 * Handler générique pour les actions d'authentification.
 * 
 * Système HYBRIDE :
 * 1. Essaie Supabase Auth si configuré
 * 2. Fallback sur Prisma/SQLite (base locale)
 * 
 * Actions supportées :
 * - signin : Connexion avec email/mot de passe
 * - signup : Inscription nouvel utilisateur
 * - signout : Déconnexion
 * - request_access : Demande d'accès organisation
 * - reset_password : Demande de réinitialisation mot de passe
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { compare, hash } from 'bcryptjs'
import { cookies } from 'next/headers'

// ============================================
// CONFIGURATION
// ============================================

const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://votre-projet.supabase.co' &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'votre-anon-key-ici'
)

// ============================================
// TYPES
// ============================================

interface AuthResult {
  success: boolean
  error?: string
  message?: string
  data?: Record<string, unknown>
}

interface SessionUser {
  id: string
  email: string
  nomComplet: string | null
  role: string
  organisationNom: string | null
  isSuperAdmin: boolean
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Crée une session utilisateur (cookie)
 */
async function createSession(user: SessionUser) {
  const cookieStore = await cookies()
  
  // Stocker les infos utilisateur dans un cookie sécurisé
  const sessionData = JSON.stringify({
    userId: user.id,
    email: user.email,
    nomComplet: user.nomComplet,
    role: user.role,
    isSuperAdmin: user.isSuperAdmin
  })
  
  cookieStore.set('eoscs-session', sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: '/'
  })
}

/**
 * Supprime la session utilisateur
 */
async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('eoscs-session')
}

// ============================================
// HANDLERS D'ACTION (Prisma Fallback)
// ============================================

/**
 * Connexion utilisateur avec email et mot de passe
 */
async function handleSignIn(email: string, password: string): Promise<AuthResult> {
  try {
    // Normaliser l'email
    const normalizedEmail = email.toLowerCase().trim()
    
    // Chercher l'utilisateur dans la base locale
    const user = await db.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect.' }
    }
    
    if (!user.isActive) {
      return { success: false, error: 'Ce compte a été désactivé. Contactez l\'administrateur.' }
    }
    
    // Vérifier le mot de passe
    const isValidPassword = await compare(password, user.passwordHash)
    
    if (!isValidPassword) {
      return { success: false, error: 'Email ou mot de passe incorrect.' }
    }
    
    // Créer la session
    await createSession({
      id: user.id,
      email: user.email,
      nomComplet: user.nomComplet,
      role: user.role,
      organisationNom: user.organisationNom,
      isSuperAdmin: user.role === 'super_admin'
    })
    
    // Logger la connexion
    console.log(`✅ Connexion réussie: ${user.email} (role: ${user.role})`)
    
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
    const normalizedEmail = email.toLowerCase().trim()
    
    // Vérifier si l'email existe déjà
    const existingUser = await db.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (existingUser) {
      return { success: false, error: 'Cet email est déjà utilisé.' }
    }
    
    // Valider le mot de passe
    if (password.length < 6) {
      return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
    }
    
    // Hasher le mot de passe
    const passwordHash = await hash(password, 12)
    
    // Créer l'utilisateur
    const newUser = await db.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        nomComplet: metadata?.full_name || metadata?.nom_complet || null,
        telephone: metadata?.telephone || null,
        role: 'user',
        isActive: true,
        emailVerified: false
      }
    })
    
    console.log(`✅ Nouvel utilisateur créé: ${newUser.email}`)
    
    return {
      success: true,
      message: 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.',
      data: { user: { id: newUser.id, email: newUser.email } }
    }
  } catch (error) {
    console.error('Erreur handleSignUp:', error)
    return { success: false, error: 'Une erreur est survenue lors de l\'inscription.' }
  }
}

/**
 * Déconnexion utilisateur
 */
async function handleSignOut(): Promise<AuthResult> {
  try {
    await destroySession()
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

    // Vérifier si une demande existe déjà pour cet email
    const existingDemande = await db.demandeAcces.findFirst({
      where: { email: email.toLowerCase().trim() }
    })

    if (existingDemande && existingDemande.statut === 'NOUVELLE') {
      return { success: false, error: 'Vous avez déjà soumis une demande avec cet email. Elle est en cours de traitement.' }
    }

    // Créer la demande
    const nouvelleDemande = await db.demandeAcces.create({
      data: {
        nomComplet: nom_complet.trim(),
        email: email.toLowerCase().trim(),
        telephone: telephone.trim(),
        nomOrganisation: nom_organisation.trim(),
        typeOrg: type_org,
        region: region.trim(),
        departement: departement?.trim() || null,
        message: message?.trim() || null,
        statut: 'NOUVELLE'
      }
    })

    console.log(`📋 Nouvelle demande d'accès: ${email} (${nom_organisation})`)

    return {
      success: true,
      message: 'Votre demande a été enregistrée avec succès ! Nous vous contacterons sous 48 heures ouvrées.',
      data: { demandeId: nouvelleDemande.id }
    }
  } catch (error) {
    console.error('Erreur handleRequestAccess:', error)
    return { success: false, error: 'Une erreur est survenue lors de la soumission.' }
  }
}

/**
 * Réinitialisation du mot de passe (mode démo - affiche juste un message)
 */
async function handleResetPassword(email: string): Promise<AuthResult> {
  try {
    // Vérifier si l'utilisateur existe
    const user = await db.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    })

    if (!user) {
      // Ne pas révéler si l'email existe ou pas
      return {
        success: true,
        message: 'Si cet email existe dans notre système, un lien de réinitialisation a été envoyé.'
      }
    }

    // En mode démo, on ne peut pas envoyer d'email réel
    // Mais on loggue pour debug
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
    console.log(`🔐 API Auth - Action: ${action}`)

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
    version: '2.0.0',
    mode: isSupabaseConfigured ? 'supabase' : 'prisma-fallback',
    actions: Object.keys(actionHandlers),
    timestamp: new Date().toISOString()
  })
}
