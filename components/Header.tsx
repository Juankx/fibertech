"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"

export function Header() {
  const { data: session } = useSession()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            C&A FIBERTECH
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="hover:text-secondary transition-colors"
            >
              Inicio
            </Link>
            <Link
              href="/contacto"
              className="hover:text-secondary transition-colors"
            >
              Contáctanos
            </Link>
            <Link
              href="/trabaja-con-nosotros"
              className="hover:text-secondary transition-colors"
            >
              Trabaja con Nosotros
            </Link>
            {session ? (
              <Link href={session.user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"}>
                <Button variant="secondary" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block py-2 hover:text-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/contacto"
              className="block py-2 hover:text-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contáctanos
            </Link>
            <Link
              href="/trabaja-con-nosotros"
              className="block py-2 hover:text-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Trabaja con Nosotros
            </Link>
            {session ? (
              <Link
                href={session.user.role === "ADMIN" ? "/dashboard/admin" : "/dashboard/user"}
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="secondary" size="sm" className="w-full">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link
                href="/login"
                className="block py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button variant="secondary" size="sm" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

