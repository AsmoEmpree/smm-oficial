import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  // Rotas públicas que não precisam de autenticação
  const publicRoutes = ['/auth', '/']

  // Se estiver em rota pública, permitir acesso
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Para rotas protegidas, verificar se tem token de sessão
  const token = req.cookies.get('sb-access-token')?.value

  // Se não estiver autenticado, redirecionar para login
  if (!token) {
    const url = new URL('/auth', req.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/projects/:path*',
    '/marketplace/:path*',
    '/settings/:path*',
  ],
}
