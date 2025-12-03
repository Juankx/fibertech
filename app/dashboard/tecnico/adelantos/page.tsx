"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdelantoForm } from "@/components/tecnico/AdelantoForm"
import { DollarSign, Clock, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface Adelanto {
  id: number
  tipo: "COMBUSTIBLE" | "SUELDO"
  monto: number
  motivo: string
  estado: "PENDIENTE" | "APROBADO" | "RECHAZADO"
  fechaSolicitud: string
  fechaAprobacion: string | null
  aprobadoPor: {
    id: number
    name: string
    email: string
  } | null
}

export default function AdelantosPage() {
  const [adelantos, setAdelantos] = useState<Adelanto[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchAdelantos = async () => {
    try {
      const res = await fetch("/api/tecnico/adelantos")
      if (res.ok) {
        const data = await res.json()
        setAdelantos(data)
      }
    } catch (error) {
      console.error("Error al cargar adelantos:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdelantos()
  }, [])

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pendiente
          </Badge>
        )
      case "APROBADO":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprobado
          </Badge>
        )
      case "RECHAZADO":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rechazado
          </Badge>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  const adelantosPendientes = adelantos.filter(a => a.estado === "PENDIENTE")
  const adelantosResueltos = adelantos.filter(a => a.estado !== "PENDIENTE")

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Adelantos</h1>
        <p className="text-muted-foreground">
          Solicita adelantos de combustible o sueldo y revisa el estado de tus solicitudes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <AdelantoForm onSuccess={fetchAdelantos} />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <CardTitle>Resumen</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="text-2xl font-bold">{adelantosPendientes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Aprobados</p>
              <p className="text-2xl font-bold text-green-600">
                {adelantos.filter(a => a.estado === "APROBADO").length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Rechazados</p>
              <p className="text-2xl font-bold text-red-600">
                {adelantos.filter(a => a.estado === "RECHAZADO").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {adelantosPendientes.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Solicitudes Pendientes</h2>
            <div className="space-y-4">
              {adelantosPendientes.map((adelanto) => (
                <Card key={adelanto.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <CardTitle>
                          Adelanto de {adelanto.tipo === "COMBUSTIBLE" ? "Combustible" : "Sueldo"}
                        </CardTitle>
                      </div>
                      {getEstadoBadge(adelanto.estado)}
                    </div>
                    <CardDescription>
                      Solicitado: {new Date(adelanto.fechaSolicitud).toLocaleDateString("es-ES")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monto:</span>
                        <span className="font-semibold">${adelanto.monto.toFixed(2)}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Motivo:</p>
                        <p className="text-sm">{adelanto.motivo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {adelantosResueltos.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Historial de Solicitudes</h2>
            <div className="space-y-4">
              {adelantosResueltos.map((adelanto) => (
                <Card key={adelanto.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <CardTitle>
                          Adelanto de {adelanto.tipo === "COMBUSTIBLE" ? "Combustible" : "Sueldo"}
                        </CardTitle>
                      </div>
                      {getEstadoBadge(adelanto.estado)}
                    </div>
                    <CardDescription>
                      Solicitado: {new Date(adelanto.fechaSolicitud).toLocaleDateString("es-ES")}
                      {adelanto.fechaAprobacion && (
                        <> • Resuelto: {new Date(adelanto.fechaAprobacion).toLocaleDateString("es-ES")}</>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monto:</span>
                        <span className="font-semibold">${adelanto.monto.toFixed(2)}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Motivo:</p>
                        <p className="text-sm">{adelanto.motivo}</p>
                      </div>
                      {adelanto.aprobadoPor && (
                        <div className="pt-2 border-t">
                          <p className="text-xs text-muted-foreground">
                            {adelanto.estado === "APROBADO" ? "Aprobado" : "Rechazado"} por: {adelanto.aprobadoPor.name}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {adelantos.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay solicitudes de adelantos registradas
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

