import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { LayoutWrapper } from "@/components/LayoutWrapper"
import { SessionProvider } from "@/components/SessionProvider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "C&A FIBERTECH - Soluciones Tecnológicas y Telecomunicaciones",
  description: "Empresa líder en soluciones tecnológicas y telecomunicaciones en Ecuador",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <SessionProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}

