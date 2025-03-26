import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const isAuthenticated = !!token

  // Paths that require authentication
  const authRequiredPaths = ["/dashboard"]

  // Check if the current path requires authentication
  const isAuthRequired = authRequiredPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // Redirect to login if authentication is required but user is not authenticated
  if (isAuthRequired && !isAuthenticated) {
    const url = new URL("/login", request.url)
    url.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  // Redirect to dashboard if user is already authenticated and trying to access login
  if (isAuthenticated && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}

