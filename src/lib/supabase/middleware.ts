/**
 * Middleware Supabase Auth e-OSCS
 * 
 * Gère la session utilisateur et protège les routes /app/* et /admin/*
 * Si Supabase n'est pas configuré, laisse passer tout le monde (mode dev)
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Routes publiques (accessibles sans authentification)
 */
const PUBLIC_ROUTES = [
  '/',                          // Landing page
  '/connexion',                 // Page de connexion
  '/activation',                // Page de demande d'accès
  '/mot-de-passe-oublie',       // Mot de passe oublié
  '/reset-password',            // Réinitialisation mot de passe
]

/**
 * Patterns de routes publiques (préfixes)
 */
const PUBLIC_PATTERNS = [
  '/(marketing)',               // Pages marketing (conditions, confidentialité)
  '/api',                       // Routes API
  '/auth',                      // Anciennes routes auth (compatibilité)
  '/login',                     // Ancienne route login (compatibilité)
]

/**
 * Vérifie si une route est publique
 */
function isPublicRoute(pathname: string): boolean {
  // Vérifier les routes exactes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return true
  }
  
  // Vérifier les patterns de préfixes
  for (const pattern of PUBLIC_PATTERNS) {
    if (pathname.startsWith(pattern)) {
      return true
    }
  }
  
  return false
}

export async function updateSession(request: NextRequest) {
  // Vérifier si Supabase est configuré
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Mode développement : si Supabase non configuré, on laisse passer
  if (!supabaseUrl || !supabaseAnonKey || 
      supabaseUrl === 'https://votre-projet.supabase.co' ||
      supabaseAnonKey === 'votre-anon-key-ici') {
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Ne pas protéger les routes API ou statiques
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/')
  
  if (!isApiRoute) {
    // Rafraîchir la session si elle existe
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protéger les routes /app et /admin
    const isProtectedRoute = 
      request.nextUrl.pathname.startsWith('/app') || 
      request.nextUrl.pathname.startsWith('/admin')

    const isPublic = isPublicRoute(request.nextUrl.pathname)

    if (!user && isProtectedRoute && !isPublic) {
      // Rediriger vers la page de connexion avec l'URL originale
      const url = request.nextUrl.clone()
      url.pathname = '/connexion'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    // Si l'utilisateur est connecté et tente d'accéder à une page auth, rediriger vers le dashboard
    if (user && PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
      // Exception : reset-password doit être accessible même si connecté
      if (request.nextUrl.pathname === '/reset-password') {
        return supabaseResponse
      }
      
      const url = request.nextUrl.clone()
      url.pathname = '/app/dashboard'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
