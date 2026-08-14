import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

    // Protéger les routes /app sauf auth/login
    const isAuthRoute = 
      request.nextUrl.pathname.startsWith('/auth') ||
      request.nextUrl.pathname.startsWith('/login') ||
      request.nextUrl.pathname === '/'

    if (
      !user &&
      !isAuthRoute &&
      request.nextUrl.pathname.startsWith('/app')
    ) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
