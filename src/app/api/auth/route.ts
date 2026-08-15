/**
 * API Route Auth e-OSCS
 * 
 * Handler générique pour les actions d'authentification.
 * 
 * Actions supportées :
 * - POST /api/auth : Connexion, Inscription, Déconnexion, Demande d'accès, Reset password
 * 
 * Méthode : POST
 * Body : { action: string, ...params }
 */

import { NextRequest, NextResponse } from 'next/server'
import {
  signInAction,
  signUpAction,
  signOutAction,
  requestAccessAction,
  resetPasswordAction,
  updatePasswordAction,
} from '@/lib/actions/auth'

/**
 * Mapping des actions vers leurs handlers
 */
const actionHandlers: Record<string, (body: Record<string, unknown>) => Promise<Record<string, unknown>>> = {
  // Connexion
  async signin(body) {
    const { email, password } = body as { email?: string; password?: string }
    if (!email || !password) {
      return { success: false, error: 'Email et mot de passe requis.' }
    }
    return signInAction(email, password)
  },

  // Inscription
  async signup(body) {
    const { email, password, metadata } = body as { email?: string; password?: string; metadata?: Record<string, string> }
    if (!email || !password) {
      return { success: false, error: 'Email et mot de passe requis.' }
    }
    return signUpAction(email, password, metadata)
  },

  // Déconnexion
  async signout() {
    return signOutAction()
  },

  // Demande d'accès organisation
  async request_access(body) {
    return requestAccessAction(body as Parameters<typeof requestAccessAction>[0])
  },

  // Reset mot de passe (envoi email)
  async reset_password(body) {
    const { email } = body as { email?: string }
    if (!email) {
      return { success: false, error: 'Email requis.' }
    }
    return resetPasswordAction(email)
  },

  // Mise à jour mot de passe
  async update_password(body) {
    const { newPassword } = body as { newPassword?: string }
    if (!newPassword) {
      return { success: false, error: 'Nouveau mot de passe requis.' }
    }
    return updatePasswordAction(newPassword)
  },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body as { action?: string }

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
    const statusCode = result.success ? 200 : 400
    return NextResponse.json(result, { status: statusCode })
  } catch (error) {
    console.error('Erreur API /api/auth:', error)
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
    version: '1.0.0',
    actions: Object.keys(actionHandlers),
  })
}
