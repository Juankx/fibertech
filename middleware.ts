import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAdmin = token?.role === "ADMIN"
    const isUser = token?.role === "USER"

    if (req.nextUrl.pathname.startsWith("/dashboard/admin") && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard/user", req.url))
    }

    if (req.nextUrl.pathname.startsWith("/dashboard/user") && !isUser && !isAdmin) {
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

