import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const AUTH_PAGES = [
  '/admin/login',
  '/account/login',
  '/account/signup',
  '/supplier/login',
  '/supplier/signup',
]

function panelFor(role: string | null | undefined) {
  if (role === 'admin') return '/admin'
  if (role === 'supplier') return '/supplier'
  return '/account'
}

function loginFor(pathname: string) {
  if (pathname.startsWith('/admin')) return '/admin/login'
  if (pathname.startsWith('/supplier')) return '/supplier/login'
  return '/account/login'
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isGuarded =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/supplier')

  if (!isGuarded) return supabaseResponse

  const isAuthPage = AUTH_PAGES.includes(pathname)

  if (!user) {
    if (isAuthPage) return supabaseResponse
    return redirectTo(loginFor(pathname))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const myPanel = panelFor(profile?.role)

  if (isAuthPage) return redirectTo(myPanel)
  if (!pathname.startsWith(myPanel)) return redirectTo(myPanel)

  return supabaseResponse
}
