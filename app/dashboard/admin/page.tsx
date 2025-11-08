"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, Mail, TrendingUp } from "lucide-react"

interface Stats {
  users: number
  cvs: number
  messages: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">
          Resumen general del sistema
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users || 0}</div>
            <p className="text-xs text-muted-foreground">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CVs Recibidos</CardTitle>
            <Briefcase className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.cvs || 0}</div>
            <p className="text-xs text-muted-foreground">
              Postulaciones recibidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.messages || 0}</div>
            <p className="text-xs text-muted-foreground">
              Mensajes de contacto
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/dashboard/admin/usuarios"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Users className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">Gestionar Usuarios</h3>
              <p className="text-sm text-muted-foreground">
                Ver y crear usuarios
              </p>
            </a>
            <a
              href="/dashboard/admin/cvs"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Briefcase className="h-6 w-6 text-secondary mb-2" />
              <h3 className="font-semibold">Ver CVs</h3>
              <p className="text-sm text-muted-foreground">
                Revisar postulaciones
              </p>
            </a>
            <a
              href="/dashboard/admin/mensajes"
              className="p-4 border rounded-lg hover:bg-accent transition-colors"
            >
              <Mail className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-semibold">Ver Mensajes</h3>
              <p className="text-sm text-muted-foreground">
                Revisar contactos
              </p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

