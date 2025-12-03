import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isUser = token?.role === "USER"
    const isTecnico = token?.role === "TECNICO"

    // Proteger rutas de admin
    if (req.nextUrl.pathname.startsWith("/dashboard/admin") && !isAdmin) {
      if (isTecnico) {
        return NextResponse.redirect(new URL("/dashboard/tecnico", req.url))
      }
      return NextResponse.redirect(new URL("/dashboard/user", req.url))
    }

    // Proteger rutas de usuario
    if (req.nextUrl.pathname.startsWith("/dashboard/user") && !isUser && !isAdmin) {
      if (isTecnico) {
        return NextResponse.redirect(new URL("/dashboard/tecnico", req.url))
      }
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Proteger rutas de técnico
    if (req.nextUrl.pathname.startsWith("/dashboard/tecnico") && !isTecnico) {
      if (isAdmin) {
        return NextResponse.redirect(new URL("/dashboard/admin", req.url))
      }
      if (isUser) {
        return NextResponse.redirect(new URL("/dashboard/user", req.url))
      }
      return NextResponse.redirect(new URL("/login", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ["/dashboard/:path*"],
}

