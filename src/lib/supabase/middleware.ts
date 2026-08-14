import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware Supabase Auth
 * 
 * Gère la session utilisateur et protège les routes /app/* et /admin/*
 * Si Supabase n'est pas configuré, laisse passer tout le monde (mode dev)
 */
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
  const isStaticRoute = 
    request.nextUrl.pathname.startsWith('/_next/static/') ||
    request.nextUrl.pathname.startsWith('/_next/image/') ||
    request.nextUrl.pathname.startsWith('/favicon.')
  
  if (!isApiRoute && !isStaticRoute) {
    // Rafraîchir la session si elle existe
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Protéger les routes /app et /admin
    const isPublicRoute = 
      request.nextUrl.pathname.startsWith('/auth') ||
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname === '/' ||
      request.nextUrl.pathname.startsWith('/(marketing)')

    if (
      !user &&
      !isPublicRoute &&
      (request.nextUrl.pathname.startsWith('/app') || 
       request.nextUrl.pathname.startsWith('/admin'))
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/connexion'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
