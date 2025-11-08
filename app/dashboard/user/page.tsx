"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Mail, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface UserData {
  user: {
    name: string
    email: string
  }
  cvs: Array<{
    id: number
    position: string
    createdAt: string
  }>
  messages: Array<{
    id: number
    createdAt: string
  }>
}

export default function UserDashboard() {
  const [data, setData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dashboard/user-data")
      .then((res) => res.json())
      .then((data) => {
        setData(data)
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

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center text-destructive">Error al cargar los datos</div>
      </div>
    )
  }

  // Preparar datos para el gráfico (actividad por mes)
  const monthlyData = data.cvs.reduce((acc: any, cv: any) => {
    const month = new Date(cv.createdAt).toLocaleDateString("es-ES", {
      month: "short",
    })
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {})

  const chartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    postulaciones: count,
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Bienvenido, {data.user.name}
        </h1>
        <p className="text-muted-foreground">
          Aquí puedes ver el estado de tus postulaciones y mensajes
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postulaciones</CardTitle>
            <Briefcase className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.cvs.length}</div>
            <p className="text-xs text-muted-foreground">
              CVs enviados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensajes</CardTitle>
            <Mail className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.messages.length}</div>
            <p className="text-xs text-muted-foreground">
              Mensajes enviados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activo</div>
            <p className="text-xs text-muted-foreground">
              Cuenta verificada
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Actividad de Postulaciones</CardTitle>
            <CardDescription>
              Gráfico de tus postulaciones por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="postulaciones" fill="#004A99" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay datos para mostrar
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Postulaciones</CardTitle>
            <CardDescription>
              Tus postulaciones más recientes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.cvs.length > 0 ? (
              <div className="space-y-4">
                {data.cvs.slice(0, 5).map((cv) => (
                  <div
                    key={cv.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{cv.position}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(cv.createdAt).toLocaleDateString("es-ES")}
                      </p>
                    </div>
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No has enviado postulaciones aún
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

