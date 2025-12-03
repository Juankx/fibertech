"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Home, ClipboardList, History, Wrench, AlertTriangle, DollarSign, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/dashboard/tecnico", label: "Inicio", icon: Home },
  { href: "/dashboard/tecnico/actividades", label: "Actividades", icon: ClipboardList },
  { href: "/dashboard/tecnico/historial", label: "Historial", icon: History },
  { href: "/dashboard/tecnico/herramientas", label: "Herramientas", icon: Wrench },
  { href: "/dashboard/tecnico/incidencias", label: "Incidencias", icon: AlertTriangle },
  { href: "/dashboard/tecnico/adelantos", label: "Adelantos", icon: DollarSign },
]

export function TecnicoSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-primary text-white min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <h2 className="text-xl font-bold">C&A FIBERTECH</h2>
        <p className="text-sm text-secondary mt-1">Panel de Técnico</p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/dashboard/tecnico" && pathname?.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-secondary text-white"
                  : "hover:bg-primary/80 text-white/90"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/20">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar Sesión
        </Button>
      </div>
    </aside>
  )
}

