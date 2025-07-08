import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')
  const { pathname } = request.nextUrl
  
  // Routes that require authentication
  const protectedRoutes = ['/admin']
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If it's a protected route and user is not authenticated, redirect to login
  if (isProtectedRoute && !token) {
    console.log('🔒 Redirecting to login - no token found for protected route:', pathname)
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If user is authenticated and trying to access login, redirect to admin
  if (token && pathname === '/login') {
    console.log('🔄 Redirecting to admin - user already authenticated')
    return NextResponse.redirect(new URL('/admin', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/login'
  ]
}