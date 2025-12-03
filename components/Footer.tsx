import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#2B2B2B] text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Información de Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">C&A FIBERTECH</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0 text-secondary" />
                <p>
                  Punin y 9 Agosto N2-134
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 flex-shrink-0 text-secondary" />
                <a
                  href="mailto:fibertechya2025@gmail.com"
                  className="hover:text-secondary transition-colors"
                >
                  fibertechya2025@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 flex-shrink-0 text-secondary" />
                <a
                  href="tel:+593995047684"
                  className="hover:text-secondary transition-colors"
                >
                  +593 99 504 7684
                </a>
              </div>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-secondary transition-colors"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="hover:text-secondary transition-colors"
                >
                  Contáctanos
                </Link>
              </li>
              <li>
                <Link
                  href="/trabaja-con-nosotros"
                  className="hover:text-secondary transition-colors"
                >
                  Trabaja con Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">Síguenos</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/cafibertech"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com/cafibertech"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com/cafibertech"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
            </div>
            <p className="text-sm mt-4 text-muted-foreground">
              @cafibertech
            </p>
          </div>
        </div>

        <div className="border-t border-accent mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} C&A FIBERTECH. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

