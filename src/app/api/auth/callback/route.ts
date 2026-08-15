/**
 * OAuth Callback Route e-OSCS
 * 
 * Gère les callbacks OAuth (Google, etc.) après authentification
 * Redirige l'utilisateur vers le dashboard après connexion réussie
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/app/dashboard'

  // Si pas de code, rediriger vers la page de connexion
  if (!code) {
    console.error('OAuth callback: code manquant')
    return NextResponse.redirect(`${origin}/connexion?error=oauth_failed`)
  }

  try {
    const supabase = await createClient()
    
    // Échanger le code contre une session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('OAuth exchangeCodeForSession error:', error.message)
      return NextResponse.redirect(`${origin}/connexion?error=${encodeURIComponent(error.message)}`)
    }

    // Rediriger vers la destination
    return NextResponse.redirect(`${origin}${next}`)
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(`${origin}/connexion?error=server_error`)
  }
}
